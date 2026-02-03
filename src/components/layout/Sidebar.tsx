"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  MessageSquare,
  History,
  Settings,
  Menu,
  Zap,
  HelpCircle,
  MoreVertical,
  Diamond,
} from "lucide-react";

interface SidebarProps {
  isCollapsed?: boolean;
  onToggle?: () => void;
}

export default function Sidebar({ isCollapsed, onToggle }: SidebarProps) {
  // const [isCollapsed, setIsCollapsed] = useState(false); // Controlled by parent now

  // Mock history data
  const history = [
    { id: 1, title: "Viral Post about AI", date: "Today" },
    { id: 2, title: "Remote Work Tips", date: "Yesterday" },
    { id: 3, title: "Coding Journey Story", date: "2 days ago" },
    { id: 4, title: "Product Launch CTA", date: "Last week" },
  ];

  return (
    <motion.div
      animate={{ width: isCollapsed ? "72px" : "280px" }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="fixed left-0 top-0 z-50 flex h-screen flex-col overflow-hidden border-r border-[#27272a] bg-[#09090b]"
    >
      {/* Top Section */}
      <div className="p-4">
        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={onToggle}
            className="rounded-full p-2 text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-white"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>

        {/* New Post Button (Gemini Style) */}
        <button
          className={`flex items-center gap-3 rounded-full bg-[#1a1a1a] text-zinc-200 transition-all hover:bg-[#27272a] ${
            isCollapsed ? "justify-center p-3" : "w-full px-4 py-3"
          }`}
        >
          <Plus className={`h-5 w-5 text-orange-500 ${isCollapsed ? "" : ""}`} />
          {!isCollapsed && <span className="text-sm font-medium">New post</span>}
        </button>
      </div>

      {/* Scrollable Content */}
      <div className="custom-scrollbar flex-1 overflow-y-auto overflow-x-hidden px-3 py-2">
        {!isCollapsed && (
          <div className="animate-fade-in mb-4 px-3 text-xs font-medium text-zinc-500">Recent</div>
        )}

        <div className="space-y-1">
          {history.map((item) => (
            <button
              key={item.id}
              className={`group flex w-full items-center gap-3 rounded-lg p-2 text-zinc-400 transition-colors hover:bg-zinc-800/50 hover:text-zinc-100 ${
                isCollapsed ? "justify-center" : "text-left"
              }`}
              title={isCollapsed ? item.title : ""}
            >
              <MessageSquare className="h-4 w-4 min-w-[16px]" />
              {!isCollapsed && <span className="truncate text-sm">{item.title}</span>}
              {!isCollapsed && (
                <div className="ml-auto opacity-0 group-hover:opacity-100">
                  <MoreVertical className="h-3 w-3" />
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Bottom Section */}
      <div className="mt-auto space-y-1 p-3">
        <button
          className={`flex w-full items-center gap-3 rounded-lg p-2 text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-zinc-100 ${isCollapsed ? "justify-center" : ""}`}
        >
          <HelpCircle className="h-5 w-5" />
          {!isCollapsed && <span className="text-sm">Help</span>}
        </button>

        <button
          className={`flex w-full items-center gap-3 rounded-lg p-2 text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-zinc-100 ${isCollapsed ? "justify-center" : ""}`}
        >
          <History className="h-5 w-5" />
          {!isCollapsed && <span className="text-sm">Activity</span>}
        </button>

        <button
          className={`flex w-full items-center gap-3 rounded-lg p-2 text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-zinc-100 ${isCollapsed ? "justify-center" : ""}`}
        >
          <Settings className="h-5 w-5" />
          {!isCollapsed && <span className="text-sm">Settings</span>}
        </button>

        {/* User Profile */}
        <div
          className={`mt-4 flex cursor-pointer items-center gap-3 rounded-lg p-2 hover:bg-zinc-800 ${isCollapsed ? "justify-center" : ""}`}
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-tr from-orange-500 to-amber-500 text-xs font-bold text-white shadow-lg shadow-orange-900/20">
            U
          </div>
          {!isCollapsed && (
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-zinc-200">User</p>
              <div className="flex items-center gap-1 text-xs text-orange-500">
                <Diamond className="h-3 w-3 fill-current" />
                <span>Pro Plan</span>
              </div>
            </div>
          )}
        </div>

        {/* Location/Footer */}
        {!isCollapsed && (
          <div className="mt-2 px-2 text-center text-[10px] text-zinc-600">
            Jakarta, Indonesia • Based on your IP
          </div>
        )}
      </div>
    </motion.div>
  );
}
