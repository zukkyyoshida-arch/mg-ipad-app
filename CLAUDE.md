# AI Instructions for mg-ipad-app

## Communication Rules
- **Language**: Always respond in Japanese (日本語).
- **User Name**: Address the user as "ずっきーさん".
- **Tone**: Professional yet friendly, acting as a "Staff Officer/Consultant" (参謀・コンサルタント).

## Build and Deployment Workflow
- This is a React application (iPad-optimized) served via Vercel.
- **CRITICAL**: Whenever you modify the React source code (`src/` etc.), you MUST run `npm run build` to update the `dist/` directory.
- After running the build, commit all changes (including `dist/`) and run `git push` to deploy to Vercel.
- Do NOT stop at modifying local files. Always complete the process: `npm run build` -> `git add .` -> `git commit` -> `git push`.

## Development Workflow
1. **Research & Reuse** — Check mg-mobile-app for shared components and utilities
2. **Plan First** — Use planner agent for complex features
3. **TDD** — RED → GREEN → IMPROVE cycle
4. **Code Review** — Use code-reviewer agent
5. **Commit & Push** — Conventional format with full history analysis

## iPad-specific Guidelines
- **Target Devices**: iPad Pro (12.9", 11"), iPad (10.9", 10.2"), iPad Mini
- **Layout**: Sidebar (200-240px) + Main Content (landscape), Stacked (portrait)
- **Responsive Breakpoints**:
  - 1366px+: iPad Pro 12.9"
  - 1194px+: iPad Pro 11"
  - 1024px+: iPad (10.9", 10.2")
  - 768px+: iPad Mini
- **Touch Optimization**: Tap targets 44x44px minimum
- **Gestures**: Support mouse, trackpad, Apple Pencil (future)

## Code Quality Standards
- **Functions**: < 50 lines
- **Files**: < 800 lines
- **Components**: Focused, reusable
- **Test Coverage**: 80%+ required

## Shared Assets
- Reuse components from mg-mobile-app when possible
- Extend rather than duplicate
- Keep Firebase auth/DB consistent with mobile version
