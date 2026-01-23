# Ravynix Website — Specification Document

## Overview

Single-page landing website for **Ravynix**, the music brand of artist **Yevheniy**.

**Primary Goal:** Professional presence + business inquiries  
**Contact:** yevheniy@ravynix.com

---

## 1. Page Structure & UX Logic

### 1.1 Header (Fixed)
- **Position:** Fixed at top, blur backdrop
- **Logo:** "Ravynix" text mark (white on dark)
- **Navigation:** Music | About | Contact
- **Behavior:** 
  - Stays visible on scroll
  - Subtle background opacity increase after 50px scroll
  - Mobile: Hamburger menu toggle

### 1.2 Hero Section
- **Purpose:** Brand introduction, minimal
- **Content:**
  - Title: "Ravynix"
  - Tagline: "Music by Yevheniy"
- **Height:** ~50vh (not full-screen, intentionally understated)
- **No imagery required**

### 1.3 Music Gallery (Core Section)
- **Purpose:** Showcase released tracks as a catalog
- **Layout:** Responsive grid (auto-fill, min 280px cards)
- **Card Structure:**
  ```
  ┌────────────────────────┐
  │                        │
  │    [Cover Image]       │  ← Square 1:1 ratio
  │                        │
  ├────────────────────────┤
  │ Track Title      2024  │  ← Title + Year
  ├────────────────────────┤
  │ 🎵 🎵 🎵 🎵            │  ← Platform icons
  └────────────────────────┘
  ```
- **Interaction:**
  - Hover: Slight lift (translateY -2px)
  - Cover: Subtle zoom on hover
  - Platform icons: Highlight on hover

### 1.4 About Section
- **Purpose:** Professional context about the artist
- **Tone:** Factual, no marketing language
- **Max-width:** 640px for readability

### 1.5 Contact Section
- **Purpose:** Business inquiries
- **Format:** Simple text + email link
- **Email interaction:** Underline on hover

### 1.6 Footer
- **Content:** Social icons + Copyright
- **Social links:** Placeholder URLs for now

---

## 2. Website Copy (Final Text)

### Hero
```
Ravynix
Music by Yevheniy
```

### About
```
Ravynix is the creative project of Yevheniy, a music producer and composer 
focused on crafting thoughtful electronic and contemporary sounds.

Each release is an exploration of texture, rhythm, and emotion — created 
with care and intention. The work spans across genres while maintaining a 
consistent commitment to quality and authenticity.

Ravynix operates independently, handling production, mixing, and creative 
direction in-house.
```

### Contact
```
For business inquiries, licensing, collaborations, or press:
yevheniy@ravynix.com
```

### Footer
```
© 2024 Ravynix. All rights reserved.
```

---

## 3. Visual System

### 3.1 Color Palette

| Token | Value | Usage |
|-------|-------|-------|
| `--color-bg` | `#0a0a0a` | Page background |
| `--color-bg-elevated` | `#111111` | Hover states |
| `--color-bg-card` | `#141414` | Card backgrounds |
| `--color-border` | `#2a2a2a` | Visible borders |
| `--color-border-subtle` | `#1a1a1a` | Section dividers |
| `--color-text-primary` | `#ffffff` | Headlines, important text |
| `--color-text-secondary` | `#a0a0a0` | Body text, descriptions |
| `--color-text-tertiary` | `#666666` | Labels, metadata |
| `--color-hover` | `#333333` | Interactive hover states |

### 3.2 Typography

**Font Family:** Inter (Google Fonts)  
**Fallback:** -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif

| Scale | Size | Use Case |
|-------|------|----------|
| `xs` | 12px | Labels, copyright |
| `sm` | 14px | Navigation, metadata |
| `base` | 16px | Body text |
| `lg` | 18px | Tagline |
| `xl` | 20px | Contact email |
| `2xl` | 24px | — |
| `3xl` | 32px | Mobile hero |
| `4xl` | 40px | — |
| `5xl` | 48px | Desktop hero |

**Weights:**
- 300 (Light): Body paragraphs
- 400 (Regular): General text
- 500 (Medium): Navigation, titles
- 600 (Semibold): Logo, hero title

### 3.3 Spacing System

Base unit: 8px

| Token | Value | Common Use |
|-------|-------|------------|
| `space-2` | 8px | Inline padding |
| `space-4` | 16px | Element gaps |
| `space-6` | 24px | Container padding |
| `space-8` | 32px | Grid gaps |
| `space-10` | 40px | Section title margin |
| `space-16` | 64px | Mobile section padding |
| `space-20` | 80px | Desktop section padding |

### 3.4 Effects

