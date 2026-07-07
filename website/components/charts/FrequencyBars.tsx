"use client";

import { useState } from "react";
import { scaleLinear } from "d3-scale";
import { max } from "d3-array";
import { localName } from "@/lib/nav";
import { useContainerWidth } from "./useContainerWidth";
import { Tooltip, type TooltipState } from "./Tooltip";

interface Row {
  URI: string;
  Frequency: number;
}

const BAR = 16;
const GAP = 10;
const LABEL_W = 190;
const VALUE_W = 60;
const TOP = 4;
const MAX_ROWS = 15;

/** Rounded right end only — the data end. Degenerates gracefully for tiny bars. */
function barPath(x: number, y: number, w: number, h: number): string {
  const r = Math.min(4, w);
  return `M${x},${y} h${w - r} a${r},${r} 0 0 1 ${r},${r} v${h - 2 * r} a${r},${r} 0 0 1 -${r},${r} h${-(w - r)} Z`;
}

export function FrequencyBars({ rows }: { rows: Row[] }) {
  const { ref, width } = useContainerWidth<HTMLDivElement>();
  const [tip, setTip] = useState<TooltipState | null>(null);
  const [hovered, setHovered] = useState<number | null>(null);

  if (rows.length === 0) {
    return <p className="viz-empty">No frequency data recorded.</p>;
  }

  const shown = rows.slice(0, MAX_ROWS);
  const hidden = rows.length - shown.length;
  const chartW = Math.max(width - LABEL_W - VALUE_W, 80);
  const height = TOP + shown.length * (BAR + GAP);
  const x = scaleLinear()
    .domain([0, max(shown, (d) => d.Frequency) ?? 1])
    .range([0, chartW]);

  return (
    <div ref={ref} className="viz-container" onMouseLeave={() => setTip(null)}>
      <svg width={width} height={height} role="img" aria-label="Frequency of each URI in The Gazette data">
        {shown.map((d, i) => {
          const y = TOP + i * (BAR + GAP);
          const w = Math.max(x(d.Frequency), 1);
          return (
            <g key={d.URI}>
              <text
                x={LABEL_W - 8}
                y={y + BAR / 2}
                dy="0.35em"
                textAnchor="end"
                className="viz-label"
              >
                {truncate(localName(d.URI), 26)}
              </text>
              <path
                d={barPath(LABEL_W, y, w, BAR)}
                fill="var(--brand)"
                opacity={hovered === null || hovered === i ? 1 : 0.45}
              />
              <text x={LABEL_W + w + 6} y={y + BAR / 2} dy="0.35em" className="viz-value">
                {d.Frequency.toLocaleString()}
              </text>
              {/* full-row hit target */}
              <rect
                x={0}
                y={y - GAP / 2}
                width={width}
                height={BAR + GAP}
                fill="transparent"
                onMouseEnter={() => setHovered(i)}
                onMouseMove={(e) => {
                  const box = e.currentTarget.ownerSVGElement!.getBoundingClientRect();
                  setTip({
                    x: e.clientX - box.left,
                    y: e.clientY - box.top,
                    lines: [localName(d.URI), d.URI, `Frequency: ${d.Frequency.toLocaleString()}`],
                  });
                }}
                onMouseLeave={() => {
                  setHovered(null);
                  setTip(null);
                }}
              />
            </g>
          );
        })}
      </svg>
      {hidden > 0 && (
        <p className="viz-note">
          Showing the top {MAX_ROWS} of {rows.length} URIs — the full list is in the table below.
        </p>
      )}
      <Tooltip tip={tip} width={width} />
    </div>
  );
}

function truncate(s: string, n: number): string {
  return s.length > n ? s.slice(0, n - 1) + "…" : s;
}
