# UI Changes Report

## Date: 2026-02-06
## Overview
This report documents significant updates to the `Canvas` component, post generation logic, and viewport management to enhance user experience and content generation capabilities.

### 1. Canvas Settings Display Update
**File**: `src/components/canvas/Canvas.tsx`
- **Change**: Replaced the bulky `SettingsPanel` with a compact, badge-based summary.
- **Details**:
  - The user's specific **input prompt** (original prompt) is now preserved and displayed prominently.
  - Settings (Intent, Length, Research Depth, Emoji Density, Tone) are now displayed as **badges** with icons (`Search`, `Smile`, `Volume2`).
  - Added `originalPrompt` prop to the interface to support displaying the exact user input rather than just the generated topic.

### 2. Original Prompt Preservation
**Files**:
- `src/hooks/usePostGeneration.ts`
- `src/components/features/post-generator/PostGeneratorWizard.tsx`
- **Change**: Implemented state persistence for the initial user prompt.
- **Details**:
  - Added `originalPrompt` state to `usePostGeneration` hook.
  - This state captures the input from the `input` phase and preserves it through the `building` phase.
  - Passed this state down through the `PostGeneratorWizard` to the `Canvas` for display.

### 3. Dynamic Card Display & Viewport Logic
**File**: `src/hooks/useViewportCardCount.ts`
- **Change**: Overhauled the logic for calculating how many cards to display per page.
- **Details**:
  - **Dynamic Calculation**: Removed hard caps on card counts (previously 2). Now calculates counts based on `window.innerHeight`.
  - **Screen Usage**: Targeted **66% (2/3)** of screen height for the card display area.
  - **Refined Estimates**: Updated card height estimates (Body: 400px, Others: 140px) to ensure content fits comfortably without scrolling issues.
  - **Reduced Chrome**: Minimized specific header/footer padding reservations to maximize space for cards.

### 4. Increased Generation Limits
**Files**:
- `src/lib/constants.ts`
- `src/services/prompts/promptTemplates.ts`
- `src/services/adapters/groqAdapter.ts`
- **Change**: Significantly increased the number of options generated for each step.
- **Details**:
  - **Topics**: Increased from 6 to **10**.
  - **Hooks**: Increased from 3 to **10**.
  - **Body**: Increased from 2 to **5**.
  - **CTA**: Increased from 4 to **8**.
  - Updated prompt templates to explicitly request these higher counts from the LLM.
  - Updated default fallbacks in the Groq adapter to match these new expectations.

### 5. UI Cleanup
**File**: `src/components/features/post-generator/BuildingPhase.tsx`
- Removed the `ChatInput` component from the building phase to declutter the interface, relying solely on the card selection workflow.
