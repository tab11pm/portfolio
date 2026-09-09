"use client";

import Image from "next/image";
import { useState, type ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { IconType } from "react-icons";
import { FaGithub, FaLinkedinIn, FaTelegramPlane } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { cn } from "@/lib/utils";

export interface MinimalistHeroProps {
  logoText: string;
  navLinks: { label: string; href: string }[];
  mainText: string;
  readMoreLink: string;
  imageSrc: string;
  imageAlt: string;
  overlayText: { part1: string; part2: string };
  socialLinks: { icon: SocialIconName; href: string; label: string }[];
  locationText: string;
  className?: string;
}

type SocialIconName = "code" | "message" | "briefcase" | "radio" | "mail";

const socialIcons: Record<SocialIconName, IconType> = {
  code: FaGithub,
  message: FaTelegramPlane,
  briefcase: FaLinkedinIn,
  radio: FaTelegramPlane,
  mail: MdEmail,
};

function NavLink({ href, children }: { href: string; children: ReactNode }) {
  return <a href={href} className="text-sm font-medium tracking-widest text-[var(--muted)] transition-colors hover:text-[var(--text)]">{children}</a>;
}

function SocialIcon({ href, icon, label }: MinimalistHeroProps["socialLinks"][number]) {
  const isEmail = href.startsWith("mailto:");
  const Icon = socialIcons[icon];
  return <a aria-label={label} href={href} {...(!isEmail ? { target: "_blank", rel: "noopener noreferrer" } : {})} className="text-[var(--muted)] transition-colors hover:text-[var(--text)]"><Icon className="h-5 w-5" aria-hidden="true" /></a>;
}

export function MinimalistHero({ logoText, navLinks, mainText, readMoreLink, imageSrc, imageAlt, overlayText, socialLinks, locationText, className }: MinimalistHeroProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);
  const reduceMotion = useReducedMotion();
  const fadeFromLeft = reduceMotion ? false : { opacity: 0, x: -20 };
  const fadeFromRight = reduceMotion ? false : { opacity: 0, x: 20 };
  const fadeFromBottom = reduceMotion ? false : { opacity: 0, y: 20 };

  return <section className={cn("relative flex min-h-screen w-full flex-col items-center justify-between overflow-hidden bg-[var(--bg)] px-6 py-8 font-sans text-[var(--text)] md:px-12", className)}>
    <header className="z-30 flex w-full max-w-7xl items-center justify-between">
      <motion.div initial={fadeFromLeft} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }} className="font-mono text-xl font-bold tracking-wider text-[var(--accent)]">{logoText}</motion.div>
      <nav aria-label="Основная навигация" className="hidden items-center space-x-8 md:flex">{navLinks.map((link) => <NavLink key={link.href} href={link.href}>{link.label}</NavLink>)}</nav>
      <motion.button type="button" initial={fadeFromRight} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }} className="flex flex-col space-y-1.5 md:hidden" aria-label={isMenuOpen ? "Закрыть меню" : "Открыть меню"} aria-expanded={isMenuOpen} onClick={() => setIsMenuOpen((open) => !open)}>
        <span className="block h-0.5 w-6 bg-[var(--text)]" /><span className="block h-0.5 w-6 bg-[var(--text)]" /><span className="block h-0.5 w-5 bg-[var(--text)]" />
      </motion.button>
      {isMenuOpen && <nav aria-label="Мобильная навигация" className="absolute right-0 top-12 z-40 flex flex-col gap-4 border border-[#3b344b] bg-[var(--surface)] p-5 shadow-[8px_8px_0_#0004] md:hidden">{navLinks.map((link) => <NavLink key={link.href} href={link.href}>{link.label}</NavLink>)}</nav>}
    </header>

    <div className="relative grid w-full max-w-7xl flex-1 grid-cols-1 items-center gap-8 py-10 md:grid-cols-3 md:gap-0">
      <motion.div initial={fadeFromBottom} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: reduceMotion ? 0 : 0.8 }} className="z-20 order-2 text-center md:order-1 md:text-left"><p className="mx-auto max-w-xs text-sm leading-relaxed text-[var(--muted)] md:mx-0">{mainText}</p><a href={readMoreLink} className="mt-4 inline-block text-sm font-medium text-[var(--text)] underline decoration-[var(--accent)] underline-offset-4">Смотреть работы</a></motion.div>
      <div className="relative order-1 flex h-full min-h-80 items-center justify-center md:order-2">
        <motion.div initial={reduceMotion ? false : { scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: reduceMotion ? 0 : 0.2 }} className="absolute z-0 h-72 w-72 rounded-full bg-[var(--accent)] opacity-80 md:h-96 md:w-96 lg:h-[28rem] lg:w-[28rem]" />
        {imageFailed ? <div role="img" aria-label={imageAlt} className="relative z-10 h-80 w-56 bg-linear-to-br from-[#211c35] to-[#121217] shadow-[0_0_0_1px_#b7a5ff55] md:h-96 md:w-64 lg:h-[82vh] lg:w-[65vh]" /> : <motion.div data-testid="hero-portrait-frame" initial={reduceMotion ? false : { opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: reduceMotion ? 0 : 0.4 }} className="relative z-10 h-80 w-56 overflow-hidden md:h-96 md:w-64 lg:h-[82vh] lg:w-[65vh]"><Image src={imageSrc} alt={imageAlt} fill priority sizes="(min-width: 1024px) 65vh, (min-width: 768px) 16rem, 14rem" className="origin-[52%_42%] scale-[1.18] object-contain object-center lg:scale-[2]" onError={() => setImageFailed(true)} /></motion.div>}
      </div>
      <motion.div initial={fadeFromBottom} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: reduceMotion ? 0 : 1 }} className="z-20 order-3 flex items-center justify-center text-center md:justify-start md:text-left"><h1 className="text-6xl font-semibold leading-none tracking-tight text-[var(--text)] md:text-7xl lg:text-8xl">{overlayText.part1}<br />{overlayText.part2}</h1></motion.div>
    </div>

    <footer className="z-30 flex w-full max-w-7xl items-center justify-between gap-4"><motion.div initial={fadeFromBottom} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: reduceMotion ? 0 : 1 }} className="flex items-center space-x-4">{socialLinks.map((link) => <SocialIcon key={link.label} {...link} />)}</motion.div><motion.div initial={fadeFromBottom} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: reduceMotion ? 0 : 1.1 }} className="text-right text-sm font-medium text-[var(--muted)]">{locationText}</motion.div></footer>
  </section>;
}
