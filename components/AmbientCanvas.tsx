"use client";

import { useEffect, useRef } from "react";

export function AmbientCanvas({ variant }: { variant: "pixels" | "dots" | "warp" }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let frame = 0;
    let elapsed = 0;
    const draw = (time = 0) => {
      const rect = canvas.getBoundingClientRect();
      const ratio = Math.min(devicePixelRatio || 1, 2);
      if (canvas.width !== Math.round(rect.width * ratio) || canvas.height !== Math.round(rect.height * ratio)) {
        canvas.width = Math.round(rect.width * ratio); canvas.height = Math.round(rect.height * ratio);
      }
      context.setTransform(ratio, 0, 0, ratio, 0, 0); context.clearRect(0, 0, rect.width, rect.height);
      elapsed = time * 0.001;
      const spacing = variant === "pixels" ? 38 : variant === "dots" ? 28 : 56;
      context.fillStyle = "rgba(166, 150, 255, 0.16)";
      for (let x = 0; x < rect.width; x += spacing) for (let y = 0; y < rect.height; y += spacing) {
        const wave = reduced ? 0.35 : 0.18 + (Math.sin(elapsed + x * 0.018 + y * 0.02) + 1) * 0.18;
        context.globalAlpha = wave;
        if (variant === "warp") { context.fillRect(x + Math.sin(elapsed + y) * 5, y, 2, 12); }
        else context.fillRect(x, y, variant === "pixels" ? 2 : 1.5, variant === "pixels" ? 2 : 1.5);
      }
      context.globalAlpha = 1;
      if (!reduced && !document.hidden) frame = requestAnimationFrame(draw);
    };
    draw();
    const onVisibility = () => { if (!document.hidden && !reduced) frame = requestAnimationFrame(draw); };
    document.addEventListener("visibilitychange", onVisibility);
    return () => { cancelAnimationFrame(frame); document.removeEventListener("visibilitychange", onVisibility); };
  }, [variant]);
  return <canvas ref={ref} aria-hidden="true" className="ambient-canvas" />;
}
