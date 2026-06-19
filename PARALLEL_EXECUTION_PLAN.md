# Parallel Execution Plan — Mutual Fund Advisor Intelligence Suite
# Proposal only — not yet adopted. Decide before Sprint 1 starts.

**Status:** Under review. `ImplementationPlan.md` and `STARTING_PROMPTS.md` currently assume strict sequential execution (one Claude Code session per sprint, in order 1→20). This document analyzes whether some of those 20 sessions could instead run in parallel, and what it would cost to do so.

---

## Why this is even possible

The 20-sprint sequence in `ImplementationPlan.md` was ordered for **context-window hygiene** — each sprint spec has a "Context window focus" line scoping it to one concern, so a single Claude Code session doesn't get overloaded. It was **not** ordered strictly by technical dependency. Looking at each sprint's actual **Pre-conditions** section reveals several sprints only depend on Sprint 1, or on sprints that don't share any files — meaning they have no real reason to wait for each other.

---

## Dependency-derived parallel groups

| Group | Sprints | Depends on | Why no conflict |
|---|---|---|---|
| Solo | **1** — Project Scaffold | none | Everything else depends on it; must run first |
| A | **2** — UI Components<br>**4** — Triage Backend<br>**6** — RAG/Corpus Pipeline | All: Sprint 1 only | Separate folders: `frontend/components/ui/` vs `backend/services/triage/` vs `backend/corpus/` |
| B | **3** — Home/Nav<br>**5** — Query Builder<br>**9** — Education Hub Backend | 3→2; 5→2+4; 9→6 | Different pages/services; 3 and 5 both touch `router.tsx` (minor overlap) |
| C | **7** — FAQ Backend<br>**10** — Education Hub Frontend<br>**11** — Scheduler Backend | 7→4+6; 10→2+9; 11→1+4 | Different services/pages |
| D | **8** — FAQ Frontend<br>**12** — Scheduler Frontend<br>**13** — Advisor Backend | 8→2+5+7; 12→2+11; 13→7+11 | Different services/pages |
| E | **14** — Advisor Frontend<br>**15** — Pulse Backend | 14→2+13; 15→7+11+13 | Different services/pages |
| Solo | **16** — Pulse Frontend + Cross-Feature Integration | 8+12+14+15 | Integration point — touches all four; must run after Group E |
| F | **17** — Integration Testing & RAG Eval<br>**18** — Mobile & Accessibility | Both → 1–16 | Neither depends on the other |
| Solo | **19** — Deployment | 1–18 | Needs everything stable first |
| Solo | **20** — Acceptance Verification | 19 | Final gate |

Net effect if fully parallelized: **20 sequential sessions could compress to roughly 10 "rounds"** (Solo, A, B, C, D, E, Solo, F, Solo, Solo).

---

## Real risks of parallelizing (not theoretical)

| Risk | Where it bites | Severity |
|---|---|---|
| **Shared file edits** | `router.tsx` (touched by Sprints 3, 5, 8, 10, 12, 14), `db_models.py` (touched by 4, 6, 7, 9, 11, 13, 15), `main.py` route registration | High — silent overwrites or merge conflicts if two sessions edit the same file in the same window |
| **Alembic migration ordering** | Every backend sprint that adds a table (4, 6, 7, 9, 11, 13, 15) creates a migration. Migrations must apply in a consistent order — two sessions generating migrations "simultaneously" can create a broken migration chain | High |
| **Handover Notes pattern breaks** | Every `STARTING_PROMPTS.md` prompt says "read Sprints 1–N Handover Notes" — a session in Group C genuinely starting before Group B finishes won't have those notes yet | Medium — prompts would need rewriting for parallel mode regardless |
| **Test gate ordering** | `TEST_CASES.md`'s Master Sprint Test Log assumes sprints complete in order; parallel completion would need the log restructured to record group-level rather than strictly sequential status | Low — cosmetic, fixable |
| **Compliance review chain** | Several P0 compliance tests (Sprint 4 triage signals, Sprint 7 FAQ deflection, Sprint 13 PII-free briefs) build on each other conceptually even if not file-wise — reviewing them in isolation across parallel sessions makes it easier to miss an interaction bug between them | Medium |

---

## If we decide to do it: the safe mechanism

Running sessions "simultaneously" only works safely with **git worktrees** — one isolated working copy per sprint in a group, each on its own branch, merged back to `main` sequentially once each finishes (even though the work happened in parallel). Conflicts get resolved one merge at a time instead of N sessions racing on the same files.

Practical sequence for, say, Group A (Sprints 2, 4, 6):
1. Create 3 worktrees off `main` after Sprint 1 merges: `sprint-2`, `sprint-4`, `sprint-6`
2. Run 3 Claude Code sessions (or 3 dispatched subagents), each pinned to its own worktree, each given that sprint's `STARTING_PROMPTS.md` block
3. Merge `sprint-4` → `main` first (no frontend conflicts)
4. Merge `sprint-6` → `main` second (no frontend conflicts, and 4/6 don't share backend files)
5. Merge `sprint-2` → `main` last
6. Only then start Group B's worktrees off the updated `main`

This requires `STARTING_PROMPTS.md`'s prompts to be rewritten for parallel mode — each would need to read only its specific dependency sprints' Handover Notes (not "Sprints 1–N"), and the merge step would need to be made an explicit instruction.

---

## Open decision — not yet made

**Option 1 — Keep strictly sequential (current plan, no changes needed).**
- Pro: Simplest, no rewrite of `STARTING_PROMPTS.md`/`TEST_CASES.md` needed, lowest conflict risk, each session has full context from every prior sprint.
- Con: Slowest — 20 sequential sessions.

**Option 2 — Parallelize the low-risk groups only (A, C, D, E, F).**
- Pro: Meaningful speedup with the least conflict-prone groups (mostly backend/frontend pairs in separate folders).
- Con: Still requires worktree setup + rewritten prompts for those sprints; Group B's `router.tsx` overlap needs a manual resolution step either way.

**Option 3 — Full parallelization per the table above.**
- Pro: Maximum speedup (~10 rounds instead of 20).
- Con: Highest coordination overhead, migration-ordering risk is real, and the compliance-chain review risk (Medium severity above) is the kind of thing that caused several of the Stitch design issues we already caught — parallel sessions reviewing compliance logic in isolation is exactly the failure mode that produced those bugs.

**Recommendation if asked:** Option 2, only for Groups A and C (the two groups with zero shared-file overlap), and keep the rest sequential — but this is the user's call, not a decision made here.

---

*No action has been taken on this plan. `ImplementationPlan.md` and `STARTING_PROMPTS.md` remain unmodified and sequential until a decision is made.*
