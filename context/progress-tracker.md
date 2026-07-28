# NowNot — Progress Tracker

> Update this file at the end of every implementation session, before closing the editor.

---

## Current Phase

- **Phase 1 — Web Application** (HTML · Tailwind CSS · React · Vite · localStorage · Cloudinary Storage)

---

## Current Goal

- Feature updates complete: **Authentication (Log-In & Sign-Up)**, **Contacts Management (Saved Phone Numbers)**, and **Cloudinary Storage Integration**.

---

## Completed Documentation & Specs

- [x] `context/project-overview.md` — Product spec, goals, user flow, Auth, Contacts, Cloudinary, and success criteria
- [x] `context/architecture.md` — Stack table, folder boundaries, storage model, Auth model, Cloudinary sync, and invariants
- [x] `context/Auth.md` — Log-In & Sign-Up specification with Phone Number and Password credentials
- [x] `context/Contacts.md` — Contacts page spec for saving, displaying, and categorizing phone numbers (replaces Settings)
- [x] `context/ui-context.md` — Complete color system, typography (Outfit + Inter + JetBrains Mono), border radius, glassmorphism
- [x] `context/code-standards.md` — File naming, import order, layer rules, Tailwind usage, data conventions

---

## Build Units

| # | Unit Name | Visible Result | Deps | Status |
|---|---|---|---|---|
| U1 | Scaffold + Design System | App loads in browser: gradient-dark background, fonts, bottom nav, all CSS tokens active | None | ✅ Completed |
| U2 | Status Manager | Create, view, edit, delete statuses (name, emoji, time window); data persists on refresh | U1 | ✅ Completed |
| U3 | Group Reply Messages | Write and save auto-replies per contact group (Family, Friends & Relatives, Work, Unknown) | U2 | ✅ Completed |
| U4 | Status Activation + Dashboard | Activate status, live countdown timer, 1-tap duration adjustment, manual deactivation | U2, U3 | ✅ Completed |
| U5 | Call Simulator + Missed Call Log | Simulate call; group message auto-selected; call logged with caller/time/group/message | U3, U4 | ✅ Completed |
| U6 | Recurring Scheduler | Create day-of-week schedules; 60s background tick loop auto-activates matching schedule | U2, U4 | ✅ Completed |
| U7 | Messages Page | Full per-group reply message management with live active status sync | U3, U4 | ✅ Completed |
| U8 | Log Page | Categorized missed call log view with tab filtering and expandable entries | U5 | ✅ Completed |
| U9 | Authentication (Log-In & Sign-Up) | Log-In and Sign-Up screens with Phone Number & Password authentication | U1 | 🔄 Planned |
| U10 | Contacts Page (Replaces Settings) | View, add, edit, search saved phone numbers categorized under Family, Friends & Relatives, Work, Unknown | U1, U9 | 🔄 Planned |
| U11 | Cloudinary Storage Integration | Sync phone number collections and contact avatars to Cloudinary cloud storage | U10 | 🔄 Planned |

---

## Architecture Decisions

| Decision | Rationale | Recorded In |
|---|---|---|
| Auth via Phone + Password | Secures account identity and links contact phone numbers to authenticated user | `Auth.md` |
| Contacts Page replaces Settings | Managing saved phone numbers & groups is core to automated reply routing | `Contacts.md` |
| Cloudinary Storage Integration | Backup phone number collections and contact assets in cloud storage | `architecture.md` |
| Group options: Family, Friends & Relatives, Work, Unknown | Clear, intuitive group classification for auto-reply routing | `project-overview.md` |
| `localStorage` + Cloud Sync | Immediate offline UI response with cloud backup | `architecture.md §3` |
| Log-In & Sign-Up full-screen views | Clean authentication flow prior to accessing dashboard and status controls | `Auth.md` |
