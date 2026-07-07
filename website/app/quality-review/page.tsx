import Link from "next/link";
import { getAllStats } from "@/lib/data";

export const metadata = { title: "Quality review" };

export default function QualityReviewIndex() {
  const stats = getAllStats();

  return (
    <>
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <Link href="/">Dashboard</Link> <span>/</span> Quality review
      </nav>
      <h2>Quality review</h2>
      <p className="lead-muted">
        DAMA-dimension quality scores, relevance and completeness analysis for each of the{" "}
        {stats.length} ontologies of The Gazette data model.
      </p>
      <div className="card-grid">
        {stats.map((s) => (
          <div key={s.category} className="card">
            <h5 className="card-title">{s.title}</h5>
            <p>
              {s.classes} classes · {s.objectProperties + s.dataProperties} properties
            </p>
            <Link href={`/quality-review/${s.category}`} className="btn btn-primary">
              Quality review
            </Link>
          </div>
        ))}
      </div>
    </>
  );
}
