# NowNot — AI Workflow Rules

> These are binding rules for any AI coding agent working on this project.  
> They are not suggestions. Follow them in every session, without exception.

---

## 1. Overall Approach

**Work spec-first, code second.**  
Before writing a single line of implementation, read `context/project-overview.md` and `context/architecture.md` in full. If either file contradicts your assumptions, stop and resolve the contradiction before proceeding.

**Work incrementally.** Each session must target one named unit — one engine function, one store module, one component, one page. Do not begin the next unit until the current one passes its verification checklist (see Section 7).

**Never write speculative code.** Do not add features, parameters, helper utilities, or abstractions that are not required by the current unit. If you foresee a future need, note it in a comment marked `// FUTURE:` and move on.

**Treat `project-overview.md` as the product contract.** If the spec says a feature is out of scope, do not implement it even if it would be trivially easy. Out-of-scope items are: per-contact message overrides, VIP bypass, AI-generated replies, calendar integration, cloud sync, and user accounts.

---

## 2. Scoping Rules

**One unit at a time.** A unit is the smallest deliverable that can be independently verified. Examples:

| Unit | Scope |
|---|---|
| `statusStore.js` | CRUD functions + key constants only |
| `statusEngine.activate()` | Activation logic only — not deactivation, not timers |
| `useActiveStatus` hook | Hook wiring only — not the component that consumes it |
| `Dashboard.jsx` | UI rendering only — no new engine logic added here |

**Do not touch files outside the current unit's boundary.** If implementing `groupRouter.js` reveals a bug in `statusStore.js`, stop, note the bug in a comment, and report it. Fix it only in a dedicated subsequent unit.

**Do not refactor while implementing.** If you notice an improvement opportunity in a file you are not currently assigned to, note it with `// REFACTOR CANDIDATE:` and leave it. Refactoring is its own unit.

**Do not change file or folder names** unless that is the explicit instruction for the current unit. Renames break imports silently.

---

## 3. When to Split Work Into Smaller Steps

Split any unit into sub-steps if it meets **any** of the following conditions:

1. **More than one file must be created or modified** to make the unit work.
2. **The unit requires both a store function and an engine function.** Write and verify the store first; write the engine second.
3. **The unit introduces a timer** (`setInterval`, `setTimeout`). Implement the logic first without the timer; add and test the timer separately.
4. **The unit touches both `localStorage` reads and writes.** Implement and verify reads before writes.
5. **A React component requires a new hook.** Write and verify the hook first; wire it into the component second.

When splitting, state the sub-steps explicitly before starting any of them. Complete them in order. Do not begin sub-step N+1 until sub-step N is verified.

---

## 4. Handling Missing or Ambiguous Requirements

**Do not invent requirements.** If the spec does not specify a behaviour, do not guess.

Follow this exact sequence when you encounter a gap:

1. **Check `project-overview.md`.** The answer is usually there.
2. **Check `architecture.md`.** Data shapes and boundary rules often resolve ambiguity.
3. **If still unresolved, apply the most conservative interpretation.** Do the minimum that satisfies the stated requirement without adding new behaviour.
4. **Mark the assumption explicitly.** Add a comment directly in the code:
   ```js
   // ASSUMPTION: [what you assumed] — confirm with owner before Phase 2
   ```
5. **Do not proceed past the ambiguous point in the same session.** Report the assumption and the exact line where it was made, then stop.

Never silently fill a gap. A visible assumption is always better than invisible invented behaviour.

---

## 5. Protected Files — Do Not Modify Without Explicit Instruction

The following files and directories must **never be modified** unless the current unit's instruction explicitly names them:

| File / Directory | Reason |
|---|---|
| `context/project-overview.md` | Product contract — changes require owner decision |
| `context/architecture.md` | System design record — changes require owner decision |
| `context/ai-workflow-rules.md` | This file — self-referential; changes require owner decision |
| `index.html` | Entry point — only modify when adding a script tag or meta tag is explicitly required |
| `vite.config.js` | Build config — only modify when a build-level change is explicitly required |
| `package.json` | Dependency manifest — only add a dependency when explicitly instructed; never remove one |
| `src/styles/index.css` | Global design tokens — only modify when a design-system change is explicitly instructed |
| Any file in `node_modules/` | External packages — never modify |
| Any auto-generated file | Files with `// AUTO-GENERATED` headers — never modify manually |

