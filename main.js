(() => {
  // --- Reusable Carousel Engine ---
  class Carousel {
    constructor(id, prevId, nextId) {
      this.container = document.getElementById(id);
      this.prevBtn = document.getElementById(prevId);
      this.nextBtn = document.getElementById(nextId);
      this.currentIndex = 0;
      this.autoplayInterval = null;
      if (this.container && this.prevBtn && this.nextBtn) {
        this.init();
      }
    }
    get slides() {
      return Array.from(this.container.children);
    }
    getVisibleCount() {
      if (window.innerWidth >= 1024) return 3;
      if (window.innerWidth >= 768) return 2;
      return 1;
    }
    update() {
      const slides = this.slides;
      const visibleCount = this.getVisibleCount();
      const maxIndex = Math.max(0, slides.length - visibleCount);
      if (this.currentIndex > maxIndex) this.currentIndex = maxIndex;
      const firstSlide = slides[0];
      if (!firstSlide) return;
      const slideWidth = firstSlide.getBoundingClientRect().width;
      const gap = 32; // 2rem
      this.container.style.transform = `translateX(-${
        this.currentIndex * (slideWidth + gap)
      }px)`;
    }
    next() {
      const visibleCount = this.getVisibleCount();
      const maxIndex = Math.max(0, this.slides.length - visibleCount);
      this.currentIndex =
        this.currentIndex >= maxIndex ? 0 : this.currentIndex + 1;
      this.update();
    }
    prev() {
      const visibleCount = this.getVisibleCount();
      const maxIndex = Math.max(0, this.slides.length - visibleCount);
      this.currentIndex =
        this.currentIndex <= 0 ? maxIndex : this.currentIndex - 1;
      this.update();
    }
    startAutoplay() {
      this.autoplayInterval = setInterval(() => this.next(), 6000);
    }
    stopAutoplay() {
      clearInterval(this.autoplayInterval);
    }
    init() {
      this.nextBtn.addEventListener("click", () => {
        this.next();
        this.stopAutoplay();
        this.startAutoplay();
      });
      this.prevBtn.addEventListener("click", () => {
        this.prev();
        this.stopAutoplay();
        this.startAutoplay();
      });
      window.addEventListener("resize", () => this.update());

      // Slight delay to ensure React has painted the DOM before calculating widths
      setTimeout(() => {
        this.update();
        this.startAutoplay();
      }, 100);
    }
  }

  // --- Initialization Timeline (Executes immediately) ---

  // 1. Themes
  const html = document.documentElement;
  const themeToggle = document.querySelector(".theme-toggle");
  const updateThemeUI = (theme) => {
    html.setAttribute("data-theme", theme);
    const icon = themeToggle?.querySelector(".toggle-icon");
    const label = themeToggle?.querySelector(".toggle-label");
    if (icon) icon.textContent = theme === "dark" ? "🌙" : "☀️";
    if (label) label.textContent = theme === "dark" ? "dark" : "light";
  };
  const storedTheme = localStorage.getItem("theme");
  const theme =
    storedTheme ||
    (window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light");
  updateThemeUI(theme);

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const current = html.getAttribute("data-theme");
      const next = current === "dark" ? "light" : "dark";
      updateThemeUI(next);
      localStorage.setItem("theme", next);
    });
  }

  // 2. Carousels
  new Carousel("work-carousel", "work-prev", "work-next");
  new Carousel("certs-carousel", "certs-prev", "certs-next");

  // 3. Modal (Refactored to read DOM datasets instead of JS objects)
  const modal = document.getElementById("project-modal");
  const modalBody = document.getElementById("modal-body");

  document.addEventListener("click", (e) => {
    const btn = e.target.closest(".open-project");
    if (!btn || !modal || !modalBody) return;

    // Read data injected by React
    const title = btn.getAttribute("data-title");
    const desc = btn.getAttribute("data-desc");
    const img = btn.getAttribute("data-img");

    modalBody.innerHTML = `
        <div class="modal-image-container"><img src="${img}" class="modal-img" alt="${title}"></div>
        <div class="modal-text">
          <h2>${title}</h2>
          <p>${desc}</p>
        </div>
      `;
    modal.classList.add("active");
    document.body.style.overflow = "hidden";
  });

  if (modal) {
    modal.addEventListener("click", (e) => {
      if (e.target === modal || e.target.closest(".modal-close")) {
        modal.classList.remove("active");
        document.body.style.overflow = "";
      }
    });
  }

  // 4. Experience Scroll
  const expList = document.getElementById("exp-list");
  const bar = document.getElementById("timeline-progress");

  const handleExpScroll = () => {
    const expItems = document.querySelectorAll(".experience-item");
    if (!expList || !bar || expItems.length === 0) return;
    const containerRect = expList.getBoundingClientRect();
    const containerCenter = containerRect.top + containerRect.height / 2;
    let closestItem = null;
    let closestDistance = Infinity;

    // If we are at the very top of the list, strictly highlight the first (latest) item
    if (expList.scrollTop <= 5) {
      expItems.forEach((item, index) => {
        if (index === 0) {
          item.classList.add("active");
          const dotRect = item.getBoundingClientRect();
          const dotCenterRelative = dotRect.top + dotRect.height / 2 - containerRect.top;
          bar.style.height = `${dotCenterRelative}px`;
        } else {
          item.classList.remove("active");
        }
      });
      return;
    }

    expItems.forEach((item) => {
      item.classList.remove("active");
      const rect = item.getBoundingClientRect();
      const itemCenter = rect.top + rect.height / 2;
      const distance = Math.abs(itemCenter - containerCenter);
      if (distance < closestDistance) {
        closestDistance = distance;
        closestItem = item;
      }
    });
    
    if (closestItem) {
      closestItem.classList.add("active");
      const dotRect = closestItem.getBoundingClientRect();
      const dotCenterRelative = dotRect.top + dotRect.height / 2 - containerRect.top;
      bar.style.height = `${dotCenterRelative}px`;
    }
  };

  if (expList) {
    expList.addEventListener("scroll", handleExpScroll);
    setTimeout(handleExpScroll, 100);
  }

  // 5. Reveal Animations
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(
        (entry) => entry.isIntersecting && entry.target.classList.add("active")
      );
    },
    { threshold: 0.1 }
  );
  document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));

  // 6. Date
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
