import { SiteNav } from "@/components/SiteNav";
import { getCategories } from "@/lib/data";

/** Layout for the app pages that carry the sidebar navigation. */
export default function MainLayout({ children }: { children: React.ReactNode }) {
  const categories = getCategories();

  return (
    <div className="layout">
      <aside className="sidebar">
        <SiteNav categories={categories} />
      </aside>
      <main className="content">{children}</main>
    </div>
  );
}
