"use client";

import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";

import { EyebrowLabel } from "@/components/product/primitives/EyebrowLabel";
import { LiveStatus } from "@/components/product/primitives/LiveStatus";
import { ProductCanvas } from "@/components/product/primitives/ProductCanvas";
import { StatPill } from "@/components/product/primitives/StatPill";
import { Tag, TypeChip, ValueBar, type ToneKey } from "@/components/product/visuals/parts";
import {
  AnimatedNumber,
  fadeUpItem,
  popItem,
  staggerContainer,
  useInViewProps,
} from "@/components/product/motion";

// [CLAIMS REVIEW] placeholder values — Andrew sign-off required.
// [COI REVIEW] compliance / regulated-status language below.
const VENDORS = [
  { name: "Recovery partner A", value: 98.2, tone: "success", status: "Compliant", statusTone: "success" },
  { name: "Recovery partner B", value: 96.8, tone: "success", status: "Compliant", statusTone: "success" },
  { name: "Recovery partner C", value: 91.4, tone: "warning", status: "Review", statusTone: "warning" },
] as const;
const EXCEPTIONS = [
  { chip: "DECEASED", chipTone: "success", desc: "SSA death index match · acct ··· 2847", action: "Treatment suspended" },
  { chip: "BANKRUPTCY", chipTone: "breach", desc: "PACER chapter 7 filing · acct ··· 1294", action: "Auto-recalled" },
  { chip: "SCRA", chipTone: "special", desc: "Active duty confirmed · acct ··· 9038", action: "Rate cap applied" },
] as const;

export const ComplianceStandards = React.memo(function ComplianceStandards() {
  const reduce = useReducedMotion();
  const reveal = useInViewProps();
  return (
    // role="img" + a root text alternative so this visual self-labels like the
    // four Console-based homepage flagships (which emit role="img" via their
    // ariaSummary). FeatureAccordion no longer wraps live visuals in role="img"
    // (that tripped axe nested-interactive), so each visual owns its own name.
    // [CLAIMS REVIEW]/[COI REVIEW]: the summary mirrors the displayed VENDORS /
    // EXCEPTIONS values above and carries the same regulated-status framing.
    <ProductCanvas
      role="img"
      aria-label="Compliance and work standards console. Vendor adherence over 30 days: recovery partner A 98.2% compliant, partner B 96.8% compliant, partner C 91.4% in review. Auto-surfaced regulated-status exceptions: a deceased match suspends treatment, a bankruptcy filing auto-recalls the account, and confirmed active duty applies an SCRA rate cap."
      className="text-[var(--product-text)]"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <EyebrowLabel>COMPLIANCE &amp; WORK STANDARDS</EyebrowLabel>
          <p className="mt-2 text-[17px] font-[500] tracking-[-0.02em]">Vendor adherence</p>
          <p className="text-[12px] text-[var(--product-text-3)]">
            Measured against your work standards · audited continuously
          </p>
        </div>
        <LiveStatus label="AUDITED" tone="success" />
      </div>

      <p className="mt-4 text-[10px] uppercase tracking-[0.08em] text-[var(--product-text-3)]">
        Work standard adherence · 30 days
      </p>
      <motion.div
        className="mt-2 flex flex-col gap-2.5"
        variants={staggerContainer}
        {...reveal}
      >
        {VENDORS.map((v) => (
          <motion.div key={v.name} variants={fadeUpItem} className="grid grid-cols-[1.4fr_2fr_auto_auto] items-center gap-3">
            <div className="flex items-center gap-2">
              <span aria-hidden="true" className="h-5 w-5 shrink-0 rounded-[5px] bg-gradient-to-br from-[#5266EB] to-[#3949B5]" />
              <span className="text-[12px]">{v.name}</span>
            </div>
            <ValueBar value={v.value} tone={v.tone} />
            <span className="text-[12px] tabular-nums">
              <AnimatedNumber value={v.value} decimals={1} suffix="%" />
            </span>
            <motion.span variants={popItem} className="inline-flex">
              <Tag label={v.status} tone={v.statusTone as ToneKey} />
            </motion.span>
          </motion.div>
        ))}
      </motion.div>

      <div className="mt-5 flex items-center justify-between">
        <p className="flex items-center gap-2 text-[11px] uppercase tracking-[0.08em] text-[var(--product-text-3)]">
          <motion.span
            aria-hidden="true"
            className="h-1.5 w-1.5 rounded-full bg-[var(--primary)]"
            style={{ boxShadow: "0 0 6px 1px var(--primary)" }}
            animate={reduce ? undefined : { opacity: [0.45, 1, 0.45] }}
            transition={reduce ? undefined : { duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          />
          Auto-surfaced exceptions · live
        </p>
        <span className="text-[11px] tabular-nums text-[var(--product-text-3)]">1,284 today</span>
      </div>
      <motion.div
        className="mt-2 flex flex-col divide-y divide-white/[0.06]"
        variants={staggerContainer}
        {...reveal}
      >
        {EXCEPTIONS.map((e) => (
          <motion.div key={e.desc} variants={fadeUpItem} className="flex items-center justify-between gap-3 py-2">
            <div className="flex min-w-0 items-center gap-2">
              <TypeChip label={e.chip} tone={e.chipTone as ToneKey} />
              <span className="truncate text-[11.5px]">{e.desc}</span>
            </div>
            <span className="shrink-0 text-[11px]" style={{ color: "var(--status-success)" }}>{e.action}</span>
          </motion.div>
        ))}
      </motion.div>

      <div className="mt-5 flex flex-wrap gap-2">
        <StatPill label="Audit trail complete" tone="success" />
        <StatPill label="Exportable for review" />
        <StatPill label="Every action logged" tone="indigo" />
      </div>
    </ProductCanvas>
  );
});
