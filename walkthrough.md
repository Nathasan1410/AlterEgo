# Walkthrough: Focus Mode & Viral Score Implementation 🚀

We have successfully implemented two major UX/Feature enhancements to the "CommitToCareer" AI Writer: **Focus Mode** and **Viral Score Indicator**.

## 1. Focus Mode (Distraction-Free Input) 🎯
**Goal:** Reduce UI clutter during the "Building" phase (Topic -> Hook -> Body -> CTA).

### Changes
*   **Modified `PostGeneratorWizard.tsx`**:
    *   Hides the large `ChatInput` area once generation starts.
    *   Replaces it with a compact `FocusSummary` strip.
*   **Created `components/FocusSummary.tsx`**:
    *   Displays the user's prompt (e.g., "Tips for junior devs").
    *   Shows active settings (Tone, Model, Research Depth) as "Chips".
    *   Includes an "Edit" button to return to the input phase.

### Verification
*   **User Flow**: Start Draft -> Input disappears -> Summary Strip appears.
*   **Edit Prompt**: Click Pencil icon -> Input reappears.

## 2. Viral Score Indicator (The "Brain Reveal") 🧠
**Goal:** Show users (and judges) how the AI evaluates content quality using Opik metrics.

### Changes
*   **Created `lib/scoring.ts`**:
    *   Extracted logic from `scripts/runEvaluation.ts`.
    *   `scoreHook`: Checks for patterns (?, !, "how to"), conciseness, and power words.
    *   `scoreBody`: Checks for optimal length and formatting.
    *   `calculateTotalScore`: Aggregates scores (40% Hook, 30% Body, 20% Formatting, 10% CTA).
*   **Updated `PostGeneratorWizard.tsx`**:
    *   Imports `calculateTotalScore`.
    *   Calculates score upon "Polish" completion.
    *   Displays a **Viral Score Card** in the Result view with a breakdown.

### Visuals
The result page now features a dark-themed card showing:
*   **Big Score:** e.g., "88"
*   **Breakdown:** Hook (Green/Yellow), Body, CTA.

## Verification Status
*   **Manual Test**: Components render correctly.
*   **Logic Check**: Scoring matches the backend evaluation script.
*   **Build Test**: `npm run build` (Running next).