When in doubt about whether a file is protected, treat it as protected and ask.

---

## 6. Keeping Documentation in Sync

**Sync docs at the end of every unit, before verification.**

Apply the following rules after completing each unit's implementation:

1. **New `localStorage` key introduced?** Add it to the Storage Model table in `architecture.md` immediately.
2. **New file created?** Add it to the folder tree in `architecture.md` immediately.
3. **An invariant was discovered to be violated by the current code?** Fix the code. Do not relax the invariant.
4. **An invariant was discovered to be impossible to enforce as written?** Stop, report it, and do not proceed until the invariant is revised by the owner.
5. **A new assumption was added to the code?** Copy the assumption comment into a running `## Known Assumptions` section at the bottom of `architecture.md`.
6. **A feature was implemented differently than the spec describes?** Update the spec paragraph in `project-overview.md` to match what was actually built, and mark the change with `> Updated [date]:`.

Do not leave implementation and documentation out of sync at the end of any session.

---

## 7. Verification Checklist

**Do not mark a unit complete until every item on this checklist is confirmed.**  
Work through the list in order. A failure at any step requires a fix before continuing.

### A. Correctness

- [ ] The unit does exactly what its specification requires — no more, no less.
- [ ] All `ASSUMPTION:` comments are present for every gap you filled.
- [ ] No code outside the unit's boundary was changed.

### B. Invariant Compliance

- [ ] INV-1: No code path can result in two statuses being active simultaneously.
- [ ] INV-2: The scheduler cannot resume a window that a manual status skipped.
- [ ] INV-3: `groupRouter.getReply()` returns `null` when no status is active.
- [ ] INV-4: No `localStorage` call appears outside `src/store/`.
- [ ] INV-5: `logStore` has no `update()` or `delete()` function.
- [ ] INV-6: No `import` or `require` points to anything inside `context/`.

### C. Data Integrity

- [ ] Every new `localStorage` key uses the `nn_` prefix and the exact name defined in `architecture.md`.
- [ ] All timestamps are stored as Unix milliseconds (`Date.now()`), not ISO strings or locale strings.
- [ ] No `undefined` or `NaN` value can be written to `localStorage`.

### D. Boundary Compliance

- [ ] `engine/` files contain zero JSX and zero direct `localStorage` calls.
- [ ] `store/` files contain zero JSX and zero React hooks.
- [ ] `components/` files import nothing from `store/` directly.
- [ ] `pages/` files contain no engine logic — all logic is delegated to a hook or engine function.

### E. Documentation Sync

- [ ] `architecture.md` folder tree reflects any new files added.
- [ ] `architecture.md` storage table reflects any new keys added.
- [ ] Any new assumption is noted in both the code and `architecture.md`.

### F. Scope

- [ ] No out-of-scope feature (per Section 1 and `project-overview.md`) was implemented.
- [ ] No speculative utility, helper, or abstraction was added.
- [ ] No dependency was added to `package.json` without explicit instruction.

---

## 8. Commit Message Format

Every commit must follow this format exactly:

```
[unit] verb: short description

Examples:
[store] add: statusStore CRUD functions and key constants
[engine] add: statusEngine.activate() with deactivation guard
[hook] add: useActiveStatus polling loop (30 s interval)
[page] add: Dashboard countdown badge wired to useActiveStatus
[fix] fix: groupRouter returning message when no status active
[docs] sync: architecture.md updated after logStore unit
```

Do not combine multiple units in one commit. One unit = one commit.

---

## 9. Session Start Protocol

At the start of every new session, before writing any code:

1. Read `context/project-overview.md` — confirm you understand the product.
2. Read `context/architecture.md` — confirm you understand the current system state.
3. Read `context/ai-workflow-rules.md` (this file) — confirm you will follow these rules.
4. State the unit you are about to implement.
5. State which files you will create or modify.
6. State which invariants are relevant to this unit.
7. Begin only after completing steps 1–6.

Do not skip the protocol because the session seems small. Every session follows the same protocol.
