(() => {
  // --- Render Functions ---
  function renderProjects() {
    const container = document.getElementById("work-carousel");
    if (!container) return;

    container.innerHTML = PORTFOLIO_DATA.projects
      .map(
        (project) => `
        <article class="carousel-slide" data-project="${project.id}">
          <div class="slide-content">
            <h3>${project.title}</h3>
            <p>${project.description}</p>
          </div>
          <div class="slide-actions">
            <button class="btn btn-small primary open-project" data-target="${
              project.id
            }">Details</button>
            ${
              project.sourceUrl
                ? `<a class="btn btn-small" href="${project.sourceUrl}">Source</a>`
                : ""
            }
            ${
              project.demoUrl
                ? `<a class="btn btn-small primary" href="${project.demoUrl}">Demo</a>`
                : ""
            }
          </div>
        </article>
      `
      )
      .join("");
  }

  function renderCertifications() {
    const container = document.getElementById("certs-carousel");
    if (!container) return;

    container.innerHTML = PORTFOLIO_DATA.certifications
      .map(
        (cert) => `
        <article class="carousel-slide">
          <div class="cert-preview">
            <img src="${cert.image || ""}" alt="${cert.category}">
          </div>
          <div class="slide-content">
            <h3>${cert.title}</h3>
          </div>
          <div class="slide-actions">
             <button class="btn btn-small primary open-project" data-target="${
               cert.id
             }">Details</button>
          </div>
        </article>
      `
      )
      .join("");
  }

  // --- Reusable Carousel Engine ---
  class Carousel {
    constructor(id, prevId, nextId) {
      this.container = document.getElementById(id);
      this.prevBtn = document.getElementById(prevId);
      this.nextBtn = document.getElementById(nextId);
      this.currentIndex = 0;
      this.autoplayInterval = null;

      // Use a getter for slides to handle dynamic content
      this.init();
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
      this.update();
      this.startAutoplay();
    }
  }

  // --- Initialize Components ---
  document.addEventListener("DOMContentLoaded", () => {
    // Render content
    renderProjects();
    renderCertifications();

    // Themes
    const html = document.documentElement;
    const themeToggle = document.querySelector(".theme-toggle");

    const updateThemeUI = (theme) => {
      html.setAttribute("data-theme", theme);
      const icon = themeToggle.querySelector(".toggle-icon");
      const label = themeToggle.querySelector(".toggle-label");
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

    themeToggle?.addEventListener("click", () => {
      const current = html.getAttribute("data-theme");
      const next = current === "dark" ? "light" : "dark";
      updateThemeUI(next);
      localStorage.setItem("theme", next);
    });

    // Carousels
    new Carousel("work-carousel", "work-prev", "work-next");
    new Carousel("certs-carousel", "certs-prev", "certs-next");

    // Modal
    const modal = document.getElementById("project-modal");
    const modalBody = document.getElementById("modal-body");

    // Use event delegation for dynamic elements
    document.addEventListener("click", (e) => {
      const btn = e.target.closest(".open-project");
      if (!btn) return;

      const id = btn.dataset.target;
      // Look for data in both arrays
      const data =
        PORTFOLIO_DATA.projects.find((p) => p.id === id) ||
        PORTFOLIO_DATA.certifications.find((c) => c.id === id);

      if (!data) return;

      modalBody.innerHTML = `
          <div class="modal-image-container"><img src="${
            data.image || ""
          }" class="modal-img" alt="${data.title}"></div>
          <div class="modal-text">
            <h2>${data.title}</h2>
            <p>${
              data.description ||
              "Details for this item will be available soon."
            }</p>
          </div>
        `;
      modal.classList.add("active");
      document.body.style.overflow = "hidden";
    });

    modal?.addEventListener("click", (e) => {
      if (e.target === modal || e.target.closest(".modal-close")) {
        modal.classList.remove("active");
        document.body.style.overflow = "";
      }
    });

    // Experience Scroll
    const expList = document.getElementById("exp-list");
    const expItems = document.querySelectorAll(".experience-item");
    const bar = document.getElementById("timeline-progress");

    const handleExpScroll = () => {
      if (!expList || !bar) return;

      // Container metrics for visual calculation
      const containerRect = expList.getBoundingClientRect();
      const containerCenter = containerRect.top + containerRect.height / 2;

      let closestItem = null;
      let closestDistance = Infinity;

      // Find active item (closest to center)
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

        // Calculate exact visual position of the dot relative to the container top
        // This makes the green line end EXACTLY at the center of the active dot
        const dotRect = closestItem.getBoundingClientRect();
        const dotCenterRelative =
          dotRect.top + dotRect.height / 2 - containerRect.top;

        bar.style.height = `${dotCenterRelative}px`;
      }
    };

    if (expList) {
      expList.addEventListener("scroll", handleExpScroll);
      // Force initial state
      handleExpScroll();
      // Default: Ensure first item is active if scroll is at top
      if (expList.scrollTop === 0 && expItems.length > 0) {
        expItems[0].classList.add("active");
      }
    }

    // Reveal
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(
          (entry) =>
            entry.isIntersecting && entry.target.classList.add("active")
        );
      },
      { threshold: 0.1 }
    );
    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));

    // Date
    document.getElementById("year").textContent = new Date().getFullYear();
  });
})();
