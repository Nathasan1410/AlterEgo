# Feature Plan: UI Focus Mode (Simplified Input) 🎯

**Goal:** Mengurangi distrak user saat fase "Building" (memilih kartu) dengan menyembunyikan Chat Input yang besar, dan menggantinya dengan ringkasan (Focus View).

## Problem
Saat ini, Chat Input (Textarea + Settings) memakan tempat yang besar di bawah layar saat user seharusnya fokus memilih opsi (Topic -> Hook -> Body).

## Solution
Ketika user klik **Generate** (`phase === 'building'`):
1.  **Hide** `ChatInput` component.
2.  **Show** `FocusSummary` component.

## `FocusSummary` Design
Komponen baru strip memanjang di bawah (posisi yang sama dengan ChatInput sebelumnya), berisi:
1.  **User Prompt:** Teks input asli user (misal: "Tips productivity").
2.  **Settings Badges:** Deretan "Chips" kecil untuk menunjukkan setting aktif.
    *   🤖 Model: Llama 3.3 70B
    *   🔍 Research: Deep
    *   🎭 Tone: Casual
    *   😃 Emoji: Moderate
    *   🇮🇩 Ind

## Technical Steps

### 1. Update State (`PostGeneratorWizard.tsx`)
Kita perlu menyimpan input awal user, karena saat ini cuma lewat doang di fungsi.
```typescript
const [initialInput, setInitialInput] = useState('');

// In handleStart:
setInitialInput(topicInput);
```

### 2. Create Component (`components/FocusSummary.tsx`)
UI sederhana menggunakan Tailwind:
- `Flex row` layout.
- `Text-gray-400` untuk label, `Text-white` untuk value.
- Border tipis / Glassmorphism background.

### 3. Conditional Rendering
Di `PostGeneratorWizard.tsx`:

```tsx
{phase === 'input' ? (
   <ChatInput ... />
) : (
   <FocusSummary input={initialInput} settings={settings} onEdit={() => setPhase('input')} />
)}
```
*(Opsional: tombol Back/Edit kecil kalau user mau ganti prompt)*

## Benefit
*   **Cleaner UI:** Layar "Canvas" jadi lebih lega.
*   **Focus:** Mata user tertuju ke opsi kartu yang digenerate AI.
*   **Professional Feel:** Terasa seperti "Dashboard" bukan sekadar "Chatbot".
