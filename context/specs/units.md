# Unit U1: Scaffold + Design System

## Goal

Initialize the Vite + React project, install and configure Tailwind CSS v3, define every CSS custom property from `ui-context.md` in `src/styles/index.css`, and build the `App.jsx` navigation shell with six stub pages — so the app loads in the browser with the complete gradient-dark aesthetic, correct fonts, and working page switching before a single feature is implemented.

---

## Design

### Page Layout

The app uses a **two-zone layout** on all screen sizes:

```
┌──────────────────────────────┐
│         Page Content         │  flex-1, overflow-y-auto, pb-24 (clear of nav)
│                              │
│                              │
├──────────────────────────────┤
│        Bottom Nav Bar        │  fixed, bottom-0, full-width, h-16
└──────────────────────────────┘
```

- On mobile (< 640px): bottom nav bar, full-width content.
- On desktop (≥ 640px): bottom nav bar stays (no sidebar in U1). Sidebar is a U8 polish item.
- Max content width: `480px` centered. The gradient background bleeds full-width behind it.

### Background

The `<body>` element gets `background: var(--gradient-page)` and `min-height: 100dvh`. This is set in `index.css` on the `body` selector — not as a Tailwind class.

### Bottom Nav Bar

- Background: `var(--color-bg-elevated)` with `border-top: 1px solid var(--color-border-subtle)`.
- Backdrop blur: `backdrop-filter: blur(20px)`.
- Five nav items: **Dashboard**, **Statuses**, **Messages**, **Log**, **Scheduler**.  
  Settings is accessible via a gear icon in the page header of each page — not a nav tab.
- Active tab indicator: icon and label use `var(--color-primary-500)`. Inactive: `var(--color-text-tertiary)`.
- Active tab has a small violet pill above the icon: `4px × 24px`, `background: var(--gradient-primary)`, `border-radius: var(--radius-full)`.
- Nav transitions: `color` and `opacity` change over `var(--duration-base)` with `var(--ease-out)`.

### Typography

- All `<h1>` elements use `font-family: var(--font-family-display)`.
- All body text uses `font-family: var(--font-family-sans)`.
- Applied globally in `index.css` via element selectors — not repeated per-component.

### Icons

Use **Lucide React** (`lucide-react`) for all nav and UI icons. It is tree-shakeable, has zero runtime overhead, and integrates cleanly with JSX. Import individual icons only — never use a barrel import.

```jsx
import { LayoutDashboard, Layers, MessageSquare, PhoneMissed, CalendarClock } from 'lucide-react';
```

---

## Implementation

### Step 1 — Project Scaffold

Run in the project root (`c:\Users\Doupu Khongsai\OneDrive\Projects\NowNot`):

```bash
npm create vite@latest ./ -- --template react
npm install
npm install -D tailwindcss@3 postcss autoprefixer
npx tailwindcss init -p
npm install lucide-react
```

After scaffolding, delete the following Vite boilerplate files (they are not part of this project):
- `src/App.css`
- `src/assets/react.svg`
- `public/vite.svg`

### Step 2 — `tailwind.config.js`

Replace the generated file entirely:

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {},
  },
  plugins: [],
};
```

No custom theme extensions yet — all design tokens live in CSS custom properties, not in the Tailwind theme. This keeps the token system in one place (`index.css`) and avoids duplication.

### Step 3 — `index.html`

Replace the generated `index.html` with the following. Do not change the Vite script tag.

```html
<!doctype html>
<html lang="en" class="dark">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="NowNot — Smart Missed Call Assistant. Set your status once and let the app handle every missed call automatically." />
    <title>NowNot — Smart Missed Call Assistant</title>

    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;700&family=Outfit:wght@500;600;700&display=swap"
      rel="stylesheet"
    />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

### Step 4 — `src/styles/index.css`

