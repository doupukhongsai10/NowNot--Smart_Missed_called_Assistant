---
name: Violet Void
colors:
  surface: '#12131a'
  surface-dim: '#12131a'
  surface-bright: '#383941'
  surface-container-lowest: '#0d0e15'
  surface-container-low: '#1a1b23'
  surface-container: '#1e1f27'
  surface-container-high: '#292932'
  surface-container-highest: '#33343d'
  on-surface: '#e3e1ec'
  on-surface-variant: '#ccc3d8'
  inverse-surface: '#e3e1ec'
  inverse-on-surface: '#2f3038'
  outline: '#958da1'
  outline-variant: '#4a4455'
  surface-tint: '#d2bbff'
  primary: '#d2bbff'
  on-primary: '#3f008e'
  primary-container: '#7c3aed'
  on-primary-container: '#ede0ff'
  inverse-primary: '#732ee4'
  secondary: '#adc6ff'
  on-secondary: '#002e6a'
  secondary-container: '#0566d9'
  on-secondary-container: '#e6ecff'
  tertiary: '#ffb95f'
  on-tertiary: '#472a00'
  tertiary-container: '#905b00'
  on-tertiary-container: '#ffe1c0'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#eaddff'
  primary-fixed-dim: '#d2bbff'
  on-primary-fixed: '#25005a'
  on-primary-fixed-variant: '#5a00c6'
  secondary-fixed: '#d8e2ff'
  secondary-fixed-dim: '#adc6ff'
  on-secondary-fixed: '#001a42'
  on-secondary-fixed-variant: '#004395'
  tertiary-fixed: '#ffddb8'
  tertiary-fixed-dim: '#ffb95f'
  on-tertiary-fixed: '#2a1700'
  on-tertiary-fixed-variant: '#653e00'
  background: '#12131a'
  on-background: '#e3e1ec'
  surface-variant: '#33343d'
  bg-void: '#07080F'
  bg-base: '#0B0D1A'
  bg-elevated: '#10132A'
  bg-surface: '#161A35'
  bg-overlay: '#1E2240'
  status-active: '#8B5CF6'
  status-scheduled: '#F59E0B'
  status-expiring: '#EF4444'
  group-family: '#F472B6'
  group-friends: '#38BDF8'
  group-work: '#FBBF24'
  text-primary: '#F1F5F9'
  text-secondary: '#94A3B8'
typography:
  headline-lg:
    fontFamily: Outfit
    fontSize: 40px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Outfit
    fontSize: 30px
    fontWeight: '600'
    lineHeight: '1.2'
  headline-sm:
    fontFamily: Outfit
    fontSize: 22px
    fontWeight: '600'
    lineHeight: '1.3'
  title-md:
    fontFamily: Outfit
    fontSize: 18px
    fontWeight: '500'
    lineHeight: '1.35'
  body-md:
    fontFamily: Inter
    fontSize: 15px
    fontWeight: '400'
    lineHeight: '1.6'
  body-sm:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '400'
    lineHeight: '1.5'
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1.4'
    letterSpacing: 0.05em
  button:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: '1'
  mono-display:
    fontFamily: JetBrains Mono
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1'
  mono-sm:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '400'
    lineHeight: '1.4'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  gutter: 16px
  margin-mobile: 16px
  margin-desktop: 48px
---

## Brand & Style

This design system embodies a **Gradient Dark** aesthetic, specifically tailored for high-tech, futuristic, or focused productivity environments. The brand personality is enigmatic yet precise, evoking a sense of calm immersion through deep, "void-like" indigo backgrounds contrasted with vibrant, electric accents.

The visual style is a sophisticated blend of **Glassmorphism** and **High-Contrast Dark Mode**. It relies on high-quality translucency, multi-layered background blurs (16px), and subtle radial glows to establish hierarchy without relying on heavy solid containers. The interface should feel like a holographic projection—lightweight, luminous, and deeply atmospheric.

**Key Visual Principles:**
- **Depth through Luminosity:** Hierarchy is defined by light emission and blur density rather than traditional shadows.
- **Atmospheric Gradients:** Backgrounds are never flat; they use sweeping linear and radial gradients to guide the eye.
- **Glass Surfaces:** Containers use semi-transparent fills and crisp 1px borders to maintain legibility against complex backgrounds.

## Colors

