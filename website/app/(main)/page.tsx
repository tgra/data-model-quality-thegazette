import Link from "next/link";
import { getAllStats } from "@/lib/data";
import { OntologyOverview } from "@/components/charts/OntologyOverview";

export default function Dashboard() {
  const stats = getAllStats();
  const totals = stats.reduce(
    (acc, s) => ({
      classes: acc.classes + s.classes,
      objectProperties: acc.objectProperties + s.objectProperties,
      dataProperties: acc.dataProperties + s.dataProperties,
      labelled: acc.labelled + s.labelled,
      entities: acc.entities + s.entities,
    }),
    { classes: 0, objectProperties: 0, dataProperties: 0, labelled: 0, entities: 0 },
  );
  const labelledPct =
    totals.entities === 0 ? 0 : Math.round((totals.labelled / totals.entities) * 100);

  return (
    <>
      <h2>Dashboard</h2>
      <p className="lead-muted">
        Quality review and documentation for the {stats.length} ontologies of The Gazette
        data model. Pick an ontology from the chart or the sidebar to see its relevance
        and completeness analysis.
      </p>

      <div className="stat-tiles">
        <div className="stat-tile">
          <div className="stat-value">{stats.length}</div>
          <div className="stat-label">Ontologies</div>
        </div>
        <div className="stat-tile">
          <div className="stat-value">{totals.classes.toLocaleString()}</div>
          <div className="stat-label">Classes</div>
        </div>
        <div className="stat-tile">
          <div className="stat-value">
            {(totals.objectProperties + totals.dataProperties).toLocaleString()}
          </div>
          <div className="stat-label">Properties</div>
        </div>
        <div className="stat-tile">
          <div className="stat-value">{labelledPct}%</div>
          <div className="stat-label">Entities with a label</div>
        </div>
      </div>

      <section className="card viz-card">
        <h3 className="viz-title">Size of each ontology</h3>
        <p className="viz-subtitle">
          Classes, object properties and data properties per ontology. Click a bar to open
          its quality review.
        </p>
        <OntologyOverview rows={stats} />
      </section>

      <h3>All ontologies</h3>
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
            <Link href={`/documentation/${s.category}`} className="btn">
              Documentation
            </Link>
          </div>
        ))}
      </div>
    </>
  );
}
