"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";

const BLUE = "#1F4488";
const BLUE_LIGHT = "#5580be";
const BLUE_GLOW = "#3564a8";

/*
 * Node positions — calculated from actual SVG path bounding boxes
 * in the europe-map.svg coordinate space (viewBox 0 0 1000 684).
 *
 * Istanbul is at the NW corner of Turkey's bbox (~730, 540).
 */
const NODES = {
  TR: { x: 745, y: 548, label: "TR" },
  RO: { x: 711, y: 475, label: "RO" },
  PL: { x: 629, y: 385, label: "PL" },
  BG: { x: 721, y: 525, label: "BG" },
  CZ: { x: 588, y: 417, label: "CZ" },
} as const;

type NodeKey = keyof typeof NODES;
const TARGETS: NodeKey[] = ["RO", "PL", "BG", "CZ"];

function arcPath(from: { x: number; y: number }, to: { x: number; y: number }, idx: number): string {
  const mx = (from.x + to.x) / 2;
  const my = (from.y + to.y) / 2;
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const dist = Math.sqrt(dx * dx + dy * dy);
  const dir = idx % 2 === 0 ? 1 : -1;
  const bulge = dist * 0.14 * dir;
  const cx = mx - (dy / dist) * bulge;
  const cy = my + (dx / dist) * bulge;
  return `M${from.x},${from.y} Q${cx.toFixed(1)},${cy.toFixed(1)} ${to.x},${to.y}`;
}

export function EuropePartnershipMap() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) {
      el.classList.add("map-visible");
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("map-visible");
          observer.unobserve(el);
        }
      },
      { threshold: 0.1 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const tr = NODES.TR;

  return (
    <div ref={ref} className="europe-map relative">
      {/* Base map SVG — real geography, transparent bg */}
      <Image
        src="/images/europe-map.svg"
        alt=""
        width={1000}
        height={684}
        className="h-auto w-full opacity-[0.22]"
        style={{ filter: "brightness(2.2) contrast(0.7)" }}
        aria-hidden
      />

      {/* Overlay SVG — same coordinate space as the map */}
      <svg
        viewBox="0 0 1000 684"
        className="absolute inset-0 h-full w-full"
        fill="none"
      >
        {/* Country highlights — rectangles approximating country areas for subtle glow */}
        <circle cx={NODES.RO.x} cy={NODES.RO.y} r="38" fill={BLUE_GLOW} opacity="0.08" />
        <circle cx={NODES.PL.x} cy={NODES.PL.y} r="42" fill={BLUE_GLOW} opacity="0.08" />
        <circle cx={NODES.BG.x} cy={NODES.BG.y} r="30" fill={BLUE_GLOW} opacity="0.08" />
        <circle cx={NODES.CZ.x} cy={NODES.CZ.y} r="28" fill={BLUE_GLOW} opacity="0.08" />
        <circle cx={tr.x} cy={tr.y} r="50" fill={BLUE} opacity="0.1" />

        {/* Routes from Istanbul */}
        {TARGETS.map((key, idx) => {
          const to = NODES[key];
          const d = arcPath(tr, to, idx);
          return (
            <g key={key}>
              <path d={d} stroke={BLUE_LIGHT} strokeWidth="1" strokeOpacity="0.08" />
              <path
                d={d}
                stroke={BLUE_LIGHT}
                strokeWidth="1.5"
                strokeOpacity="0.35"
                strokeDasharray="400"
                strokeDashoffset="400"
                className="route-line"
              />
              <circle r="3" fill={BLUE_GLOW} opacity="0" className="route-dot">
                <animateMotion
                  dur={`${3.8 + idx * 0.5}s`}
                  repeatCount="indefinite"
                  begin={`${1.2 + idx * 0.3}s`}
                >
                  <mpath href={`#rp2-${key}`} />
                </animateMotion>
              </circle>
              <path id={`rp2-${key}`} d={d} stroke="none" />
            </g>
          );
        })}

        {/* Target nodes */}
        {TARGETS.map((key) => {
          const n = NODES[key];
          const labelLeft = key === "BG";
          return (
            <g key={key}>
              <circle cx={n.x} cy={n.y} r="12" fill="none" stroke={BLUE_LIGHT} strokeWidth="1" opacity="0" className="pulse-ring" />
              <circle cx={n.x} cy={n.y} r="6" fill={BLUE_GLOW} opacity="0.75" />
              <circle cx={n.x} cy={n.y} r="2.8" fill="white" fillOpacity="0.9" />
              <text
                x={labelLeft ? n.x - 14 : n.x + 14}
                y={n.y + 5}
                textAnchor={labelLeft ? "end" : "start"}
                fontSize="14"
                fontWeight="600"
                fill="white"
                fillOpacity="0.65"
              >
                {n.label}
              </text>
            </g>
          );
        })}

        {/* TR / Istanbul node — prominent */}
        <circle cx={tr.x} cy={tr.y} r="18" fill={BLUE} fillOpacity="0.2" className="pulse-ring-tr" />
        <circle cx={tr.x} cy={tr.y} r="9" fill={BLUE} opacity="0.9" />
        <circle cx={tr.x} cy={tr.y} r="4" fill="white" fillOpacity="0.9" />
        <text x={tr.x + 16} y={tr.y + 5} fontSize="15" fontWeight="700" fill="white" fillOpacity="0.85">
          TR
        </text>
      </svg>
    </div>
  );
}
