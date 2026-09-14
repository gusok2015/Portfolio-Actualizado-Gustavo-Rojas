import "./styles/Work.css";
import WorkImage from "./WorkImage";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect } from "react";
import { config } from "../config";
import { Link } from "react-router-dom";

gsap.registerPlugin(ScrollTrigger);

const Work = () => {
  useEffect(() => {
    // Disable pinning on mobile to allow scrolling
    if (window.innerWidth <= 768) return;

    let translateX: number = 0;
    let timeline: gsap.core.Timeline | null = null;

    function initWorkScroll() {
      const box = document.getElementsByClassName("work-box");
      if (box.length === 0) return;
      const workContainer = document.querySelector(".work-container");
      if (!workContainer) return;

      const rectLeft = workContainer.getBoundingClientRect().left;
      const rect = box[0].getBoundingClientRect();
      const parentWidth = box[0].parentElement!.getBoundingClientRect().width;
      let padding: number =
        parseInt(window.getComputedStyle(box[0]).padding) / 2;

      translateX = rect.width * box.length - (rectLeft + parentWidth) + padding;

      if (timeline) {
        timeline.kill();
        ScrollTrigger.getById("work")?.kill();
      }

      timeline = gsap.timeline({
        scrollTrigger: {
          trigger: ".work-section",
          start: "top top",
          end: `+=${translateX}`,
          scrub: 1,
          pin: true,
          pinSpacing: true,
          anticipatePin: 1,
          id: "work",
          invalidateOnRefresh: true,
        },
      });

      timeline.to(".work-flex", {
        x: -translateX,
        ease: "none",
      });

      ScrollTrigger.refresh();
    }

    const timer1 = setTimeout(initWorkScroll, 100);
    const timer2 = setTimeout(initWorkScroll, 800);

    window.addEventListener("resize", initWorkScroll);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      window.removeEventListener("resize", initWorkScroll);
      if (timeline) timeline.kill();
      ScrollTrigger.getById("work")?.kill();
    };
  }, []);
  return (
    <div className="work-section" id="work">
      <div className="work-container section-container">
        <h2>
          Mis <span>Proyectos</span>
        </h2>
        <div className="work-flex">
          {config.projects.slice(0, 5).map((project, index) => (
            <div className="work-box" key={project.id}>
              <div className="work-info">
                <div className="work-title">
                  <h3>0{index + 1}</h3>

                  <div>
                    {project.link ? (
                      <a href={project.link} target="_blank" rel="noopener noreferrer" style={{ color: "inherit", textDecoration: "none" }}>
                        <h4>{project.title}</h4>
                      </a>
                    ) : (
                      <h4>{project.title}</h4>
                    )}
                    <p>{project.category}</p>
                  </div>
                </div>
                <h4>Herramientas y características</h4>
                {project.link ? (
                  <a href={project.link} target="_blank" rel="noopener noreferrer" style={{ color: "inherit", textDecoration: "none" }}>
                    <p>{project.technologies}</p>
                  </a>
                ) : (
                  <p>{project.technologies}</p>
                )}
              </div>
              <WorkImage image={project.image} alt={project.title} link={project.link} />
            </div>
          ))}
          {/* See All Works Button */}
          <div className="work-box work-box-cta">
            <div className="see-all-works">
              <h3>Querés ver más?</h3>
              <p>Explora mis proyectos y creaciones</p>
              <Link to="/myworks" className="see-all-btn" data-cursor="disable">
                See All Works →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Work;
