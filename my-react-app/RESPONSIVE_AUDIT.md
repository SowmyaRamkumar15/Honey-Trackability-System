# HoneyChain — Responsive Design & Viewport Audit Report

## Viewport Standards & Breakpoints

HoneyChain enforces fluid responsiveness across four target device viewports:

1. **Mobile Viewport (375px - 639px)**: Single column layouts, collapsible mobile navigation drawers, touch-friendly 44px+ tap targets.
2. **Tablet Viewport (640px - 1023px)**: 2-column grid cards, responsive stat summaries, touch/pointer hybrid.
3. **Desktop Viewport (1024px - 1279px)**: Full multi-column dashboard grid, persistent sidebar navigation.
4. **Wide Desktop Viewport (1280px+)**: Constrained maximum content container (`max-w-7xl mx-auto`), centered layout alignment.

---

## Layout Responsive Rules Applied

- **Grid Breakpoints**: Replaced rigid column spans with `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5`.
- **Card Containers**: Replaced fixed width declarations (`w-[400px]`) with `w-full max-w-md mx-auto` or `w-full flex-1`.
- **Table Control & Overflow**: Wrapped data tables in `overflow-x-auto` with styled scrollbars for horizontal panning on small screens.
- **Header Action Bars**: Converted fixed horizontal flexbars to responsive flex column-to-row layouts (`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4`).
- **Form Controls**: Full width form controls on mobile (`w-full`), side-by-side buttons on desktop (`sm:w-auto`).
