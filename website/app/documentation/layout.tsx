/**
 * Documentation renders full-width with no sidebar — the embedded pyLODE doc
 * carries its own table-of-contents nav, so the app nav column is omitted to
 * avoid a doubled navigation.
 */
export default function DocumentationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <main className="content-full">{children}</main>;
}
