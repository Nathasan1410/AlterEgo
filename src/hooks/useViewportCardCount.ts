"use client";

import { useState, useEffect } from "react";

export interface UseViewportCardCountOptions {
  stepType: "topics" | "hooks" | "body" | "cta";
  isMobile: boolean;
  enabled?: boolean;
}

/**
 * Custom hook to calculate how many cards fit in the viewport without scrolling
 * Desktop: Dynamic calculation based on available height
 * Mobile: Fixed counts (will be made dynamic later)
 */
export function useViewportCardCount({
  stepType,
  isMobile,
  enabled = true,
}: UseViewportCardCountOptions): number {
  const [itemsPerPage, setItemsPerPage] = useState(() => {
    // Initial value based on mobile/desktop
    if (isMobile) {
      return stepType === "body" ? 1 : 2;
    }
    return 2; // Default for desktop
  });

  useEffect(() => {
    if (!enabled) return;

    if (isMobile) {
      // Mobile: Fixed counts for now (will be dynamic later)
      setItemsPerPage(stepType === "body" ? 1 : 2);
      return;
    }

    // Desktop: Calculate based on viewport
    const calculateFit = () => {
      const viewportHeight = window.innerHeight;

      // Account for UI elements
      // ChatInput is removed, so less header space needed
      const headerHeight = 100;
      const footerHeight = 40;
      const titleHeight = 50;
      const padding = 20;

      const availableHeight = viewportHeight - headerHeight - footerHeight - titleHeight - padding;

      // Estimate card height based on step type
      // Body cards are taller due to more content
      // Heavily increased body estimate to prevent internal scrolling
      const estimatedCardHeight = stepType === "body" ? 400 : 140;
      const cardGap = 16; // gap-4 = 16px between cards

      // Calculate how many cards fit
      const fitsCount = Math.floor(availableHeight / (estimatedCardHeight + cardGap));

      // Set limits based on step type
      const maxItems = {
        topics: 12,
        hooks: 12,
        body: 3,
        cta: 12,
      }[stepType];

      // Ensure at least 1 for body, 2 for others
      const minItems = stepType === "body" ? 1 : 2;
      const optimalCount = Math.min(Math.max(minItems, fitsCount), maxItems);

      setItemsPerPage(optimalCount);
    };

    calculateFit();

    // Recalculate on window resize
    window.addEventListener("resize", calculateFit);
    return () => window.removeEventListener("resize", calculateFit);
  }, [stepType, isMobile, enabled]);

  return itemsPerPage;
}
