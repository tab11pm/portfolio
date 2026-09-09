import FeaturesCards from "@/components/ui/feature-shader-cards";
import { projects } from "@/data/projects";

export default function PortfolioPage() {
  return (
    <section className="page">
      <p className="eyebrow">Портфолио</p>
      <h1>Работы, за которыми стоит результат.</h1>
      <FeaturesCards projects={projects} />
    </section>
  );
}
