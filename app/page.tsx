import Image from "next/image";
import { PORTFOLIO_DATA } from "./data/portfolio-data";

// WP GraphQL Fetch
async function getPortfolioData() {
  try {
    const wpUrl = process.env.WP_GRAPHQL_URL || 'http://headless-portfolio-api.local/graphql';
    const res = await fetch(wpUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: `
          {
            projects: posts(where: { categoryName: "Projects" }) {
              nodes { id title content featuredImage { node { sourceUrl } } }
            }
            certifications: posts(where: { categoryName: "Certifications" }) {
              nodes { id title content featuredImage { node { sourceUrl } } }
            }
            experiences: posts(where: { categoryName: "Experience" }) {
              nodes { id title content }
            }
            skills: posts(where: { categoryName: "Skills" }, first: 50) {
              nodes { id title }
            }
          }
        `,
      }),
      // Revalidate every 24 hours (86400 seconds) as a safety net.
      // Updates are now handled instantly via On-Demand Revalidation (/api/revalidate)
      next: { revalidate: 86400 },
    });
    const json = await res.json();
    return {
      projects: json.data?.projects?.nodes || [],
      certifications: json.data?.certifications?.nodes || [],
      experiences: json.data?.experiences?.nodes || [],
      skills: json.data?.skills?.nodes || [],
    };
  } catch (error) {
    console.error("WordPress is offline!", error);
    return { projects: [], certifications: [], experiences: [], skills: [] };
  }
}

const FALLBACK_EXPERIENCES = [
  {
    title: "Front End Developer",
    content: "<h3>Pixel Motion</h3>\n<p class=\"mono\">2025 - PRESENT</p>"
  },
  {
    title: "Technical Support Specialist",
    content: "<h3>BrandLink</h3>\n<p class=\"mono\">2024 - 2025</p>"
  },
  {
    title: "IT Operations Intern",
    content: "<h3>Concentrix</h3>\n<p class=\"mono\">2024</p>"
  }
];

const FALLBACK_SKILLS = [
  { title: "JavaScript" },
  { title: "React" },
  { title: "HTML5 & CSS3" },
  { title: "Python" },
  { title: "Flask" },
  { title: "MySQL" },
  { title: "Git & GitHub" },
  { title: "Linux / Unix" },
  { title: "Figma" },
  { title: "Active Directory" }
];

