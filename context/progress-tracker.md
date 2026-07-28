# NowNot — Progress Tracker

> Update this file at the end of every implementation session, before closing the editor.

---

## Current Phase

- **Phase 1 — Web Prototype** (HTML · Tailwind CSS · React · Vite · localStorage)

---

## Current Goal

- Project context complete. Build units defined and ordered.
- Next goal: execute **Unit 1 — Scaffold + Design System**.

---

## Completed

- [x] `context/project-overview.md` — full product spec, goals, user flow, in/out of scope, success criteria
- [x] `context/architecture.md` — stack table, folder boundaries, storage model (all `nn_` keys), auth model, background task model, six invariants, design decisions
- [x] `context/ai-workflow-rules.md` — binding agent workflow rules: scoping, splitting, ambiguity handling, protected files, doc sync, verification checklist, session protocol
- [x] `context/ui-context.md` — complete color token system, typography (Outfit + Inter + JetBrains Mono), border radius scale, spacing scale, elevation/shadow scale, animation tokens, glass surface recipe
- [x] `context/code-standards.md` — file naming, import order, layer rules (engine/store/hook/component/page), Tailwind usage, data conventions (UUID, Unix ms, GROUPS constant), comment tags, error handling, prohibited patterns

---

## In Progress

- None. Context phase complete; implementation not started.

---

## Build Units

| # | Unit Name | Visible Result | Deps | Status |
|---|---|---|---|---|
| U1 | Scaffold + Design System | App loads in browser: gradient-dark background, correct fonts, 5-page nav shell, all CSS tokens active | None | ✅ Completed |
| U2 | Status Manager | Create, view, edit, delete statuses (name, emoji, start/end time); data persists on refresh | U1 | ✅ Completed |
| U3 | Group Reply Messages | Write and save one auto-reply per contact group per status; messages persist on refresh | U2 | Pending |
| U4 | Status Activation + Live Dashboard | Activate a status, see live countdown, manually deactivate, watch auto-expire at end time | U2, U3 | Pending |
| U5 | Call Simulator + Missed Call Log | Simulate a call during an active status; correct group message auto-selected; call logged with caller/time/group/message; log persists | U3, U4 | Pending |
| U6 | Recurring Scheduler | Create day-of-week schedules; correct status auto-activates on Dashboard at scheduled time; manual override blocks resume | U2, U4 | Pending |
| U7 | Callback Reminders + Toast System | Enable reminder on a log entry; in-app toast fires after configured delay | U5 | Pending |
| U8 | Settings + Responsive Polish | Configure reminder delay; full app responsive on mobile; transitions and animations complete | U1–U7 | Pending |

## Next Up

- **U3 — Group Reply Messages** (Write and save auto-reply messages per contact group per status)

---

## Open Questions

- **Tailwind version**: Confirm v3 (class-based `dark:` variants) vs v4 (CSS-first). Architecture assumes v3 dark mode via `class` strategy — confirm before scaffolding.
- **React version**: v18 (with `createRoot`) assumed. Confirm before scaffolding.
- **Routing**: `App.jsx` needs a router for multi-page navigation. No routing library was specified. Options: React Router v6 (lightweight) or manual `useState` page switcher (zero dependencies). Decision needed before building `App.jsx`.
- **Vite base URL**: If deployed to a subdirectory (e.g. GitHub Pages at `/NowNot/`), `vite.config.js` needs `base: '/NowNot/'`. Confirm deployment target.
- **Reminder persistence**: `ai-workflow-rules.md` §5c notes that `setTimeout`-based reminders are lost on tab close. Acceptable for Phase 1? Or use `nn_reminders` in localStorage with on-load re-scheduling?

---

## Architecture Decisions

| Decision | Rationale | Recorded In |
|---|---|---|
| `localStorage` only; no backend | Self-contained static prototype; swappable for SQLite in Phase 2 | `architecture.md §3` |
| Six named invariants (INV-1 through INV-6) | Prevent the highest-risk logic errors (dual active status, log mutation, direct localStorage access) | `architecture.md §6` |
| `store/` is the only layer that touches `localStorage` | Enables clean Phase 2 swap to SQLite without touching engine or component code | `architecture.md INV-4` |
| Log is append-only | Prevents audit trail corruption; no `logStore.update()` or `delete()` exists | `architecture.md INV-5` |
| Poll-based scheduler (60 s interval) | No server-side cron available in browser; polling is sufficient for minute-level schedule precision | `architecture.md §7` |
| Manual status overrides schedule and returns to idle (no resume) | Simplest user mental model; avoids stale auto-replies from a window the user deliberately bypassed | `architecture.md §7` |
| Gradient-dark aesthetic with glassmorphism | Matches the premium portfolio goal; violet primary maps to status/availability semantics | `ui-context.md` |
| Outfit + Inter + JetBrains Mono typography | Outfit for display impact, Inter for body readability, JetBrains Mono for countdown digits that don't shift | `ui-context.md §2` |

---

## Session Notes

- **Context files live in `context/`** — `project-overview.md`, `architecture.md`, `ai-workflow-rules.md`, `ui-context.md`. Read all four before any implementation session (per `ai-workflow-rules.md §9`).
- **All `localStorage` keys are prefixed `nn_`** — full list in `architecture.md §3`.
- **`context/` files are protected** — do not `import` them in application code (INV-6).
- **Phase 2 target**: Native Android app in Flutter. Every architectural decision in Phase 1 should avoid coupling the logic to browser APIs beyond the `store/` layer.
- **Call Simulator** is a UI-only React component — it does not send real SMS or detect real calls. Its only job is to demonstrate the group-routing and log-append flow in the browser.
