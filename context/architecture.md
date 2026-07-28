# NowNot — Architecture

> Phase 1: Web Prototype  
> Stack: HTML · Tailwind CSS · React · JavaScript (no backend, no auth, no server)

---

## 1. Stack Table

| Layer | Technology | Role |
|---|---|---|
| **Structure** | HTML5 | Semantic page skeleton; accessibility anchors |
| **Styling** | Tailwind CSS | Utility-first design system; dark mode via `dark:` variants |
| **UI Framework** | React (via CDN or Vite) | Component tree, local state, event handling |
| **Logic** | Vanilla JavaScript (inside React) | Status engine, scheduler, timer management, group-routing |
| **Persistence** | `localStorage` (browser) | All user data — statuses, schedules, messages, missed call log |
| **Timers** | `setInterval` / `setTimeout` (browser) | Auto-expire countdowns, scheduler polling, callback reminders |
| **Notifications** | In-app React state (toast / banner) | Status confirmation, callback reminder alerts |
| **Call Simulator** | React component (UI only) | Simulates an incoming call to demonstrate auto-reply flow |
| **Build Tool** | Vite (Phase 1) | Dev server, HMR, production bundle |

---

## 2. System Boundaries — Folder Responsibilities

```
NowNot/
├── context/                  # Project documentation only — never imported by app code
│   └── project-overview.md
│
├── src/
│   ├── main.jsx              # React root mount, global providers
│   ├── App.jsx               # Top-level router / page switcher
│   │
│   ├── engine/               # Pure logic — no JSX, no UI concerns
│   │   ├── statusEngine.js   # Activate, deactivate, expire, override logic
│   │   ├── scheduler.js      # Recurring schedule evaluation and tick loop
│   │   ├── groupRouter.js    # Maps a caller's contact group → correct reply message
│   │   └── callLogger.js     # Appends a missed call record to the log
│   │
│   ├── store/                # localStorage read/write — single source of truth
│   │   ├── statusStore.js    # CRUD for status definitions
│   │   ├── scheduleStore.js  # CRUD for recurring schedules
│   │   ├── messageStore.js   # CRUD for group-specific reply messages
│   │   └── logStore.js       # Append-only log of missed calls
│   │
│   ├── hooks/                # React hooks that bridge engine ↔ components
│   │   ├── useActiveStatus.js
│   │   ├── useScheduler.js
│   │   └── useCallLog.js
│   │
│   ├── components/           # Reusable UI primitives (no business logic)
│   │   ├── StatusCard.jsx
│   │   ├── CountdownBadge.jsx
│   │   ├── Toast.jsx
│   │   └── CallSimulator.jsx
│   │
│   ├── pages/                # Full-screen views rendered by App.jsx
│   │   ├── Dashboard.jsx     # Active status + countdown + quick actions
│   │   ├── StatusManager.jsx # Create / edit / delete statuses
│   │   ├── Scheduler.jsx     # Recurring schedule setup
│   │   ├── Messages.jsx      # Per-group reply message editor
│   │   ├── CallLog.jsx       # Missed call history
│   │   └── Settings.jsx      # App preferences (theme, reminder delay)
│   │
│   └── styles/
│       └── index.css         # Tailwind directives + any custom CSS variables
│
├── public/
│   └── favicon.svg
│
├── architecture.md           # This file
├── index.html
├── vite.config.js
└── package.json
```

**Boundary rules:**
- `engine/` files are pure functions or classes — they never import from `components/` or `pages/`.
- `store/` is the only layer allowed to call `localStorage`. Engine and hooks call store functions; they never call `localStorage` directly.
- `components/` receive all data via props or hooks — they never import from `store/` directly.
- `context/` is documentation; it must never be imported by any `.js` or `.jsx` file.

---

## 3. Storage Model

NowNot Phase 1 has no server. Everything lives in the browser.

| What | Where | Format | Key |
|---|---|---|---|
| Status definitions (name, emoji, time window) | `localStorage` | JSON array | `nn_statuses` |
| Currently active status + expiry timestamp | `localStorage` | JSON object | `nn_active_status` |
| Recurring schedules | `localStorage` | JSON array | `nn_schedules` |
| Group reply messages (per status, per group) | `localStorage` | JSON object map | `nn_messages` |
| Missed call log | `localStorage` | JSON array (append-only) | `nn_call_log` |
| Pending callback reminders | `localStorage` | JSON array | `nn_reminders` |
| User preferences (theme, reminder delay) | `localStorage` | JSON object | `nn_settings` |
| UI transient state (open modal, current page) | React state (in-memory) | — | — |

**Nothing is stored in a database or on a server in Phase 1.**  
Phase 2 (Android / Flutter) will replace `localStorage` with SQLite and a foreground service.

### Data shape examples

```js
// nn_active_status
{
  "statusId": "uuid-abc",
  "activatedAt": 1721800000000,  // Unix ms
  "expiresAt":   1721815600000,  // Unix ms
  "source": "manual" | "schedule"
}

// nn_call_log entry
{
  "id": "uuid-xyz",
  "timestamp": 1721801234567,
  "callerName": "Unknown",
  "callerNumber": "+91-9999999999",
  "group": "Unknown" | "Family" | "Friends" | "Work",
  "messageSent": "I'm sleeping and will be available after 5:00 PM.",
  "reminderSet": false
}
```

---

## 4. Auth and Access Model

**Phase 1 has no authentication and no user accounts.**

| Concern | Decision |
|---|---|
| User identity | Single implicit user — whoever has the browser session |
| Data ownership | All data is scoped to the origin (`localStorage` is same-origin only) |
| Access control | None — the app is single-user by design |
| Data isolation | Separate browser profiles = separate data; no sharing |
| Session expiry | None — `localStorage` persists until manually cleared |
| Sensitive data | No passwords, tokens, or PII are stored |
| Phase 2 plan | Android app will use device-local auth (PIN / biometric); no cloud account needed |

