# Phase 12 archetype-mapping table (D-08 deliverable)

**Authored:** 2026-06-12 (Plan 12-01, Task 1)
**Status:** Awaiting Connor approval (Task 4 checkpoint)
**Decision basis:** D-08 (no two industries share a visual composition), D-09 (real-shaped anonymized industry-realistic numbers), D-11 (accents from existing chart tokens only).

This table covers all 25 visual instances across the 6 industry sub-pages plus
the `/solutions` hub: 6 Console heroes (one per industry, in the existing
`ProductVisualBand` slot), 18 FeatureAccordion items (3 per industry), and 1 hub
cross-industry overview. Accordion item ids are verified against
`src/content/solutions-*.ts`. Archetypes are one of Console / Data-story /
Schematic. Each one-line intent names the concrete data shape so no two visuals
read alike (D-08). Per D-05, every `placement` item is routing-themed and gets a
Schematic. Each page carries the triad (Schematic + DataStory + Console) across
its 3 accordion items; the "DataStory carrier" column records which item carries
the Data-story on each page.

## Mapping table

### Console heroes (ProductVisualBand slot, one per industry, SOLVIS-02)

| Page | Slot | Archetype | Accent | One-line payload intent |
|---|---|---|---|---|
| utilities | hero | Console | chart-5 | Utilities-in-treatment console: final-bill, active-service arrears, deposit offsets, write-off dispute rows; residential vs commercial pills; smaller balances / higher counts than financial-services. |
| financial-services | hero | Console | chart-1 | Charge-off console: charged-off card, consumer loan, line-of-credit rows; larger balances / lower counts; bank vs credit-union book pills. |
| telecom | hero | Console | chart-3 | Telecom receivables console: device-receivable vs service-balance rows split prepaid vs postpaid; high volume, short-cycle. |
| fintech | hero | Console | chart-5 | Fintech console: BNPL-installment and personal-loan rows; steep early-delinquency curve; digital-origination pills. |
| insurance | hero | Console | chart-3 | Insurance console: earned-premium, subrogation, deductible rows; business vs consumer book pills; jurisdiction-variance. |
| healthcare | hero | Console | chart-4 | Healthcare console: self-pay, balance-after-insurance rows split EBO vs bad-debt; provider-network pills. |

### Accordion items (3 per industry, SOLVIS-03/04/05)

| Page | Item id | Archetype | Accent | One-line payload intent |
|---|---|---|---|---|
| utilities | placement | Schematic | chart-5 | Routing: Billing / CIS system source → routing decision engine → utility vendor pools → recovered/closed sink; routes residential and commercial separately. |
| utilities | optimization | Console | chart-5 | Config console: residential vs commercial workflow rows, each with its own vendor pool, share, and cycle. |
| utilities | reporting | DataStory (carrier) | chart-5 | Daily-reconciliation spark of arrears/deposit balance matches with a match-rate annotation. |
| financial-services | placement | Schematic | chart-1 | Routing: core banking / loan-servicing source → decision engine → agency/law-firm pools → recovered sink. |
| financial-services | issues | Console (DataStory carrier) | chart-1 | Exception console: bankruptcy, deceased, dispute condition rows, each with a configured treatment and live handled-automatically status. |
| financial-services | optimization | Console | chart-1 | Settlement console: settlement-floor and payment-plan rows per pool with authorized caps. |
| telecom | placement | Schematic | chart-3 | Routing: OSS / BSS source → decision engine → high-volume vendor pools → recovered sink; short-cycle recall. |
| telecom | optimization | Console | chart-3 | Short-cycle recall console: recall-window rows per tier with per-window account counts. |
| telecom | issues | Console (DataStory carrier) | chart-3 | Prepaid vs postpaid exception console: device-receivable vs service-balance condition rows. |
| fintech | placement | Schematic | chart-5 | Routing: ledger / origination API source → decision engine → vendor pools → recovered sink; in-app config. |
| fintech | optimization | Console | chart-5 | In-app config console: BNPL-installment and personal-loan workflow rows configured from the app. |
| fintech | reporting | DataStory (carrier) | chart-5 | Network-consolidation cards: per-vendor BNPL/personal-loan liquidation across the consolidated network. |
| insurance | placement | Schematic | chart-3 | Routing: policy-admin system source → decision engine → jurisdiction-aware vendor pools → recovered sink. |
| insurance | optimization | Console | chart-3 | Business vs consumer books console: separate premium/subrogation workflow rows per book. |
| insurance | reporting | DataStory (carrier) | chart-3 | Reconciliation bars of premium vs subrogation recoveries with a recovery-rate annotation. |
| healthcare | placement | Schematic | chart-4 | Routing: EHR / clearinghouse source → decision engine → EBO/bad-debt vendor pools → recovered sink. |
| healthcare | optimization | Console | chart-4 | EBO vs bad-debt console: early-out vs bad-debt workflow rows with separate treatment cycles. |
| healthcare | reporting | DataStory (carrier) | chart-4 | Reconciliation area of self-pay vs balance-after-insurance recoveries with a match-rate annotation. |

### Hub

