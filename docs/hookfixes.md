# Hook State Management Fix Report

## Issue Summary
The hook selection was not being saved to the user's picked content. After selecting a hook from the carousel, the flow would skip to the body step without properly saving the selected hook to the deck state.

Additionally, the Studio Settings panel was losing values when transitioning between phases, causing "undefined" values and React controlled/uncontrolled input warnings.

## Root Causes Identified

### 1. Stale Closure Bugs in usePostGeneration.ts
Multiple callbacks were capturing stale state from their closures due to improper dependency arrays and React's closure mechanism.

**Problem:** When callbacks like `selectStep`, `selectHook`, `handleOptionSelect` were created, they captured the state values (`hand.options`, `deck.topic`, `hand.type`) at creation time. When these callbacks were invoked later, they used the stale values instead of the current state.

**Key Issues:**
- `selectStep` captured `hand.options` from closure
- `selectHook` captured `deck.topic` from closure  
- `handleOptionSelect` captured `hand.type` from closure and used a stale `actions` object
- All dependent callbacks were being recreated when dependencies changed, but still held stale references

### 2. Incorrect Deck Property Mapping
When updating the deck state, the step name wasn't being correctly mapped to the deck property name.

**Bug Location:** Line 140 in `usePostGeneration.ts`

```typescript
// BEFORE (BUGGY):
setDeck((p) => ({ ...p, [step === "topics" ? "topic" : step]: option }));

// Problem: When step === "hooks", it sets deck.hooks but DeckType expects deck.hook
```

The ternary only handled `"topics"` → `"topic"` mapping, but not `"hooks"` → `"hook"`.

### 3. Studio Settings Not Persisting
The Studio Settings panel was losing values because:

**Issue A: Settings not included in generation call**
In `ChatInput.tsx`, `handleGenerate` only passed `{ intent, length, magicMode, researchMode }`, but `initialSettings` contained `language`, `emojiLevel`, `tone`, and `researchDepth` which got lost.

**Issue B: Settings panel inputs becoming undefined**
The SettingsPanel component received settings values without fallbacks. When the component re-rendered during the building phase, these values could become undefined, causing React's controlled/uncontrolled input warning.

**Issue C: ChatInput local state not syncing**
The local state in `ChatInput` (`intent`, `length`, `magicMode`) was initialized from `initialSettings` only on mount, but never updated when `initialSettings` changed during the building phase.

## Changes Made

### File: `src/hooks/usePostGeneration.ts`

#### 1. Added State Refs for Fresh State Access
```typescript
const handRef = useRef(hand);
const deckRef = useRef(deck);

useEffect(() => {
  handRef.current = hand;
}, [hand]);

useEffect(() => {
  deckRef.current = deck;
}, [deck]);
```

#### 2. Fixed selectStep to Use Ref
Changed from reading `hand.options` from closure to reading from `handRef.current.options`:
```typescript
const currentOptions = handRef.current.options;
if (currentOptions && Array.isArray(currentOptions)) {
  setOptionsCache((p) => ({ ...p, [step]: currentOptions }));
}
```

#### 3. Fixed selectHook to Use Ref
Changed from reading `deck.topic` from closure to reading from `deckRef.current.topic`:
```typescript
const selectHook = useCallback(
  (h: string) =>
    selectStep("hooks", h, "body", {
      hook: h,
      topic: deckRef.current.topic,  // Use ref instead of closure
      intent: settings.intent,
      length: settings.length,
    }),
  [selectStep, settings.intent, settings.length]
);
```

#### 4. Fixed handleOptionSelect to Use Ref
Changed from using stale `hand.type` from closure to reading from `handRef.current.type`:
```typescript
const handleOptionSelect = useCallback(
  (opt: string) => {
    const currentType = handRef.current.type;  // Use ref instead of closure
    if (currentType === "topics") {
      selectTopic(opt);
    } else if (currentType === "hooks") {
      selectHook(opt);
    } else if (currentType === "body") {
      selectBody(opt);
    } else if (currentType === "cta") {
      selectCTA(opt);
    }
  },
  [selectTopic, selectHook, selectBody, selectCTA]
);
```

