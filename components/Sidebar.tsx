'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  MessageSquare, 
  History, 
  Settings, 
  Menu, 
  Zap, 
  HelpCircle,
  MoreVertical,
  Diamond
} from 'lucide-react';

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
      animate={{ width: isCollapsed ? '72px' : '280px' }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="fixed left-0 top-0 h-screen bg-[#09090b] border-r border-[#27272a] flex flex-col z-50 overflow-hidden"
    >
      {/* Top Section */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-6">
          <button 
            onClick={onToggle}
            className="p-2 hover:bg-zinc-800 rounded-full text-zinc-400 hover:text-white transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>

        {/* New Post Button (Gemini Style) */}
        <button 
          className={`flex items-center gap-3 bg-[#1a1a1a] hover:bg-[#27272a] text-zinc-200 transition-all rounded-full ${
            isCollapsed ? 'p-3 justify-center' : 'px-4 py-3 w-full'
          }`}
        >
          <Plus className={`w-5 h-5 text-orange-500 ${isCollapsed ? '' : ''}`} />
          {!isCollapsed && <span className="text-sm font-medium">New post</span>}
        </button>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden py-2 px-3 custom-scrollbar">
        {!isCollapsed && (
          <div className="mb-4 px-3 text-xs font-medium text-zinc-500 animate-fade-in">
            Recent
          </div>
        )}
        
        <div className="space-y-1">
          {history.map((item) => (
            <button
              key={item.id}
              className={`flex items-center gap-3 w-full p-2 rounded-lg text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-100 transition-colors group ${
                isCollapsed ? 'justify-center' : 'text-left'
              }`}
              title={isCollapsed ? item.title : ''}
            >
              <MessageSquare className="w-4 h-4 min-w-[16px]" />
              {!isCollapsed && (
                <span className="text-sm truncate">{item.title}</span>
              )}
              {!isCollapsed && (
                <div className="ml-auto opacity-0 group-hover:opacity-100">
                  <MoreVertical className="w-3 h-3" />
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Bottom Section */}
      <div className="p-3 mt-auto space-y-1">
        <button className={`flex items-center gap-3 w-full p-2 rounded-lg text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100 transition-colors ${isCollapsed ? 'justify-center' : ''}`}>
          <HelpCircle className="w-5 h-5" />
          {!isCollapsed && <span className="text-sm">Help</span>}
        </button>
        
        <button className={`flex items-center gap-3 w-full p-2 rounded-lg text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100 transition-colors ${isCollapsed ? 'justify-center' : ''}`}>
          <History className="w-5 h-5" />
          {!isCollapsed && <span className="text-sm">Activity</span>}
        </button>

        <button className={`flex items-center gap-3 w-full p-2 rounded-lg text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100 transition-colors ${isCollapsed ? 'justify-center' : ''}`}>
          <Settings className="w-5 h-5" />
          {!isCollapsed && <span className="text-sm">Settings</span>}
        </button>

        {/* User Profile */}
        <div className={`mt-4 flex items-center gap-3 p-2 rounded-lg hover:bg-zinc-800 cursor-pointer ${isCollapsed ? 'justify-center' : ''}`}>
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-orange-500 to-amber-500 flex items-center justify-center text-white text-xs font-bold shadow-lg shadow-orange-900/20">
            U
          </div>
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-zinc-200 truncate">User</p>
              <div className="flex items-center gap-1 text-xs text-orange-500">
                <Diamond className="w-3 h-3 fill-current" />
                <span>Pro Plan</span>
              </div>
            </div>
          )}
        </div>
        
        {/* Location/Footer */}
        {!isCollapsed && (
          <div className="mt-2 px-2 text-[10px] text-zinc-600 text-center">
            Jakarta, Indonesia • Based on your IP
          </div>
        )}
      </div>
    </motion.div>
  );
}