| Page | Slot | Archetype | Accent | One-line payload intent |
|---|---|---|---|---|
| /solutions (hub) | BenefitSplit visual | DataStory (cards) | per-card chart-1/3/4/5 | 6-card cross-industry overview: one card per industry, each with that industry's accent token, headline noun, and a liquidation/match value. Visually distinct from all 6 industry pages (cards branch, no industry uses cards in its triad except via fintech network-consolidation, which is a different card subject). |

**Totals:** 6 heroes + 18 accordion + 1 hub = 25 instances. Archetype split: Console x12 (6 heroes + 6 accordion), Schematic x6 (every `placement`), DataStory x7 (4 reporting + 2 issues-as-carrier + 1 hub).

**DataStory carrier per page (SOLVIS-04):**

| Page | Carrier item | Why |
|---|---|---|
| utilities | reporting | page has a reporting item |
| financial-services | issues | no reporting item; issues carries the DataStory |
| telecom | issues | no reporting item; issues carries the DataStory |
| fintech | reporting | page has a reporting item |
| insurance | reporting | page has a reporting item |
| healthcare | reporting | page has a reporting item |

Every page therefore presents Schematic (placement) + DataStory (carrier) + Console (remaining item), so all three archetypes appear in every industry's accordion.

## Distinctness check (D-08 / SOLVIS-01)

No two industries share a visual composition. The pressure clusters where pages
risk reading alike, and the explicit differentiator for each:

**Reconcile-daily / configure-separately cluster (utilities / insurance / healthcare).**
These three share near-identical "reconcile daily" reporting items and parallel
"configure X and Y separately" optimization items. Differentiated three ways:

- **DataStory chart kind + nouns differ.** Utilities reconciles arrears/deposit
  balances on a daily **spark**; insurance reconciles premium/subrogation
  recoveries on a **bars** chart; healthcare reconciles self-pay/balance-after-
  insurance on an **area** chart. Different chart kind, different row nouns.
- **Schematic source node differs.** Utilities source node is **Billing / CIS
  system**; insurance is **policy-admin system**; healthcare is **EHR /
  clearinghouse**. The routing diagram reads differently on each page.
- **Console split differs.** Utilities splits residential vs commercial; insurance
  splits business vs consumer books; healthcare splits EBO vs bad-debt.

**Accent-share cluster: fintech vs utilities (both chart-5).**
Fintech Console rows are BNPL installments and personal loans with a **steep
early-delinquency** shape (high early miss rate, fast curve); utilities rows are
arrears and deposits with a **seasonal** shape (lower, flatter). Different row
nouns, different curve, different hero pills (digital-origination vs
residential/commercial). Composition differs on every co-visible surface.

**Accent-share cluster: telecom vs insurance (both chart-3).**
Telecom is **OSS/BSS high-volume short-cycle** (device vs service receivables,
prepaid/postpaid, short recall windows, large counts); insurance is
**policy-admin jurisdiction-variance** (premium/subrogation/deductibles, business
vs consumer, larger balances). Telecom's Console leans count-heavy short-cycle;
insurance leans balance-heavy jurisdictional. Different Schematic source, row
nouns, and DataStory subject.

**Financial-services vs the rest.** Uses chart-1 (unique among the six),
charge-off card/loan/line-of-credit nouns, larger balances and lower counts than
utilities (relative-magnitude guardrail), and an `issues` exception Console
(bankruptcy/deceased/disputes) that no other page carries.

## Per-route distinctness strings

Two to three industry-unique substrings per route, sourced verbatim into the
spec's `industryUniqueStrings`. A copy-pasted payload fails the cross-route
distinctness test because a sibling route will not contain another industry's
full set.

| Route | industryUniqueStrings |
|---|---|
| /solutions/utilities | `arrears`, `deposit` |
| /solutions/financial-services | `charge-off` |
| /solutions/telecom | `prepaid` |
| /solutions/fintech | `BNPL` |
| /solutions/insurance | `subrogation` |
| /solutions/healthcare | `self-pay` |

## Accent confirmation (D-11)

Only `chart-1`, `chart-3`, `chart-4`, `chart-5` appear in the accent column
above. `chart-2` is excluded as near-canvas. Accents repeat by design (4 hues, 6
industries): utilities + fintech share chart-5; telecom + insurance share
chart-3. Both shared pairs are differentiated by composition on every co-visible
surface, per the Distinctness check.

## [CLAIMS REVIEW] / [COI REVIEW] surface

Per D-09, Andrew has pre-cleared real-shaped anonymized figures and vendor/TSI
framing for this phase (recorded in AUDIT FIX-03 and project memory, 2026-06-12).
Tags stay on the payload modules for audit traceability; they are not
merge-blockers this phase. No named clients or client logos appear. All routing
framing stays agency-network-agnostic per CLAUDE.md §6 ("routes across the
originator's existing vendors"); no claim positions dPlat as structurally
separate from TSI's ARM business.

## Plan 12-01 scope note

This plan (12-01) authors and wires the 4 **utilities** payloads only
(`utilitiesConsole`, `utilitiesRouting`, `utilitiesConfig`,
`utilitiesReconciliation`) as the proven end-to-end pattern, plus the gating
`solutions-visuals.spec.ts`. The other five industries and the hub are the
approved intents that Wave 2 (Plans 12-02 / 12-03 / 12-04) authors against this
locked table.
