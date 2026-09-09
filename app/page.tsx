import Link from "next/link";
import { AmbientCanvas } from "@/components/AmbientCanvas";

export default function HomePage() { return <section className="hero"><AmbientCanvas variant="pixels" /><div className="hero-content"><p className="eyebrow">Frontend developer · Томск</p><h1>Создаю цифровые продукты, которые упрощают сложное.</h1><p>Табрез Шонизоров — разработчик, который соединяет продуктовый подход, интерфейсы и инженерную системность.</p><div className="actions"><Link href="/resume">Резюме</Link><Link href="/portfolio">Мои работы →</Link></div></div></section>; }
