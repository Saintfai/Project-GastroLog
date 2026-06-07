# DESIGN.md — GastroLog Smart Reflux Journal

> **Source:** Extracted from Stitch project `GastroLog Smart Reflux Journal`  
> **Design Theme:** Serene Digestive Care · Color Mode: Light · Font: Inter · Roundness: 8px  
> **Device Target:** Mobile-first (390px) with Desktop breakpoint (960px+)

---

## 1. Brand & Style Philosophy

The brand personality is centered on **empathy and medical reliability** without the coldness of traditional clinical software. The design system follows a **Soft Minimalist** aesthetic, prioritizing whitespace and a "breathable" interface to lower the cognitive load and anxiety often associated with chronic symptom tracking.

The visual narrative avoids all aggressive stimulants — no high-energy gradients or jagged edges. Instead, the UI uses soft layering and a muted, organic palette to create a soothing digital environment. Journaling symptoms should feel **therapeutic rather than burdensome**.

---

## 2. Color Palette

### 2.1 Primary Colors

| Role | Token | Hex Value | Usage |
|------|-------|-----------|-------|
| Primary | `primary` | `#566342` | Primary actions, active states |
| On Primary | `on-primary` | `#ffffff` | Text/icons on primary fills |
| Primary Container | `primary-container` | `#a3b18a` | **Sage green** — button backgrounds, healthy states |
| On Primary Container | `on-primary-container` | `#384425` | Text on primary containers |
| Inverse Primary | `inverse-primary` | `#becca3` | Primary on dark surfaces |

### 2.2 Secondary Colors

| Role | Token | Hex Value | Usage |
|------|-------|-----------|-------|
| Secondary | `secondary` | `#57615c` | Supporting UI elements |
| On Secondary | `on-secondary` | `#ffffff` | Text/icons on secondary fills |
| Secondary Container | `secondary-container` | `#dbe5df` | **Mist green** — non-urgent fills, selection states |
| On Secondary Container | `on-secondary-container` | `#5d6762` | Text on secondary containers |

### 2.3 Tertiary Colors

| Role | Token | Hex Value | Usage |
|------|-------|-----------|-------|
| Tertiary | `tertiary` | `#605e5a` | Accent, supplementary information |
| On Tertiary | `on-tertiary` | `#ffffff` | Text/icons on tertiary fills |
| Tertiary Container | `tertiary-container` | `#aeaba7` | Warm stone — background accents |
| On Tertiary Container | `on-tertiary-container` | `#41403c` | Text on tertiary containers |

### 2.4 Surface & Background

| Role | Token | Hex Value | Usage |
|------|-------|-----------|-------|
| Background | `background` | `#f7faf5` | App background (lowest level) |
| Surface | `surface` | `#f7faf5` | Default surface |
| Surface Dim | `surface-dim` | `#d8dbd6` | Dimmed/disabled surfaces |
| Surface Bright | `surface-bright` | `#f7faf5` | Highlighted surfaces |
| Surface Container Lowest | `surface-container-lowest` | `#ffffff` | Pure white containers |
| Surface Container Low | `surface-container-low` | `#f1f4f0` | Low-emphasis containers |
| Surface Container | `surface-container` | `#ecefea` | Default containers |
| Surface Container High | `surface-container-high` | `#e6e9e4` | Cards, input fields |
| Surface Container Highest | `surface-container-highest` | `#e0e3df` | Top-level containers |
| Surface Variant | `surface-variant` | `#e0e3df` | Alternative surface fill |
| Surface Tint | `surface-tint` | `#566342` | Tonal elevation overlay color |

### 2.5 On-Surface / Text Colors

| Role | Token | Hex Value | Usage |
|------|-------|-----------|-------|
| On Surface | `on-surface` | `#191c1a` | Primary text, body copy |
| On Surface Variant | `on-surface-variant` | `#45483f` | Secondary text, placeholder |
| On Background | `on-background` | `#191c1a` | Text on background |
| Inverse Surface | `inverse-surface` | `#2d312e` | **Deep Charcoal** — dark mode surface |
| Inverse On Surface | `inverse-on-surface` | `#eff2ed` | Text on dark surfaces |

