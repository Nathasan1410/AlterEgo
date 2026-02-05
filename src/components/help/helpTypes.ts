import { LucideIcon } from "lucide-react";

export type HelpSection = "getting-started" | "features" | "tips" | "faq" | "troubleshooting";

export interface HelpSectionItem {
  id: HelpSection;
  title: string;
  icon: LucideIcon;
  content: React.ReactNode;
}
