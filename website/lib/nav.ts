// Pure helpers safe to import from client components (no node:fs).

export function categoryTitle(category: string): string {
  const spaced = category.replace(/-/g, " ");
  return spaced.charAt(0).toUpperCase() + spaced.slice(1);
}

export function localName(uri: string): string {
  const hash = uri.split("#");
  if (hash.length > 1) return hash[hash.length - 1];
  const parts = uri.split("/");
  return parts[parts.length - 1];
}