### 2.6 Outline & Dividers

| Role | Token | Hex Value | Usage |
|------|-------|-----------|-------|
| Outline | `outline` | `#76786e` | Borders, dividers |
| Outline Variant | `outline-variant` | `#c6c8bb` | Subtle dividers, input outlines |

### 2.7 Error / Status Colors

| Role | Token | Hex Value | Usage |
|------|-------|-----------|-------|
| Error | `error` | `#ba1a1a` | Error state (use sparingly) |
| On Error | `on-error` | `#ffffff` | Text on error fills |
| Error Container | `error-container` | `#ffdad6` | Muted error backgrounds |
| On Error Container | `on-error-container` | `#93000a` | Text in error containers |

> ⚠️ **Guideline:** Avoid bright red for errors. Favor **muted terracotta or deep amber** with text-based clarity over alarming color shifts.

### 2.8 Fixed Variants (Light/Dark Agnostic)

| Token | Hex | Token | Hex |
|-------|-----|-------|-----|
| `primary-fixed` | `#dae8be` | `primary-fixed-dim` | `#becca3` |
| `on-primary-fixed` | `#141f05` | `on-primary-fixed-variant` | `#3f4b2c` |
| `secondary-fixed` | `#dbe5df` | `secondary-fixed-dim` | `#bfc9c3` |
| `on-secondary-fixed` | `#151d1a` | `on-secondary-fixed-variant` | `#3f4945` |
| `tertiary-fixed` | `#e6e2dd` | `tertiary-fixed-dim` | `#c9c6c1` |
| `on-tertiary-fixed` | `#1c1c19` | `on-tertiary-fixed-variant` | `#484743` |

### 2.9 CSS Custom Properties

```css
:root {
  /* Primary */
  --color-primary:                    #566342;
  --color-on-primary:                 #ffffff;
  --color-primary-container:          #a3b18a;
  --color-on-primary-container:       #384425;
  --color-inverse-primary:            #becca3;

  /* Secondary */
  --color-secondary:                  #57615c;
  --color-on-secondary:               #ffffff;
  --color-secondary-container:        #dbe5df;
  --color-on-secondary-container:     #5d6762;

  /* Tertiary */
  --color-tertiary:                   #605e5a;
  --color-on-tertiary:                #ffffff;
  --color-tertiary-container:         #aeaba7;
  --color-on-tertiary-container:      #41403c;

  /* Surface */
  --color-background:                 #f7faf5;
  --color-on-background:              #191c1a;
  --color-surface:                    #f7faf5;
  --color-surface-dim:                #d8dbd6;
  --color-surface-bright:             #f7faf5;
  --color-surface-container-lowest:   #ffffff;
  --color-surface-container-low:      #f1f4f0;
  --color-surface-container:          #ecefea;
  --color-surface-container-high:     #e6e9e4;
  --color-surface-container-highest:  #e0e3df;
  --color-surface-variant:            #e0e3df;
  --color-surface-tint:               #566342;
  --color-on-surface:                 #191c1a;
  --color-on-surface-variant:         #45483f;
  --color-inverse-surface:            #2d312e;
  --color-inverse-on-surface:         #eff2ed;

  /* Outline */
  --color-outline:                    #76786e;
  --color-outline-variant:            #c6c8bb;

  /* Error */
  --color-error:                      #ba1a1a;
  --color-on-error:                   #ffffff;
  --color-error-container:            #ffdad6;
  --color-on-error-container:         #93000a;
}
```

---

## 3. Typography

**Font Family:** `Inter` — used exclusively across all text roles (headline, body, label).

> **Guideline:** Use **weight** (Medium → Semi-Bold) rather than size to establish hierarchy in tight mobile views. Use **sentence case** for all headlines and labels. Avoid all-caps.

