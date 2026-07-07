"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { categoryTitle } from "@/lib/nav";

export function SiteNav({ categories }: { categories: string[] }) {
  // trailingSlash is on for static export — normalise before matching
  const pathname = (usePathname() ?? "/").replace(/\/+$/, "") || "/";
  const active = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  // Highlight the current category regardless of section
  const currentCategory = pathname.match(/^\/(?:quality-review|documentation)\/([^/]+)/)?.[1];

  return (
    <nav>
      <ul className="nav-card">
        <li>
          <Link href="/" className={active("/") ? "active" : ""}>
            Dashboard
          </Link>
        </li>
        <li>
          <Link
            href="/quality-review"
            className={pathname === "/quality-review" ? "active" : ""}
          >
            Quality review
          </Link>
        </li>
        <li>
          <Link
            href="/documentation"
            className={pathname === "/documentation" ? "active" : ""}
          >
            Documentation
          </Link>
        </li>
      </ul>
      <div className="nav-section-label">Ontologies</div>
      <ul className="nav-card nav-categories">
        {categories.map((c) => (
          <li key={c}>
            <Link
              href={`/quality-review/${c}`}
              className={currentCategory === c ? "active" : ""}
            >
              {categoryTitle(c)}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
