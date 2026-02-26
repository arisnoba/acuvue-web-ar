# Acuvue Web AR Microsite - Implementation

## Phase 1: Project Setup + Camera Prototype
- [ ] Initialize Next.js 15 project with dependencies
- [ ] Configure Next.js, Tailwind CSS 4, TypeScript
- [ ] Create app layout, global styles, type definitions
- [ ] Implement camera capture hook + component
- [ ] Implement MediaPipe face detection hook
- [ ] Create permission/loading/intro screens
- [ ] Verify camera works in browser

## Phase 2: WebGL Blur + Lens Simulation
- [ ] Create WebGL utility functions
- [ ] Implement blur shaders (vertex + fragment)
- [ ] Implement useWebGLBlur hook
- [ ] Create smoothing utilities (EMA/Lerp)
- [ ] Implement landmark coordinate transforms
- [ ] Build CameraCanvas (WebGL + Canvas composite)
- [ ] Implement LensOverlay + BeforeAfterToggle

## Phase 3: SF HUD Animation
- [ ] Create ScanRing component
- [ ] Create Crosshair component
- [ ] Create LockOnFrame component
- [ ] Create DataOverlay component
- [ ] Create HudLayer composition
- [ ] Implement useHudAnimation hook
- [ ] Wire up scanning → tracking → lock-on → lens sequence

## Phase 4: Integration + Polish
- [ ] Wire main page with full flow
- [ ] Mobile touch interaction optimization
- [ ] Performance optimization
- [ ] Build verification (static export)

## Working Notes
- Prettier: singleQuote, semi, useTabs, tabWidth 2, trailingComma all, printWidth 120
- Node 22 (.nvmrc)
- ESLint: @typescript-eslint, consistent-type-imports enforced
- All camera/WebGL/MediaPipe components need 'use client'