### 3.1 Type Scale

| Style | Size | Weight | Line Height | Letter Spacing | Usage |
|-------|------|--------|-------------|----------------|-------|
| `headline-lg` | 32px | 600 (SemiBold) | 40px | -0.02em | Page titles (desktop) |
| `headline-lg-mobile` | 26px | 600 (SemiBold) | 32px | -0.02em | Page titles (mobile) |
| `headline-md` | 24px | 500 (Medium) | 32px | -0.01em | Section headings |
| `body-lg` | 18px | 400 (Regular) | 28px | — | Primary body, log content |
| `body-md` | 16px | 400 (Regular) | 24px | — | Secondary body, descriptions |
| `label-md` | 14px | 500 (Medium) | 20px | +0.01em | Form labels, chips, button text |
| `label-sm` | 12px | 600 (SemiBold) | 16px | +0.03em | Timestamps, badges, captions |

### 3.2 CSS Custom Properties

```css
:root {
  --font-family-headline: 'Inter', sans-serif;
  --font-family-body:     'Inter', sans-serif;
  --font-family-label:    'Inter', sans-serif;

  /* Headline LG (Desktop) */
  --text-headline-lg-size:    32px;
  --text-headline-lg-weight:  600;
  --text-headline-lg-lh:      40px;
  --text-headline-lg-ls:      -0.02em;

  /* Headline LG (Mobile) */
  --text-headline-lg-mobile-size:    26px;
  --text-headline-lg-mobile-weight:  600;
  --text-headline-lg-mobile-lh:      32px;
  --text-headline-lg-mobile-ls:      -0.02em;

  /* Headline MD */
  --text-headline-md-size:    24px;
  --text-headline-md-weight:  500;
  --text-headline-md-lh:      32px;
  --text-headline-md-ls:      -0.01em;

  /* Body LG */
  --text-body-lg-size:    18px;
  --text-body-lg-weight:  400;
  --text-body-lg-lh:      28px;

  /* Body MD */
  --text-body-md-size:    16px;
  --text-body-md-weight:  400;
  --text-body-md-lh:      24px;

  /* Label MD */
  --text-label-md-size:    14px;
  --text-label-md-weight:  500;
  --text-label-md-lh:      20px;
  --text-label-md-ls:      0.01em;

  /* Label SM */
  --text-label-sm-size:    12px;
  --text-label-sm-weight:  600;
  --text-label-sm-lh:      16px;
  --text-label-sm-ls:      0.03em;
}
```

---

## 4. Spacing & Layout

### 4.1 Spacing Scale

| Token | Value | Usage |
|-------|-------|-------|
| `base-unit` | 4px | Grid atom — all spacing should be multiples |
| `gutter` | 16px | Column gutters |
| `margin-mobile` | 20px | Side margins on mobile (wider than standard to focus content) |
| `margin-desktop` | 40px | Side margins on desktop |
| `touch-target-min` | 48px | Minimum height for all interactive elements |

### 4.2 Semantic Spacing Reference

```
4px  → xs  (icon padding, inline gaps)
8px  → sm  (tight internal padding)
12px → sm+ (compact card internal padding)
16px → md  (standard element padding, gutters)
20px → lg  (mobile margin)
24px → xl  (log card internal padding)
32px → 2xl (section separators between log entries)
40px → 3xl (desktop margin, large section gaps)
```

### 4.3 Layout Rules

- **Grid Model:** Fluid Grid with emphasis on vertical rhythm
- **Mobile:** Single-column layout for one-handed usage
- **Desktop:** Multi-column with wider container (960px design width)
- **Content Grouping:** Use 32px–40px spacing blocks to separate "days" or "events" instead of harsh divider lines

```css
:root {
  --spacing-xs:               4px;
  --spacing-sm:               8px;
  --spacing-md:               16px;
  --spacing-lg:               20px;   /* mobile margin */
  --spacing-xl:               24px;   /* card padding */
  --spacing-2xl:              32px;   /* section gap */
  --spacing-3xl:              40px;   /* desktop margin */
  --touch-target-min:         48px;
  --gutter:                   16px;
  --page-margin-mobile:       20px;
  --page-margin-desktop:      40px;
}
```

