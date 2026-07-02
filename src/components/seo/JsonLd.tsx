/**
 * Server component that renders a JSON-LD structured-data block.
 *
 * Emits a single <script type="application/ld+json"> with the schema
 * object serialized. No client JS. Callers pass the object built by
 * src/lib/seo/schema.ts.
 */

interface JsonLdProps {
  data: Record<string, unknown>;
}

export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
