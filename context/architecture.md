# NowNot — Architecture

> Phase 1: Web Prototype  
> Stack: HTML · Tailwind CSS · React · JavaScript · Cloudinary Storage (Auth, Contacts, Statuses)

---

## 1. Stack Table

| Layer | Technology | Role |
|---|---|---|
| **Structure** | HTML5 | Semantic page skeleton; accessibility anchors |
| **Styling** | Tailwind CSS | Utility-first design system; dark mode & glassmorphism |
| **UI Framework** | React (Vite) | Component tree, local state, event handling |
| **Logic** | Vanilla JavaScript (inside React) | Status engine, scheduler, timer management, group-routing |
| **Authentication** | `authStore.js` | Log-In and Sign-Up session management (Phone Number + Password) |
| **Cloud Storage** | Cloudinary API / Cloud Sync | Sync and backup of phone number collection data and media assets |
| **Persistence** | `localStorage` + Cloudinary | User sessions, contacts, statuses, schedules, messages, missed call log |
| **Timers** | `setInterval` / `setTimeout` (browser) | Auto-expire countdowns, scheduler polling, callback reminders |
| **Notifications** | In-app React state (toast / banner) | Status confirmation, callback reminder alerts |
| **Call Simulator** | React component (UI only) | Simulates an incoming call to demonstrate auto-reply flow |
| **Build Tool** | Vite | Dev server, HMR, production bundle |

---

## 2. System Boundaries — Folder Responsibilities

```
NowNot/
├── context/                  # Project documentation only — never imported by app code
│   ├── project-overview.md
│   ├── architecture.md
│   ├── Auth.md
│   └── Contacts.md
│
├── src/
│   ├── main.jsx              # React root mount, global providers
│   ├── App.jsx               # Top-level router / page switcher (Auth + Main Navigation)
│   │
│   ├── engine/               # Pure logic — no JSX, no UI concerns
│   │   ├── statusEngine.js   # Activate, deactivate, expire, override logic
│   │   ├── scheduler.js      # Recurring schedule evaluation and tick loop
│   │   ├── groupRouter.js    # Maps a caller's contact group → correct reply message
│   │   └── callLogger.js     # Appends a missed call record to the log
│   │
│   ├── store/                # Storage & Data Access — single source of truth
│   │   ├── authStore.js      # Auth session & credential management (Phone + Password)
│   │   ├── contactsStore.js  # CRUD for saved phone numbers & contact groups (Family, Friends & Relatives, Work, Unknown)
│   │   ├── statusStore.js    # CRUD for status definitions
│   │   ├── scheduleStore.js  # CRUD for recurring schedules
│   │   ├── messageStore.js   # CRUD for group-specific reply messages
│   │   └── logStore.js       # Append-only log of missed calls
│   │
│   ├── services/             # External Cloud Services
│   │   └── cloudinaryService.js # Cloudinary storage service for phone number collections
│   │
│   ├── hooks/                # React hooks that bridge engine ↔ components
│   │   ├── useAuth.js
│   │   ├── useActiveStatus.js
│   │   ├── useScheduler.js
│   │   └── useCallLog.js
│   │
│   ├── components/           # Reusable UI primitives (no business logic)
│   │   ├── Header.jsx
│   │   ├── BottomNav.jsx
│   │   ├── StatusCard.jsx
│   │   ├── CreateStatusModal.jsx
│   │   ├── Toast.jsx
│   │   └── CallSimulator.jsx
│   │
│   ├── pages/                # Full-screen views rendered by App.jsx
│   │   ├── Auth.jsx          # Log-In and Sign-Up pages (Phone + Password)
│   │   ├── Dashboard.jsx     # Active status + countdown + quick actions
│   │   ├── StatusManager.jsx # Create / edit / delete statuses
│   │   ├── Scheduler.jsx     # Recurring schedule setup
│   │   ├── Messages.jsx      # Per-group reply message editor
│   │   ├── CallLog.jsx       # Missed call history
│   │   └── Contacts.jsx      # Saved phone numbers management (replaces Settings)
│   │
│   └── styles/
│       └── index.css         # Tailwind directives + custom CSS variables
│
├── architecture.md           # Mirror documentation in root
├── index.html
├── vite.config.js
└── package.json
```

---

## 3. Storage Model

NowNot uses local persistence coupled with Cloudinary cloud storage endpoints for phone number data backup.

| What | Where | Format | Key / Service |
|---|---|---|---|
| Auth Session (user identity, token) | `localStorage` | JSON object | `nn_auth_session` |
| User credentials store (demo/cloud) | `localStorage` + Cloud | JSON array | `nn_users` |
| Saved Phone Numbers (Contacts) | `localStorage` + Cloudinary | JSON array | `nn_contacts` / Cloudinary API |
| Status definitions (name, emoji, window) | `localStorage` | JSON array | `nn_statuses` |
| Currently active status + expiry | `localStorage` | JSON object | `nn_active_status` |
| Recurring schedules | `localStorage` | JSON array | `nn_schedules` |
| Group reply messages (per group) | `localStorage` | JSON object map | `nn_messages_global` |
| Missed call log | `localStorage` | JSON array (append-only) | `nn_call_log` |

---

## 4. Auth and Access Model

**User Authentication via Phone Number and Password**

| Concern | Specification |
|---|---|
| Identity | Validated Phone Number (e.g. `+1 555-012-3456`) + Secret Password |
| Sign-Up | Users register with Phone Number, Full Name, and Password |
| Log-In | Users authenticate using registered Phone Number and Password |
| Persistence | Session saved to `nn_auth_session` with automatic auto-login on app launch |
| Sign-Out | Clears active authentication session and returns user to Auth view |
| Contacts Protection | Saved phone numbers and auto-replies are bound to the authenticated account |

---

## 5. Invariants

1. **INV-1 — Only one status can be active at a time**: Before activating any status, the engine must deactivate the currently active status.
2. **INV-2 — Manual status always overrides scheduled status**: Expiry of manual status returns app to idle.
3. **INV-3 — Auto-reply messages sent only when status is active**: Caller group lookup uses the saved Contacts database.
4. **INV-4 — Storage isolation through `store/` and `services/`**: All data operations pass through store abstractions.
5. **INV-5 — Missed call log is append-only**: Permanent audit record of calls and auto-replies.
6. **INV-6 — Contacts Page replaces Settings**: Navigation tab 5 renders Contacts view for managing saved phone numbers under Family, Friends & Relatives, Work, and Unknown.
7. **INV-7 — Cloudinary Phone Number Collection Sync**: Saved contacts and phone numbers sync with Cloudinary storage endpoints.
