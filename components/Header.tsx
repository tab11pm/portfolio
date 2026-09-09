import Link from "next/link";

export function Header() { return <header className="site-header"><Link className="brand" href="/"><span>Т</span><span>Ш</span></Link><nav aria-label="Основная навигация"><Link href="/">Главная</Link><Link href="/resume">Резюме</Link><Link href="/portfolio">Портфолио</Link></nav><span className="header-status">ДОСТУПЕН ДЛЯ РАБОТЫ</span></header>; }
