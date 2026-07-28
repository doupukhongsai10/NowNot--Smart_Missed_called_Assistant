# NowNot — Project Overview

## Overview

NowNot is a Smart Missed Call Assistant that allows users to set a temporary availability status with a custom time window and auto-reply message. When an incoming call is missed while a status is active, the app automatically sends a context-aware SMS to the caller explaining why the call was not answered and when the user will be available — for example, *"I'm sleeping and will be available after 5:00 PM."* The status automatically deactivates when the time window expires, requiring no manual intervention from the user.

---

## Goals

1. Reduce the uncertainty that follows a missed call by informing the caller of the reason and expected availability.
2. Allow users to set a status once and let the app handle all communication automatically until the status expires.
3. Support both one-time manual statuses and recurring scheduled statuses.
4. Deliver different auto-reply messages depending on whether the caller is Family, Friends & Relatives, Work, or an Unknown contact.
5. Provide user authentication with Log-In and Sign-Up using phone number and password credentials.
6. Manage saved contact phone numbers in a dedicated Contacts section and synchronize phone number collections to Cloudinary cloud storage.
7. Build a fully functional, beautiful web prototype as a learning project in HTML, CSS, and JavaScript.
8. Lay a clean logical foundation that can later be ported to a native Android app using Flutter.

---

## Core User Flow (Step by Step)

1. User opens NowNot and logs in or signs up with Phone Number and Password.
2. User manages saved contacts and phone numbers in the Contacts page (Family, Friends & Relatives, Work, Unknown).
3. User selects or creates a status (e.g., 😴 Sleeping, 💼 In a Meeting, 📚 Studying).
4. User sets a start time and an end time for the status (e.g., 2:00 PM – 5:00 PM).
5. User writes a custom auto-reply message for each contact group (Family, Friends & Relatives, Work, Unknown).
6. User activates the status. A minimal notification appears confirming the status is running.
7. A call comes in during the active time window.
8. The user does not answer the call (missed call).
9. The app immediately identifies which contact group the caller belongs to using the saved Contacts repository.
10. The app sends the group-specific auto-reply SMS to the caller instantly.
11. The missed call and the reply sent are logged inside the app.
12. Phone number collections and metadata are synced to Cloudinary cloud storage.
13. At 5:00 PM, the status automatically deactivates with no action needed from the user.

---

## Features

### Authentication & Account System
- Log-In and Sign-Up flows using Phone Number and Password.
- Persistent user session with token handling.
- Profile information linked to the authenticated phone number.

### Contacts Management (Replaces Settings)
- Dedicated Contacts page to store, save, and display phone numbers.
- Categorize numbers into groups: Family, Friends & Relatives, Work, Unknown.
- Add new contacts, edit existing names/numbers, and search by contact name or phone number.

### Cloudinary Storage Integration
- Phone number collections and contact avatars synced to Cloudinary cloud storage endpoints.
- Secure data backup for phone number records.

### Status Management
- Create a status with a name, emoji, start time, and end time.
- Activate a status manually (one tap).
- Schedule a recurring status (e.g., every weekday 10:00 AM – 11:00 AM).
- Only one status can be active at a time.
- Manual status always overrides a scheduled status.
- When a manual status expires, the scheduled window for that time does not resume — it is skipped.
- Status automatically deactivates when the end time is reached.

### Auto-Reply Messaging
- Four contact groups: Family, Friends & Relatives, Work, Unknown.
- One custom auto-reply message per group per status.
- The correct message is selected automatically based on the caller's group in Contacts.
- Auto-reply is only sent when a status is active — never when no status is set.
- Reply is sent the instant a missed call is detected.

### Missed Call Log
- Every missed call is recorded with: caller name/number, time of call, contact group, and message sent.
- Log is viewable inside the app.
- Log persists across app sessions using LocalStorage and Cloudinary cloud storage.

---

## In Scope

- User authentication with Phone Number and Password (Log-In and Sign-Up).
- Contacts page for saving, searching, and managing phone numbers.
- Cloudinary storage integration for phone number collection data.
- Web prototype built with HTML, CSS, and JavaScript (React/Vite).
- Status creation, manual activation, and scheduling.
- Auto-expire logic using JavaScript timers.
- Contact group management (Family, Friends & Relatives, Work, Unknown).
- Interactive phone call simulator on the web app to demonstrate auto-reply flow.
- Missed call log stored locally and synced to cloud.
- Responsive, modern UI with Gradient Dark aesthetics and glassmorphism design.

---

## Out of Scope

- Detecting real native carrier phone calls without app installation (requires Android native service — Phase 2).
- Per-contact individual message overrides (group-based auto-replies are used).
- Calendar integration (auto-creating status from Google Calendar).
- iOS native call monitoring (blocked by Apple sandboxing).

---

## Success Criteria

The project is considered **done** when the following are true:

1. **Authentication Works**: Users can sign up and log in using their Phone Number and Password.
2. **Contacts Page Works**: Users can store, save, display, search, and categorize phone numbers under Family, Friends & Relatives, Work, and Unknown.
3. **Cloudinary Integration Works**: Phone number collection records are saved and retrieved from Cloudinary storage.
4. **Status Lifecycle Works**: A user can create a status with a time window, activate it, and it automatically deactivates at the end time with no user action.
5. **Scheduler Works**: A user can set a recurring schedule and the app activates the correct status at the correct time.
6. **Auto-Reply Logic Works**: Simulating a missed call during an active status triggers the correct group-specific message and displays it in the log.
7. **UI is Complete**: The interface is fully responsive, uses dark mode with glassmorphism, and features smooth navigation across Dashboard, Statuses, Messages, Log, Scheduler, Contacts, and Auth pages.
