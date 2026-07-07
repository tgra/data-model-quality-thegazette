import Link from "next/link";
import { notFound } from "next/navigation";
import { categoryTitle, getCategories, getDocHtml } from "@/lib/data";

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
  const html = getDocHtml(category);

  return (
    <div className="doc-page">
      <div className="doc-bar">
        <Link href="/documentation" className="doc-back">
          ← All documentation
        </Link>
        <span className="doc-bar-title">{categoryTitle(category)}</span>
        <Link href={`/quality-review/${category}`} className="btn btn-primary">
          Quality review
        </Link>
      </div>
      {html ? (
        <iframe
          className="doc-frame"
          srcDoc={html}
          title={`${categoryTitle(category)} ontology documentation`}
        />
      ) : (
        <p className="viz-empty" style={{ padding: "1.5rem" }}>
          No documentation is available for this ontology.
        </p>
      )}
    </div>
  );
}
