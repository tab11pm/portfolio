import { ExternalLink } from "lucide-react";
import { projects } from "@/data/projects";

export default function PortfolioPage() { return <section className="page"><p className="eyebrow">Портфолио</p><h1>Работы, за которыми стоит результат.</h1><div className="project-grid">{projects.map((project, index) => <article className={`project project-${project.slug}`} key={project.slug}><span>0{index + 1}</span><h2>{project.title}</h2><p className="category">{project.category}</p><p>{project.summary}</p><p className="stack">{project.technologies.join(" · ")}</p>{project.href ? <a aria-label={`Открыть проект ${project.title}`} href={project.href} target="_blank" rel="noreferrer">GitHub <ExternalLink size={15} /></a> : null}</article>)}</div></section>; }
