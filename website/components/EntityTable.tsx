import type { OntologyEntity } from "@/lib/data";
import { localName } from "@/lib/nav";

/**
 * Detail table for one entity kind. Doubles as the accessible "table view"
 * behind the charts; missing labels/comments are highlighted.
 */
export function EntityTable({
  entities,
  showDomainRange,
}: {
  entities: Record<string, OntologyEntity>;
  showDomainRange: boolean;
}) {
  const rows = Object.entries(entities);
  if (rows.length === 0) return null;
  const missing = rows.filter(([, e]) => e.label == null || e.comment == null).length;

  return (
    <details className="entity-details">
      <summary>
        Detail table — {rows.length} entities
        {missing > 0 && ` (${missing} missing a label or comment)`}
      </summary>
      <div className="table-scroll">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Label</th>
              <th>Comment</th>
              {showDomainRange && (
                <>
                  <th>Domain</th>
                  <th>Range</th>
                </>
              )}
            </tr>
          </thead>
          <tbody>
            {rows.map(([uri, e]) => (
              <tr key={uri} className={e.label == null || e.comment == null ? "missing" : ""}>
                <td title={uri}>{localName(uri)}</td>
                <td>{e.label ?? "—"}</td>
                <td>{e.comment ?? "—"}</td>
                {showDomainRange && (
                  <>
                    <td>{e.domain ? localName(String(e.domain)) : "—"}</td>
                    <td>{e.range ? localName(String(e.range)) : "—"}</td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </details>
  );
}
