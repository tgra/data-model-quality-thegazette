import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import { SiteNav } from "@/components/SiteNav";
import { getCategories } from "@/lib/data";

export const metadata: Metadata = {
  title: {
    default: "The Gazette Data Model",
    template: "%s — The Gazette Data Model",
  },
  description:
    "Quality review and documentation for the ontologies of The Gazette data model.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const categories = getCategories();

  return (
    <html lang="en">
      <body>
        <header className="site-header">
          <h1>
            <Link href="/">The Gazette Data Model</Link>
          </h1>
        </header>
        <div className="layout">
          <aside className="sidebar">
            <SiteNav categories={categories} />
          </aside>
          <main className="content">{children}</main>
        </div>
      </body>
    </html>
  );
}
