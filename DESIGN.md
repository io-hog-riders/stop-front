# Design System Document: Kinetic Friction

## 1. Overview & Creative North Star: "The Asphalt Outlaw"

This design system rejects the "polite" softness of modern SaaS. Our Creative North Star is **The Asphalt Outlaw**—an unapologetic, high-velocity aesthetic designed for the open road. It mimics the raw energy of late-night highway signage and industrial logistics.

We break the "template" look through **Kinetic Asymmetry**. Elements do not simply sit on a grid; they collide. By using heavy strokes, zero-radius corners, and hard-edged shadows, we create a UI that feels physically constructed rather than digitally rendered. The experience is "unfiltered," prioritizing raw data and high-speed legibility over decorative fluff.

## 2. Colors: High-Voltage Contrast

The palette is built on a foundation of absolute darkness, punctuated by "radioactive" accents that ensure critical information is never missed.

- **Core Tones:**
  - **Background (#0e0e0e):** A deep, void-like black that provides the maximum contrast for our accents.
  - **Primary (#f3ffca / #CCFF00):** "Acid Green." Used for the most critical actions and wayfinding.
  - **Secondary (#c97cff):** "Electric Purple." Used for secondary data points and path-finding logic.
- **The "Heavy-Stroke" Rule:** Unlike traditional systems that use background shifts to define sections, this system uses **Primary (#CCFF00)** or **White (#FFFFFF)** borders of at least 3px.
- **Surface Hierarchy:** We utilize `surface-container` tokens to create "slabs" of content.
  - **Layering:** Place a `surface-container-highest` (#262626) block directly onto the `background` to create a stark, non-graduated jump in depth.
- **Texture & Impact:** Avoid soft gradients. If a gradient is used, it must be a "Hard Step" gradient between `primary` and `primary-container` to maintain the brutalist integrity.

## 3. Typography: The Editorial Megaphone

We use typography as a structural element, not just a carrier of information.

- **Display & Headlines (Lexend):** These must be oversized and aggressive. **Lexend** provides a geometric clarity that remains legible even under "road vibration" conditions.
  - _Usage:_ Use `display-lg` for destination names and `headline-lg` for mileage.
- **Data & Labels (Space Grotesk / Mono):** We utilize `label-md` and `label-sm` for technical details (coordinates, fuel prices, timestamps). The mono-spaced nature of these tokens reinforces the "functional/unfiltered" personality.
- **Hierarchy:** High contrast in scale is mandatory. A `display-lg` headline should sit immediately adjacent to a `label-sm` detail to create visual tension.

## 4. Elevation & Depth: The Hard-Offset Principle

In this system, "Elevation" does not mean "Lightness." It means "Physical Displacement."

- **The Layering Principle:** Depth is achieved by stacking sharp-edged slabs. No blurs are permitted.
- **Hard Shadows:** To indicate a floating element (like a "Stop Finder" FAB), use a flat, non-blurred offset shadow. Use the `primary` or `secondary` token for the shadow color at 100% opacity, offset by 4px or 8px.
- **Anti-Glassmorphism:** We explicitly reject transparency and blur. Every container is 100% opaque. If an element is "above" another, it completely obscures what is beneath it, defined by a 3px `outline`.
- **Zero Rounding:** The `Roundedness Scale` is strictly **0px** across all tokens. Any hint of a curve is a violation of the system’s industrial DNA.

## 5. Components: Industrial Modules

- **Buttons:**
  - **Primary:** Solid `primary` (#CCFF00) background, `on-primary` (#516700) text, 3px black border.
  - **State:** On hover/active, shift the entire button 4px down and 4px right, while keeping the shadow in a fixed position to create a "mechanical press" effect.
- **Input Fields:**
  - Use `surface-container-highest` backgrounds with a stark `outline` (#777575).
  - Focus state: The border must switch to `primary` (#CCFF00) with a 4px thickness.
- **Cards:**
  - Cards must never use dividers. Separate content using "High-Contrast Blocks"—alternate the background of card sections between `surface-container-low` and `surface-container-high`.
- **Chips:**
  - Rectangular tags with 2px borders. Use `secondary` (#c97cff) for amenity filters (e.g., "EV Charging," "24h Food").
- **Navigation Rails:**
  - Oversized icons with `label-sm` text. Use high-contrast active states where the selected item is "inverted" (Black background, Acid Green text).

## 6. Do's and Don'ts

### Do:

- **DO** use extreme weight. If a border feels too thick, it’s probably just right.
- **DO** overlap elements. Let a card "clip" over a map edge to create a sense of raw assembly.
- **DO** use "Acid Green" for anything related to movement or "Go" actions.
- **DO** keep all text left-aligned to mimic technical manifests.

### Don't:

- **DON'T** use soft shadows or blurs. If it looks "cloudy," it’s wrong.
- **DON'T** use 1px lines. They disappear in high-vibration road environments.
- **DON'T** use rounded corners (`0px` is the only value).
- **DON'T** use subtle greys. If it’s not deep black or high-octane neon, reconsider the choice.

## 7. Spacing: The Brutalist Grid

Spacing is used to create "impact zones." Use the `spacing-12` (4rem) and `spacing-16` (5.5rem) tokens to create massive gaps between unrelated content sections, forcing the user to focus on one "slab" of information at a time. Smaller gaps (e.g., `spacing-2`) are reserved for internal data clusters.
