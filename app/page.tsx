import Link from "next/link";

export default function HomePage() { return <section className="hero"><p className="eyebrow">Frontend developer · Томск</p><h1>Создаю цифровые продукты, которые упрощают сложное.</h1><p>Табрез Шонизоров — разработчик, который соединяет продуктовый подход, интерфейсы и инженерную системность.</p><div className="actions"><Link href="/resume">Резюме</Link><Link href="/portfolio">Мои работы →</Link></div></section>; }
