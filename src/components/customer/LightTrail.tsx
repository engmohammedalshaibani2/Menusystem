"use client";

import { useEffect, useRef } from "react";

interface Point {
  x: number;
  y: number;
  age: number;
}

export default function LightTrail() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointsRef = useRef<Point[]>([]);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const getGoldColor = () => {
      const el = document.documentElement;
      const gold = getComputedStyle(el).getPropertyValue("--gold").trim() || "#EAD7B8";
      return gold;
    };

    const onMouseMove = (e: MouseEvent) => {
      pointsRef.current.push({ x: e.clientX, y: e.clientY, age: 0 });
      if (pointsRef.current.length > 40) {
        pointsRef.current = pointsRef.current.slice(-40);
      }
    };
    window.addEventListener("mousemove", onMouseMove);

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const gold = getGoldColor();
      const pts = pointsRef.current;

      for (let i = 0; i < pts.length; i++) {
        pts[i].age++;
      }

      pointsRef.current = pts.filter((p) => p.age < 40);

      if (pts.length > 1) {
        ctx.beginPath();
        ctx.moveTo(pts[0].x, pts[0].y);
        for (let i = 1; i < pts.length; i++) {
          ctx.lineTo(pts[i].x, pts[i].y);
        }
        const alpha = Math.max(0, 0.25 - pts.length / 200);
        ctx.strokeStyle = gold;
        ctx.globalAlpha = alpha;
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.shadowColor = gold;
        ctx.shadowBlur = 15;
        ctx.beginPath();
        ctx.moveTo(pts[0].x, pts[0].y);
        for (let i = 1; i < pts.length; i++) {
          ctx.lineTo(pts[i].x, pts[i].y);
        }
        ctx.strokeStyle = gold;
        ctx.globalAlpha = alpha * 0.5;
        ctx.lineWidth = 4;
        ctx.stroke();
        ctx.shadowBlur = 0;
      }

      ctx.globalAlpha = 1;
      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouseMove);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[1]"
    />
  );
}
