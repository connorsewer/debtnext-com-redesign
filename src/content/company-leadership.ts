/**
 * /company/leadership content - child page under /company.
 * Source copy: DebtNext_Company_Pages_Copy.docx (page 2 of 4).
 *
 * Voice rules per CLAUDE.md §5. No em dashes. No banned phrases.
 *
 * [CLAIMS REVIEW] Named individuals on a public page. Andrew Budish to clear
 * names and titles; this page needs an owner who updates it when roles change.
 * Marc Lanni removed and Rob Novosel added per direction (kept in sync with the
 * /company parent and /compare leadership roster).
 */

import type { GridCard } from "@/components/sections/CardGrid";

export const leadershipMeta = {
  title: "DebtNext leadership: a team built inside recovery",
  description:
    "dPlat is led by a team with more than 100 combined years in recovery operations. The people who build the platform have run the operations it serves.",
  canonical: "https://debtnext.com/company/leadership",
};

export const leadershipHero = {
  eyebrow: "Leadership",
  h1: "The people who build dPlat have run recovery operations.",
  body:
    "dPlat is led by a team with more than 100 combined years in recovery operations. Not software executives who learned the domain on the job. People who spent careers inside placement, vendor management, and platform delivery, and then built the system they wished they'd had.",
  primaryCta: { label: "Request a demo", href: "/demo" },
  secondaryCta: { label: "See the platform", href: "/platform" },
};

export const leadershipApproach = {
  eyebrow: "Approach",
  heading: "Recovery-native leadership.",
  paragraphs: [
    "Most enterprise software is built by people who understand software and study the domain. dPlat is the other way around. The team's depth is in recovery operations first, and that shows up in the data model, the configuration choices, and the exception handling.",
    "The same leaders who set product direction sit in client implementations. The person who designed a workflow is reachable by the person configuring it.",
  ],
};

export const leadershipTeam: {
  eyebrow: string;
  heading: string;
  cards: GridCard[];
} = {
  eyebrow: "The team",
  heading: "Who runs dPlat.",
  cards: [
    {
      eyebrow: "25 years",
      title: "Paul Goske",
      body:
        "Co-founder & President. Leads corporate strategy, sales, and client engagement across the dPlat business.",
    },
    {
      eyebrow: "Co-founder",
      title: "Rob Novosel",
      body:
        "Co-founder & CTO. Co-founded DebtNext in 2003. Oversees product, operations, and technology, including platform development, implementation success, and support.",
    },
    {
      eyebrow: "20 years",
      title: "Andrew Hannan",
      body:
        "Director of Product Innovation. Owns product direction and the platform roadmap.",
    },
    {
      eyebrow: "17 years",
      title: "Eric Port",
      body: "Operations Director. Directs platform operations and client delivery.",
    },
    {
      eyebrow: "15 years",
      title: "Frank Ellenberger",
      body:
        "Director of Strategic Initiatives. Leads client implementation and strategic programs.",
    },
  ],
};

export const leadershipHow = {
  eyebrow: "How the team works",
  heading: "Small team, real ownership.",
  bullets: [
    "Software development is onshore, by badged employees, with no offshore or third-party development",
    "Two major platform releases a year, with most new functionality driven by client feedback",
    "Implementation project managers carry at least 4 years inside DebtNext projects",
    "Dedicated platform-management and portfolio-management teams stay on after launch",
  ],
};

export const leadershipFinalCta = {
  heading: "Meet the team on a walkthrough.",
  body:
    "The people who run the demo are the people who build and operate the platform.",
  primaryCta: { label: "Request a demo", href: "/demo" },
  reassurance: "30-minute walkthrough. No commitment.",
};