This file defines every token from `ui-context.md` as CSS custom properties, the Tailwind directives, the glass-card utility class, and global element resets.

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* ─── Design Tokens ─────────────────────────────────────── */
:root {
  /* Backgrounds */
  --color-bg-void:         #07080F;
  --color-bg-base:         #0B0D1A;
  --color-bg-elevated:     #10132A;
  --color-bg-surface:      #161A35;
  --color-bg-overlay:      #1E2240;
  --color-bg-glass:        rgba(255,255,255,0.04);
  --color-bg-glass-border: rgba(255,255,255,0.08);

  /* Gradients */
  --gradient-page:         linear-gradient(135deg, #07080F 0%, #0D1030 45%, #12072A 100%);
  --gradient-surface:      linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.01) 100%);
  --gradient-primary:      linear-gradient(135deg, #7C3AED 0%, #4F46E5 100%);
  --gradient-scheduled:    linear-gradient(135deg, #D97706 0%, #B45309 100%);
  --gradient-glow-primary: radial-gradient(ellipse 60% 40% at 50% 0%, rgba(124,58,237,0.18) 0%, transparent 70%);
  --gradient-glow-amber:   radial-gradient(ellipse 60% 40% at 50% 0%, rgba(217,119,6,0.15) 0%, transparent 70%);

  /* Primary — Violet */
  --color-primary-300:  #C4B5FD;
  --color-primary-400:  #A78BFA;
  --color-primary-500:  #8B5CF6;
  --color-primary-600:  #7C3AED;
  --color-primary-700:  #6D28D9;
  --color-primary-glow: rgba(139,92,246,0.22);

  /* Accent — Electric Blue */
  --color-accent-400:  #60A5FA;
  --color-accent-500:  #3B82F6;
  --color-accent-glow: rgba(59,130,246,0.18);

  /* Status semantic */
  --color-status-active:    #8B5CF6;
  --color-status-scheduled: #F59E0B;
  --color-status-idle:      #475569;
  --color-status-expiring:  #EF4444;

  /* Semantic UI */
  --color-success-400: #34D399;
  --color-success-600: #059669;
  --color-warning-400: #FBBF24;
  --color-warning-600: #D97706;
  --color-danger-400:  #F87171;
  --color-danger-600:  #DC2626;
  --color-info-400:    #38BDF8;

  /* Contact groups */
  --color-group-family:  #F472B6;
  --color-group-friends: #38BDF8;
  --color-group-work:    #FBBF24;
  --color-group-unknown: #94A3B8;

  /* Text */
  --color-text-primary:   #F1F5F9;
  --color-text-secondary: #94A3B8;
  --color-text-tertiary:  #64748B;
  --color-text-inverse:   #0B0D1A;
  --color-text-link:      #60A5FA;

  /* Borders */
  --color-border-subtle:  rgba(255,255,255,0.06);
  --color-border-default: rgba(255,255,255,0.10);
  --color-border-strong:  rgba(255,255,255,0.18);
  --color-border-primary: rgba(139,92,246,0.40);

  /* Typography families */
  --font-family-sans:    'Inter', system-ui, sans-serif;
  --font-family-display: 'Outfit', system-ui, sans-serif;
  --font-family-mono:    'JetBrains Mono', ui-monospace, monospace;

  /* Border radius */
  --radius-xs:   4px;
  --radius-sm:   8px;
  --radius-md:   12px;
  --radius-lg:   16px;
  --radius-xl:   20px;
  --radius-2xl:  28px;
  --radius-full: 9999px;

  /* Spacing */
  --space-1:  4px;
  --space-2:  8px;
  --space-3:  12px;
  --space-4:  16px;
  --space-5:  20px;
  --space-6:  24px;
  --space-8:  32px;
  --space-10: 40px;
  --space-12: 48px;

  /* Shadows */
  --shadow-sm:          0 1px 3px rgba(0,0,0,0.4);
  --shadow-md:          0 4px 16px rgba(0,0,0,0.5);
  --shadow-lg:          0 8px 32px rgba(0,0,0,0.6);
  --shadow-glow-primary: 0 0 24px rgba(139,92,246,0.28), 0 0 8px rgba(139,92,246,0.15);
  --shadow-glow-amber:   0 0 20px rgba(245,158,11,0.22), 0 0 6px rgba(245,158,11,0.12);
  --shadow-glow-danger:  0 0 16px rgba(239,68,68,0.30);

  /* Animations */
  --duration-fast:  120ms;
  --duration-base:  200ms;
  --duration-slow:  350ms;
  --duration-xslow: 600ms;
  --ease-out:       cubic-bezier(0.0, 0, 0.2, 1);
  --ease-in-out:    cubic-bezier(0.4, 0, 0.2, 1);
  --ease-spring:    cubic-bezier(0.34, 1.56, 0.64, 1);
}

/* ─── Global Resets & Base ───────────────────────────────── */
*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  -webkit-text-size-adjust: 100%;
}