Because the app is single-user and fully local, there are no roles, no tokens, and no permission surfaces to secure in Phase 1.

---

## 5. Background Task Model

Phase 1 runs entirely in the browser's main thread with two timer loops.

### 5a. Status Expiry Timer

| Property | Detail |
|---|---|
| Mechanism | `setInterval` polling every 30 seconds |
| Owned by | `useActiveStatus` hook, mounted on app load |
| What it does | Reads `nn_active_status.expiresAt`, compares to `Date.now()`, calls `statusEngine.deactivate()` if expired |
| Edge cases | Tab hidden / sleeping — expiry is caught on next visible tick or on next page load |

### 5b. Scheduler Tick Loop

| Property | Detail |
|---|---|
| Mechanism | `setInterval` polling every 60 seconds |
| Owned by | `useScheduler` hook, mounted on app load |
| What it does | Evaluates all recurring schedules against current time and day-of-week; activates matching schedule if no manual status is active |
| Priority | Manual status always wins; scheduler will not activate if `source === "manual"` |

### 5c. Callback Reminders

| Property | Detail |
|---|---|
| Mechanism | `setTimeout` set when user enables a reminder; delay stored in `nn_settings.reminderDelayMs` |
| Owned by | `useCallLog` hook |
| What it does | Shows an in-app toast/banner: *"Don't forget to call back [Name]"* |
| Persistence caveat | If the tab is closed before the timer fires, the reminder is lost (known Phase 1 limitation) |

> **No service workers, Web Workers, or server-sent events are used in Phase 1.**  
> True background operation (reliable SMS sending, call detection) requires a native Android foreground service — Phase 2.

---

## 6. Invariants

Rules the codebase must never violate. Each one has a single owner and a clear failure mode if broken.

---

### INV-1 — Only one status can be active at a time

> **Before activating any status, the engine must deactivate the currently active status (if any).**

- **Owner:** `statusEngine.activate()`
- **Failure mode:** Two statuses would produce conflicting auto-reply messages for the same missed call.
- **Implementation:** `activate()` calls `deactivate()` as its first step, unconditionally.

---

### INV-2 — A manual status always overrides a scheduled status; when it expires, the app returns to idle

> **The scheduler must never resume a scheduled window that was skipped by a manual override.**

- **Owner:** `scheduler.js` + `statusEngine.js`
- **Failure mode:** A skipped schedule window auto-activating after a manual status expires would confuse the user and send stale auto-replies.
- **Implementation:** When a manual status expires, `nn_active_status` is cleared entirely. The scheduler treats the just-expired window as past and does not re-activate it.

---

### INV-3 — Auto-reply messages are sent only when a status is active

> **`groupRouter.getReply()` must check for an active status before returning a message. If no status is active, it must return `null` and no SMS/simulation must fire.**

- **Owner:** `groupRouter.js`
- **Failure mode:** A caller receives an auto-reply outside any active status window, causing confusion and misrepresenting the user's availability.
- **Implementation:** `groupRouter.getReply()` reads `nn_active_status`; if `null` or expired, it returns `null`. The call simulator checks for `null` before triggering a reply.

---

### INV-4 — `localStorage` is written only through `store/` functions

> **No component, hook, engine module, or utility outside `src/store/` may call `localStorage.setItem`, `localStorage.getItem`, or `localStorage.removeItem` directly.**

- **Owner:** All files in `src/store/`
- **Failure mode:** Scattered direct access creates key-name collisions, inconsistent serialization, and makes it impossible to swap the storage layer for Phase 2 (SQLite) without touching every file.
- **Implementation:** `store/` functions own the key names as named constants. All other modules import and call these functions.

---

### INV-5 — The missed call log is append-only

> **Existing log entries must never be mutated or deleted by application code. The log is a permanent audit trail.**

- **Owner:** `logStore.js`, `callLogger.js`
- **Failure mode:** Editing or deleting a log entry would break the user's ability to trust the history and could hide double-sent replies.
- **Implementation:** `logStore.append()` is the only write function; there is no `logStore.update()` or `logStore.delete()`. UI shows the log read-only.

---

### INV-6 — `context/` files are never imported by application code

> **Files inside `context/` are project documentation only and must not be referenced with `import` or `require` in any `.js` or `.jsx` file.**

- **Owner:** All developers / linter config
- **Failure mode:** A documentation file bundled into the app would expose planning notes to end users and bloat the production bundle.
- **Implementation:** Add `context/` to `.eslintignore` or configure a lint rule that flags imports from this directory.

---

## 7. Key Design Decisions and Rationale

| Decision | Rationale |
|---|---|
| No backend in Phase 1 | Keeps the prototype self-contained and deployable as a static site; meets the learning goal of mastering HTML/CSS/JS before adding server complexity |
| `localStorage` over IndexedDB | Sufficient for the data volumes expected; simpler API; straightforward to replace with SQLite in Phase 2 |
| React over Vanilla JS | Component model makes the multi-page UI and derived state (active status countdown) cleaner to manage; aligns with Phase 2 skills transfer |
| Tailwind CSS | Speeds up consistent dark-mode-first UI; avoids writing a custom design system from scratch in Phase 1 |
| Poll-based scheduler (not cron) | Browser environments offer no server-side cron; polling every 60 s is accurate enough for minute-granularity schedules and avoids `requestAnimationFrame` battery drain |
| Simulator instead of real calls | Real call detection and SMS sending require Android system APIs unavailable in a browser; the simulator proves the logic and UI without them |
| Manual status overrides schedule (no resume) | Simplest mental model for the user — activating a manual status is a deliberate action that ends any automated behaviour for that window |
