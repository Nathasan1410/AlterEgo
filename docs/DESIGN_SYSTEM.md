# CommitToCareer Design System & Color Report

## 🎨 Master Color Palette ("Energetic Productivity")

This report establishes the **Implementation Truth** based on the current codebase (`globals.css` and Component files).

### 1. Primary Colors (Orange Brand)
The core brand identity.

| Token | Hex | Tailwind/Var | Usage |
|-------|-----|--------------|-------|
| **Orange 500** | `#f97316` | `bg-orange-500` | Primary Button Gradient (Start), Sliders, Focus Rings, Toggle Active State |
| **Orange 600** | `#ea580c` | `bg-orange-600` | Primary Button Gradient (End), Text Gradient (Middle) |
| **Orange 400** | `#fb923c` | `bg-orange-400` | **Secondary Button Bg**, Wave Fills (Light Mode) |
| **Orange 100** | `#ffedd5` | `bg-orange-100` | Badge Backgrounds, Active Cards |
| **Orange 50** | `#fff7ed` | `bg-orange-50` | Subtle Backgrounds |

### 2. Neutral Colors
Structure and Text.

| Token | Hex | Usage |
|-------|-----|-------|
| **White** | `#ffffff` | Card Backgrounds, Inputs, Inputs, Text (on Orange) |
| **Warm White** | `#fffbf5` | Main Background Gradient (End) |
| **Gray 100** | `#f3f4f6` | Theme Toggle Inactive Bg, Scrollbar Track |
| **Gray 200** | `#e5e7eb` | Borders, Skeleton Loader (End) |
| **Gray 400** | `#9ca3af` | Slider Inactive Ticks, Disabled Text |
| **Gray 500** | `#6b7280` | Secondary Text, Placeholders |
| **Gray 800** | `#1f2937` | Headings, Body Text (Light Mode) |
| **Slate 900** | `#0f172a` | Dark Mode Background (Start) |
| **Slate 950** | `#020617` | Dark Mode Background (End) |

### 3. Semantic Colors

| Token | Hex | Usage |
|-------|-----|-------|
| **Red 500** | `#ef4444` | Destructive Button Bg, Recording Dot |
| **Red 600** | `#dc2626` | Text Gradient (End) |
| **Green 500** | `#22c55e` | Success State (Audio) |
| **Green 600** | `#16a34a` | "Style Active" Badge Text |
| **Blue 600** | `#2563eb` | Research Mode Icon |
| **Purple 600** | `#9333ea` | Magic Mode Icon |

---

## 🧩 Component Implementation Details

### 1. Buttons (`components/ui/Button.tsx`)
*Actual values found in the component code.*

*   **Primary Variant**:
    *   **Background**: `linear-gradient(135deg, #f97316 0%, #ea580c 100%)`
    *   **Text**: `#ffffff`
    *   **Hover**: Scale `1.05` (Framer Motion) - *Note: The shadow `0 6px 20px` in globals.css is available but not used by default in the component's inline styles.*
*   **Secondary Variant**:
    *   **Background**: `#fb923c` (Orange 400) - *Note: Differs from standard Gray secondary.*
    *   **Text**: `#ffffff`
*   **Ghost/Outline Variant**:
    *   **Border**: `2px solid #f97316`
    *   **Text**: `#f97316` or `var(--foreground)`
*   **Destructive Variant**:
    *   **Background**: `#ef4444`
    *   **Text**: `#ffffff`
*   **Disabled State**:
    *   **Opacity**: `0.6`
    *   **Cursor**: `not-allowed`

### 2. Inputs & Textareas
*   **Default**:
    *   **Bg**: `bg-white/50` (Translucent)
    *   **Border**: `border-gray-200`
    *   **Text**: `text-gray-900`
*   **Focus State** (`focus:ring-2`):
    *   **Ring**: `rgba(249, 115, 22, 0.5)` (Orange 500, 50% opacity)
    *   **Border**: `rgba(249, 115, 22, 0.5)`

### 3. Sliders (`components/ui/Slider.tsx`)
*   **Track Gradient**: `linear-gradient(to right, #f97316, #ea580c)`
*   **Thumb**: White with shadow
*   **Inactive Ticks**: `#9ca3af` (Gray 400)

### 4. Background Waves (`globals.css`)
*   **Wave 1**: Fill `#fb923c` (Orange 400), Opacity 0.8
*   **Wave 2**: Fill `#fb923c` (Orange 400), Opacity 0.6
*   **Wave 3**: Fill `#fb923c` (Orange 400), Opacity 0.4
*   *Dark Mode*: Uses `#f97316` (Orange 500) for waves.

---

## 🔍 Interaction States

| State | Visual Change | Implementation Method |
|-------|---------------|----------------------|
| **Button Hover** | Scale up 1.05x | Framer Motion (`whileHover`) |
| **Button Click** | Scale down 0.95x | Framer Motion (`whileTap`) |
| **Input Focus** | Orange Ring (2px) | Tailwind `focus:ring-orange-500/50` |
| **Card Hover** | Border Orange (30%), Lift | Tailwind `hover:border-orange-500/30` |
| **Toggle Click** | Bg White + Text Orange | React State Conditional Class |

## ⚠️ Discrepancy Note
The implementation of the **Secondary Button** in `Button.tsx` (Orange 400) differs from the design snippet provided (Gray 100/200).