---

## 5. Border Radius (Roundness)

**Base Roundness:** `8px` (round-eight system)

> All corners are significantly rounded to reinforce an empathetic and "safe" personality.

| Token | Value | Usage |
|-------|-------|-------|
| `rounded-sm` | `0.25rem` (4px) | Micro elements, badges |
| `rounded` (DEFAULT) | `0.5rem` (8px) | Default component radius |
| `rounded-md` | `0.75rem` (12px) | Medium components |
| `rounded-lg` | `1rem` (16px) | **Buttons, input fields** |
| `rounded-xl` | `1.5rem` (24px) | **Feature cards, main dashboard cards** |
| `rounded-full` | `9999px` | **Progress bars, pills, sliders** |

```css
:root {
  --radius-sm:      0.25rem;   /*  4px */
  --radius-default: 0.5rem;    /*  8px */
  --radius-md:      0.75rem;   /* 12px */
  --radius-lg:      1rem;      /* 16px */
  --radius-xl:      1.5rem;    /* 24px */
  --radius-full:    9999px;
}
```

---

## 6. Elevation & Depth

**System:** Tonal Layering + Soft Ambient Shadows

> Avoid multiple levels of elevation. Stick to a "flat-on-flat" or "flat-on-soft-shadow" approach to maintain the minimalist ethos.

### 6.1 Surface Tiers

| Level | Token | Value | Usage |
|-------|-------|-------|-------|
| 0 — Background | `background` | `#f7faf5` | App background (lowest) |
| 1 — Surface | `surface-container-low` | `#f1f4f0` | Default content areas |
| 2 — Cards | `surface-container` | `#ecefea` | Card backgrounds, input fills |
| 3 — Elevated | `surface-container-high` | `#e6e9e4` | Modals, dropdowns |

### 6.2 Shadow

```css
/* Active Card Shadow — only one diffused level */
--shadow-card: 0px 4px 20px rgba(45, 49, 46, 0.06);

/* Usage: apply only to active / hovered cards */
.card-active {
  box-shadow: var(--shadow-card);
}
```

---

## 7. Components

### 7.1 Buttons

- **Primary:** Sage green fill (`#a3b18a`) · White text · `rounded-lg` (16px) radius
- **Interaction:** Subtle `scale(0.97)` on press — tactile feedback without visual noise
- **Min height:** 48px (touch target)

```css
.btn-primary {
  background-color: var(--color-primary-container);  /* #a3b18a */
  color: var(--color-on-primary-container);           /* #384425 */
  border-radius: var(--radius-lg);                    /* 16px */
  min-height: var(--touch-target-min);                /* 48px */
  padding: 0 var(--spacing-xl);
  font-size: var(--text-label-md-size);
  font-weight: var(--text-label-md-weight);
  transition: transform 100ms ease;
}
.btn-primary:active {
  transform: scale(0.97);
}
```

### 7.2 Input Fields

- **Default:** Soft background fill (`#f1f4f0`) · No heavy border
- **Active/Focus:** 2px `#a3b18a` (Sage) border
- **Radius:** `rounded-lg` (16px)

```css
.input {
  background-color: var(--color-surface-container-low);  /* #f1f4f0 */
  border: 1.5px solid transparent;
  border-radius: var(--radius-lg);
  min-height: var(--touch-target-min);
  padding: 0 var(--spacing-md);
  font-size: var(--text-body-md-size);
  transition: border-color 150ms ease;
}
.input:focus {
  border-color: var(--color-primary-container);  /* 2px sage */
  outline: none;
}
```

### 7.3 Log Cards (Journal Entries)

- **Radius:** `rounded-xl` (24px) — friendly, organic appearance
- **Internal padding:** 24px
- **Shadow:** `--shadow-card` on active/hover
- **Content layout:** `Time | Symptom | Severity` clusters using clear typography (no icon dependency)

