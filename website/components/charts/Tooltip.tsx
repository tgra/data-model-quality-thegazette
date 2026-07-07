"use client";

export interface TooltipState {
  x: number;
  y: number;
  lines: string[];
}

export function Tooltip({ tip, width }: { tip: TooltipState | null; width: number }) {
  if (!tip) return null;
  const flip = tip.x > width * 0.6;
  return (
    <div
      className="viz-tooltip"
      style={{
        left: flip ? undefined : tip.x + 12,
        right: flip ? width - tip.x + 12 : undefined,
        top: tip.y + 12,
      }}
    >
      {tip.lines.map((line, i) => (
        <div key={i} className={i === 0 ? "viz-tooltip-title" : undefined}>
          {line}
        </div>
      ))}
    </div>
  );
}
