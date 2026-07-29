---
name: Morning Mist
colors:
  surface: '#f9f9ff'
  surface-dim: '#cfdaf2'
  surface-bright: '#f9f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f0f3ff'
  surface-container: '#e7eeff'
  surface-container-high: '#dee8ff'
  surface-container-highest: '#d8e3fb'
  on-surface: '#111c2d'
  on-surface-variant: '#4a4455'
  inverse-surface: '#263143'
  inverse-on-surface: '#ecf1ff'
  outline: '#7b7487'
  outline-variant: '#ccc3d8'
  surface-tint: '#732ee4'
  primary: '#630ed4'
  on-primary: '#ffffff'
  primary-container: '#7c3aed'
  on-primary-container: '#ede0ff'
  inverse-primary: '#d2bbff'
  secondary: '#5c5f61'
  on-secondary: '#ffffff'
  secondary-container: '#e0e3e5'
  on-secondary-container: '#626567'
  tertiary: '#494f56'
  on-tertiary: '#ffffff'
  tertiary-container: '#61676e'
  on-tertiary-container: '#e0e6ee'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#eaddff'
  primary-fixed-dim: '#d2bbff'
  on-primary-fixed: '#25005a'
  on-primary-fixed-variant: '#5a00c6'
  secondary-fixed: '#e0e3e5'
  secondary-fixed-dim: '#c4c7c9'
  on-secondary-fixed: '#191c1e'
  on-secondary-fixed-variant: '#444749'
  tertiary-fixed: '#dde3eb'
  tertiary-fixed-dim: '#c1c7cf'
  on-tertiary-fixed: '#161c22'
  on-tertiary-fixed-variant: '#41474e'
  background: '#f9f9ff'
  on-background: '#111c2d'
  surface-variant: '#d8e3fb'
typography:
  headline-xl:
    fontFamily: Outfit
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Outfit
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Outfit
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 36px
  headline-md:
    fontFamily: Outfit
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 14px
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
  xl: 48px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 64px
---

## Brand & Style

This design system transitions from a dark aesthetic to a clean, airy, and professional light-themed environment. The brand personality is energetic yet grounded, designed to evoke a sense of clarity and focus. By leveraging high-contrast typography against expansive, light surfaces, the interface feels both premium and accessible.

The design style is a sophisticated blend of **Minimalism** and **Glassmorphism**. It prioritizes heavy whitespace and a restricted color palette to reduce cognitive load, while employing soft translucent layers for cards and surfaces to provide a modern, tactile depth without the visual weight of traditional skeuomorphism.

## Colors

The palette is anchored by a pure, luminous background to create an immediate sense of openness. 

- **Primary Violet (#7C3AED):** Used sparingly but purposefully as an action color for buttons, active states, and critical brand moments.
- **Surface Background (#F8FAFC):** A very light gray used to differentiate secondary containers from the pure white base.
- **Typography:** Deep charcoal (#1E293B) is reserved for headings to ensure maximum legibility and hierarchy. Slate gray (#64748B) provides a softer, readable contrast for long-form body text.
- **Borders (#E2E8F0):** Subtle and unobtrusive, used only where structural definition is required between similar surface tones.

## Typography

The typographic system utilizes a dual-font approach to balance personality with utility. **Outfit** is used for all headings to provide a modern, geometric character that feels energetic. **Inter** is used for all UI elements and body copy, chosen for its exceptional legibility and systematic precision.

Headlines should utilize tight letter-spacing to maintain a punchy, editorial feel. Body text should maintain standard tracking to ensure comfort during extended reading. Use `headline-lg-mobile` for top-level headers on small screens to prevent awkward line breaks while maintaining visual impact.

## Layout & Spacing

The design system employs a **fluid 12-column grid** for desktop and a **4-column grid** for mobile. The layout relies on generous outer margins to frame the content, creating the "airy" feel central to the Morning Mist aesthetic.

Spacing follows a strict 4px base unit. Component internal padding should default to `md` (16px), while vertical section spacing should leverage `xl` (48px) to allow the design to "breathe." Elements should align to the grid, but decorative "glass" cards may occasionally bleed into margins on mobile to imply horizontal scrollability.

## Elevation & Depth

Depth is achieved through **Glassmorphism** and soft ambient shadows rather than harsh outlines.

1.  **Base Layer:** Pure white or #F8FAFC.
2.  **Surface Layer (Cards):** Semi-transparent white (e.g., `rgba(255, 255, 255, 0.7)`) with a `20px` backdrop blur. This creates a frosted glass effect that picks up hints of the background colors.
3.  **Shadows:** Shadows are highly diffused and low-opacity. Avoid "glow" effects; instead, use a vertical offset (e.g., `y: 4px, blur: 12px, opacity: 0.05`) using a neutral slate tint to ground elements realistically.
4.  **Interactive States:** On hover, cards should slightly increase their shadow spread and lift (Y-axis shift) to provide tactile feedback.

## Shapes

The shape language is consistently **Rounded**. This softens the professional tone, making the interface feel more approachable and modern.

- **Standard Elements:** Buttons and input fields use a `0.5rem` (8px) radius.
- **Containers:** Cards and large modal surfaces use `rounded-lg` (1rem / 16px).
- **Accents:** Small decorative elements or tags use `rounded-xl` (1.5rem / 24px) to create a "pill" look that contrasts against the more structured card shapes.

## Components

- **Buttons:** The primary button uses the Violet (#7C3AED) fill with white text. Secondary buttons should use a light slate ghost style with a subtle #E2E8F0 border.
- **Cards:** White glass containers with a subtle 1px border (#E2E8F0) and a soft ambient shadow.
- **Input Fields:** Use a #F8FAFC background with a 1px #E2E8F0 border. On focus, the border transitions to the Primary Violet with a soft 2px focus ring.
- **Chips/Tags:** Use a soft violet tint (10% opacity of #7C3AED) with deep violet text for high-contrast secondary information.
- **Lists:** Items are separated by thin #E2E8F0 hairlines. Hover states should utilize a subtle shift to a pure white background with a light shadow.
- **Checkboxes & Radios:** Use the Primary Violet for checked states. The unselected state should be a simple light gray stroke to remain unobtrusive.