```css
.log-card {
  background-color: var(--color-surface-container);  /* #ecefea */
  border-radius: var(--radius-xl);                   /* 24px */
  padding: var(--spacing-xl);                        /* 24px */
  box-shadow: none;
  transition: box-shadow 200ms ease;
}
.log-card:hover,
.log-card.active {
  box-shadow: var(--shadow-card);
}
```

### 7.4 Trigger Chips

- **Usage:** Quick-tagging (e.g., "Spicy", "Coffee", "Stress")
- **Default:** `surface-container` fill · `outline-variant` border
- **Selected:** Mist green fill (`#dbe5df`) · primary-container border (`#a3b18a`)
- **Min height:** 48px · Pill-shaped (`rounded-full`)

```css
.chip {
  background-color: var(--color-surface-container);
  border: 1.5px solid var(--color-outline-variant);
  border-radius: var(--radius-full);
  min-height: var(--touch-target-min);
  padding: 0 var(--spacing-md);
  font-size: var(--text-label-md-size);
  font-weight: var(--text-label-md-weight);
  cursor: pointer;
  transition: background-color 150ms ease, border-color 150ms ease;
}
.chip.selected {
  background-color: var(--color-secondary-container);  /* #dbe5df */
  border-color: var(--color-primary-container);        /* #a3b18a */
}
```

### 7.5 Symptom Severity Slider

- **Track:** Soft neutral (`#e0e3df`) — subtle, non-alarming
- **Thumb:** Large draggable Sage circle (`#566342`)
- **Shape:** `rounded-full` track and thumb

```css
.severity-slider {
  -webkit-appearance: none;
  width: 100%;
  height: 6px;
  border-radius: var(--radius-full);
  background: var(--color-surface-container-highest);  /* #e0e3df */
  outline: none;
}
.severity-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 28px;
  height: 28px;
  border-radius: var(--radius-full);
  background: var(--color-primary);                    /* #566342 */
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(86, 99, 66, 0.3);
}
```

### 7.6 Progress / Intake Bars

- **Shape:** Fully pill-shaped (`rounded-full`)
- **Track:** `surface-container-high` (`#e6e9e4`)
- **Fill:** `primary` (`#566342`) or `primary-container` (`#a3b18a`)

```css
.progress-bar-track {
  background-color: var(--color-surface-container-high);
  border-radius: var(--radius-full);
  height: 8px;
  overflow: hidden;
}
.progress-bar-fill {
  background-color: var(--color-primary-container);
  height: 100%;
  border-radius: var(--radius-full);
  transition: width 400ms ease;
}
```

### 7.7 Empty States

- **Illustration style:** Simple hand-drawn line illustrations
- **Color:** Deep charcoal (`#2d312e` / `#191c1a`) line work
- **Background:** Transparent on background surface

---

## 8. Screens

| Screen | ID | Size | Device |
|--------|----|------|--------|
| Dashboard GastroLog | `e1ab443bcae84b43a478acc787aa375d` | 390×884 | Mobile |
| Catat Jurnal - Form Harian | `d9b6f4e187894122888818c970e8e341` | 390×884 | Mobile |

---

## 9. Design Principles Summary

| Principle | Rule |
|-----------|------|
| **Whitespace** | Generous whitespace is a feature — it lowers cognitive load |
| **No harsh dividers** | Use spacing blocks (32–40px) to separate sections |
| **Weight over size** | Use font weight (not size) for hierarchy on mobile |
| **Sentence case** | All text — never all-caps |
| **Color restraint** | Max 2 accent colors visible at once |
| **Touch targets** | All interactive elements ≥ 48px in height |
| **Single shadow level** | One diffused shadow only; no stacking |
| **Status messaging** | Prefer text clarity over alarming color shifts for errors |

---

*Generated from Stitch MCP · Project: `projects/6102165085477040948` · GastroLog Smart Reflux Journal*
