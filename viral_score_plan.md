# Feature Plan: Viral Score Indicator (The "Brain Reveal") 🧠

**Goal:** Menjawab pertanyaan user "Apakah hasil ini bagus?" dengan data real-time, sekaligus memamerkan fitur "Evaluation" kita ke pengguna (dan Juri).

## Konsep
Saat ini, logika scoring (`scoreHook`, `scoreBody`) terkubur di script backend. User gak liat.
Kita akan **memindahkan logika ini ke Shared Library** supaya bisa dipanggil di Frontend.

## User Experience
Pas postingan selesai dibuat, user bakal lihat:
1.  **Viral Score Badge:** "viral Score: 88/100" (Warna Hijau/Kuning/Merah).
2.  **Breakdown (Tooltip/Modal):**
    *   ✅ Hook contains 'Numbers' (+10)
    *   ✅ Length is optimal (Medium) (+20)
    *   ⚠️ Emoji density low (-5)

## Technical Steps

### 1. Extract Logic (`lib/scoring.ts`)
Pindahkan fungsi `scoreHook` dan `scoreBody` dari `scripts/runEvaluation.ts` ke file baru di `lib/scoring.ts`. Pastikan kode ini "Pure TypeScript" (gak pake library Node.js) biar bisa jalan di Browser `layout.tsx`.

### 2. Frontend Integration (`PostGeneratorWizard.tsx`)
*   Import `calculateScore` dari `lib/scoring.ts`.
*   Setiap kali `handleConfirmPolish` selesai, hitung skor `deck.final` secara real-time.
*   Simpan skor di state React.

### 3. UI Implementation
*   Tambahkan komponen "ScoreCard" di bawah hasil postingan.
*   Tampilkan teks: *"Agent Confidence: High (Agent yakin post ini bakal viral)"*.

## Why this wins?
*   **Proof:** Membuktikan kita gak cuma generate teks, tapi kita *mengerti* framework viral.
*   **Interactive:** User merasa dibimbing oleh "Coach", bukan cuma "Tools".
