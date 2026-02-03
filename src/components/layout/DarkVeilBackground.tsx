"use client";

import { useEffect, useRef } from "react";

export default function DarkVeilBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let time = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", resize);
    resize();

    // Configuration
    const dotSpacing = 30; // Spacing between dots
    const waveHeight = 60; // Max height of the wave
    const speed = 0.02; // Speed of animation
    const colorPrimary = "249, 115, 22"; // Orange RGB

    const draw = () => {
      // Clear with trail effect for "silk" look
      ctx.fillStyle = "rgba(5, 5, 5, 0.2)"; // Very dark trail
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const rows = Math.ceil(canvas.height / dotSpacing);
      const cols = Math.ceil(canvas.width / dotSpacing);

      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          // Calculate wave offset
          const xPos = x * dotSpacing;
          const yBase = y * dotSpacing;

          // 3D Wave Formula
          const distFromCenter = Math.sqrt(Math.pow(x - cols / 2, 2) + Math.pow(y - rows / 2, 2));
          const waveOffset = Math.sin(distFromCenter * 0.1 - time) * waveHeight;
          const waveOffset2 = Math.cos(x * 0.1 + time) * (waveHeight * 0.5);

          const yPos = yBase + waveOffset + waveOffset2;

          // Opacity based on depth
          const opacity = Math.max(0.1, 1 - distFromCenter / (cols / 1.5));

          // Draw Dot
          ctx.beginPath();
          ctx.arc(xPos, yPos, 1.5, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${colorPrimary}, ${opacity * 0.5})`;
          ctx.fill();

          // Connect nearby dots for "Veil" effect (horizontal only for silky look)
          if (x > 0) {
            ctx.beginPath();
            ctx.moveTo(xPos, yPos);
            // Previous dot logic (approximate for performance)
            const prevX = (x - 1) * dotSpacing;
            const prevDist = Math.sqrt(Math.pow(x - 1 - cols / 2, 2) + Math.pow(y - rows / 2, 2));
            const prevWave = Math.sin(prevDist * 0.1 - time) * waveHeight;
            const prevWave2 = Math.cos((x - 1) * 0.1 + time) * (waveHeight * 0.5);
            const prevY = yBase + prevWave + prevWave2;

            ctx.lineTo(prevX, prevY);
            ctx.strokeStyle = `rgba(${colorPrimary}, ${opacity * 0.15})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }

      time += speed;
      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-0 bg-[#050505]">
      <div className="absolute inset-0 z-10 bg-gradient-to-b from-transparent to-[#050505]" />
      <canvas ref={canvasRef} className="opacity-60" />
    </div>
  );
}
