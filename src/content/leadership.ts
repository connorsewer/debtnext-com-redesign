/**
 * Canonical leadership roster. Single source of truth for the five named
 * leaders, their roles, and their tenure so the figures stay reconciled
 * wherever they appear (/company, /company/leadership, /compare).
 *
 * Consumers keep their own presentation (card bios, table rows, eyebrows);
 * they derive name, role, and years from this roster so the facts can only
 * be edited in one place.
 *
 * [CLAIMS REVIEW] Andrew Budish to confirm titles and tenure before launch.
 * Marc Lanni removed and Rob Novosel added per prior direction.
 */

export interface Leader {
  /** Full name as displayed. */
  name: string;
  /** Title / role line. */
  role: string;
  /** Years in recovery operations. Drives the "N years" eyebrows. */
  years: number;
  /** True for the two 2003 co-founders. */
  cofounder?: boolean;
}

/** The year DebtNext was founded. Matches src/content/org.ts. */
export const foundedYear = 2003;

/**
 * Combined-experience headline used across the leadership sections. Sum of the
 * tenures below rounds to more than 100 years; kept as a phrase so the copy
 * stays "100+ combined years" without asserting a false exact figure.
 */
export const combinedYearsPhrase = "100+ combined years";

/** Canonical roster, ordered by tenure then role seniority. */
export const leaders: Leader[] = [
  { name: "Paul Goske", role: "Co-founder & President", years: 25, cofounder: true },
  { name: "Rob Novosel", role: "Co-founder & CTO", years: 25, cofounder: true },
  { name: "Andrew Hannan", role: "Director of Product Innovation", years: 20 },
  { name: "Eric Port", role: "Operations Director", years: 17 },
  { name: "Frank Ellenberger", role: "Director of Strategic Initiatives", years: 15 },
];

/** Look up a leader by name. Throws in dev if the name drifts out of sync. */
export function leaderByName(name: string): Leader {
  const found = leaders.find((leader) => leader.name === name);
  if (!found) {
    throw new Error(`Unknown leader "${name}": reconcile with src/content/leadership.ts`);
  }
  return found;
}
