import { formatQueryDate, getProvenance } from "@/lib/provenance";

/** Site-wide provenance line: when the underlying data was queried. */
export function SiteFooter() {
  const p = getProvenance();
  return (
    <footer className="site-footer">
      <p>
        Data queried from{" "}
        {p.sourceUrl ? (
          <a href={p.sourceUrl} target="_blank" rel="noopener noreferrer">
            {p.source}
          </a>
        ) : (
          p.source
        )}{" "}
        on {formatQueryDate(p.queriedOn)}.
        {p.note ? ` ${p.note}` : ""}
      </p>
    </footer>
  );
}
