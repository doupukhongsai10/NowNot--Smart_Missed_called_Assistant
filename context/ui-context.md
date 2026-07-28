# NowNot — UI Design Tokens

> Aesthetic: **Gradient Dark** — deep indigo-to-void backgrounds, violet-electric primary, glass surfaces, soft glow effects.  
> All tokens are defined as CSS custom properties. Tailwind theme extensions mirror every token.

---

## 1. Color Palette — Semantic Token Reference

### 1a. Background Scale

| Token | Hex | Usage |
|---|---|---|
| `--color-bg-void` | `#07080F` | Page root; the darkest layer behind everything |
| `--color-bg-base` | `#0B0D1A` | Main app background; what the gradient sits on |
| `--color-bg-elevated` | `#10132A` | Cards, panels sitting above the base |
| `--color-bg-surface` | `#161A35` | Input fields, secondary cards, drawer backgrounds |
| `--color-bg-overlay` | `#1E2240` | Modals, dropdowns, popovers |
| `--color-bg-glass` | `rgba(255,255,255,0.04)` | Glassmorphism layer tint |
| `--color-bg-glass-border` | `rgba(255,255,255,0.08)` | Glass card border |

### 1b. Gradients

| Token | Value | Usage |
|---|---|---|
| `--gradient-page` | `linear-gradient(135deg, #07080F 0%, #0D1030 45%, #12072A 100%)` | Full-page background gradient |
| `--gradient-surface` | `linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.01) 100%)` | Glass card surface fill |
| `--gradient-primary` | `linear-gradient(135deg, #7C3AED 0%, #4F46E5 100%)` | Active status badge, primary CTA buttons |
| `--gradient-scheduled` | `linear-gradient(135deg, #D97706 0%, #B45309 100%)` | Scheduled status indicator strip |
| `--gradient-glow-primary` | `radial-gradient(ellipse 60% 40% at 50% 0%, rgba(124,58,237,0.18) 0%, transparent 70%)` | Top-of-card glow for active status card |
| `--gradient-glow-amber` | `radial-gradient(ellipse 60% 40% at 50% 0%, rgba(217,119,6,0.15) 0%, transparent 70%)` | Top-of-card glow for scheduled status card |

### 1c. Primary — Violet (Active Status, Primary Actions)

| Token | Hex | Usage |
|---|---|---|
| `--color-primary-300` | `#C4B5FD` | Disabled primary text on dark |
| `--color-primary-400` | `#A78BFA` | Hover state text, secondary links |
| `--color-primary-500` | `#8B5CF6` | Icon fills, ring focus color |
| `--color-primary-600` | `#7C3AED` | Primary button background |
| `--color-primary-700` | `#6D28D9` | Primary button pressed state |
| `--color-primary-glow` | `rgba(139,92,246,0.22)` | Box-shadow glow on active elements |

### 1d. Accent — Electric Blue (Interactive, Links, Highlights)

| Token | Hex | Usage |
|---|---|---|
| `--color-accent-400` | `#60A5FA` | Hyperlinks, active nav indicator |
| `--color-accent-500` | `#3B82F6` | Secondary CTA, badge outlines |
| `--color-accent-glow` | `rgba(59,130,246,0.18)` | Focus ring shadow |

### 1e. Status Semantic Colors

| Token | Hex | Meaning |
|---|---|---|
| `--color-status-active` | `#8B5CF6` | A status is currently running |
| `--color-status-scheduled` | `#F59E0B` | A recurring schedule is armed |
| `--color-status-idle` | `#475569` | No status active |
| `--color-status-expiring` | `#EF4444` | Status expires in < 5 minutes |

### 1f. Semantic UI Colors

| Token | Hex | Usage |
|---|---|---|
| `--color-success-400` | `#34D399` | Log entry confirmed, status deactivated |
| `--color-success-600` | `#059669` | Success button, checkmarks |
| `--color-warning-400` | `#FBBF24` | Callback reminder alert |
| `--color-warning-600` | `#D97706` | Warning badge background |
| `--color-danger-400` | `#F87171` | Expiry warning, error states |
| `--color-danger-600` | `#DC2626` | Destructive action confirmation |
| `--color-info-400` | `#38BDF8` | Informational toasts |

### 1g. Contact Group Colors

Each group gets a distinct color used for avatars, log row left-borders, and message group tags.

| Group | Token | Hex | Tailwind Equivalent |
|---|---|---|---|
| Family | `--color-group-family` | `#F472B6` | `pink-400` |
| Friends | `--color-group-friends` | `#38BDF8` | `sky-400` |
| Work | `--color-group-work` | `#FBBF24` | `amber-400` |
| Unknown | `--color-group-unknown` | `#94A3B8` | `slate-400` |

### 1h. Neutral Text Scale

| Token | Hex | Usage |
|---|---|---|
| `--color-text-primary` | `#F1F5F9` | Headings, primary content |
| `--color-text-secondary` | `#94A3B8` | Body copy, labels |
| `--color-text-tertiary` | `#64748B` | Placeholders, disabled labels |
| `--color-text-inverse` | `#0B0D1A` | Text on light/colored button backgrounds |
| `--color-text-link` | `#60A5FA` | Hyperlinks |

### 1i. Border Scale

