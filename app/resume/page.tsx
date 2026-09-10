import { experience } from "@/data/experience";
import { ResumeMatrix } from "@/components/ResumeMatrix";

const displayOrder = ["PinShop TJ", "Matrix IT", "ТУСУР"] as const;

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

      <ResumeMatrix entries={resumeExperience} />
    </section>
  );
}
