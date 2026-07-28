---
name: Violet Void — Contacts Spec
colors:
  surface: '#12131a'
  bg-base: '#0B0D1A'
  bg-surface: '#161A35'
  primary: '#d2bbff'
  group-family: '#F472B6'
  group-friends: '#38BDF8'
  group-work: '#FBBF24'
  group-unknown: '#94A3B8'
---

# Contacts Specification

The **Contacts** page replaces Settings as the 5th main navigation section of NowNot. It allows users to store, save, manage, and display phone numbers, categorizing them into four primary contact groups: **Family**, **Friends & Relatives**, **Work**, and **Unknown**.

---

## 1. Features & Layout

### Header & Actions
- **Title**: `Contacts`
- **Subtitle**: `Manage and categorize saved phone numbers for auto-reply routing.`
- **CTA Button**: `+ Add Contact` (Opens bottom sheet modal to create a new contact).

### Search & Filter Bar
- **Search Input**: Live filtering by contact name or phone number.
- **Group Filter Tabs**: `All`, `Family`, `Friends & Relatives`, `Work`, `Unknown`.

### Contact List Cards
Each contact card includes:
- **Avatar Circle**: Initials or Cloudinary-stored avatar image.
- **Contact Name**: Displayed in `Outfit` bold typography.
- **Phone Number**: Monospace font (`JetBrains Mono`), formatted (e.g., `+1 (555) 012-3456`).
- **Group Badge**: Pill-shaped badge with group color accent:
  - 🩷 `Family` (`#F472B6`)
  - 👥 `Friends & Relatives` (`#38BDF8`)
  - 🧳 `Work` (`#FBBF24`)
  - 👤 `Unknown` (`#94A3B8`)
- **Actions**: Quick edit and delete buttons.

### Cloudinary Sync Status
- A subtle header/footer badge indicating Cloudinary storage status:
  `☁️ Cloudinary Storage: Synced (X Contacts)`

---

## 2. Add / Edit Contact Modal

Bottom sheet modal for creating or editing contacts:
- **Full Name**: Text input
- **Phone Number**: Monospace text input with country code support
- **Group Selector**: Choice pills for `Family`, `Friends & Relatives`, `Work`, `Unknown`
- **Save Contact**: Stores in `contactsStore` and synchronizes with Cloudinary storage service.
