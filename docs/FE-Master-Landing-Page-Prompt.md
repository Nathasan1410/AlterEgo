# FE Master - Landing Page Implementation Prompt

## Project Overview

**Project:** AlterEgo - AI-Powered LinkedIn Post Generator  
**Hackathon:** Commit To Change 2026  
**Sponsor:** OPIK AI ⭐  
**Tech Stack:** Next.js 16, React 18, TypeScript, Tailwind CSS, Framer Motion, GSAP

---

## Objective

Create a stunning, animated landing page for AlterEgo that showcases the product, its features, market opportunity, and competitive advantages. The landing page must use **Magic Bento** layout with **Plasma background** for a minimalistic yet premium feel.

---

## Landing Page Sections

### 1. Hero Section
- **Headline:** "Transform Your LinkedIn Presence in Minutes, Not Hours"
- **Subheadline:** "AI-powered personal branding coach that clones your authentic writing style and crafts viral content."
- **CTA:** Large "GET STARTED" button (primary variant - orange gradient)
- **Background:** Plasma animation (custom color: #f97316 brand orange)
- **Visual:** Subtle floating AI/brain graphic or abstract shape

### 2. Problem Statement
- **Headline:** "The Challenge: Creating Viral LinkedIn Content"
- **Content** (presented as Magic Bento cards):
  1. **Time-Consuming** - 1-2 hours to write a high-quality post
  2. **Inconsistent Quality** - Quality varies based on mood and creativity
  3. **Unpredictable Results** - Generic tools don't capture unique voice
  4. **Market Gap** - $8B opportunity, no LinkedIn-optimized AI solution

### 3. Solution Overview
- **Headline:** "Introducing AlterEgo"
- **Content** (Magic Bento cards with icons):
  1. 🎯 **Style Cloning** - Upload past posts, AI learns your voice
  2. ⚡ **AI Generation** - Topics, hooks, body, CTAs in 2 minutes
  3. 🎙️ **Voice Input** - Hands-free content creation
  4. 🔍 **Web Research** - Real-time context and trends
  5. 📊 **Viral Scoring** - AI-powered quality assessment (0-100)
  6. 🌍 **Multi-Language** - Support for Indonesian and English

### 4. How It Works
- **Headline:** "The Agentic Workflow"
- **Flow visualization** (animated):
  1. Input → Type topic or use voice
  2. Generate → AI generates multiple options
  3. Select → Choose the best from each phase
  4. Score → Get viral score and quality assessment
  5. Publish → Copy to LinkedIn

### 5. Videos Section
- **Headline:** "See AlterEgo in Action"
- **Content:**
  - **Pitch Deck Video** (embed placeholder or mock)
  - **Demo Video** (embed placeholder or mock)
  - Both videos should be in a responsive layout (side-by-side on desktop, stacked on mobile)

### 6. App Screenshots Carousel
- **Headline:** "Beautiful, Intuitive Interface"
- **Content:** Carousel of app screenshots showing:
  1. Style Analysis / Onboarding
  2. Post Generation Wizard
  3. Focus Mode / Building Phase
  4. Result Phase with Viral Score
  5. Opik Dashboard Integration
- **Carousel Requirements:**
  - Auto-play with pause on hover
  - Navigation dots
  - Previous/Next arrows
  - Smooth transitions (slide or fade)
  - Responsive (1-2 cards on mobile, 3 on tablet, 4 on desktop)

### 7. Market Analysis
- **Headline:** "A $8B Market Opportunity"
- **Content** (Magic Bento cards with statistics):
  1. **900M+** LinkedIn users globally
  2. **100M+** Professional content creators
  3. **50M+** B2B marketers
  4. **73% YoY** AI adoption growth
  5. **15% YoY** LinkedIn user growth
  6. **$8B+** Annual content marketing spend

### 8. Why We're Better
- **Headline:** "What Sets Us Apart"
- **Content** (Magic Bento cards):
  1. **Purpose-Built for LinkedIn** - Not generic AI, optimized for LinkedIn's algorithm
  2. **Style Cloning** - First-to-market digital twin technology
  3. **OPIK Observability** ⭐ - Real-time AI tracing, quality monitoring
  4. **Agentic Workflow** - Multi-agent system (Researcher → Drafting → Self-Correction)
  5. **Multi-Language** - Support for Indonesian and English
  6. **Sub-Second Inference** - Powered by Groq Llama 3.3 70B

### 9. Competitive Comparison
- **Headline:** "Compare with Competitors"
- **Content:** Simple comparison table or cards:
  - **AlterEgo** vs Jasper AI vs Copy.ai vs ChatGPT Plus
  - Focus on: Style Cloning, LinkedIn Optimization, Observability, Price, Speed

### 10. Technology Stack
- **Headline:** "Built on Cutting-Edge Technology"
- **Content** (Tech stack logos/names with brief descriptions):
  - Next.js 16 - Modern React framework
  - Groq Llama 3.3 70B - Sub-second AI inference
  - OPIK AI ⭐ - Real-time observability
  - Tavily AI - Real-time web research
  - OpenAI Whisper - Voice transcription
  - TypeScript - Type-safe development

### 11. CTA Section
- **Headline:** "Ready to Transform Your LinkedIn Presence?"
- **Subheadline:** "Join thousands of professionals creating viral content with AlterEgo."
- **CTA:** Large "GET STARTED FREE" button (primary variant)
- **Secondary CTA:** "Watch Demo" (ghost variant with arrow icon)

### 12. Social Media Links
- **Content:** Social media icons (dummy links):
  - Twitter/X
  - LinkedIn
  - GitHub
  - Instagram
  - YouTube
- **Style:** Minimalist icons in footer or bottom section

---

## Design Requirements

### Color Scheme (Digital Dark Theme)
```css
/* Brand Colors */
--brand-primary: #f97316;      /* Electric Orange */
--brand-glow: rgba(249, 115, 22, 0.15);

/* Dark Theme */
--canvas-page: #050505;       /* Almost Black */
--canvas-panel: #0a0a0a;      /* Panel BG */
--surface-weak: #171717;      /* Weak Surface */
--border-subtle: #262626;    /* Subtle Border */

/* Text Colors */
--text-muted: #a3a3a3;       /* Neutral-400 */
--text-body: #d4d4d4;        /* Neutral-300 */
--text-strong: #ffffff;       /* White */

/* Semantic */
--semantic-success: #10b981;   /* Green */
--semantic-ai: #8b5cf6;      /* Violet (for AI/Magic) */
```

### Typography
- **Font Family:** Inter, system-ui, -apple-system, sans-serif
- **Headings:** Bold, gradient-text effect
- **Body:** Regular weight, line-height 1.6
- **CTA:** Bold, uppercase for primary buttons

### Magic Bento Layout
- Use the provided **Magic Bento** component from React Bits
- Grid layout with varying card sizes
- Responsive breakpoints:
  - Mobile: 1 column
  - Tablet: 2 columns
  - Desktop: 3-4 columns with span variations
- Enable: spotlight, borderGlow, tilt, clickEffect
- Glow color: Brand orange (#f97316)

### Plasma Background
- Use the provided **Plasma** component from React Bits
- Custom color: Brand orange (#f97316)
- Position: Fixed, z-index: -1
- Opacity: 0.6-0.8 for subtle effect
- Interactive: Mouse tracking enabled

### Animation Requirements
**MUST BE ANIMATED** throughout:
1. **Scroll Animations:**
   - Fade in on scroll (Framer Motion)
   - Stagger animations for lists/cards
   - Parallax effects for background

2. **Hover Effects:**
   - Cards scale up slightly
   - Border glow intensifies
   - Text colors shift
   - Smooth transitions (0.2s cubic-bezier)

3. **Magic Bento Effects:**
   - Particle burst on hover
   - Spotlight follows mouse
   - Border glow animation
   - Click ripple effect

4. **Micro-Interactions:**
   - Button hover states
   - Link underline animations
   - Icon bounce/pulse
   - Counter animations for numbers

### Button Variants (from existing codebase)
```typescript
variant: "primary" | "secondary" | "ghost" | "danger" | "outline" | "magic"

// Primary (GET STARTED)
background: linear-gradient(135deg, #ea580c 0%, #c2410c 100%);
color: #ffffff;
box-shadow: 0 4px 6px -1px rgba(234, 88, 12, 0.2);

// Secondary (neutral)
background: #f5f5f4;
color: #1c1917;
border: 1px solid #e7e5e4;

// Ghost
background: transparent;
color: #57534e;

// Magic (AI-related)
background: #8b5cf6;
color: #fff;
box-shadow: 0 4px 12px rgba(139, 92, 246, 0.25);
```

---

## Implementation Guide

### File Structure
```
app/
  page.tsx                          # Landing page (replace existing)
  layout.tsx                        # Root layout (keep existing)
  globals.css                       # Global styles (keep existing)

components/
  landing/
    MagicBento.tsx                  # Bento grid component
    Plasma.tsx                      # Plasma background component
    HeroSection.tsx                 # Hero with CTA
    ProblemSection.tsx              # Problem statement (bento)
    SolutionSection.tsx            # Solution (bento)
    WorkflowSection.tsx            # How it works (animated flow)
    VideosSection.tsx              # Pitch deck & demo videos
    ScreenshotsCarousel.tsx        # App screenshots carousel
    MarketSection.tsx              # Market analysis (bento)
    CompetitiveSection.tsx         # Why we're better (bento)
    ComparisonSection.tsx          # Competitor comparison
    TechStackSection.tsx           # Technology stack
    CTASection.tsx                 # Final CTA
    SocialLinks.tsx                # Social media icons

  ui/
    Button.tsx                     # (keep existing)
    Card.tsx                       # (keep existing)
    // ... other UI components
```

### Key Components

#### 1. MagicBento Component
Use the exact code provided in the prompt. Adapt it to:
- Use brand color (#f97316) for glow
- Adjust card data for landing page sections
- Enable spotlight, borderGlow, tilt, clickEffect

#### 2. Plasma Component
Use the exact code provided in the prompt. Configure:
- Color: #f97316 (brand orange)
- Speed: 0.6
- Opacity: 0.7
- Mouse interactive: true

#### 3. ScreenshotsCarousel Component
```typescript
// Features:
- Auto-play with interval (5000ms)
- Pause on hover
- Navigation dots (clickable)
- Previous/Next buttons
- Smooth slide transition (Framer Motion)
- Responsive: 1/2/3/4 cards per view
- Lazy loading for images
```

#### 4. Animated Flow (How It Works)
```typescript
// Use Framer Motion for:
- Step-by-step visualization
- Animated arrows connecting steps
- Icons that pulse/animate
- Number counter (1 → 5)
- Progress bar animation
```

---

## Code Style Guidelines

Follow existing code style from project:

### TypeScript
- Strict mode enabled
- Explicit types for props
- Interfaces over types for objects
- No `any` types (use `unknown` if necessary)
- Proper error handling

### React
- Functional components with hooks
- Props interfaces defined explicitly
- Use `useCallback`, `useMemo` for performance
- Proper key props in lists
- Client components marked with `"use client"`

### Styling
- Tailwind CSS utility classes
- No inline styles (use Tailwind)
- Accept `className` prop for customization
- Use motion components from Framer Motion
- Follow naming convention: `variant`, `size`, `className`

### Imports
```typescript
// External libraries
import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';

// Internal modules
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import type { LandingSectionProps } from '@/types/landing';
```

---

## Performance Considerations

1. **Lazy Loading:**
   - Lazy load sections below the fold
   - Lazy load carousel images
   - Dynamic import for heavy components

2. **Animations:**
   - Use `transform` and `opacity` for GPU acceleration
   - Disable complex animations on mobile if needed
   - Use `will-change` sparingly

3. **Bundle Size:**
   - Tree-shake unused GSAP plugins
   - Use `dynamic` imports for Framer Motion heavy components
   - Optimize images (WebP format, appropriate sizes)

---

## Responsive Design

### Breakpoints
```css
/* Mobile: < 640px */
- Single column layout
- Simplified animations
- Smaller fonts
- Touch-friendly buttons

/* Tablet: 640px - 1024px */
- 2 column bento grid
- Side-by-side videos (if space allows)
- 2-3 cards in carousel

/* Desktop: > 1024px */
- 3-4 column bento grid
- Full layout
- 4 cards in carousel
- Enhanced animations
```

---

## Content Guidelines

### Tone
- Professional yet approachable
- Confident and authoritative
- Data-driven (include specific numbers)
- Action-oriented (strong CTAs)

### Copywriting
- Keep headlines short and punchy
- Use bullet points for easy scanning
- Highlight key metrics and benefits
- Include "OPIK AI" mention prominently (⭐)

### OPIK Integration Highlights
- Mention OPIK in multiple sections
- Add OPIK logo where appropriate
- Emphasize observability and quality monitoring
- Highlight "Powered by OPIK AI" as sponsor credit

---

## Testing Checklist

### Functional Requirements
- [ ] All sections render correctly
- [ ] GET STARTED button navigates to app
- [ ] Carousel auto-plays and can be controlled
- [ ] Videos load (placeholders work)
- [ ] Social links are clickable
- [ ] Animations trigger on scroll/hover

### Visual Requirements
- [ ] Magic Bento layout displays correctly
- [ ] Plasma background is visible and interactive
- [ ] Brand colors used consistently
- [ ] Typography is readable at all sizes
- [ ] Hover effects work as expected
- [ ] Animations are smooth (no jank)

### Performance
- [ ] Lighthouse score > 90
- [ ] Initial load < 3s
- [ ] Animations run at 60fps
- [ ] No console errors

### Responsive
- [ ] Mobile layout works (320px+)
- [ ] Tablet layout works (640px-1024px)
- [ ] Desktop layout works (> 1024px)
- [ ] Carousel adapts to screen size

---

## Deliverables

### Required Components
1. ✅ `MagicBento.tsx` - Bento grid with animations
2. ✅ `Plasma.tsx` - Animated background
3. ✅ `HeroSection.tsx` - Hero with CTA
4. ✅ `ProblemSection.tsx` - Problem statement (bento)
5. ✅ `SolutionSection.tsx` - Solution (bento)
6. ✅ `WorkflowSection.tsx` - How it works (animated)
7. ✅ `VideosSection.tsx` - Pitch deck & demo
8. ✅ `ScreenshotsCarousel.tsx` - App screenshots
9. ✅ `MarketSection.tsx` - Market analysis (bento)
10. ✅ `CompetitiveSection.tsx` - Why better (bento)
11. ✅ `ComparisonSection.tsx` - Competitor table
12. ✅ `TechStackSection.tsx` - Technology stack
13. ✅ `CTASection.tsx` - Final CTA
14. ✅ `SocialLinks.tsx` - Social media icons
15. ✅ `page.tsx` - Landing page composition

### Additional Assets
- Placeholder images for:
  - App screenshots (use generic UI mockups)
  - Team member photos (optional)
  - Technology logos (SVG or CDN)

---

## Important Notes

### OPIK AI Sponsorship
- ⭐ Acknowledge OPIK AI as primary sponsor
- Include OPIK logo in relevant sections
- Mention observability benefits
- Add "Powered by OPIK AI" tagline

### Animation Performance
- Test animations on low-end devices
- Consider `prefers-reduced-motion` media query
- Disable animations on battery saver mode

### Accessibility
- ARIA labels for all interactive elements
- Keyboard navigation support
- Alt text for all images
- Focus indicators for buttons/links

### SEO Considerations
- Meta tags for title and description
- Open Graph tags for social sharing
- Structured data (Schema.org)
- Semantic HTML structure

---

## Reference Links

### React Bits Components
- **Magic Bento:** https://reactbits.dev/t/magic-bento
- **Plasma:** https://reactbits.dev/t/plasma

### Documentation
- **Framer Motion:** https://www.framer.com/motion/
- **GSAP:** https://greensock.com/gsap/
- **Next.js:** https://nextjs.org/docs
- **Tailwind CSS:** https://tailwindcss.com/docs

---

## Success Metrics

- **Visual Impact:** Stunning, memorable design that stands out
- **Animation Quality:** Smooth, purposeful animations (no motion sickness)
- **Performance:** Fast loading, 60fps animations
- **Conversion:** Clear CTAs that drive signups
- **Brand Consistency:** Follows Digital Dark theme perfectly
- **Mobile Experience:** Fully functional on all devices

---

## Next Steps

1. Set up component structure in `components/landing/`
2. Install dependencies: `gsap`, `ogl` (for Plasma)
3. Create base layout with Magic Bento and Plasma
4. Implement sections one by one (Hero → Problem → Solution → ...)
5. Add scroll animations with Framer Motion
6. Implement carousel component
7. Integrate all sections into `page.tsx`
8. Test responsiveness and performance
9. Polish animations and interactions
10. Deploy and verify functionality

---

## Questions?

If clarification is needed on:
- Specific section content
- Animation behavior
- Color or styling choices
- Component architecture
- Performance optimization

Please ask before proceeding!

---

**Build something amazing! 🚀**

🏆 Powered by OPIK AI - Observability for AI Excellence ⭐