**Transitions:**
- Fast: 150ms (hover states)
- Base: 250ms (general transitions)
- Slow: 400ms (image transforms)

**Border Radius:**
- Small: 4px (buttons, icons)
- Medium: 8px (social links)
- Large: 12px (cards)

---

## 4. Music Gallery — UI Behavior

### 4.1 Grid Behavior
```css
grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
```
- Automatically adjusts columns based on viewport
- Minimum card width: 280px
- Gap: 32px (desktop), 24px (tablet), 20px (mobile)

### 4.2 Card States

**Default:**
- Background: `#141414`
- No shadow

**Hover:**
- Background: `#111111`
- Transform: `translateY(-2px)`
- Cover image: `scale(1.02)`

**Focus:**
- Outline: 2px solid `#888888`
- Offset: 2px

### 4.3 Platform Icons

**Supported Platforms:**
1. Spotify (green brand: #1DB954, displayed as neutral)
2. Apple Music
3. YouTube Music
4. SoundCloud (orange brand: #FF5500, displayed as neutral)

**Icon Specifications:**
- Size: 18×18px
- Color: `#a0a0a0` (secondary text)
- Hover: `#ffffff` (primary text)
- Container: 32×32px clickable area

**Important:** Icons are displayed in neutral gray, not brand colors, to maintain visual consistency.

### 4.4 Placeholder State

For unreleased tracks:
- Show abstract placeholder graphic (concentric circles)
- Title: "Upcoming Release"
- Platforms area: "Coming Soon" text label

---

## 5. Placeholder Image Rules

### 5.1 Requirements
- **Style:** Abstract, minimal, geometric
- **Colors:** Monochromatic grays only
- **Content:** No text, no symbols, no recognizable imagery
- **Aspect:** 1:1 square

### 5.2 Current Implementation
```html
<div class="cover-placeholder">
    <svg class="placeholder-icon">
        <!-- Concentric circles, subtle opacity -->
    </svg>
</div>
```
Background: Linear gradient from `#1a1a1a` to `#0d0d0d`

### 5.3 Forbidden Elements
- ❌ Fire, flames, energy visuals
- ❌ Dramatic lighting or cinematic effects
- ❌ Text or typography
- ❌ Artist photos
- ❌ Bright or saturated colors
- ❌ Complex patterns or noise

---

## 6. Technical Implementation

### 6.1 Files Structure
```
/
├── index.html          # Main HTML
├── css/
│   └── styles.css      # All styles
├── js/
│   └── main.js         # Interactions
├── SetMeOnFire.jpg     # Album cover (existing)
└── RavinixImage.jpg    # Artist image (existing)
```

### 6.2 Dependencies
- Google Fonts: Inter (weights 300, 400, 500, 600)
- No JavaScript frameworks
- No CSS frameworks

### 6.3 Browser Support
- Modern browsers (Chrome, Firefox, Safari, Edge)
- CSS Grid, Flexbox, Custom Properties
- Backdrop filter (with fallback)

### 6.4 Performance
- Lazy loading for images
- Minimal JavaScript footprint
- No external dependencies
- Critical CSS inlined (future optimization)

---

## 7. Responsive Breakpoints

| Breakpoint | Container Padding | Card Min-Width | Notes |
|------------|-------------------|----------------|-------|
| Desktop | 24px | 280px | Full navigation |
| Tablet (≤768px) | 20px | 240px | Mobile menu |
| Mobile (≤480px) | 16px | 100% | Single column |

---

## 8. Accessibility

- Semantic HTML structure
- ARIA labels on icon-only links
- Keyboard navigation support
- Focus visible outlines
- Reduced motion preference respected
- Sufficient color contrast (WCAG AA)

---

## 9. Future Scalability

### Adding New Tracks
Copy the song card template in `index.html`:
```html
<article class="song-card">
    <div class="song-cover">
        <img src="[cover-image].jpg" alt="[Title] — Cover Art" loading="lazy">
    </div>
    <div class="song-info">
        <h3 class="song-title">[Track Title]</h3>
        <span class="song-year">[Year]</span>
    </div>
    <div class="song-platforms">
        <!-- Platform links -->
    </div>
</article>
```

### Platform Links
Replace `#` with actual URLs:
```html
<a href="https://open.spotify.com/track/[ID]" class="platform-link">
```

---

## 10. Design References

**Inspired by:**
- Apple Music (clean cards, typography hierarchy)
- Spotify (dark theme, platform icons)
- Minimal portfolio sites (whitespace, focus)

**NOT inspired by:**
- Aggressive music marketing sites
- Over-animated experiences
- Cluttered label pages
