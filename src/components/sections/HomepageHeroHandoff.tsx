import { HeroCinematicMount } from "./HeroCinematicMount";
import { HomepageHero } from "./HomepageHero";
import { HomepageHandoffSection } from "./HomepageHandoffSection";

/**
 * Shared composition for the homepage hero + platform-handoff pair.
 *
 * Server Component since the hero RSC split (2026-07-08): the two sections
 * render entirely on the server (mobile and reduced-motion sessions hydrate
 * none of their markup), and HeroCinematicMount is the pair's only eager
 * client leaf — it gates on desktop + motion-safe, lazy-loads the GSAP
 * controller, and attaches to the sections' DOM through data-* markers.
 *
 * Why one shared home (2026-07-02 mechanics fix): the hero and the handoff
 * each used to mount their OWN HeroCinematicController instance, so the
 * creation/refresh order between the hero pin and the handoff tab-progression
 * trigger was unowned, and the handoff trigger frequently cached a stale start
 * and jumped straight to the last tab. EXACTLY ONE controller may exist, and
 * it creates the hero pin first, the handoff trigger second, and refreshes
 * last. HeroCinematicMount mounts that single controller; the ordering
 * contract lives inside HeroCinematicController itself, which the RSC split
 * left untouched.
 */
export function HomepageHeroHandoff() {
  return (
    <>
      <HeroCinematicMount />
      <HomepageHero />
      <HomepageHandoffSection />
    </>
  );
}
