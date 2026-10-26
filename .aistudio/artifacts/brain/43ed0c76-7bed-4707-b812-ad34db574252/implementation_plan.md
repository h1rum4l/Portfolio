# Seamless Gradient Feathering for Portrait & Project Cards

Eliminate the sharp lower cutoff above the "Data Science · Design · Respect · Communication" values marquee by introducing organic alpha gradient masking and deep-space tone fades to Hirumal's hero portrait and project preview cards.

## User Review & Critical Decisions

> [!IMPORTANT]
> The following design direction was confirmed during clarification:
> - **Portrait Bottom Edge**: Smooth seamless fade dissolving into the deep oceanic space background at the lower torso.
> - **Extended Scope**: Subtle bottom gradient feathering also applied to project preview cards (`.project .liquid`) for consistent photographic depth across the portfolio.

- **Confirmed Decision 1**: Apply CSS `-webkit-mask-image` and `mask-image` with linear gradient alpha-falloff (from opaque 100% at head/chest down to 0% at bottom edge) to `.portrait` and `.portrait img`.
- **Confirmed Decision 2**: Enhance the `.hero:after` and `.portrait:after` atmospheric gradient so the transition into `#020B14` and the values marquee is completely seamless across desktop and mobile screens.
- **Confirmed Decision 3**: Add soft bottom vignette gradient overlays to project cards (`.project .liquid:after`) to anchor project imagery smoothly into card typography.

---

### 1. Overview & Core Concept

- **What It Does**: Resolves the abrupt horizontal cutoff where Hirumal's portrait ends above the values marquee ribbon. Replaces hard edges with a soft, cinematic feather that naturally dissolves the torso into the dark starry cosmos.
- **Visual Impact**: Restores the original intended aesthetic where the subject appears emerged within the cosmic deep-ocean environment rather than clipped by a container boundary.
- **Scope**: Applied to the Hero portrait (desktop & mobile responsive breakpoints) and extended cleanly to project showcase tiles.

---

### 2. User Experience & Visual Design

#### Visual Architecture
```
┌─────────────────────────────────────────────────────────────┐
│ Hero Section (Three.js Starfield + Deep Ocean Glow)        │
│                                                             │
│         [ Hirumal's Portrait - Full Clarity Top ]          │
│                       │                                     │
│                       ▼                                     │
│     [ Smooth Alpha Feathering 70% -> 98% Torso ]            │
│                       │                                     │
│                       ▼                                     │
│     [ Deep-Sea Dark Gradient Blend (var(--bg)) ]            │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│ Values Marquee: Data Science · Design · Respect ...        │
└─────────────────────────────────────────────────────────────┘
```

#### Aesthetic Details
- **Masking Curve**: Linear gradient alpha mask on `.portrait img`:
  - `0% - 68%`: 100% solid opacity (face, shoulders, and mid-chest remain fully crisp).
  - `68% - 98%`: Smooth cosine-like roll-off into 0% opacity (lower torso melts away).
- **Secondary Atmospheric Veil**: A subtle ambient gradient (`.hero:after`) deepening from `transparent` through `rgba(2, 11, 20, 0.45)` to `var(--bg)` at the very bottom edge (height: 24%), preventing any harsh contrast line with the marquee border.
- **Project Cards**: Dual-layer bottom vignette on `.project .liquid:after` transitioning into the card background, which lifts slightly on hover for interactive showcase exploration.

---

### 3. Key Technical Decisions & Trade-Offs

- **Decision 1: CSS `mask-image` vs. Simple Overlay Div**
  - *Chosen Approach*: Implement both `mask-image: linear-gradient(...)` on `.portrait` / `.portrait img` AND a supporting atmospheric gradient on `.hero:after`.
  - *Why*: A simple overlay div with color tint cannot cleanly handle the transparent Three.js canvas underneath when stars drift behind the lower torso. A true alpha mask feathers the image pixels directly, letting Three.js stars shine seamlessly behind the feathered torso.
  - *Cross-Browser Compatibility*: Includes `-webkit-mask-image` alongside standard `mask-image`.

- **Decision 2: Mobile Responsive Alignment**
  - *Chosen Approach*: Maintain proportional mask height across `@media(max-width: 767px)` and `@media(max-width: 640px)`.
  - *Why*: On mobile devices, the portrait scales down to 68%-72% container height; keeping the mask gradient relative ensures the face never gets inadvertently faded on small screens.

---

### 4. Technical Implementation Steps

1. **Update Hero Portrait Styles in `/index.html` and `/extracted/.../index.html`**:
   - Add `-webkit-mask-image: linear-gradient(to bottom, #000 0%, #000 68%, rgba(0,0,0,0.6) 82%, transparent 98%);` and standard `mask-image` to `.portrait` and `.portrait img`.
   - Add `.portrait:after` subtle gradient anchor for extra depth.
   - Refine `.hero:after` gradient stops from transparent to `var(--bg)`.
2. **Update Project Preview Cards (`.project .liquid`)**:
   - Add soft bottom gradient feather in `.project .liquid:after` to dissolve the lower border into project headers.
3. **Parity & Validation**:
   - Sync all edits across both `/index.html` and `/extracted/role-you-are-a-senior-front/outputs/index.html`.
   - Run compilation checks (`compile_applet` / `lint_applet`) to ensure clean verification.
