"use client";

import { useState, useEffect } from "react";
import { X, HelpCircle } from "lucide-react";
import Dialog from "@/src/components/ui/Dialog";
import HelpNavigation from "./HelpNavigation";
import HelpContent from "./HelpContent";
import HelpSearch from "./HelpSearch";
import HelpFeedback from "./HelpFeedback";
import type { HelpSection } from "./helpTypes";

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultSection?: HelpSection;
}

export default function HelpModal({
  isOpen,
  onClose,
  defaultSection = "getting-started",
}: HelpModalProps) {
  const [activeSection, setActiveSection] = useState<HelpSection>(defaultSection);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (isOpen) {
      setActiveSection(defaultSection);
      setSearchQuery("");
    }
  }, [isOpen, defaultSection]);

  const handleFeedback = (helpful: boolean) => {
    console.log(`User found content helpful: ${helpful}`);
  };

  return (
    <Dialog isOpen={isOpen} onClose={onClose} title="" maxWidth="max-w-6xl">
      <div className="flex h-[85vh] flex-col md:h-[75vh] md:flex-row">
        <div className="flex w-full flex-col border-r border-zinc-800 bg-zinc-950/50 md:w-72">
          <div className="flex items-center justify-between border-b border-zinc-800 px-6 py-4">
            <div className="flex items-center gap-2">
              <div className="rounded-lg bg-orange-500/10 p-2">
                <HelpCircle className="h-5 w-5 text-orange-500" />
              </div>
              <h2 className="text-lg font-semibold text-white">Help Center</h2>
            </div>
            <button
              onClick={onClose}
              className="rounded-full p-1.5 text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-white md:hidden"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="p-4">
            <HelpSearch query={searchQuery} setQuery={setSearchQuery} />
          </div>

          <div className="flex-1 overflow-y-auto px-3 pb-4">
            <HelpNavigation activeSection={activeSection} onSectionChange={setActiveSection} />
          </div>
        </div>

        <div className="flex flex-1 flex-col bg-zinc-900/30">
          <div className="hidden items-center justify-between border-b border-zinc-800 px-6 py-4 md:flex">
            <h2 className="text-xl font-semibold text-white">
              {activeSection === "getting-started" && "Getting Started"}
              {activeSection === "features" && "Features"}
              {activeSection === "tips" && "Tips & Tricks"}
              {activeSection === "faq" && "FAQ"}
              {activeSection === "troubleshooting" && "Troubleshooting"}
            </h2>
            <button
              onClick={onClose}
              className="rounded-full p-2 text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-white"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <HelpContent activeSection={activeSection} searchQuery={searchQuery} />

          <div className="border-t border-zinc-800 bg-zinc-950/30 px-6 py-4">
            <HelpFeedback onFeedback={handleFeedback} />
          </div>
        </div>
      </div>
    </Dialog>
  );
}
