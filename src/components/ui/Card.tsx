"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface CardProps {
  variant?: "default" | "glass" | "hover" | "selected";
  onClick?: () => void;
  children: ReactNode;
  className?: string;
}

export default function Card({
  variant = "default",
  onClick,
  children,
  className = "",
}: CardProps) {
  const baseClasses = "p-6 rounded-xl border transition-colors duration-200";

  const variantClasses = {
    default: "bg-black/40 border-white/10 hover:border-white/20",
    glass: "bg-black/5 backdrop-blur-md border-white/10",
    hover: "bg-black/40 border-white/10 cursor-pointer hover:border-orange-500/50 hover:bg-black/5",
    selected: "bg-orange-500/10 border-orange-500/50 shadow-[0_0_15px_rgba(249,115,22,0.1)]",
  };

  return (
    <motion.div
      onClick={onClick}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      // REMOVED: whileHover scale effect
      // REMOVED: whileTap scale effect
    >
      {children}
    </motion.div>
  );
}
