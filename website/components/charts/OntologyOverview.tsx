"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { scaleLinear } from "d3-scale";
import { max } from "d3-array";
import { useContainerWidth } from "./useContainerWidth";
import { Tooltip, type TooltipState } from "./Tooltip";

export interface OverviewRow {
  category: string;
  title: string;
  classes: number;
  objectProperties: number;
  dataProperties: number;
}

const SERIES = [
  { key: "classes", label: "Classes", color: "#8e2433" },
  { key: "objectProperties", label: "Object properties", color: "#2a78d6" },
  { key: "dataProperties", label: "Data properties", color: "#c98500" },
] as const;

const BAR = 14;
const GAP = 10;
const LABEL_W = 170;
const VALUE_W = 44;
const SEGMENT_GAP = 2;

export function OntologyOverview({ rows }: { rows: OverviewRow[] }) {
  const router = useRouter();
  const { ref, width } = useContainerWidth<HTMLDivElement>();
  const [tip, setTip] = useState<TooltipState | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);

  const sorted = [...rows].sort(
    (a, b) =>
      b.classes + b.objectProperties + b.dataProperties -
      (a.classes + a.objectProperties + a.dataProperties),
  );
  const total = (r: OverviewRow) => r.classes + r.objectProperties + r.dataProperties;
  const chartW = Math.max(width - LABEL_W - VALUE_W, 120);
  const height = sorted.length * (BAR + GAP);
  const x = scaleLinear()
    .domain([0, max(sorted, total) ?? 1])
    .range([0, chartW]);

  return (
    <div ref={ref} className="viz-container" onMouseLeave={() => setTip(null)}>
      <div className="viz-legend">
        {SERIES.map((s) => (
          <span key={s.key} className="viz-legend-item">
            <span className="viz-swatch" style={{ background: s.color }} />
            {s.label}
          </span>
        ))}
      </div>
      <svg
        width={width}
        height={height}
        role="img"
        aria-label="Number of classes and properties in each ontology"
      >
        {sorted.map((r, i) => {
          const y = i * (BAR + GAP);
          let cursor = LABEL_W;
          const dim = hovered !== null && hovered !== r.category;
          return (
            <g
              key={r.category}
              style={{ cursor: "pointer" }}
              opacity={dim ? 0.45 : 1}
              onClick={() => router.push(`/quality-review/${r.category}`)}
              onMouseEnter={() => setHovered(r.category)}
              onMouseMove={(e) => {
                const box = e.currentTarget.ownerSVGElement!.getBoundingClientRect();
                setTip({
                  x: e.clientX - box.left,
                  y: e.clientY - box.top,
                  lines: [
                    r.title,
                    `Classes: ${r.classes}`,
                    `Object properties: ${r.objectProperties}`,
                    `Data properties: ${r.dataProperties}`,
                    "Click to open the quality review",
                  ],
                });
              }}
              onMouseLeave={() => {
                setHovered(null);
                setTip(null);
              }}
            >
              <rect x={0} y={y - GAP / 2} width={width} height={BAR + GAP} fill="transparent" />
              <text x={LABEL_W - 8} y={y + BAR / 2} dy="0.35em" textAnchor="end" className="viz-label">
                {r.title}
              </text>
              {SERIES.map((s) => {
                const w = x(r[s.key]);
                if (w <= 0) return null;
                const seg = (
                  <rect
                    key={s.key}
                    x={cursor}
                    y={y}
                    width={Math.max(w - SEGMENT_GAP, 1)}
                    height={BAR}
                    rx={2}
                    fill={s.color}
                  />
                );
                cursor += w;
                return seg;
              })}
              <text x={cursor + 6} y={y + BAR / 2} dy="0.35em" className="viz-value">
                {total(r)}
              </text>
            </g>
          );
        })}
      </svg>
      <Tooltip tip={tip} width={width} />
    </div>
  );
}
