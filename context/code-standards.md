# NowNot — Code Standards

> Implementation rules for the NowNot Phase 1 web prototype.
> Stack: React · Vite · Tailwind CSS v3 · Vanilla JS · localStorage.
> These rules apply to every file in `src/`. Follow them without exception.

---

## 1. File and Folder Naming

- Use **kebab-case** for all file names: `status-engine.js`, `use-active-status.js`.
- Exception: React component files use **PascalCase**: `StatusCard.jsx`, `Dashboard.jsx`.
- Use `.jsx` for any file that contains JSX. Use `.js` for all pure logic files.
- One default export per file. The export name must match the file name exactly.
  ```js
  // statusStore.js
  export default statusStore;

  // StatusCard.jsx
  export default StatusCard;
  ```

---

## 2. Module Structure and Import Order

Order imports in every file as follows, separated by blank lines:

```js
// 1. React and React ecosystem
import { useState, useEffect } from 'react';

// 2. Third-party libraries (none expected in Phase 1)

// 3. Engine modules
import statusEngine from '../engine/statusEngine';

// 4. Store modules
import statusStore from '../store/statusStore';

// 5. Hooks
import useActiveStatus from '../hooks/useActiveStatus';

// 6. Components
import StatusCard from '../components/StatusCard';

// 7. Styles (only in main.jsx or index.css)
import '../styles/index.css';
```

Do not mix these groups. Do not use path aliases unless Vite is configured with them explicitly.

---

## 3. Engine Module Rules (`src/engine/`)

- Every function in `engine/` must be a **pure function** or a **stateless class method**.
- Engine functions must not import from `components/` or `pages/`.
- Engine functions must not call `localStorage` directly — call `store/` functions only.
- Engine functions must not use React hooks or JSX.
- Every engine function must have a JSDoc comment stating its inputs, output, and any invariant it enforces.

```js
/**
 * Activates a status. Deactivates any currently active status first (INV-1).
 * @param {string} statusId - The ID of the status to activate.
 * @param {'manual'|'schedule'} source - What triggered the activation.
 * @returns {ActiveStatus} The newly written active status object.
 */
function activate(statusId, source) { ... }
```

---

## 4. Store Module Rules (`src/store/`)

- Every store module must declare its `localStorage` key as a named constant at the top of the file.
  ```js
  const KEY = 'nn_statuses'; // All keys use the nn_ prefix
  ```
- Every store function that writes to `localStorage` must serialize with `JSON.stringify`.
- Every store function that reads from `localStorage` must parse with `JSON.parse` and return a safe default (`[]` or `null`) if the key is absent or unparseable.
  ```js
  function getAll() {
    try {
      return JSON.parse(localStorage.getItem(KEY)) ?? [];
    } catch {
      return [];
    }
  }
  ```
- `logStore.js` must not export any function named `update`, `delete`, `remove`, `clear`, or `mutate` (INV-5).
- Store functions must not import from `engine/`, `hooks/`, `components/`, or `pages/`.

---

## 5. Hook Rules (`src/hooks/`)

- Every hook file exports exactly one hook as the default export.
- Hook names must start with `use`.
- Hooks are the only layer permitted to call both engine functions and store functions in the same file.
- Hooks must not contain JSX.
- Every `setInterval` or `setTimeout` inside a hook must be cleaned up in a `useEffect` return function.
  ```js
  useEffect(() => {
    const id = setInterval(tick, 30_000);
    return () => clearInterval(id);
  }, []);
  ```
- Do not start a timer in a hook without also cleaning it up. Leaked timers are a bug.

---

## 6. Component Rules (`src/components/`)

- Components are presentational. They render UI based on props. They do not contain business logic.
- Components must not import from `store/` directly. If they need data, receive it as a prop or call a hook.
- Components must not call `localStorage` directly (INV-4).
- Every component must accept a `className` prop and spread it onto its root element to allow external style composition.
  ```jsx
  function StatusCard({ status, className = '' }) {
    return <div className={`glass-card ${className}`}>...</div>;
  }
  ```
