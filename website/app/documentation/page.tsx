import Link from "next/link";
import { getAllStats } from "@/lib/data";

export const metadata = { title: "Documentation" };

export default function DocumentationIndex() {
  const stats = getAllStats();

  return (
    <>
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <Link href="/">Dashboard</Link> <span>/</span> Documentation
      </nav>
      <h2>Documentation</h2>
      <p className="lead-muted">
        Generated reference documentation for each of the {stats.length} ontologies of The
        Gazette data model.
      </p>
      <div className="card-grid">
        {stats.map((s) => (
          <div key={s.category} className="card">
            <h5 className="card-title">{s.title}</h5>
            <p>
              {s.classes} classes · {s.objectProperties + s.dataProperties} properties
            </p>
            <Link href={`/documentation/${s.category}`} className="btn btn-primary">
              Documentation
            </Link>
          </div>
        ))}
      </div>
    </>
  );
}
