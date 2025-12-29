# Button0 — Project Context & AI Guidelines

## Project Overview

**Button0** (pronounced *“button-zero”*) is a portfolio-quality frontend web project built as part of a DevOps bootcamp final project.

It is intentionally designed as a **“weird internet service”**:
- A single central button
- Infinite spammable interaction
- Rare glitch-like events
- Unlockable cosmetics
- Mysterious, cryptic, Y2K / glitch / Bungie–Marathon inspired aesthetic

Most of the time, nothing happens.  
Sometimes, something *very* strange happens.

---

## Tech Stack (Current)

### Frontend
- **React**
- **Vite**
- **TypeScript**
- **TailwindCSS**
- **Framer Motion**

### State & Persistence
- Local-only for now
- Uses `localStorage`
- Device-based identity (no accounts yet)

### Backend (Planned, NOT implemented yet)
- FastAPI (Python)
- Will later support:
  - Global counter
  - Cross-device persistence
  - Accounts / cross-save

---

## Core Gameplay / UX Rules

1. **The button can be spammed infinitely**
   - No cooldowns
   - No rate limits
   - Clicking should *never* be blocked

2. **Clicks**
   - Each user has a **local click count**
   - A global count will be added later (backend)

3. **Rare Events**
   - Occur infrequently
   - Trigger subtle visual + audio effects
   - Display short cryptic messages
   - Must NOT block interaction
   - Only one rare-event toast visible at a time

4. **Cosmetics**
   - Unlock via rare events
   - Persist locally
   - Two tiers:
     - **Normal**: simple, clean visual changes
     - **Ultra**: dramatic effects (glow, chromatic, animation, aura)
   - Cosmetics visually affect the **button itself**
   - Unlocking cosmetics triggers a longer, dopamine-inducing sound

5. **Toasts / Messages**
   - Non-blocking (`pointer-events: none`)
   - Persist briefly even while clicking
   - Only change on rare events, NOT normal clicks

---

## Current Project State

- App is stable and running locally
- Toast system implemented
- Rare events implemented
- Cosmetic system implemented
- Audio system exists (clicks + special events)
- Known focus: UX polish, balance, visual impact

---

## Git & Workflow

- Default branch: `master`
- Feature branches may exist but are merged into `master`
- Work happens on multiple machines
- Sync workflow:
  - Push from one machine
  - Pull on another
- `node_modules` is NOT committed
- `package-lock.json` IS committed

---

## AI USAGE GUIDELINES (IMPORTANT)

This project frequently uses AI (ChatGPT / GitHub Copilot) for assistance.

### AI models MUST follow these rules:

#### ❗ Architecture & Tools
- **DO NOT change architecture**
- **DO NOT introduce new libraries**
- **DO NOT refactor broadly unless explicitly asked**
- **DO NOT add backend code unless requested**

#### ❗ Code Style
- Prefer **small, targeted fixes**
- Avoid abstractions unless necessary
- Keep changes localized to relevant files
- Maintain existing patterns

#### ❗ UX Rules
- Never block button interaction
- Never interrupt clicking
- Effects should feel mysterious, subtle, and intentional
- Avoid loud or intrusive UI unless explicitly specified (e.g. ultra cosmetics)

#### ❗ TypeScript
- Prefer correct typing
- If necessary, use minimal narrowing or guarded access
- Avoid widening types unnecessarily

#### ❗ Output Expectations
- When asked for prompts: output **only the prompt**
- When asked for fixes: be precise, minimal, and explicit
- Avoid speculative changes

---

## Design Philosophy

Button0 is **not a game to win**.  
It is a **signal interface**.

- Minimal
- Strange
- Atmospheric
- Slightly unsettling
- Rewards curiosity, not optimization

---

## Repository

GitHub:
https://github.com/YonatanK0510/button0

---

## Notes for Future Development

Planned (later, not now):
- Backend persistence
- Global counter sync
- Accounts / cross-save
- Server-side rare event logic

Current priority:
- Frontend polish
- UX balance
- Visual + audio impact
- Stability

---

End of context.
