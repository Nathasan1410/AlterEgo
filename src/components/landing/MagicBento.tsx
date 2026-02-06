"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";

interface BentoCardProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  children?: React.ReactNode;
}

interface MagicBentoGridProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
}

const BentoCard = ({
  title,
  description,
  icon,
  size = "md",
  className = "",
  children,
}: BentoCardProps) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  const sizeClasses = {
    sm: "col-span-1 row-span-1",
    md: "col-span-1 row-span-1 md:col-span-2",
    lg: "col-span-1 row-span-2 md:col-span-2",
    xl: "col-span-1 row-span-2 md:col-span-3",
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      className={`relative flex flex-col items-start overflow-hidden rounded-2xl border border-[#262626] bg-[#171717] p-8 text-left transition-all duration-300 hover:border-[#f97316]/50 hover:shadow-[0_0_30px_rgba(249,115,22,0.15)] ${sizeClasses[size]} ${className}`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5 }}
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: `radial-gradient(600px circle at ${mousePos.x}px ${mousePos.y}px, rgba(249, 115, 22, 0.06), transparent 40%)`,
        }}
      />

      {icon && (
        <motion.div
          className="mb-4"
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
        >
          {icon}
        </motion.div>
      )}

      <motion.h3
        className="mb-2 text-lg font-semibold text-white"
        initial={{ opacity: 0, x: -10 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1 }}
      >
        {title}
      </motion.h3>

      {description && (
        <motion.p
          className="text-sm text-[#a3a3a3]"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          {description}
        </motion.p>
      )}

      {children && (
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          {children}
        </motion.div>
      )}

      <motion.div
        className="pointer-events-none absolute inset-0"
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        style={{
          background:
            "radial-gradient(circle at center, rgba(249, 115, 22, 0.1) 0%, transparent 70%)",
        }}
      />
    </motion.div>
  );
};

export const MagicBentoGrid = ({
  children,
  className = "",
  glowColor = "#f97316",
}: MagicBentoGridProps) => {
  return (
    <div className={`grid grid-cols-1 gap-4 md:grid-cols-4 md:gap-6 ${className}`}>{children}</div>
  );
};

export default BentoCard;
