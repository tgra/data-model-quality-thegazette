import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ENTITY_KINDS,
  categoryTitle,
  getCategories,
  getCompleteness,
  getFrequency,
  getSummaryData,
  lodeUrl,
} from "@/lib/data";
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

  return (
    <>
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <Link href="/">Dashboard</Link> <span>/</span> Quality review <span>/</span>{" "}
        {categoryTitle(category)}
      </nav>

      <div className="page-head">
        <div>
          <h2>{categoryTitle(category)} ontology</h2>
          <p className="lead-muted">
            Relevance (how often each term appears in The Gazette data) and completeness
            (how well each term is annotated) for this ontology.
          </p>
        </div>
        <div className="page-actions">
          <Link href={`/documentation/${category}`} className="btn btn-primary">
            Documentation
          </Link>
          <a href={lodeUrl(category)} target="_blank" rel="noopener" className="btn">
            LODE ↗
          </a>
        </div>
      </div>

      {ENTITY_KINDS.map(({ slug, key, label }) => {
        const frequency = getFrequency(category, slug);
        const completeness = getCompleteness(category, slug);
        const entities = summary?.[key] ?? {};
        if (frequency.length === 0 && !completeness && Object.keys(entities).length === 0) {
          return null;
        }
        return (
          <section key={slug}>
            <h4>{label}</h4>
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
