import { experience } from "@/data/experience";

export default function ResumePage() { return <section className="page"><p className="eyebrow">Резюме</p><h1>Опыт, системность, рост.</h1><ol className="timeline">{experience.map((item) => <li key={item.company}><time>{item.period}</time><h2>{item.company}</h2><strong>{item.role}</strong><p>{item.description}</p></li>)}</ol></section>; }
