"use client";

import { BookOpen, Zap, Lightbulb, HelpCircle, AlertCircle, LucideIcon } from "lucide-react";
import type { HelpSection } from "./helpTypes";

interface HelpNavigationProps {
  activeSection: HelpSection;
  onSectionChange: (section: HelpSection) => void;
}

interface NavItem {
  id: HelpSection;
  title: string;
  icon: LucideIcon;
}

const navItems: NavItem[] = [
  { id: "getting-started", title: "Getting Started", icon: BookOpen },
  { id: "features", title: "Features", icon: Zap },
  { id: "tips", title: "Tips & Tricks", icon: Lightbulb },
  { id: "faq", title: "FAQ", icon: HelpCircle },
  { id: "troubleshooting", title: "Troubleshooting", icon: AlertCircle },
];

export default function HelpNavigation({ activeSection, onSectionChange }: HelpNavigationProps) {
  return (
    <nav className="flex flex-col gap-1">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeSection === item.id;

        return (
          <button
            key={item.id}
            onClick={() => onSectionChange(item.id)}
            className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
              isActive
                ? "bg-orange-600 text-white"
                : "text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200"
            }`}
          >
            <Icon className={`h-5 w-5 ${isActive ? "text-white" : "text-zinc-500"}`} />
            <span>{item.title}</span>
          </button>
        );
      })}
    </nav>
  );
}
