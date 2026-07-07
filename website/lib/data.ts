import fs from "node:fs";
import path from "node:path";
import { categoryTitle } from "./nav";

export { categoryTitle, localName } from "./nav";

const DATA_DIR = path.join(process.cwd(), "public", "data");

export type EntitySlug = "class" | "object_property" | "data_property";

export const ENTITY_KINDS: { slug: EntitySlug; key: SummaryKey; label: string }[] = [
  { slug: "class", key: "classes", label: "Classes" },
  { slug: "object_property", key: "object_properties", label: "Object properties" },
  { slug: "data_property", key: "data_properties", label: "Data properties" },
];

export interface OntologyEntity {
  label: string | null;
  comment: string | null;
  domain?: string | null;
  range?: string | null;
}

export type SummaryKey = "classes" | "object_properties" | "data_properties";

export type SummaryData = Partial<Record<SummaryKey, Record<string, OntologyEntity>>>;

export interface FrequencyRow {
  URI: string;
  Frequency: number;
}

export interface FieldCompleteness {
  present: number;
  absent: number;
}

export type Completeness = Record<string, FieldCompleteness>;

export function getCategories(): string[] {
  return fs
    .readdirSync(DATA_DIR, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();
}

function readJson<T>(...segments: string[]): T | null {
  const file = path.join(DATA_DIR, ...segments);
  if (!fs.existsSync(file)) return null;
  return JSON.parse(fs.readFileSync(file, "utf8")) as T;
}

export function getSummaryData(category: string): SummaryData | null {
  return readJson<SummaryData>(category, "summary_data.json");
}

export function getFrequency(category: string, slug: EntitySlug): FrequencyRow[] {
  const data = readJson<Record<string, FrequencyRow>>(
    category,
    `relevance_${slug}_frequency.json`,
  );
  if (!data) return [];
  return Object.values(data).sort((a, b) => b.Frequency - a.Frequency);
}

export function getCompleteness(category: string, slug: EntitySlug): Completeness | null {
  const data = readJson<Completeness>(category, `completeness_${slug}.json`);
  if (!data) return null;
  // Drop fields that don't apply (e.g. domain/range on classes are 0/0)
  const filtered = Object.fromEntries(
    Object.entries(data).filter(([, v]) => v.present + v.absent > 0),
  );
  return Object.keys(filtered).length > 0 ? filtered : null;
}

export interface CategoryStats {
  category: string;
  title: string;
  classes: number;
  objectProperties: number;
  dataProperties: number;
  labelled: number;
  entities: number;
}

export function getCategoryStats(category: string): CategoryStats {
  const summary = getSummaryData(category);
  const count = (key: SummaryKey) => Object.keys(summary?.[key] ?? {}).length;
  const all = Object.values(summary ?? {}).flatMap((entities) => Object.values(entities));
  return {
    category,
    title: categoryTitle(category),
    classes: count("classes"),
    objectProperties: count("object_properties"),
    dataProperties: count("data_properties"),
    labelled: all.filter((e) => e.label != null).length,
    entities: all.length,
  };
}

export function getAllStats(): CategoryStats[] {
  return getCategories().map(getCategoryStats);
}

/** Static pyLODE documentation generated at build time into public/docs. */
export function docUrl(category: string): string {
  return `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/docs/${category}.html`;
}

/** URIs observed at least once in The Gazette data, across all entity kinds. */
export function getUsedUris(category: string): Set<string> {
  const used = new Set<string>();
  for (const { slug } of ENTITY_KINDS) {
    for (const row of getFrequency(category, slug)) {
      if (row.Frequency > 0) used.add(row.URI);
    }
  }
  return used;
}
