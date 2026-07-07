import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ENTITY_KINDS,
  categoryTitle,
  getCategories,
  getCompleteness,
  getFrequency,
  getSummaryData,
  getUsedUris,
} from "@/lib/data";
import { BAND_LABEL, band, getDimensionScores } from "@/lib/quality";
import { FrequencyBars } from "@/components/charts/FrequencyBars";
import { CompletenessMeters } from "@/components/charts/CompletenessMeters";
import { EntityTable } from "@/components/EntityTable";

export function generateStaticParams() {
  return getCategories().map((category) => ({ category }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  return { title: `${categoryTitle(category)} — Quality review` };
}

export default async function QualityReview({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const categories = getCategories();
  if (!categories.includes(category)) notFound();

  const index = categories.indexOf(category);
  const prev = categories[index - 1];
  const next = categories[index + 1];
  const summary = getSummaryData(category);
  const scores = summary ? getDimensionScores(summary, getUsedUris(category)) : [];

  return (
    <>
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <Link href="/">Dashboard</Link> <span>/</span>{" "}
        <Link href="/quality-review">Quality review</Link> <span>/</span>{" "}
        {categoryTitle(category)}
      </nav>

      <div className="page-head">
        <div>
          <h2>{categoryTitle(category)} ontology</h2>
          <p className="lead-muted">
            Quality of this ontology measured against DAMA data-quality dimensions, with the
            underlying relevance and completeness detail per entity kind below.
          </p>
        </div>
        <div className="page-actions">
          <Link href={`/documentation/${category}`} className="btn btn-primary">
            Documentation
          </Link>
        </div>
      </div>

      {scores.length > 0 && (
        <section aria-label="Quality scorecard">
          <div className="scorecard">
            {scores.map((s) => (
              <div key={s.dimension} className="score-tile">
                <div className="score-head">
                  <span className="score-dimension">{s.dimension}</span>
                  {s.score != null && (
                    <span className={`score-badge ${band(s.score)}`}>
                      {BAND_LABEL[band(s.score)]}
                    </span>
                  )}
                </div>
                {s.score != null ? (
                  <>
                    <div className="score-value">{s.score}%</div>
                    <div
                      className="score-meter"
                      role="meter"
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-valuenow={s.score}
                      aria-label={`${s.dimension} score`}
                    >
                      <div className="score-meter-fill" style={{ width: `${s.score}%` }} />
                    </div>
                  </>
                ) : (
                  <div className="score-value score-na">n/a</div>
                )}
                <p className="score-note">
                  {s.method}
                  {s.detail ? ` — ${s.detail}` : ""}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {ENTITY_KINDS.map(({ slug, key, label }) => {
        const frequency = getFrequency(category, slug);
        const completeness = getCompleteness(category, slug);
        const entities = summary?.[key] ?? {};
        const count = Object.keys(entities).length;
        if (frequency.length === 0 && !completeness && count === 0) {
          return null;
        }
        return (
          <section key={slug}>
            <div className="section-head">
              <h4>{label}</h4>
              <span className="section-count">
                {count} {count === 1 ? "term" : "terms"}
              </span>
            </div>
            <div className="panel-grid">
              <div className="card">
                <h5 className="card-title">Relevance</h5>
                <p>Frequency of each URI in The Gazette data</p>
                <FrequencyBars rows={frequency} />
              </div>
              <div className="card">
                <h5 className="card-title">Completeness</h5>
                <p>Entities with each annotation field present</p>
                {completeness ? (
                  <CompletenessMeters data={completeness} />
                ) : (
                  <p className="viz-empty">No completeness data recorded.</p>
                )}
              </div>
            </div>
            <EntityTable entities={entities} showDomainRange={key !== "classes"} />
          </section>
        );
      })}

      <nav className="pager">
        {prev ? (
          <Link href={`/quality-review/${prev}`}>← {categoryTitle(prev)}</Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link href={`/quality-review/${next}`}>{categoryTitle(next)} →</Link>
        ) : (
          <span />
        )}
      </nav>
    </>
  );
}
