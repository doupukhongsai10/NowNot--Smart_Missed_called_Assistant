# NowNot — Project Overview

## Overview

NowNot is a Smart Missed Call Assistant that allows users to set a temporary availability status with a custom time window and auto-reply message. When an incoming call is missed while a status is active, the app automatically sends a context-aware SMS to the caller explaining why the call was not answered and when the user will be available — for example, *"I'm sleeping and will be available after 5:00 PM."* The status automatically deactivates when the time window expires, requiring no manual intervention from the user.

---

## Goals

1. Reduce the uncertainty that follows a missed call by informing the caller of the reason and expected availability.
2. Allow users to set a status once and let the app handle all communication automatically until the status expires.
3. Support both one-time manual statuses and recurring scheduled statuses.
4. Deliver different auto-reply messages depending on whether the caller is Family, Friends, Work, or an Unknown contact.
5. Build a fully functional, beautiful web prototype as a learning project in HTML, CSS, and JavaScript.
6. Lay a clean logical foundation that can later be ported to a native Android app using Flutter.

---

## Core User Flow (Step by Step)

1. User opens NowNot.
2. User selects or creates a status (e.g., 😴 Sleeping, 💼 In a Meeting, 📚 Studying).
3. User sets a start time and an end time for the status (e.g., 2:00 PM – 5:00 PM).
4. User writes a custom auto-reply message for each contact group (Family, Friends, Work, Unknown).
5. User activates the status. A minimal notification appears confirming the status is running.
6. A call comes in during the active time window.
7. The user does not answer the call (missed call).
8. The app immediately identifies which contact group the caller belongs to.
9. The app sends the group-specific auto-reply SMS to the caller instantly.
10. The missed call and the reply sent are logged inside the app.
11. The app optionally reminds the user to call back later.
12. At 5:00 PM, the status automatically deactivates with no action needed from the user.

---

## Features

### Status Management
- Create a status with a name, emoji, start time, and end time.
- Activate a status manually (one tap).
- Schedule a recurring status (e.g., every weekday 10:00 AM – 11:00 AM).
- Only one status can be active at a time.
- Manual status always overrides a scheduled status.
- When a manual status expires, the scheduled window for that time does not resume — it is skipped.
- Status automatically deactivates when the end time is reached.

### Auto-Reply Messaging
- Four contact groups: Family, Friends, Work, Unknown.
- One custom auto-reply message per group per status.
- The correct message is selected automatically based on the caller's group.
- Auto-reply is only sent when a status is active — never when no status is set.
- Reply is sent the instant a missed call is detected.

### Missed Call Log
- Every missed call is recorded with: caller name/number, time of call, contact group, and message sent.
- Log is viewable inside the app.
- Log persists across app sessions using LocalStorage (web) or SQLite (future Android app).

### Callback Reminders
- After a missed call is logged, the user can enable a callback reminder.
- The reminder fires as an in-app notification after a user-defined delay (e.g., 30 minutes).

### Background Operation (Android — Future Phase)
- A foreground service keeps the app running reliably in the background.
- A minimal status bar notification is shown while a status is active (e.g., "😴 Sleeping until 5:00 PM — Tap to deactivate").
- This notification is the only visible sign of the app running.

---

## In Scope

- Web prototype built with HTML, CSS, and Vanilla JavaScript.
- Status creation, manual activation, and scheduling.
- Auto-expire logic using JavaScript timers.
- Contact group management (Family, Friends, Work, Unknown) with one message per group.
- Interactive phone call simulator on the web app to demonstrate the auto-reply flow visually.
- Missed call log stored in LocalStorage.
- Callback reminder system (in-app).
- Manual override behavior and schedule conflict resolution.
- Responsive, modern UI with dark mode and glassmorphism design.

---

## Out of Scope

- Detecting real phone calls or sending real SMS messages (requires native Android app — Phase 2).
- Per-contact message overrides (e.g., a unique message just for Mom).
- VIP bypass list (contacts who always ring through regardless of status).
- AI-generated auto-reply messages.
- Calendar integration (e.g., auto-create status from Google Calendar events).
- "Notify me when available" feature for callers.
- iOS support (Apple's sandboxing blocks third-party call/SMS access entirely).
- Cloud sync or multi-device support.
- User authentication or accounts.
- Push notifications (web prototype uses in-app alerts only).

---

## Success Criteria

The project is considered **done** when the following are true:

1. **Status Lifecycle Works**: A user can create a status with a time window, activate it, and it automatically deactivates at the end time with no user action.
2. **Scheduler Works**: A user can set a recurring schedule and the app activates the correct status at the correct time.
3. **Manual Override Works**: Activating a manual status while a schedule is running switches to the manual status immediately. When the manual status expires, the app returns to idle (not back to the schedule).
4. **Auto-Reply Logic Works**: Simulating a missed call during an active status triggers the correct group-specific message and displays it in the simulator.
5. **Log is Accurate**: Every simulated missed call appears in the log with the caller, time, group, and message sent.
6. **Persistence Works**: Refreshing the browser does not lose the user's statuses, schedules, messages, or logs.
7. **Callback Reminder Works**: The user can request a callback reminder after a missed call, and it fires at the correct time.
8. **UI is Complete**: The interface is fully responsive, uses dark mode, and feels polished enough to present as a portfolio project.
