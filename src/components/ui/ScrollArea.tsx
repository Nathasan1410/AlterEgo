"use client";

import { forwardRef } from "react";
import { cn } from "@/src/utils";

interface ScrollAreaProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

const ScrollArea = forwardRef<HTMLDivElement, ScrollAreaProps>(
  ({ children, className = "", ...props }, ref) => {
    return (
      <div ref={ref} className={cn("custom-scrollbar overflow-y-auto", className)} {...props}>
        {children}
      </div>
    );
  }
);

ScrollArea.displayName = "ScrollArea";

export default ScrollArea;
