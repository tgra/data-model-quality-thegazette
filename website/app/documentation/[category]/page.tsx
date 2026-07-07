import Link from "next/link";
import { notFound } from "next/navigation";
import { categoryTitle, docUrl, getCategories } from "@/lib/data";

export function generateStaticParams() {
  return getCategories().map((category) => ({ category }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  return { title: `${categoryTitle(category)} — Documentation` };
}

export default async function Documentation({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  if (!getCategories().includes(category)) notFound();

  return (
    <>
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <Link href="/">Dashboard</Link> <span>/</span>{" "}
        <Link href="/documentation">Documentation</Link> <span>/</span>{" "}
        {categoryTitle(category)}
      </nav>
      <div className="page-head">
        <h2>{categoryTitle(category)} — documentation</h2>
        <div className="page-actions">
          <Link href={`/quality-review/${category}`} className="btn btn-primary">
            Quality review
          </Link>
          <a href={docUrl(category)} target="_blank" rel="noopener" className="btn">
            Open in new tab ↗
          </a>
        </div>
      </div>
      <iframe
        className="doc-frame"
        src={docUrl(category)}
        title={`${categoryTitle(category)} ontology documentation`}
      />
    </>
  );
}