body {
  font-family: var(--font-family-sans);
  background: var(--gradient-page);
  background-attachment: fixed;
  color: var(--color-text-primary);
  min-height: 100dvh;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

h1, h2, h3 {
  font-family: var(--font-family-display);
}

/* ─── Utility Classes ────────────────────────────────────── */
@layer components {
  .glass-card {
    background: var(--gradient-surface);
    border: 1px solid var(--color-bg-glass-border);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    box-shadow: var(--shadow-md);
    border-radius: var(--radius-xl);
  }
}
```

### Step 5 — `src/main.jsx`

```jsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles/index.css';
import App from './App';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

### Step 6 — Page Stubs (`src/pages/`)

Create six files. Each is identical in structure — only the title changes. Example for `Dashboard.jsx`; repeat for `StatusManager.jsx`, `Scheduler.jsx`, `Messages.jsx`, `CallLog.jsx`, `Settings.jsx`.

```jsx
// Dashboard.jsx
export default function Dashboard() {
  return (
    <div className="px-4 pt-10">
      <h1
        className="text-3xl font-semibold"
        style={{ fontFamily: 'var(--font-family-display)', color: 'var(--color-text-primary)' }}
      >
        Dashboard
      </h1>
      <p className="mt-2 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
        Unit U4 will build this page.
      </p>
    </div>
  );
}
```

Page stub filenames and titles:

| File | Title text |
|---|---|
| `Dashboard.jsx` | Dashboard |
| `StatusManager.jsx` | Statuses |
| `Scheduler.jsx` | Scheduler |
| `Messages.jsx` | Messages |
| `CallLog.jsx` | Call Log |
| `Settings.jsx` | Settings |

### Step 7 — `src/components/BottomNav.jsx`

```jsx
import { LayoutDashboard, Layers, MessageSquare, PhoneMissed, CalendarClock } from 'lucide-react';

const NAV_ITEMS = [
  { id: 'dashboard',      label: 'Home',      Icon: LayoutDashboard },
  { id: 'status-manager', label: 'Statuses',  Icon: Layers },
  { id: 'messages',       label: 'Messages',  Icon: MessageSquare },
  { id: 'call-log',       label: 'Log',       Icon: PhoneMissed },
  { id: 'scheduler',      label: 'Scheduler', Icon: CalendarClock },
];

export default function BottomNav({ activePage, onNavigate, className = '' }) {
  return (
    <nav
      className={`fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around h-16 ${className}`}
      style={{
        background: 'var(--color-bg-elevated)',
        borderTop: '1px solid var(--color-border-subtle)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
      }}
    >
      {NAV_ITEMS.map(({ id, label, Icon }) => {
        const isActive = activePage === id;
        return (
          <button
            key={id}
            id={`nav-${id}`}
            onClick={() => onNavigate(id)}
            className="relative flex flex-col items-center gap-1 px-3 py-2 rounded-md"
            style={{
              color: isActive ? 'var(--color-primary-500)' : 'var(--color-text-tertiary)',
              transition: `color var(--duration-base) var(--ease-out)`,
              background: 'none',
              border: 'none',
              cursor: 'pointer',
            }}
            aria-label={label}
            aria-current={isActive ? 'page' : undefined}
          >
            {/* Active pill indicator */}
            {isActive && (
              <span
                className="absolute -top-0.5"
                style={{
                  width: 24,
                  height: 4,
                  background: 'var(--gradient-primary)',
                  borderRadius: 'var(--radius-full)',
                }}
              />
            )}
            <Icon size={20} strokeWidth={isActive ? 2.5 : 1.75} />
            <span style={{ fontSize: '10px', fontWeight: isActive ? 600 : 400, lineHeight: 1 }}>
              {label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
```

### Step 8 — `src/App.jsx`

```jsx
import { useState } from 'react';

import BottomNav from './components/BottomNav';
import Dashboard from './pages/Dashboard';
import StatusManager from './pages/StatusManager';
import Scheduler from './pages/Scheduler';
import Messages from './pages/Messages';
import CallLog from './pages/CallLog';
import Settings from './pages/Settings';

const PAGES = {
  'dashboard':      Dashboard,
  'status-manager': StatusManager,
  'scheduler':      Scheduler,
  'messages':       Messages,
  'call-log':       CallLog,
  'settings':       Settings,
};

export default function App() {
  const [activePage, setActivePage] = useState('dashboard');

  const PageComponent = PAGES[activePage] ?? Dashboard;

  return (
    <div className="relative flex flex-col min-h-dvh mx-auto" style={{ maxWidth: 480 }}>
      {/* Page content — padded at bottom to clear fixed nav */}
      <main className="flex-1 overflow-y-auto pb-24">
        <PageComponent />
      </main>

      {/* Bottom navigation — Settings is excluded from nav; reached via page headers */}
      <BottomNav activePage={activePage} onNavigate={setActivePage} />
    </div>
  );
}
```

### Step 9 — Clean Up Vite Boilerplate

After scaffolding, ensure the following are gone:
- `src/App.css` — deleted
- `src/assets/react.svg` — deleted  
- `public/vite.svg` — deleted
- Any `import './App.css'` line that Vite generated — removed

---

## Dependencies

| Package | Version | Reason |
|---|---|---|
| `tailwindcss` | `^3.4` | Utility-first styling; v3 required for `class`-based dark mode |
| `postcss` | latest | Tailwind peer dependency |
| `autoprefixer` | latest | Tailwind peer dependency |
| `lucide-react` | latest | Icon set for nav and future UI icons; tree-shakeable |

Install command:
```bash
npm install -D tailwindcss@3 postcss autoprefixer && npm install lucide-react
```

---

## Verify When Done

### Visual
- [ ] Opening `http://localhost:5173` shows the deep indigo-to-purple gradient background filling the full viewport
- [ ] Outfit font renders on the stub page headings (not system fallback)
- [ ] Inter font renders on body text
- [ ] Bottom nav bar is fixed to the bottom, has five items, and does not overlap page content
- [ ] Active nav item shows the violet pill indicator above its icon and colored icon + label
- [ ] Tapping each nav item switches to the correct stub page
- [ ] Settings page is reachable by setting `activePage` to `'settings'` in state (will be wired to a header icon in U8)

### Correctness
- [ ] `src/styles/index.css` contains every token from `ui-context.md` — no token is missing or misspelled
- [ ] No hex color is hardcoded in any `.jsx` file — all colors reference `var(--…)` tokens
- [ ] No `localStorage` call exists anywhere in this unit
- [ ] `context/` directory has no `import` pointing to it from any `src/` file (INV-6)
- [ ] `console.log` calls are absent

### Code Standards
- [ ] All page files use PascalCase `.jsx` extension
- [ ] `BottomNav.jsx` accepts and spreads a `className` prop
- [ ] Import order in `App.jsx` follows the order defined in `code-standards.md §2`

### Build
- [ ] `npm run dev` starts without errors
- [ ] `npm run build` completes without errors or warnings
- [ ] No TypeScript errors (project is JS; ensure no accidental `.ts` files were created by scaffold)

### Responsive
- [ ] At 375px width (iPhone SE): content is readable, nav is usable, no horizontal scroll
- [ ] At 768px width (tablet): layout centers correctly at `max-width: 480px`, gradient fills background
