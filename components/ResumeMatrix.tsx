"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import type { ExperienceEntry } from "@/data/experience";

const cardRoles = ["lead", "side", "lower"] as const;
const cardCount = 4;
const deckLayouts = [
  { rotation: 0, scale: 1, xPercent: 0, y: 0, zIndex: 40 },
  { rotation: 8, scale: 0.94, xPercent: 28, y: 46, zIndex: 30 },
  { rotation: 0, scale: 0.88, xPercent: 0, y: 76, zIndex: 10 },
  { rotation: -8, scale: 0.94, xPercent: -28, y: 46, zIndex: 20 },
] as const;

function relativePosition(index: number, activeIndex: number) {
  return (index - activeIndex + cardCount) % cardCount;
}

export function ResumeMatrix({ entries }: { entries: readonly ExperienceEntry[] }) {
  const deckRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef({ active: false, dx: 0, startX: 0, startY: 0 });
  const animatingRef = useRef(false);
  const mountedRef = useRef(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const prefersReducedMotion = () =>
    typeof window.matchMedia === "function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const getActiveCard = () => deckRef.current?.querySelector<HTMLElement>(".resume-card.is-active") ?? null;

  useLayoutEffect(() => {
    const deck = deckRef.current;
    if (!deck) return;

    const cards = Array.from(deck.querySelectorAll<HTMLElement>(".resume-card"));
    const reduceMotion = prefersReducedMotion();
    const firstLayout = !mountedRef.current;
    const context = gsap.context(() => {
      cards.forEach((card, index) => {
        const relativeIndex = relativePosition(index, activeIndex);
        const layout = deckLayouts[relativeIndex];
        const target = {
          ...layout,
          opacity: 1,
          rotationX: 0,
          rotationY: 0,
          transformOrigin: "50% 70%",
          transformPerspective: 1200,
        };

        if (firstLayout && !reduceMotion) {
          gsap.fromTo(card, { ...target, opacity: 0, y: layout.y + 38 }, {
            ...target,
            delay: relativeIndex * 0.06,
            duration: 0.65,
            ease: "power3.out",
          });
        } else {
          gsap.to(card, {
            ...target,
            duration: reduceMotion || firstLayout ? 0 : 0.55,
            ease: "power3.out",
            overwrite: "auto",
          });
        }
      });
    }, deck);

    mountedRef.current = true;
    return () => context.revert();
  }, [activeIndex]);

  const restoreActiveCard = () => {
    const card = getActiveCard();
    if (!card) return;
    gsap.to(card, {
      duration: prefersReducedMotion() ? 0 : 0.42,
      ease: "power3.out",
      overwrite: "auto",
      rotation: 0,
      rotationX: 0,
      rotationY: 0,
      scale: 1,
      x: 0,
      xPercent: 0,
      y: 0,
      zIndex: 40,
    });
  };

  const moveDeck = (direction: -1 | 1) => {
    if (animatingRef.current) return;
    const card = getActiveCard();
    if (!card) return;

    const nextIndex = (activeIndex + (direction < 0 ? 1 : -1) + cardCount) % cardCount;
    const finish = () => {
      animatingRef.current = false;
      setActiveIndex(nextIndex);
    };

    if (prefersReducedMotion()) {
      finish();
      return;
    }

    animatingRef.current = true;
    gsap.to(card, {
      duration: 0.3,
      ease: "power2.in",
      opacity: 0,
      rotation: direction * 16,
      scale: 0.96,
      x: direction * Math.min(window.innerWidth * 0.52, 620),
      y: 48,
      onComplete: finish,
    });
  };

  const releasePointer = (target: HTMLDivElement, pointerId: number) => {
    dragRef.current.active = false;
    target.classList.remove("is-grabbing");
    if (target.hasPointerCapture(pointerId)) target.releasePointerCapture(pointerId);

    if (Math.abs(dragRef.current.dx) >= 82) {
      moveDeck(dragRef.current.dx < 0 ? -1 : 1);
    } else {
      restoreActiveCard();
    }
  };

  return (
    <div
      className="resume-deck"
      ref={deckRef}
      role="region"
      aria-label="Опыт работы"
      aria-roledescription="колода карточек"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === "ArrowRight") {
          event.preventDefault();
          moveDeck(-1);
        }
        if (event.key === "ArrowLeft") {
          event.preventDefault();
          moveDeck(1);
        }
      }}
      onPointerDown={(event) => {
        if (animatingRef.current || event.button !== 0) return;
        const card = getActiveCard();
        if (!card) return;
        dragRef.current = { active: true, dx: 0, startX: event.clientX, startY: event.clientY };
        event.currentTarget.setPointerCapture(event.pointerId);
        event.currentTarget.classList.add("is-grabbing");
        gsap.to(card, {
          duration: prefersReducedMotion() ? 0 : 0.18,
          ease: "power2.out",
          scale: 1.035,
          y: -10,
          zIndex: 60,
        });
      }}
      onPointerMove={(event) => {
        const card = getActiveCard();
        if (!card || animatingRef.current || prefersReducedMotion()) return;

        if (dragRef.current.active) {
          const dx = event.clientX - dragRef.current.startX;
          const dy = event.clientY - dragRef.current.startY;
          dragRef.current.dx = dx;
          gsap.set(card, {
            rotation: dx / 22,
            rotationX: -dy / 28,
            rotationY: dx / 30,
            scale: 1.035,
            x: dx,
            xPercent: 0,
            y: dy * 0.34 - 10,
          });
          return;
        }

        if (event.pointerType === "mouse") {
          const box = card.getBoundingClientRect();
          const x = Math.max(-1, Math.min(1, (event.clientX - (box.left + box.width / 2)) / (box.width / 2)));
          const y = Math.max(-1, Math.min(1, (event.clientY - (box.top + box.height / 2)) / (box.height / 2)));
          gsap.to(card, {
            duration: 0.28,
            ease: "power2.out",
            rotationX: -y * 7,
            rotationY: x * 9,
            x: x * 9,
            y: y * 6,
          });
        }
      }}
      onPointerUp={(event) => releasePointer(event.currentTarget, event.pointerId)}
      onPointerCancel={(event) => releasePointer(event.currentTarget, event.pointerId)}
      onPointerLeave={() => {
        if (!dragRef.current.active && !animatingRef.current && !prefersReducedMotion()) restoreActiveCard();
      }}
    >
      {entries.map((item, index) => {
        const role = cardRoles[index];

        return (
          <article
            className={`resume-card resume-card--${role} resume-reveal${activeIndex === index ? " is-active" : ""}`}
            aria-label={`${index + 1} из 4`}
            aria-current={activeIndex === index ? "true" : undefined}
            key={item.company}
          >
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

      <article
        className={`resume-card resume-card--editorial resume-reveal${activeIndex === 3 ? " is-active" : ""}`}
        aria-label="4 из 4"
        aria-current={activeIndex === 3 ? "true" : undefined}
      >
        <p className="resume-card-label">Фокус</p>
        <h2>Строю продукты и беру ответственность за систему.</h2>
        <span className="resume-card-index" aria-hidden="true">04</span>
      </article>
    </div>
  );
}
