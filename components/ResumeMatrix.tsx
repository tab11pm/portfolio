"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { ExperienceEntry } from "@/data/experience";

const cardRoles = ["lead", "side", "lower"] as const;

export function ResumeMatrix({ entries }: { entries: readonly ExperienceEntry[] }) {
  const matrixRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!matrixRef.current || !window.matchMedia) {
      return;
    }

    const cards = Array.from(matrixRef.current.querySelectorAll<HTMLElement>(".resume-reveal"));
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduceMotion) {
      gsap.set(cards, { autoAlpha: 1, y: 0 });
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    const context = gsap.context(() => {
      cards.forEach((card, index) => {
        gsap.fromTo(card, { autoAlpha: 0, y: 24 }, {
          autoAlpha: 1,
          y: 0,
          duration: 0.55,
          delay: index * 0.06,
          ease: "power1.out",
          scrollTrigger: { trigger: card, start: "top 88%", once: true },
        });
      });

      matrixRef.current?.querySelectorAll<HTMLElement>(".resume-parallax").forEach((card) => {
        gsap.to(card, {
          yPercent: -4,
          ease: "none",
          scrollTrigger: { trigger: card, start: "top bottom", end: "bottom top", scrub: true },
        });
      });
    }, matrixRef);

    return () => context.revert();
  }, []);

  return (
    <div className="resume-matrix" ref={matrixRef}>
      {entries.map((item, index) => {
        const role = cardRoles[index];
        const parallaxClass = role === "lead" ? " resume-parallax" : "";

        return (
          <article className={`resume-card resume-card--${role} resume-reveal${parallaxClass}`} key={item.company}>
            <time>{item.period}</time>
            <div>
              <h2>{item.company}</h2>
              <strong>{item.role}</strong>
              <p>{item.description}</p>
            </div>
            <span className="resume-card-index" aria-hidden="true">0{index + 1}</span>
          </article>
        );
      })}

      <article className="resume-card resume-card--editorial resume-reveal resume-parallax">
        <p className="resume-card-label">Фокус</p>
        <h2>Строю продукты и беру ответственность за систему.</h2>
      </article>
    </div>
  );
}
