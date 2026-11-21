import React, { useEffect, useRef, useState } from 'react';

interface HeroOrbitalVisualProps {
  compact?: boolean;
  speedMultiplier?: number;
  tiltIntensity?: number;
  showGrid?: boolean;
}

interface Point3D {
  x: number;
  y: number;
  z: number;
}

interface Particle {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  accent: boolean;
}

const PHI = (1 + Math.sqrt(5)) / 2;

// Icosahedron vertices normalized
const RAW_VERTS: Point3D[] = [
  { x: -1, y: PHI, z: 0 },
  { x: 1, y: PHI, z: 0 },
  { x: -1, y: -PHI, z: 0 },
  { x: 1, y: -PHI, z: 0 },
  { x: 0, y: -1, z: PHI },
  { x: 0, y: 1, z: PHI },
  { x: 0, y: -1, z: -PHI },
  { x: 0, y: 1, z: -PHI },
  { x: PHI, y: 0, z: -1 },
  { x: PHI, y: 0, z: 1 },
  { x: -PHI, y: 0, z: -1 },
  { x: -PHI, y: 0, z: 1 },
].map((v) => {
  const len = Math.hypot(v.x, v.y, v.z);
  return { x: v.x / len, y: v.y / len, z: v.z / len };
});

const ICO_EDGES: [number, number][] = [
  [0, 11], [0, 5], [0, 1], [0, 7], [0, 10],
  [1, 5], [5, 11], [11, 10], [10, 7], [7, 1],
  [3, 9], [3, 4], [3, 2], [3, 6], [3, 8],
  [4, 9], [2, 4], [6, 2], [8, 6], [9, 8],
  [4, 5], [2, 11], [6, 10], [8, 7], [9, 1],
  [5, 9], [11, 4], [10, 2], [7, 6], [1, 8],
];

function rotatePoint(p: Point3D, rx: number, ry: number, rz: number): Point3D {
  // Rotate X
  const cy = Math.cos(rx);
  const sy = Math.sin(rx);
  const y1 = p.y * cy - p.z * sy;
  const z1 = p.y * sy + p.z * cy;
  const x1 = p.x;

  // Rotate Y
  const cx = Math.cos(ry);
  const sx = Math.sin(ry);
  const x2 = x1 * cx + z1 * sx;
  const z2 = -x1 * sx + z1 * cx;
  const y2 = y1;

  // Rotate Z
  const cz = Math.cos(rz);
  const sz = Math.sin(rz);
  return {
    x: x2 * cz - y2 * sz,
    y: x2 * sz + y2 * cz,
    z: z2,
  };
}

