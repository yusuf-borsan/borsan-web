"use client";

import { useEffect, useRef } from "react";
import { EUROPE_BG, TUR_PATH, ROU_PATH, POL_PATH, BGR_PATH, CZE_PATH } from "./europeMapPaths";

const BLUE = "#1F4488";
const BLUE_LIGHT = "#5580be";
const BLUE_GLOW = "#3564a8";

/*
 * Projection used in europeMapPaths.ts:
 *   x = (lon + 12) × (560/57) + 20
 *   y = (72 − lat) × (440/38) + 20
 *
 * Node positions calculated from real coordinates:
 *   Istanbul: 29.0°E, 41.0°N  → x=403, y=359
 *   Bucharest: 26.1°E, 44.4°N → x=374, y=320
 *   Warsaw: 21.0°E, 52.2°N    → x=324, y=229
 *   Sofia: 23.3°E, 42.7°N     → x=347, y=339
 *   Prague: 14.4°E, 50.1°N    → x=280, y=254
 */
const NODES = {
  TR: { x: 403, y: 359, label: "TR", sub: "İstanbul" },
  RO: { x: 374, y: 320, label: "RO", sub: "Romanya" },
  PL: { x: 324, y: 229, label: "PL", sub: "Polonya" },
  BG: { x: 347, y: 339, label: "BG", sub: "Bulgaristan" },
  CZ: { x: 280, y: 254, label: "CZ", sub: "Çekya" },
} as const;

type NodeKey = keyof typeof NODES;
const TARGETS: NodeKey[] = ["RO", "PL", "BG", "CZ"];

function arcPath(from: { x: number; y: number }, to: { x: number; y: number }): string {
  const mx = (from.x + to.x) / 2;
  const my = (from.y + to.y) / 2;
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const dist = Math.sqrt(dx * dx + dy * dy);
  const bulge = dist * 0.18;
  const cx = mx - (dy / dist) * bulge;
  const cy = my + (dx / dist) * bulge;
  return `M${from.x},${from.y} Q${cx.toFixed(1)},${cy.toFixed(1)} ${to.x},${to.y}`;
}

export function EuropeRouteMap() {
  const ref = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const svg = ref.current;
    if (!svg) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) {
      svg.classList.add("map-visible");
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          svg.classList.add("map-visible");
          observer.unobserve(svg);
        }
      },
      { threshold: 0.1 },
    );
    observer.observe(svg);
    return () => observer.disconnect();
  }, []);

  const tr = NODES.TR;

  return (
    <svg
      ref={ref}
      viewBox="120 60 480 400"
      className="europe-map h-auto w-full"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Background countries */}
      <path d={EUROPE_BG} fill="white" fillOpacity="0.06" stroke="white" strokeWidth="0.5" strokeOpacity="0.12" />

      {/* Target countries — highlighted */}
      <path d={ROU_PATH} fill={BLUE_LIGHT} fillOpacity="0.14" stroke={BLUE_LIGHT} strokeWidth="0.6" strokeOpacity="0.25" />
      <path d={POL_PATH} fill={BLUE_LIGHT} fillOpacity="0.14" stroke={BLUE_LIGHT} strokeWidth="0.6" strokeOpacity="0.25" />
      <path d={BGR_PATH} fill={BLUE_LIGHT} fillOpacity="0.14" stroke={BLUE_LIGHT} strokeWidth="0.6" strokeOpacity="0.25" />
      <path d={CZE_PATH} fill={BLUE_LIGHT} fillOpacity="0.14" stroke={BLUE_LIGHT} strokeWidth="0.6" strokeOpacity="0.25" />

      {/* Turkey — most prominent */}
      <path d={TUR_PATH} fill={BLUE} fillOpacity="0.25" stroke={BLUE_LIGHT} strokeWidth="0.7" strokeOpacity="0.35" />

      {/* Route arcs from Istanbul */}
      {TARGETS.map((key) => {
        const to = NODES[key];
        const d = arcPath(tr, to);
        return (
          <g key={key}>
            <path d={d} stroke={BLUE_LIGHT} strokeWidth="0.8" strokeOpacity="0.08" fill="none" />
            <path
              d={d}
              stroke={BLUE_LIGHT}
              strokeWidth="1.4"
              strokeOpacity="0.4"
              strokeDasharray="300"
              strokeDashoffset="300"
              fill="none"
              className="route-line"
            />
            <circle r="2.5" fill={BLUE_GLOW} opacity="0" className="route-dot">
              <animateMotion dur="4s" repeatCount="indefinite" begin="1.5s">
                <mpath href={`#route-${key}`} />
              </animateMotion>
            </circle>
            <path id={`route-${key}`} d={d} fill="none" stroke="none" />
          </g>
        );
      })}

      {/* Target nodes */}
      {TARGETS.map((key) => {
        const n = NODES[key];
        const labelLeft = key === "BG";
        return (
          <g key={key}>
            <circle cx={n.x} cy={n.y} r="10" fill="none" stroke={BLUE_LIGHT} strokeWidth="0.8" opacity="0" className="pulse-ring" />
            <circle cx={n.x} cy={n.y} r="5" fill={BLUE_GLOW} opacity="0.75" />
            <circle cx={n.x} cy={n.y} r="2.2" fill="white" fillOpacity="0.9" />
            <text
              x={labelLeft ? n.x - 10 : n.x + 10}
              y={n.y + 4}
              textAnchor={labelLeft ? "end" : "start"}
              fontSize="10"
              fontWeight="600"
              fill="white"
              fillOpacity="0.7"
            >
              {n.label}
            </text>
          </g>
        );
      })}

      {/* Turkey / Istanbul center node */}
      <circle cx={tr.x} cy={tr.y} r="14" fill={BLUE} fillOpacity="0.2" className="pulse-ring-tr" />
      <circle cx={tr.x} cy={tr.y} r="7" fill={BLUE} opacity="0.9" />
      <circle cx={tr.x} cy={tr.y} r="3.2" fill="white" fillOpacity="0.9" />
      <text x={tr.x + 14} y={tr.y + 4} fontSize="11" fontWeight="700" fill="white" fillOpacity="0.85">
        TR
      </text>
    </svg>
  );
}
