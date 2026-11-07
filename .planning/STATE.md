# STATE.md — Current Project & Milestone State

## Active Milestone
**Milestone v9.0:** Store Location & Business Information Update
- **Status:** Scoped & Executing (Phase 21 Wave 1 Active)
- **Frameworks:** GSD Primary + CodeRabbit Review + Gravitas Visual and Functional QA
- **Branch:** `main`
- **Commerce Mode:** `NEXT_PUBLIC_COMMERCE_MODE=demo`
- **Current Phase:** Phase 21 (Global Store Location & Business Information Update)
- **Previous Milestone:** Milestone v8.0 (Completed, Verified, and Pushed `eb04ecc`)
- **Phases:** Exactly 1 Implementation Phase (Phase 21)

---

## Current Position

Phase: Phase 21 — Global Store Location & Business Information Update
Plans: `21-01-PLAN.md`, `21-02-PLAN.md`, `21-03-PLAN.md` (3 Waves Scoped)
Status: Executing Wave 1 (Canonical Business Config & Layout Updates)
Last activity: 2026-11-07 — Phase 21 execution started

---

## Quality & Safety Constraints
- **Zero Redesign:** Preserved Irish Grocer branding, typography, cards, and tokens.
- **Shared Component Protection:** `ProductCard.tsx` design invariants protected.
- **Strict Mobile Freeze:** `MobileBottomNav.tsx` remains 100% untouched; mobile header height and structure preserved.
- **Desktop Visual Lock:** Desktop viewports $\ge 1024\text{px}$ locked to approved baseline state.
- **Commerce Mode:** `NEXT_PUBLIC_COMMERCE_MODE=demo` strictly preserved.
- **Git Safety:** Zero unapproved commits, pushes, stashes, or branch switches. Ralph Wiggum remains completely disabled.