- Do not use inline `style={{}}` objects for values that have a token. Use Tailwind classes or CSS custom properties.

---

## 7. Page Rules (`src/pages/`)

- Pages own layout and data assembly. They call hooks and pass data down to components.
- Pages must not contain direct `localStorage` calls (INV-4).
- Pages must not contain engine logic. If a user action requires engine logic, extract it to a hook and call the hook.
- Each page is a single default export with no named exports.

---

## 8. Tailwind CSS Usage

- Use Tailwind utility classes for spacing, layout, and responsive breakpoints.
- Use CSS custom properties (from `ui-context.md`) for all colors, typography, and shadows — do not hardcode hex values in Tailwind classes.
  ```jsx
  // Correct
  <div className="rounded-xl p-6" style={{ background: 'var(--gradient-surface)' }}>

  // Wrong — never hardcode colors
  <div className="bg-[#161A35] rounded-xl p-6">
  ```
- Exception: Tailwind `dark:` variants and opacity modifiers are permitted as utilities.
- All `border-radius` values must use the scale from `ui-context.md §3`. Do not use arbitrary Tailwind values like `rounded-[13px]`.

---

## 9. Data and Type Conventions

- All timestamps are stored and compared as **Unix milliseconds** (`Date.now()`). Never store ISO strings or locale strings in `localStorage`.
- All IDs are **UUID v4 strings**. Use `crypto.randomUUID()` (available in all modern browsers). Do not use `Math.random()` for IDs.
- Contact groups are a closed string union. The only valid values are:
  ```js
  const GROUPS = ['Family', 'Friends', 'Work', 'Unknown'];
  ```
  Do not hardcode group strings outside this constant. Import `GROUPS` wherever group values are needed.
- Active status source is a closed string union: `'manual'` or `'schedule'`. No other values are valid.

---

## 10. Comment Conventions

Use these exact tags — they are referenced by `ai-workflow-rules.md` and must be machine-readable:

| Tag | Meaning | Example |
|---|---|---|
| `// FUTURE:` | A known future need deferred to Phase 2 | `// FUTURE: replace with SQLite in Phase 2` |
| `// ASSUMPTION:` | A gap in the spec filled conservatively | `// ASSUMPTION: overlapping schedules are resolved by earliest end time` |
| `// REFACTOR CANDIDATE:` | An improvement spotted but not implemented now | `// REFACTOR CANDIDATE: extract into shared util` |
| `// INV-N:` | An invariant being enforced at this exact line | `// INV-1: deactivate any existing status before activating` |
| `// TODO:` | Work within the current unit not yet done | `// TODO: handle null callerGroup` |

Do not use `// HACK:`, `// FIXME:`, or `// XXX:`. Use the tags above instead.

---

## 11. Error Handling

- Every `localStorage` read must be wrapped in a `try/catch` with a safe fallback (see §4).
- Do not `throw` errors from store or engine functions in normal operation. Return `null` or a safe default.
- Do not use `alert()` or `console.error()` in production paths. Use the `Toast` component for user-facing errors.
- `console.log()` is permitted during development. All `console.log` calls must be removed before a unit is marked complete in `progress-tracker.md`.

---

## 12. Prohibited Patterns

Never do any of the following:

| Prohibited | Reason |
|---|---|
| `localStorage.setItem(...)` outside `src/store/` | Violates INV-4 |
| `logStore.delete(...)` or `logStore.update(...)` | Violates INV-5 |
| `import` anything from `context/` | Violates INV-6 |
| Two active statuses in `nn_active_status` | Violates INV-1 |
| Scheduler re-activating an expired manual window | Violates INV-2 |
| `groupRouter.getReply()` returning a non-null value when no status is active | Violates INV-3 |
| Hardcoded hex colors in JSX | Breaks the token system |
| `Math.random()` for IDs | Produces collision-prone IDs |
| Storing timestamps as ISO strings | Creates comparison bugs across timezones |
| `console.log` left in completed units | Pollutes the production console |