#### 5. Fixed Deck Property Mapping
Added proper mapping from `"hooks"` to `"hook"`:
```typescript
setDeck((p) => ({ 
  ...p, 
  [step === "topics" ? "topic" : step === "hooks" ? "hook" : step]: option 
}));
```

#### 6. Fixed handleStart to Use New Settings
Changed from using stale `settings.researchDepth` to using the new settings passed in:
```typescript
const data = await generateContent("topics", {
  input: topicInput,
  researchDepth: newSettings.researchDepth ?? settings.researchDepth,
});
```

#### 7. Fixed Other Callbacks Using Stale State
Updated the following callbacks to use refs instead of closure-captured state:
- `handleRegenerate` - now uses `deckRef.current` and `handRef.current`
- `handleRegenerateWithStyle` - now uses `deckRef.current` and `handRef.current`
- `handleConfirmPolish` - now uses `deckRef.current`
- `handleRePolish` - now uses `deckRef.current`
- `handleCopy` - now uses `deckRef.current`

### File: `src/components/layout/ChatInput.tsx`

#### 1. Fixed handleGenerate to Preserve All Settings
Changed from passing only some settings to spreading all initialSettings:
```typescript
const handleGenerate = () => {
  if (!topic.trim()) return;
  const settingsToSave = { 
    ...initialSettings,  // Preserve all existing settings
    intent, 
    length, 
    magicMode, 
    researchMode 
  };
  onSettingsChange(settingsToSave);
  onGenerate(topic, settingsToSave);
};
```

#### 2. Added Sync Effect for Building Phase
Added useEffect to sync local state with initialSettings when in building phase:
```typescript
useEffect(() => {
  if (currentStep) {
    setIntent(initialSettings.intent || "viral");
    setLength(initialSettings.length || "medium");
    setMagicMode(initialSettings.magicMode || false);
  }
}, [currentStep, initialSettings.intent, initialSettings.length, initialSettings.magicMode]);
```

#### 3. Fixed SettingsPanel Fallback Values
Added nullish coalescing operators to ensure inputs always have defined values:
```typescript
<SettingsPanel
  language={initialSettings.language || "id"}
  setLanguage={(l) => onSettingsChange({ ...initialSettings, language: l })}
  emojiLevel={initialSettings.emojiLevel ?? 5}
  setEmojiLevel={(v) => onSettingsChange({ ...initialSettings, emojiLevel: v })}
  tone={initialSettings.tone ?? 5}
  setTone={(v) => onSettingsChange({ ...initialSettings, tone: v })}
  researchDepth={initialSettings.researchDepth ?? 3}
  setResearchDepth={(v) =>
    onSettingsChange({ ...initialSettings, researchDepth: v })
  }
/>
```

## Result
The flow now correctly progresses through all steps:
1. **Topic** - User selects a topic
2. **Hook** - User selects a hook (now properly saved)
3. **Body** - User selects body content
4. **CTA** - User selects call-to-action
5. **Confirm** - Review and polish

All settings configured in the Studio Settings panel (language, emojiLevel, tone, researchDepth) are now properly preserved throughout the entire flow.

## Testing Recommendations
1. Test the complete flow: topic → hook → body → cta → confirm
2. Verify that the hook appears in the Canvas sidebar after selection
3. Test the back button to ensure hook is properly restored
4. Test regeneration at each step to ensure state consistency
5. Verify final post includes the selected hook
6. Test Studio Settings: Change language, emoji level, tone, and research depth before starting, verify they persist through all phases
7. Test that settings can be changed during the building phase via the Studio Settings panel

## Related Files
- `src/hooks/usePostGeneration.ts` - Main hook with state management
- `src/components/layout/ChatInput.tsx` - Input component with settings
- `src/components/features/post-generator/OptionCarousel.tsx` - UI for selecting options
- `src/components/canvas/Canvas.tsx` - Displays selected content
- `src/components/features/post-generator/BuildingPhase.tsx` - Container for building phase
- `src/components/layout/SettingsPanel.tsx` - Studio settings panel
