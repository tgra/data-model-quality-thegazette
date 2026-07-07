import fs from "node:fs";
import path from "node:path";

export interface Provenance {
  /** ISO date (YYYY-MM-DD) the source data was queried. */
  queriedOn: string;
  /** Human-readable name of the data source. */
  source: string;
  /** Optional link for the source. */
  sourceUrl?: string;
  /** Optional longer note about how the data was produced. */
  note?: string;
}

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

/** Read the single source of truth for when/where the data was queried. */
export function getProvenance(): Provenance {
  const file = path.join(process.cwd(), "data-provenance.json");
  return JSON.parse(fs.readFileSync(file, "utf8")) as Provenance;
}

/** "2026-07-07" -> "7 July 2026". String-parsed to avoid timezone drift. */
export function formatQueryDate(iso: string): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso);
  if (!m) return iso;
  const [, y, mo, d] = m;
  return `${Number(d)} ${MONTHS[Number(mo) - 1]} ${y}`;
}
