"use client";

import { Component, type ReactNode } from "react";
import { ExternalLink } from "lucide-react";
import { Warp } from "@paper-design/shaders-react";
import type { Project } from "@/data/projects";

type FeaturesCardsProps = {
  projects: readonly Project[];
};

type ShaderErrorBoundaryProps = {
  children: ReactNode;
};

type ShaderErrorBoundaryState = {
  hasError: boolean;
};

const shaderConfigs = [
  {
    proportion: 0.3,
    softness: 0.8,
    distortion: 0.15,
    swirl: 0.6,
    swirlIterations: 8,
    shape: "checks" as const,
    shapeScale: 0.08,
    colors: ["hsl(280, 100%, 30%)", "hsl(320, 100%, 60%)", "hsl(340, 90%, 40%)", "hsl(300, 100%, 70%)"],
  },
  {
    proportion: 0.4,
    softness: 1.2,
    distortion: 0.2,
    swirl: 0.9,
    swirlIterations: 12,
    shape: "stripes" as const,
    shapeScale: 0.12,
    colors: ["hsl(200, 100%, 25%)", "hsl(180, 100%, 65%)", "hsl(160, 90%, 35%)", "hsl(190, 100%, 75%)"],
  },
  {
    proportion: 0.35,
    softness: 0.9,
    distortion: 0.18,
    swirl: 0.7,
    swirlIterations: 10,
    shape: "checks" as const,
    shapeScale: 0.1,
    colors: ["hsl(120, 100%, 25%)", "hsl(140, 100%, 60%)", "hsl(100, 90%, 30%)", "hsl(130, 100%, 70%)"],
  },
  {
    proportion: 0.45,
    softness: 1.1,
    distortion: 0.22,
    swirl: 0.8,
    swirlIterations: 15,
    shape: "stripes" as const,
    shapeScale: 0.09,
    colors: ["hsl(30, 100%, 35%)", "hsl(50, 100%, 65%)", "hsl(40, 90%, 40%)", "hsl(45, 100%, 75%)"],
  },
];

export class ShaderErrorBoundary extends Component<ShaderErrorBoundaryProps, ShaderErrorBoundaryState> {
  state: ShaderErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ShaderErrorBoundaryState {
    return { hasError: true };
  }

  render() {
    return this.state.hasError ? <div className="absolute inset-0 bg-[#15131a]" data-testid="shader-fallback" /> : this.props.children;
  }
}

export default function FeaturesCards({ projects }: FeaturesCardsProps) {
  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
      {projects.map((project, index) => {
        const shaderConfig = shaderConfigs[index];

        return (
          <article className="relative min-h-80 overflow-hidden rounded-3xl" key={project.slug}>
            <div aria-hidden="true" className="absolute inset-0">
              <ShaderErrorBoundary>
                <Warp
                  colors={shaderConfig.colors}
                  distortion={shaderConfig.distortion}
                  proportion={shaderConfig.proportion}
                  rotation={0}
                  scale={1}
                  shape={shaderConfig.shape}
                  shapeScale={shaderConfig.shapeScale}
                  softness={shaderConfig.softness}
                  speed={0.8}
                  style={{ height: "100%", width: "100%" }}
                  swirl={shaderConfig.swirl}
                  swirlIterations={shaderConfig.swirlIterations}
                />
              </ShaderErrorBoundary>
            </div>

            <div className="relative z-10 flex min-h-80 flex-col rounded-3xl border border-white/20 bg-black/80 p-8">
              <span className="font-mono text-xs uppercase tracking-[0.14em] text-gray-200">0{index + 1} · {project.category}</span>
              <h2 className="mb-4 mt-6 text-2xl font-bold text-white">{project.title}</h2>
              <p className="flex-grow font-medium leading-relaxed text-gray-100">{project.summary}</p>
              <p className="mt-6 font-mono text-xs uppercase tracking-[0.14em] text-gray-200">{project.technologies.join(" · ")}</p>
              {project.href ? (
                <a
                  aria-label={`Открыть проект ${project.title}`}
                  className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-gray-200"
                  href={project.href}
                  rel="noreferrer"
                  target="_blank"
                >
                  GitHub <ExternalLink aria-hidden="true" size={15} />
                </a>
              ) : null}
            </div>
          </article>
        );
      })}
    </div>
  );
}