export default async function Home() {
  const wpData = await getPortfolioData();
  const projects = wpData.projects.length > 0 ? wpData.projects : PORTFOLIO_DATA.projects;
  const certifications = wpData.certifications.length > 0 ? wpData.certifications : PORTFOLIO_DATA.certifications;
  const experiences = wpData.experiences.length > 0 ? wpData.experiences : FALLBACK_EXPERIENCES;
  const skills = wpData.skills.length > 0 ? wpData.skills : FALLBACK_SKILLS;
  return (
    // React Boilerplate
    // <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
    //   <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
    //     <Image
    //       className="dark:invert"
    //       src="/next.svg"
    //       alt="Next.js logo"
    //       width={100}
    //       height={20}
    //       priority
    //     />
    //     <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
    //       <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
    //         To get started, edit the page.tsx file.
    //       </h1>
    //       <p className="max-w-md text-lg leading-8 text-zinc-600 dark:text-zinc-400">
    //         Looking for a starting point or more instructions? Head over to{" "}
    //         <a
    //           href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
    //           className="font-medium text-zinc-950 dark:text-zinc-50"
    //         >
    //           Templates
    //         </a>{" "}
    //         or the{" "}
    //         <a
    //           href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
    //           className="font-medium text-zinc-950 dark:text-zinc-50"
    //         >
    //           Learning
    //         </a>{" "}
    //         center.
    //       </p>
    //     </div>
    //     <div className="flex flex-col gap-4 text-base font-medium sm:flex-row">
    //       <a
    //         className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-foreground px-5 text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc] md:w-[158px]"
    //         href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
    //         target="_blank"
    //         rel="noopener noreferrer"
    //       >
    //         <Image
    //           className="dark:invert"
    //           src="/vercel.svg"
    //           alt="Vercel logomark"
    //           width={16}
    //           height={16}
    //         />
    //         Deploy Now
    //       </a>
    //       <a
    //         className="flex h-12 w-full items-center justify-center rounded-full border border-solid border-black/[.08] px-5 transition-colors hover:border-transparent hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-[#1a1a1a] md:w-[158px]"
    //         href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
    //         target="_blank"
    //         rel="noopener noreferrer"
    //       >
    //         Documentation
    //       </a>
    //     </div>
    //   </main>
    // </div>
    <main>
      <header className="topbar">
        <div className="logo">NEIL/_</div>
        <nav className="nav" aria-label="Primary">
          <a href="#home">.home()</a>
          <a href="#skills">.skills()</a>
          <a href="#work">.work()</a>
          <a href="#experience">.exp()</a>
          <a href="#contact">.contact()</a>
        </nav>
        <button
          className="theme-toggle"
          aria-label="Toggle theme"
          type="button"
        >
          <span className="toggle-icon" aria-hidden="true">
            🌙
          </span>
          <span className="toggle-label">dark</span>
        </button>
      </header>

      <main>
        {/* <!-- Home/Hero/About Section --> */}
        <section id="home" className="section hero reveal">
          <div className="section-container">
            <span className="eyebrow">// Introduction</span>
            <h1>
              Front End Developer @{" "}
              <span className="accent">Pixel Motion.</span>
            </h1>
            <p className="lede">
              Currently diving deeper into both{" "}
              <span className="mono accent">web development</span> and
              <span className="mono">IT systems (helpdesk/sysadmin)</span> to
              understand the full stack of digital experiences.
            </p>
            <div className="cta-group">
              <a className="btn primary" href="#work">
                Projects
              </a>
              <a className="btn" href="#contact">
                Contact
              </a>
            </div>
          </div>
        </section>

        {/* <!-- Skills Section --> */}
        <section id="skills" className="section">
          <div className="section-container">
            <span className="eyebrow">01. Skills</span>
            <div className="skills-grid reveal">
              {skills.map((skill: any, index: number) => (
                <div key={index} className="skill-card">
                  {skill.title}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* <!-- Project/Certifications Section --> */}
        <section id="work" className="section">
          <div className="section-container">
            {/* <!-- Selected Work --> */}
            <div className="work-subsection">
              <span className="eyebrow">02. Selected Work</span>
              <div className="carousel-wrapper reveal">
                <button
                  className="carousel-btn prev"
                  id="work-prev"
                  aria-label="Previous"
                >
                  ←
                </button>
                {/* <div className="carousel-container" id="work-carousel"> */}
                {/* <!-- Injected via JS --> */}
                {/* </div> */}

                <div className="carousel-container" id="work-carousel">
                  {projects.map((project: any, index: number) => {
                    const desc = project.content || project.description;
                    const img = project.featuredImage?.node?.sourceUrl || project.image || "";
                    
                    return (
                      <article
                        key={index}
                        className="carousel-slide"
                        data-project={project.id}
                      >
                        <div className="slide-content">
                          <h3>{project.title}</h3>
                          {project.content ? (
                            <div dangerouslySetInnerHTML={{ __html: project.content }} />
                          ) : (
                            <p>{project.description}</p>
                          )}
                        </div>
                        <div className="slide-actions">
                          <button
                            className="btn btn-small primary open-project"
                            data-title={project.title}
                            data-desc={desc}
                            data-img={img}
                          >
                            Details
                          </button>
                          {project.sourceUrl && (
                            <a className="btn btn-small" href={project.sourceUrl}>
                              Source
                            </a>
                          )}
                          {project.demoUrl && (
                            <a
                              className="btn btn-small primary"
                              href={project.demoUrl}
                            >
                              Demo
                            </a>
                          )}
                        </div>
                      </article>
                    );
                  })}
                </div>

                <button
                  className="carousel-btn next"
                  id="work-next"
                  aria-label="Next"
                >
                  →
                </button>
              </div>
            </div>

            {/* <!-- Certifications --> */}
            <div className="work-subsection" style={{ marginTop: "3rem" }}>
              <span className="eyebrow">Certifications & Training</span>
              <div className="carousel-wrapper reveal">
                <button
                  className="carousel-btn prev"
                  id="certs-prev"
                  aria-label="Previous"
                >
                  ←
                </button>
                {/* <div className="carousel-container" id="certs-carousel"> */}
                {/* <!-- Injected via JS --> */}
                {/* </div> */}

                <div className="carousel-container" id="certs-carousel">
                  {certifications.map((cert: any, index: number) => {
                    const desc = cert.content || cert.description || "Details for this item will be available soon.";
                    const img = cert.featuredImage?.node?.sourceUrl || cert.image || "";
                    
                    return (
                      <article key={index} className="carousel-slide">
                        <div className="cert-preview">
                          <img
                            src={img}
                            alt={cert.title}
                            style={{ maxWidth: "100%" }}
                          />
                        </div>
                        <div className="slide-content">
                          <h3>{cert.title}</h3>
                        </div>
                        <div className="slide-actions">
                          <button
                            className="btn btn-small primary open-project"
                            data-title={cert.title}
                            data-desc={desc}
                            data-img={img}
                          >
                            Details
                          </button>
                        </div>
                      </article>
                    );
                  })}
                </div>

                <button
                  className="carousel-btn next"
                  id="certs-next"
                  aria-label="Next"
                >
                  →
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* <!-- Experience Section --> */}
        <section id="experience" className="section">
          <div className="section-container">
            <span className="eyebrow">04. Experience</span>
            <div className="experience-container">
              <div className="timeline-line">
                <div className="timeline-progress" id="timeline-progress"></div>
              </div>
              <div className="experience-list" id="exp-list">
                {experiences.map((exp: any, index: number) => (
                  <div key={index} className="experience-item">
                    <span className="role">{exp.title}</span>
                    {exp.content && <div dangerouslySetInnerHTML={{ __html: exp.content }} />}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* <!-- Contact Section --> */}
        <section id="contact" className="section reveal">
          <div className="section-container">
            <span className="eyebrow">05. Contact</span>
            <h1>
              Let's Work <span className="accent">Together.</span>
            </h1>
            <p className="lede">
              Currently open for professional opportunities and collaborative
              projects.
            </p>
            <a className="btn primary" href="mailto:">
              Send Message
            </a>
          </div>
        </section>
      </main>

      <footer>
        <p>
          NEIL //{" "}
          <span className="mono">
            © <span id="year"></span>
          </span>
        </p>
      </footer>

      {/* <!-- Modal --> */}
      <div className="modal-overlay" id="project-modal">
        <div className="modal-content">
          <button className="modal-close" aria-label="Close modal">
            &times;
          </button>
          <div id="modal-body">{/* <!-- Content injected via JS --> */}</div>
        </div>
      </div>

      {/* <script src="portfolio-data.js"></script> */}
      {/* <script src="main.js"></script> */}
    </main>
  );
}