The palette is anchored by the **Violet-Electric** primary color, which serves as the main interactive signal. The background system moves from a pure "void" black to deep indigo elevations, creating a natural sense of depth.

**Color Usage Guidelines:**
- **Primary Gradient:** Use the linear violet-to-indigo gradient for primary CTAs and active status indicators.
- **Glass Tinting:** Glass layers use a white tint at very low opacity (4-8%) to simulate reflective surfaces.
- **Functional Accents:** Electric Blue is reserved for secondary interactions and hyperlinks to differentiate from primary action paths.
- **Status Glows:** Use radial gradients matching the status color (Violet for active, Amber for scheduled) at the top of cards to indicate state without saturating the entire surface.

## Typography

This system uses a three-font strategy to balance character, readability, and technical precision.

- **Outfit (Display):** Used for all headings. Its geometric but soft nature balances the sharp digital aesthetic.
- **Inter (Sans):** The workhorse for body copy and interface labels, ensuring maximum legibility against dark, translucent backgrounds.
- **JetBrains Mono (Monospace):** Vital for technical data, timers, and timestamps. It reinforces the "system-level" or "developer-grade" feel of the product.

**Responsive Adjustments:**
Headlines should scale down for mobile devices: `headline-lg` should shift to 32px and `headline-md` to 24px on screens narrower than 768px.

## Layout & Spacing

The layout follows a **fluid grid** model with a consistent 4px base unit. 

**Grid Architecture:**
- **Desktop:** 12-column grid with 24px gutters. Content should be centered with a max-width of 1440px.
- **Tablet:** 8-column grid with 16px gutters and 32px side margins.
- **Mobile:** 4-column grid with 16px gutters and 16px side margins.

**Rhythm:**
Spacing should be generous to allow the background gradients to breathe. Use `lg` (24px) for internal card padding and `xl` (32px) for vertical separation between major sections.

## Elevation & Depth

Elevation is achieved through a combination of **Tonal Layering** and **Luminous Shadows**.

1.  **Surfaces:** Elements "rise" by becoming lighter and more translucent. The base is `#0B0D1A`, while modals use `#1E2240` with 16px backdrop blur.
2.  **Outlines:** Every elevated surface must have a 1px border. For glass surfaces, use `rgba(255,255,255,0.08)`. For active states, use a primary-tinted border (`rgba(139,92,246,0.40)`).
3.  **Shadows:** Shadows are highly diffused and low-opacity. 
    *   **Standard:** Soft black shadows for physical lift.
    *   **Glows:** Active elements utilize colored outer glows (e.g., Violet 28% opacity) to simulate light emission. This is the primary indicator of "on" states.

## Shapes

The design uses a "Rounded" (level 2) language. This softens the high-tech aesthetic, making it feel more approachable and premium.

- **Base Radius (8px):** Standard buttons and input fields.
- **Surface Radius (16px):** Status cards and group panels.
- **Container Radius (20px - 28px):** Large dashboard cards, modals, and bottom sheets.
- **Full Radius (Pill):** Dedicated to status badges, tags, and toggles to ensure they are immediately recognizable as secondary UI metadata.

## Components

### Buttons
- **Primary:** Uses the `--gradient-primary`. On hover, add a `shadow-glow-primary`. Text is inverse (dark).
- **Secondary:** Transparent background with a `color-border-default` and light glass tint.
- **Glass:** No background, only a subtle border and 16px blur, used for low-priority actions.

### Cards
All cards should implement the `.glass-card` recipe: a subtle white-tinted linear gradient, a thin semi-transparent border, and backdrop blur. High-priority cards (Active Status) feature a radial glow at the top edge.

### Input Fields
Inputs should use the `--color-bg-surface` with a 1px border. On focus, the border transitions to `--color-primary-600` with a subtle primary-tinted glow.

### Chips & Badges
Always pill-shaped. Status badges use solid background colors, while metadata chips (like contact groups) use a low-opacity version of the group color with a high-contrast label.

### Lists & Logs
Items are separated by `--color-border-subtle`. Log entries for specific groups should include a 3px left-border accent using the corresponding Group Color (Family, Work, etc.).

### Timers
Always rendered in **JetBrains Mono Bold**. In active or expiring states, the text should pulse slightly using a scale transform (1.0 to 1.02) to draw attention.