| Token | Hex | Usage |
|---|---|---|
| `--color-border-subtle` | `rgba(255,255,255,0.06)` | Card edges, dividers |
| `--color-border-default` | `rgba(255,255,255,0.10)` | Input borders at rest |
| `--color-border-strong` | `rgba(255,255,255,0.18)` | Focused input, active card |
| `--color-border-primary` | `rgba(139,92,246,0.40)` | Primary-tinted border (active status ring) |

---

## 2. Typography

| Role | Family | Weight | Size | Line Height | Token |
|---|---|---|---|---|---|
| **Display / Hero** | Outfit | 700 Bold | 2.5rem (40px) | 1.1 | `--font-display` |
| **Page Heading H1** | Outfit | 600 SemiBold | 1.875rem (30px) | 1.2 | `--font-h1` |
| **Section Heading H2** | Outfit | 600 SemiBold | 1.375rem (22px) | 1.3 | `--font-h2` |
| **Card Heading H3** | Outfit | 500 Medium | 1.125rem (18px) | 1.35 | `--font-h3` |
| **Body / Paragraph** | Inter | 400 Regular | 0.9375rem (15px) | 1.6 | `--font-body` |
| **Body Small** | Inter | 400 Regular | 0.8125rem (13px) | 1.5 | `--font-body-sm` |
| **Label / Overline** | Inter | 500 Medium | 0.75rem (12px) | 1.4 | `--font-label` |
| **Button** | Inter | 600 SemiBold | 0.875rem (14px) | 1 | `--font-btn` |
| **Countdown / Timer** | JetBrains Mono | 700 Bold | 2rem (32px) | 1 | `--font-mono-display` |
| **Timestamps / Log** | JetBrains Mono | 400 Regular | 0.75rem (12px) | 1.4 | `--font-mono-sm` |

**Google Fonts import (paste into `index.html` `<head>`):**
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;700&family=Outfit:wght@500;600;700&display=swap" rel="stylesheet">
```

**CSS base:**
```css
:root {
  --font-family-sans:  'Inter', system-ui, sans-serif;
  --font-family-display: 'Outfit', system-ui, sans-serif;
  --font-family-mono: 'JetBrains Mono', ui-monospace, monospace;
}

body {
  font-family: var(--font-family-sans);
  background: var(--gradient-page);
  color: var(--color-text-primary);
  -webkit-font-smoothing: antialiased;
}
```

---

## 3. Border Radius Scale

| Token | Value | Usage |
|---|---|---|
| `--radius-xs` | `4px` | Tags, small badges, inline chips |
| `--radius-sm` | `8px` | Buttons (compact), input fields |
| `--radius-md` | `12px` | Standard buttons, small cards |
| `--radius-lg` | `16px` | Status cards, message group panels |
| `--radius-xl` | `20px` | Main Dashboard card, modals |
| `--radius-2xl` | `28px` | Call simulator panel, bottom sheets |
| `--radius-full` | `9999px` | Pill badges, toggle switches, avatar circles |

---

## 4. Spacing Scale

| Token | Value | Usage |
|---|---|---|
| `--space-1` | `4px` | Icon gap, tight inline padding |
| `--space-2` | `8px` | Tag inner padding, small gaps |
| `--space-3` | `12px` | Input vertical padding |
| `--space-4` | `16px` | Card inner padding (compact) |
| `--space-5` | `20px` | Section gap |
| `--space-6` | `24px` | Card inner padding (standard) |
| `--space-8` | `32px` | Between sections |
| `--space-10` | `40px` | Page top padding |
| `--space-12` | `48px` | Hero spacing |

---

## 5. Elevation / Shadow Scale

| Token | Value | Usage |
|---|---|---|
| `--shadow-sm` | `0 1px 3px rgba(0,0,0,0.4)` | Subtle card lift |
| `--shadow-md` | `0 4px 16px rgba(0,0,0,0.5)` | Standard card |
| `--shadow-lg` | `0 8px 32px rgba(0,0,0,0.6)` | Modal, overlay panel |
| `--shadow-glow-primary` | `0 0 24px rgba(139,92,246,0.28), 0 0 8px rgba(139,92,246,0.15)` | Active status card outer glow |
| `--shadow-glow-amber` | `0 0 20px rgba(245,158,11,0.22), 0 0 6px rgba(245,158,11,0.12)` | Scheduled status glow |
| `--shadow-glow-danger` | `0 0 16px rgba(239,68,68,0.30)` | Expiry countdown pulse |

---

## 6. Glass Surface Recipe

Apply to any card that should use the glassmorphism aesthetic:

```css
.glass-card {
  background: var(--gradient-surface);
  border: 1px solid var(--color-bg-glass-border);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  box-shadow: var(--shadow-md);
  border-radius: var(--radius-xl);
}
```

---

## 7. Animation Tokens

| Token | Value | Usage |
|---|---|---|
| `--duration-fast` | `120ms` | Hover state color transitions |
| `--duration-base` | `200ms` | Button press, toggle, icon swap |
| `--duration-slow` | `350ms` | Card appear, modal open |
| `--duration-xslow` | `600ms` | Page transition, status activation pulse |
| `--ease-out` | `cubic-bezier(0.0, 0, 0.2, 1)` | Elements entering the screen |
| `--ease-in-out` | `cubic-bezier(0.4, 0, 0.2, 1)` | Repositioning animations |
| `--ease-spring` | `cubic-bezier(0.34, 1.56, 0.64, 1)` | Playful spring for badge pop-in |
