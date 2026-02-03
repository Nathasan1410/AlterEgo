# Implementation Plan - AI Quality & UX Upgrade (OpikAI)

## Status
- [x] AI Model Upgrade (Llama 3.3 70B)
- [x] Prompt Engineering Refinement
- [x] Focus Mode (Distraction-Free UI)
- [x] Viral Score Indicator (Opik Metrics)

## Goal
Improve the quality of generated content and enhance the user experience with professional "Focus Mode" and real-time "Viral Score" feedback.

## User Review Required
No major breaking changes. AI latency might increase slightly due to using a larger model (70B vs 8B) and score calculation.

## Completed Changes

### 1. AI Quality (`lib/ai-service.ts`)
*   **Model Upgrade**: Switched to `llama-3.3-70b-versatile` for all generation tasks.
*   **Prompt Refinement**: Enhanced Tone and Emoji instructions for stricter adherence.

### 2. Focus Mode (`components/`)
*   **New Component**: `FocusSummary.tsx` - a compact strip showing the prompt and active settings.
*   **Logic**: `PostGeneratorWizard.tsx` now hides the large input area during the building phase.

### 3. Viral Score Indicator (`lib/scoring.ts`)
*   **New Library**: `scoring.ts` containing `scoreHook`, `scoreBody`, and `calculateTotalScore`.
*   **UI Integration**: Added a "Viral Score Card" to the result view in `PostGeneratorWizard.tsx`.
*   **Metrics**:
    *   **Hook**: Patterns (?, !), Conciseness, Power Words.
    *   **Body**: Word count optimization, Formatting.
    *   **CTA**: Engagement checks.

## Verification Plan

### Automated Tests
*   `npm run build`: Ensure strict type safety for new components.
*   `npm run evaluate`: Run the backend evaluation script to verify scoring logic alignment.

### Manual Verification
1.  **Focus Mode**: Start a draft -> Verify Input disappears -> Verify Summary appears.
2.  **Viral Score**: Finish a draft -> Polish -> Verify Score Card appears with correct breakdown (Green/Yellow indicators).
