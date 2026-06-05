# Next.js template

This is a Next.js template with shadcn/ui.

# Life Savers Match-3 Playable Ad

## Objective

Build a mobile-first playable ad inspired by the uploaded Life Savers Match-3 gameplay flow.

The experience should mimic a simplified Candy Crush style game and demonstrate the core gameplay loop within a short session (15–20 seconds).

The playable must guide users through:

Start Screen → Gameplay → Match Feedback ("Great") → End Screen → CTA

The goal is to:

- Teach gameplay immediately
- Create a satisfying match interaction
- Reward the player with visible feedback
- Drive users to click the CTA

## What happens after a swap:

- If the swap creates a valid match, those candies are removed and you score points.
- If the swap does not create a match, the candies return to their original positions (no points).
- Removed candies cause others to fall down and new candies spawn from the top automatically.

---

# Reference Flow

Expected flow:

1. Preview Loaded
2. Start Screen
3. Play Button Click
4. Gameplay Board
5. User Swaps Candy
6. Valid Match
7. "Great" Feedback
8. Score Update
9. Continue Playing
10. Time Up / Moves End
11. End Screen
12. CTA Click

---

# Game Scope

This is NOT a full production game.

Only implement the minimum polished gameplay necessary to:

- Demonstrate match-3 mechanics
- Showcase score feedback
- Showcase swap and refill animations
- Reach the CTA quickly

Target session length:

15–20 seconds

---

# Analytics Events

All events should be tracked.

## Preview Loaded

Fire once when playable loads.

```ts
track("preview_loaded")
```

---

## Play Button Clicked

Fire when user starts gameplay.

```ts
track("play_clicked")
```

---

## Candy Swapped

Fire on every attempted swap.

```ts
track("candy_swapped")
```

---

## Valid Match Completed

Fire when a swap creates a valid match.

```ts
track("valid_match_completed")
```

---

## Invalid Swap

Fire when a swap does not create a valid match.

```ts
track("invalid_swap")
```

---

## Score Updated

Fire whenever score changes.

```ts
track("score_updated", {
  score,
})
```

---

## Game Completed

Fire when game reaches completion.

```ts
track("game_completed")
```

---

## CTA Clicked

Fire when user taps CTA.

```ts
track("cta_clicked")
```

---

# Game States

Use a finite state approach.

```ts
type GameState = "loading" | "start" | "playing" | "feedback" | "completed"
```

---

# Start Screen

Display:

- Life Savers branding
- Background artwork
- Play button
- Optional short tutorial text

Example:

```text
Match candies and score points!
```

User taps Play.

Transition:

```text
Start Screen
      ↓
Gameplay Screen
```

---

# Gameplay Screen

Display:

## Header

- Score
- Remaining Time or Moves

Example:

```text
Score: 0
Time: 20
```

---

## Board

Recommended size:

```text
6 x 6
```

or

```text
7 x 7
```

Use candy icons/colors from provided assets.

---

# Match Rules

A match occurs when:

```text
3 or more candies
of the same type
align horizontally
or vertically
```

---

# Valid Swap Flow

When user performs a valid move:

1. Swap candies
2. Detect match
3. Remove matched candies
4. Add score
5. Show "Great"
6. Drop candies
7. Refill board
8. Detect chain reactions
9. Continue gameplay

Tracking:

```ts
track("candy_swapped")
track("valid_match_completed")
track("score_updated")
```

---

# Invalid Swap Flow

When swap does not create a match:

1. Swap animation
2. Detect no match
3. Revert swap
4. Show subtle invalid feedback

Tracking:

```ts
track("candy_swapped")
track("invalid_swap")
```

---

# Scoring System

Example scoring:

```text
3 Match = 100
4 Match = 200
5 Match = 300
```

Score updates immediately after match completion.

---

# Match Feedback

After a successful match:

Display:

```text
Great!
```

Animation:

- Scale up
- Fade out

Duration:

```text
500ms - 800ms
```

Position:

Center of gameplay board.

---

# Refill System

After candies are cleared:

## Step 1

Candies above fall downward.

## Step 2

Empty spaces are refilled.

## Step 3

Automatically check for chain reactions.

Continue until:

```text
No additional matches exist
```

---

# Animation Requirements

Animations should feel polished and responsive.

## Swap

```text
150ms - 250ms
```

---

## Clear

```text
200ms
```

---

## Fall

```text
200ms - 300ms
```

---

## Refill

```text
200ms
```

---

## Feedback

```text
500ms - 800ms
```

---

# Timer / Moves

Choose ONE approach.

## Recommended

Timer-based gameplay.

```text
20 seconds
```

Display:

```text
Time Left: 20
```

Countdown continuously.

When timer reaches zero:

Transition to end screen.

---

# End Screen

Display:

- Final Score
- Completion message
- CTA Button

Example:

```text
Awesome Job!
```

```text
Final Score: 2300
```

CTA:

```text
Play Now
```

or

```text
Download Now
```

Tracking:

```ts
track("cta_clicked")
```

---

# CTA Destination

Landing page:

https://www.life-savers.com/

---

# Technical Requirements

## Framework

Preferred:

- React
- TypeScript

Optional:

- Framer Motion

---

# State Structure

Recommended:

```ts
type GameStore = {
  board: Candy[][]
  score: number
  timer: number
  gameState: GameState
  selectedCandy: Position | null
}
```

---

# Component Structure

```text
PlayableRoot
│
├── StartScreen
│
├── GameScreen
│   ├── Header
│   ├── Score
│   ├── Timer
│   ├── Board
│   ├── Candy
│   └── Feedback
│
└── EndScreen
```

---

# Mobile Requirements

Primary target:

Mobile devices.

Support:

- Tap
- Drag
- Swipe

Portrait orientation only.

Target widths:

```text
320px
375px
390px
414px
430px
```

---

# QA Checklist

## Tracking

- preview_loaded fires once
- play_clicked fires once
- candy_swapped fires every swap
- valid_match_completed fires correctly
- invalid_swap fires correctly
- score_updated contains latest score
- game_completed fires once
- cta_clicked fires once

---

## Gameplay

- Valid swaps score correctly
- Invalid swaps revert
- Board always remains filled
- No empty cells remain
- Chain reactions work
- Great feedback appears

---

## Mobile

- No overflow
- No clipping
- Smooth interactions
- Touch gestures work correctly

---

# Success Criteria

The playable is considered complete when:

1. User understands gameplay within 3 seconds.
2. User can complete at least one valid match.
3. Score visibly increases.
4. "Great" feedback appears.
5. Game ends automatically.
6. CTA is displayed.
7. All tracking events fire correctly.
8. Experience feels smooth on mobile devices.
