import { localName } from "./nav";
import type { OntologyEntity, SummaryData } from "./data";

export interface DimensionScore {
  dimension: string;
  /** 0–100, or null when the dimension does not apply (e.g. no properties). */
  score: number | null;
  /** How the score was measured — shown under the tile. */
  method: string;
  /** e.g. "142/150" */
  detail: string | null;
}

export type Band = "good" | "fair" | "poor";

export function band(score: number): Band {
  if (score >= 90) return "good";
  if (score >= 60) return "fair";
  return "poor";
}

export const BAND_LABEL: Record<Band, string> = {
  good: "Good",
  fair: "Fair",
  poor: "Poor",
};

interface Entry {
  uri: string;
  entity: OntologyEntity;
  kind: "class" | "property";
}

function allEntries(summary: SummaryData): Entry[] {
  const entries: Entry[] = [];
  for (const [uri, entity] of Object.entries(summary.classes ?? {})) {
    entries.push({ uri, entity, kind: "class" });
  }
  for (const key of ["object_properties", "data_properties"] as const) {
    for (const [uri, entity] of Object.entries(summary[key] ?? {})) {
      entries.push({ uri, entity, kind: "property" });
    }
  }
  return entries;
}

function pct(numerator: number, denominator: number): number {
  return denominator === 0 ? 0 : Math.round((numerator / denominator) * 100);
}

/** A field counts as present only when it holds a non-empty value. */
function present(value: string | null | undefined): boolean {
  return value != null && value !== "";
}

/**
 * DAMA-style quality dimensions computed from the ontology summary and
 * term-frequency data. Each score states its method so the number is auditable.
 */
export function getDimensionScores(
  summary: SummaryData,
  usedUris: Set<string>,
): DimensionScore[] {
  const entries = allEntries(summary);
  const total = entries.length;

  // Completeness: label and comment annotations present
  const fieldsPresent = entries.reduce(
    (n, { entity }) => n + (present(entity.label) ? 1 : 0) + (present(entity.comment) ? 1 : 0),
    0,
  );

  // Uniqueness: labels not shared by another entity (case-insensitive)
  const labelled = entries.filter(({ entity }) => present(entity.label));
  const labelCounts = new Map<string, number>();
  for (const { entity } of labelled) {
    const key = String(entity.label).trim().toLowerCase();
    labelCounts.set(key, (labelCounts.get(key) ?? 0) + 1);
  }
  const uniqueLabels = labelled.filter(
    ({ entity }) => labelCounts.get(String(entity.label).trim().toLowerCase()) === 1,
  ).length;

  // Consistency: naming conventions — PascalCase classes, camelCase properties
  const conforming = entries.filter(({ uri, kind }) => {
    const name = localName(uri);
    if (name.length === 0) return false;
    const first = name.charAt(0);
    return kind === "class" ? first === first.toUpperCase() : first === first.toLowerCase();
  }).length;

  // Validity: properties declare both a domain and a range
  const properties = entries.filter(({ kind }) => kind === "property");
  const validProperties = properties.filter(
    ({ entity }) => present(entity.domain) && present(entity.range),
  ).length;

  // Relevance: terms observed at least once in The Gazette data
  const used = entries.filter(({ uri }) => usedUris.has(uri)).length;

  return [
    {
      dimension: "Completeness",
      score: pct(fieldsPresent, total * 2),
      method: "Label and comment annotations present on every term",
      detail: `${fieldsPresent}/${total * 2} fields`,
    },
    {
      dimension: "Uniqueness",
      score: labelled.length === 0 ? null : pct(uniqueLabels, labelled.length),
      method: "Labels not shared by another term in this ontology",
      detail: labelled.length === 0 ? null : `${uniqueLabels}/${labelled.length} labels`,
    },
    {
      dimension: "Consistency",
      score: total === 0 ? null : pct(conforming, total),
      method: "Naming convention: PascalCase classes, camelCase properties",
      detail: total === 0 ? null : `${conforming}/${total} terms`,
    },
    {
      dimension: "Validity",
      score: properties.length === 0 ? null : pct(validProperties, properties.length),
      method: "Properties declare both a domain and a range",
      detail: properties.length === 0 ? null : `${validProperties}/${properties.length} properties`,
    },
    {
      dimension: "Relevance",
      score: total === 0 ? null : pct(used, total),
      method: "Terms observed at least once in The Gazette data",
      detail: total === 0 ? null : `${used}/${total} terms`,
    },
  ];
}
