import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
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
          <Link href="/">
            <Image
              src={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/logo.png`}
              alt="The Gazette logo"
              width={43}
              height={52}
              priority
            />
          </Link>
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
