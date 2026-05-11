"use client";

import { useEffect, useRef, useState } from "react";
import createGlobe, { type Arc, type Marker } from "cobe";

const LAGOS: [number, number] = [6.5244, 3.3792];

const DESTINATIONS: Array<{ name: string; coords: [number, number] }> = [
  { name: "London",       coords: [51.5074, -0.1278] },
  { name: "Paris",        coords: [48.8566,  2.3522] },
  { name: "Amsterdam",    coords: [52.3676,  4.9041] },
  { name: "New York",     coords: [40.7128, -74.0060] },
  { name: "São Paulo",    coords: [-23.5505, -46.6333] },
  { name: "Mumbai",       coords: [19.0760,  72.8777] },
  { name: "Beijing",      coords: [39.9042, 116.4074] },
  { name: "Dubai",        coords: [25.2048,  55.2708] },
  { name: "Johannesburg", coords: [-26.2041, 28.0473] },
  { name: "Sydney",       coords: [-33.8688, 151.2093] },
];

const ACCENT: [number, number, number] = [0.23, 0.51, 0.96]; // Tailwind accent #3B82F6

export function Globe() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const pointerInteracting = useRef<number | null>(null);
  const pointerMovement = useRef(0);
  const phiRef = useRef(2.4); // Africa-forward starting rotation
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrapper = wrapperRef.current;
    if (!canvas || !wrapper) return;

    const measure = () => wrapper.offsetWidth;
    let size = measure();

    const markers: Marker[] = [
      { location: LAGOS, size: 0.14 },
      ...DESTINATIONS.map<Marker>((d) => ({ location: d.coords, size: 0.06 })),
    ];

    const arcs: Arc[] = DESTINATIONS.map<Arc>((d) => ({
      from: LAGOS,
      to: d.coords,
      color: ACCENT,
    }));

    const globe = createGlobe(canvas, {
      devicePixelRatio: Math.min(window.devicePixelRatio || 1, 2),
      width: size * 2,
      height: size * 2,
      phi: phiRef.current,
      theta: 0.25,
      dark: 1,
      diffuse: 1.25,
      mapSamples: 16000,
      mapBrightness: 6,
      baseColor: [0.18, 0.28, 0.42],
      markerColor: ACCENT,
      glowColor: [0.18, 0.36, 0.58],
      markers,
      arcs,
      arcColor: ACCENT,
      arcWidth: 1.6,
      arcHeight: 0.45,
    });

    let raf = 0;
    const tick = () => {
      if (pointerInteracting.current === null) {
        phiRef.current += 0.0025;
      }
      globe.update({
        phi: phiRef.current + pointerMovement.current,
        width: size * 2,
        height: size * 2,
      });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const onResize = () => {
      size = measure();
    };
    window.addEventListener("resize", onResize);

    const t = window.setTimeout(() => setVisible(true), 120);

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(t);
      globe.destroy();
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <div
      ref={wrapperRef}
      className="relative mx-auto aspect-square w-full max-w-[560px]"
    >
      <canvas
        ref={canvasRef}
        onPointerDown={(e) => {
          pointerInteracting.current = e.clientX - pointerMovement.current;
          e.currentTarget.style.cursor = "grabbing";
        }}
        onPointerUp={(e) => {
          pointerInteracting.current = null;
          e.currentTarget.style.cursor = "grab";
        }}
        onPointerOut={() => {
          pointerInteracting.current = null;
        }}
        onMouseMove={(e) => {
          if (pointerInteracting.current !== null) {
            const delta = e.clientX - pointerInteracting.current;
            pointerMovement.current = delta / 200;
          }
        }}
        onTouchMove={(e) => {
          if (pointerInteracting.current !== null && e.touches[0]) {
            const delta = e.touches[0].clientX - pointerInteracting.current;
            pointerMovement.current = delta / 100;
          }
        }}
        onContextMenu={(e) => e.preventDefault()}
        style={{
          aspectRatio: 1,
          opacity: visible ? 1 : 0,
          transition: "opacity 700ms ease",
        }}
        className="h-full w-full cursor-grab [contain:layout_paint_size]"
      />

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 rounded-full bg-accent/25 blur-3xl"
      />
    </div>
  );
}
