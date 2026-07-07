import type { Completeness } from "@/lib/data";

/**
 * One completion meter per annotation field (label, comment, domain, range):
 * how many entities have the field vs. how many are missing it.
 */
export function CompletenessMeters({ data }: { data: Completeness }) {
  return (
    <div className="meters">
      {Object.entries(data).map(([field, { present, absent }]) => {
        const totalCount = present + absent;
        const pct = totalCount === 0 ? 0 : Math.round((present / totalCount) * 100);
        return (
          <div key={field} className="meter">
            <div className="meter-head">
              <span className="meter-field">{field}</span>
              <span className="meter-count">
                {present}/{totalCount} · {pct}%
              </span>
            </div>
            <div
              className="meter-track"
              role="meter"
              aria-valuemin={0}
              aria-valuemax={totalCount}
              aria-valuenow={present}
              aria-label={`Entities with a ${field}`}
            >
              <div className="meter-fill" style={{ width: `${pct}%` }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