export const HeroOrbitalVisual: React.FC<HeroOrbitalVisualProps> = ({
  compact = false,
  speedMultiplier = 1,
  tiltIntensity = 1,
  showGrid = true,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const pointerRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const particles: Particle[] = Array.from({ length: compact ? 24 : 42 }, (_, i) => ({
      x: (Math.sin(i * 12.9898) * 43758.5453 % 1) * 2 - 1,
      y: (Math.sin(i * 78.233) * 43758.5453 % 1) * 2 - 1,
      z: (Math.sin(i * 39.346) * 43758.5453 % 1) * 2 - 1,
      vx: ((i % 2 === 0 ? 1 : -1) * 0.0014) + (i % 3) * 0.0004,
      vy: ((i % 3 === 0 ? 1 : -1) * 0.0012),
      vz: ((i % 5 === 0 ? 1 : -1) * 0.0011),
      accent: i % 4 === 0,
    })).map((p) => ({
      ...p,
      x: ((p.x % 1) + 1) % 1 * 2 - 1,
      y: ((p.y % 1) + 1) % 1 * 2 - 1,
      z: ((p.z % 1) + 1) % 1 * 2 - 1,
    }));

    let animId = 0;
    let time = 0;

    const resize = () => {
      const rect = container.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.floor(rect.width * dpr));
      canvas.height = Math.max(1, Math.floor(rect.height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(container);

    const drawFrame = () => {
      const rect = container.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;
      if (w <= 0 || h <= 0) return;

      ctx.clearRect(0, 0, w, h);

      // Smooth pointer interpolation
      pointerRef.current.x += (pointerRef.current.targetX - pointerRef.current.x) * 0.06;
      pointerRef.current.y += (pointerRef.current.targetY - pointerRef.current.y) * 0.06;

      const px = pointerRef.current.x * 0.35 * tiltIntensity;
      const py = pointerRef.current.y * 0.35 * tiltIntensity;

      const cx = w * 0.5;
      const cy = h * 0.48;
      const scale = Math.min(w, h) * (compact ? 0.3 : 0.27);
      const fov = 4.2;

      const project = (pt: Point3D) => {
        const zDepth = fov + pt.z;
        const factor = fov / Math.max(0.8, zDepth);
        return {
          x: cx + pt.x * scale * factor,
          y: cy + pt.y * scale * factor,
          scale: factor,
          z: pt.z,
        };
      };

      // Subtle atmospheric radial glow behind core
      const coreGlow = ctx.createRadialGradient(cx, cy, scale * 0.1, cx, cy, scale * 1.9);
      coreGlow.addColorStop(0, 'rgba(139, 92, 246, 0.14)');
      coreGlow.addColorStop(0.5, 'rgba(182, 255, 92, 0.05)');
      coreGlow.addColorStop(1, 'rgba(8, 11, 18, 0)');
      ctx.fillStyle = coreGlow;
      ctx.fillRect(0, 0, w, h);

      // Perspective digital grid floor
      if (showGrid) {
        ctx.save();
        ctx.strokeStyle = 'rgba(38, 50, 68, 0.45)';
        ctx.lineWidth = 1;
        const gridY = 1.48;
        const gridSteps = 8;
        for (let i = -gridSteps; i <= gridSteps; i++) {
          const t = i / gridSteps;
          const pA = project(rotatePoint({ x: t * 2.2, y: gridY, z: -2.0 }, py * 0.3, px * 0.3, 0));
          const pB = project(rotatePoint({ x: t * 2.2, y: gridY, z: 2.0 }, py * 0.3, px * 0.3, 0));
          ctx.beginPath();
          ctx.moveTo(pA.x, pA.y);
          ctx.lineTo(pB.x, pB.y);
          ctx.stroke();

          const pC = project(rotatePoint({ x: -2.2, y: gridY, z: t * 2.0 }, py * 0.3, px * 0.3, 0));
          const pD = project(rotatePoint({ x: 2.2, y: gridY, z: t * 2.0 }, py * 0.3, px * 0.3, 0));
          ctx.beginPath();
          ctx.moveTo(pC.x, pC.y);
          ctx.lineTo(pD.x, pD.y);
          ctx.stroke();
        }
        ctx.restore();
      }

      // Update & project neural constellation particles
      const projectedParticles = particles.map((pt) => {
        if (!prefersReducedMotion) {
          pt.x += pt.vx * speedMultiplier;
          pt.y += pt.vy * speedMultiplier;
          pt.z += pt.vz * speedMultiplier;
          if (pt.x > 1.4 || pt.x < -1.4) pt.vx *= -1;
          if (pt.y > 1.2 || pt.y < -1.2) pt.vy *= -1;
          if (pt.z > 1.4 || pt.z < -1.4) pt.vz *= -1;
        }
        const rotated = rotatePoint(
          { x: pt.x * 1.45, y: pt.y * 1.25, z: pt.z * 1.45 },
          py * 0.5 + time * 0.08,
          px * 0.5 + time * 0.12,
          0
        );
        return { ...project(rotated), accent: pt.accent };
      });

      // Connect nearby particles
      for (let i = 0; i < projectedParticles.length; i++) {
        for (let j = i + 1; j < projectedParticles.length; j++) {
          const a = projectedParticles[i];
          const b = projectedParticles[j];
          const dist = Math.hypot(a.x - b.x, a.y - b.y);
          if (dist < (compact ? 64 : 88)) {
            const alpha = (1 - dist / (compact ? 64 : 88)) * 0.2;
            ctx.strokeStyle = a.accent || b.accent
              ? `rgba(182, 255, 92, ${alpha})`
              : `rgba(139, 92, 246, ${alpha})`;
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      // Draw particles
      projectedParticles.forEach((p) => {
        ctx.fillStyle = p.accent ? 'rgba(182, 255, 92, 0.8)' : 'rgba(148, 163, 184, 0.5)';
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.accent ? 2 : 1.4, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw 3 tilted orbital rings
      const rings = [
        { radius: 1.48, tiltX: 1.15, tiltY: 0.35, speed: 0.32, color: 'rgba(182, 255, 92, 0.48)', dash: false },
        { radius: 1.28, tiltX: -0.92, tiltY: 0.65, speed: -0.25, color: 'rgba(139, 92, 246, 0.52)', dash: true },
        { radius: 1.72, tiltX: 0.45, tiltY: -0.85, speed: 0.16, color: 'rgba(148, 163, 184, 0.25)', dash: false },
      ];

      rings.forEach((ring, idx) => {
        ctx.save();
        ctx.strokeStyle = ring.color;
        ctx.lineWidth = idx === 0 ? 1.4 : 1.05;
        if (ring.dash) ctx.setLineDash([4, 6]);
        ctx.beginPath();
        const segs = 72;
        let satellitePos: { x: number; y: number } | null = null;
        const satAngle = time * ring.speed * 1.8 + idx * 2.1;

        for (let s = 0; s <= segs; s++) {
          const theta = (s / segs) * Math.PI * 2;
          const raw: Point3D = {
            x: Math.cos(theta) * ring.radius,
            y: Math.sin(theta) * ring.radius,
            z: 0,
          };
          const rotated = rotatePoint(
            raw,
            ring.tiltX + py,
            ring.tiltY + px + time * ring.speed * 0.4,
            time * 0.1
          );
          const p = project(rotated);
          if (s === 0) ctx.moveTo(p.x, p.y);
          else ctx.lineTo(p.x, p.y);
        }
        ctx.stroke();

        // Orbiting node on ring
        const satRaw: Point3D = {
          x: Math.cos(satAngle) * ring.radius,
          y: Math.sin(satAngle) * ring.radius,
          z: 0,
        };
        const satRot = rotatePoint(
          satRaw,
          ring.tiltX + py,
          ring.tiltY + px + time * ring.speed * 0.4,
          time * 0.1
        );
        satellitePos = project(satRot);
        ctx.setLineDash([]);
        ctx.fillStyle = idx === 0 ? '#B6FF5C' : idx === 1 ? '#8B5CF6' : '#F8FAFC';
        ctx.beginPath();
        ctx.arc(satellitePos.x, satellitePos.y, idx === 0 ? 3.5 : 2.6, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      // Central 3D wireframe Icosahedron + inner octahedron core
      const rotX = 0.45 + time * 0.28 + py * 1.4;
      const rotY = 0.3 + time * 0.42 + px * 1.4;
      const rotZ = time * 0.15;

      const transformedVerts = RAW_VERTS.map((v) =>
        project(rotatePoint({ x: v.x * 0.88, y: v.y * 0.88, z: v.z * 0.88 }, rotX, rotY, rotZ))
      );

      ICO_EDGES.forEach(([a, b]) => {
        const va = transformedVerts[a];
        const vb = transformedVerts[b];
        const avgZ = (va.z + vb.z) * 0.5;
        const frontness = Math.max(0.18, Math.min(0.95, (1.2 - avgZ) * 0.45));
        ctx.strokeStyle =
          avgZ < 0
            ? `rgba(182, 255, 92, ${frontness * 0.72})`
            : `rgba(139, 92, 246, ${frontness * 0.55})`;
        ctx.lineWidth = avgZ < 0 ? 1.35 : 0.9;
        ctx.beginPath();
        ctx.moveTo(va.x, va.y);
        ctx.lineTo(vb.x, vb.y);
        ctx.stroke();
      });

      // Draw vertices as sharp geometric nodes
      transformedVerts.forEach((v) => {
        const front = v.z < 0;
        ctx.fillStyle = front ? '#B6FF5C' : 'rgba(148, 163, 184, 0.65)';
        ctx.beginPath();
        ctx.arc(v.x, v.y, front ? 2.6 : 1.7, 0, Math.PI * 2);
        ctx.fill();
      });

      // Inner luminous tensor core
      const innerPulse = 0.42 + Math.sin(time * 2.2) * 0.04;
      const innerVerts: Point3D[] = [
        { x: innerPulse, y: 0, z: 0 },
        { x: -innerPulse, y: 0, z: 0 },
        { x: 0, y: innerPulse, z: 0 },
        { x: 0, y: -innerPulse, z: 0 },
        { x: 0, y: 0, z: innerPulse },
        { x: 0, y: 0, z: -innerPulse },
      ].map((v) => project(rotatePoint(v, -rotX * 1.2, -rotY * 1.2, rotZ)));

      const octEdges: [number, number][] = [
        [0, 2], [0, 3], [0, 4], [0, 5],
        [1, 2], [1, 3], [1, 4], [1, 5],
        [2, 4], [4, 3], [3, 5], [5, 2],
      ];

      ctx.strokeStyle = 'rgba(248, 250, 252, 0.55)';
      ctx.lineWidth = 1;
      octEdges.forEach(([a, b]) => {
        ctx.beginPath();
        ctx.moveTo(innerVerts[a].x, innerVerts[a].y);
        ctx.lineTo(innerVerts[b].x, innerVerts[b].y);
        ctx.stroke();
      });

      if (!prefersReducedMotion) {
        time += 0.016 * speedMultiplier;
        animId = requestAnimationFrame(drawFrame);
      }
    };

    drawFrame();

    return () => {
      cancelAnimationFrame(animId);
      observer.disconnect();
    };
  }, [compact, speedMultiplier, tiltIntensity, showGrid]);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const ny = ((e.clientY - rect.top) / rect.height) * 2 - 1;
    pointerRef.current.targetX = nx;
    pointerRef.current.targetY = ny;
  };

  const handlePointerLeave = () => {
    setHovered(false);
    pointerRef.current.targetX = 0;
    pointerRef.current.targetY = 0;
  };

  return (
    <div
      ref={containerRef}
      onPointerMove={handlePointerMove}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={handlePointerLeave}
      className={`relative w-full overflow-hidden rounded-2xl border border-[#263244] bg-[#0B101A]/90 ${compact ? 'h-[230px]' : 'h-[400px] @5xl:h-[490px]'
        }`}
      aria-label="Interactive 3D neural geometry visualization"
    >
      {/* Subtle top-right & bottom-left architectural crosshair ticks */}
      <div className="pointer-events-none absolute inset-4 border border-[#263244]/40 rounded-xl" />
      <div className="pointer-events-none absolute top-3 left-4 flex items-center gap-2 font-mono text-[11px] text-[#94A3B8]">
        <span></span>
        <span aria-hidden="true">·</span>
        <span className="text-[#B6FF5C]"></span>
      </div>
      <div className="pointer-events-none absolute bottom-3 right-4 font-mono text-[11px] text-[#94A3B8]">
        {hovered ? 'Parallax Active' : 'Move cursor to orbit'}
      </div>

      <canvas ref={canvasRef} className="block h-full w-full cursor-crosshair" />
    </div>
  );
};
