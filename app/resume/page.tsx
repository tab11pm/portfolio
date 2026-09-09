import { experience } from "@/data/experience";

const displayOrder = ["PinShop TJ", "Matrix IT", "ТУСУР"] as const;
const cardRoles = ["lead", "side", "lower"] as const;

const resumeExperience = displayOrder.map((company) => {
  const entry = experience.find((item) => item.company === company);

  if (!entry) {
    throw new Error(`Missing résumé entry for ${company}`);
  }

  return entry;
});

export default function ResumePage() {
  return (
    <section className="page resume-page">
      <p className="eyebrow">Резюме</p>
      <h1>Опыт, системность, рост.</h1>

      <div className="resume-grid">
        {resumeExperience.map((item, index) => (
          <article className={`resume-card resume-card--${cardRoles[index]}`} key={item.company}>
            <time>{item.period}</time>
            <div>
              <h2>{item.company}</h2>
              <strong>{item.role}</strong>
              <p>{item.description}</p>
            </div>
            <span className="resume-card-index" aria-hidden="true">0{index + 1}</span>
          </article>
        ))}

        <article className="resume-card resume-card--editorial">
          <p className="resume-card-label">Фокус</p>
          <h2>Строю продукты и беру ответственность за систему.</h2>
        </article>
      </div>
    </section>
  );
}
