// src/components/ambient/AmbientField.tsx
// Decorative ambient motion layer for dark sections: slowly drifting indigo
// particles plus an optional breathing radial bloom. Sits behind content.
//
// Deterministic particle placement (seeded) so server and client markup match
// and there is no hydration mismatch.
//
// Usage: place inside a position:relative section, before the content.
//   <section className="relative">
//     <AmbientField />
//     <div className="relative z-10">...content...</div>
//   </section>
//
// Server Component: reduced-motion handling lives entirely in the module CSS
// (bloom animation off, particles display:none), so no client JS ships.

import styles from "./AmbientField.module.css";

interface Particle {
  left: number;
  top: number;
  size: number;
  dx: number;
  dy: number;
  dur: number;
  delay: number;
}

// Tiny deterministic PRNG so particle positions are stable across renders.
function makeParticles(count: number, seedStart: number): Particle[] {
  let seed = seedStart;
  const rand = () => {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff;
    return seed / 0x7fffffff;
  };
  const out: Particle[] = [];
  for (let i = 0; i < count; i++) {
    out.push({
      left: 6 + rand() * 88,
      top: 8 + rand() * 84,
      size: 2 + rand() * 1.6,
      dx: (rand() - 0.5) * 44,
      dy: (rand() - 0.5) * 44,
      dur: 42 + rand() * 26,
      delay: -rand() * 40,
    });
  }
  return out;
}

interface AmbientFieldProps {
  particleCount?: number;
  bloom?: boolean;
  seed?: number;
  className?: string;
}

export function AmbientField({
  particleCount = 5,
  bloom = true,
  seed = 538,
  className,
}: AmbientFieldProps) {
  const particles = makeParticles(particleCount, seed);

  return (
    <div className={`${styles.field} ${className ?? ""}`} aria-hidden="true">
      {bloom && <div className={styles.bloom} />}
      {particles.map((p, i) => (
          <span
            key={i}
            className={styles.particle}
            style={
              {
                left: `${p.left}%`,
                top: `${p.top}%`,
                width: `${p.size}px`,
                height: `${p.size}px`,
                "--dx": `${p.dx}px`,
                "--dy": `${p.dy}px`,
                "--dur": `${p.dur}s`,
                "--delay": `${p.delay}s`,
              } as React.CSSProperties
            }
          />
        ))}
    </div>
  );
}
