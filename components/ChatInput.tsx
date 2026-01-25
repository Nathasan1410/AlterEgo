'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button, Card } from './ui';
import SettingsPanel from './SettingsPanel';
import VoiceInput from './VoiceInput';
import { Globe, Sparkles } from 'lucide-react';

interface ChatInputProps {
  onGenerate: (topic: string, settings: any) => void;
  initialSettings: any;
  onSettingsChange: (settings: any) => void;
  onOpenStyleOnboarding?: () => void;
  hasStyleProfile?: boolean;
}

export default function ChatInput({ 
  onGenerate, 
  initialSettings, 
  onSettingsChange,
  onOpenStyleOnboarding,
  hasStyleProfile = false
}: ChatInputProps) {
  const [topic, setTopic] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [model, setModel] = useState('Llama 3 (Fast)');
  const [researchMode, setResearchMode] = useState(false);
  
  // Local state for chips before generating
  const [intent, setIntent] = useState(initialSettings.intent || 'viral');
  const [length, setLength] = useState(initialSettings.length || 'medium');
  const [magicMode, setMagicMode] = useState(initialSettings.magicMode || false);

  const handleGenerate = () => {
    if (!topic.trim()) return;
    onSettingsChange({ intent, length, magicMode, researchMode });
    onGenerate(topic, { intent, length, magicMode, researchMode });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleGenerate();
    }
  };

  // Handle voice transcription - set as topic
  const handleTranscription = (text: string) => {
    setTopic(text);
  };

  return (
    <div className="w-full max-w-3xl mx-auto relative z-10">
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative group"
      >
        {/* Outer Container - Using Glass variant */}
        <div className="relative bg-white/70 dark:bg-black/40 backdrop-blur-xl rounded-3xl border border-white/50 dark:border-white/10 shadow-2xl p-4 z-10">
          
          {/* Subtle Orange Glow (Reduced) */}
          <div className="absolute -inset-1 bg-orange-500 rounded-3xl opacity-5 group-hover:opacity-10 transition duration-500 blur-2xl"></div>
          
          {/* 1. Header Row (Model + Style + Settings) */}
          <div className="flex justify-between items-center mb-4 pb-3 border-b border-stone-200 dark:border-zinc-800 relative z-30">
             {/* Model Selector */}
            <div className="relative group/model z-40">
              <button 
                suppressHydrationWarning
                className="flex items-center gap-2 px-3 py-1.5 bg-stone-100 dark:bg-zinc-800 rounded-lg text-xs font-semibold text-stone-700 dark:text-zinc-300 hover:bg-stone-200 dark:hover:bg-zinc-700 transition-all border border-stone-200 dark:border-zinc-700"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse"></span>
                {model}
                <svg className="w-3 h-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </button>
              
              <div className="absolute top-full left-0 mt-2 w-48 bg-white dark:bg-zinc-900 rounded-xl shadow-xl border border-stone-200 dark:border-zinc-800 opacity-0 invisible group-hover/model:opacity-100 group-hover/model:visible transition-all transform origin-top-left">
                {['Llama 3 (Fast)', 'DeepSeek V3', 'Mistral Large'].map(m => (
                  <button 
                    key={m}
                    onClick={() => setModel(m)}
                    className="w-full text-left px-4 py-3 text-sm text-stone-700 dark:text-zinc-300 hover:bg-stone-50 dark:hover:bg-zinc-800 first:rounded-t-xl last:rounded-b-xl"
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Style Profile Button - TEAL for Success/Active */}
              <button 
                onClick={onOpenStyleOnboarding}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border cursor-pointer ${
                  hasStyleProfile 
                    ? 'bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-900/20 dark:text-teal-400 dark:border-teal-800' 
                    : 'bg-stone-100 dark:bg-zinc-800 border-stone-200 dark:border-zinc-700 text-stone-600 dark:text-zinc-400 hover:bg-stone-200 dark:hover:bg-zinc-700'
                }`}
                title="Personalize with your writing style"
              >
                <Sparkles className="w-3.5 h-3.5" />
                {hasStyleProfile ? 'Style Active' : 'My Style'}
              </button>

              {/* Settings Toggle */}
              <button 
                onClick={() => setShowSettings(!showSettings)}
                className="p-2 text-stone-500 hover:text-stone-900 dark:text-zinc-400 dark:hover:text-white transition-colors hover:bg-stone-100 dark:hover:bg-zinc-800 rounded-lg relative z-40 cursor-pointer"
                title="Settings"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              </button>
            </div>
          </div>

          {/* 2. Textarea - REFINED INPUT (Solid White) */}
          <div className="relative group/input">
            <textarea
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="What do you want to post about today? Type or use voice..."
                className="w-full py-4 px-4 text-lg bg-white dark:bg-zinc-900 border border-stone-200 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 resize-none min-h-[120px] placeholder-stone-400 dark:placeholder-zinc-500 text-stone-900 dark:text-white outline-none leading-relaxed relative z-10 transition-all shadow-inner"
                autoFocus
            />
          </div>
          
          {/* 3. Bottom Toolbar */}
          <div className="flex flex-wrap justify-between items-center gap-3 mt-4 relative z-30">
             <div className="flex items-center gap-2 relative z-30">
                {/* Voice Input */}
                <VoiceInput onTranscription={handleTranscription} />

                {/* Dropdowns - Stone Neutrals */}
                <select 
                  value={intent}
                  onChange={(e) => setIntent(e.target.value)}
                  className="bg-stone-50 dark:bg-zinc-800 border border-stone-200 dark:border-zinc-700 rounded-lg px-3 py-1.5 text-xs font-semibold text-stone-700 dark:text-zinc-300 hover:bg-stone-100 dark:hover:bg-zinc-700 cursor-pointer transition-colors focus:outline-none relative z-30"
                >
                  <option value="viral">Viral</option>
                  <option value="storytelling">Story</option>
                  <option value="educational">Edu</option>
                </select>

                <select 
                  value={length}
                  onChange={(e) => setLength(e.target.value)}
                  className="bg-stone-50 dark:bg-zinc-800 border border-stone-200 dark:border-zinc-700 rounded-lg px-3 py-1.5 text-xs font-semibold text-stone-700 dark:text-zinc-300 hover:bg-stone-100 dark:hover:bg-zinc-700 cursor-pointer transition-colors focus:outline-none relative z-30"
                >
                  <option value="short">Short</option>
                  <option value="medium">Medium</option>
                  <option value="long">Long</option>
                </select>

                {/* Research Toggle (Blue) */}
                <button
                  onClick={() => setResearchMode(!researchMode)}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors border relative z-30 cursor-pointer ${
                    researchMode 
                      ? 'bg-sky-50 text-sky-600 border-sky-200 dark:bg-sky-900/20 dark:text-sky-400 dark:border-sky-800' 
                      : 'bg-stone-50 dark:bg-zinc-800 border-stone-200 dark:border-zinc-700 text-stone-600 dark:text-zinc-400 hover:bg-stone-100'
                  }`}
                  title="Enable web research"
                >
                  <Globe className="w-3 h-3" />
                  Research
                </button>

                {/* Magic Toggle (Violet for AI) */}
                <button
                  onClick={() => setMagicMode(!magicMode)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors border relative z-30 cursor-pointer ${
                    magicMode 
                      ? 'bg-violet-50 text-violet-600 border-violet-200 dark:bg-violet-900/20 dark:text-violet-400 dark:border-violet-800 shadow-sm' 
                      : 'bg-stone-50 dark:bg-zinc-800 border-stone-200 dark:border-zinc-700 text-stone-600 dark:text-zinc-400 hover:bg-stone-100'
                  }`}
                >
                  <span className="mr-1">✨</span> Magic
                </button>
             </div>

             {/* PRIMARY ACTION - Strong Orange */}
             <Button
                onClick={handleGenerate}
                disabled={!topic.trim()}
                variant="primary"
                className="px-6 py-2 shadow-lg shadow-orange-500/20"
              >
                Generate
              </Button>
          </div>

          {/* 4. Suggestions */}
          {!topic && (
           <div className="mt-4 pt-3 border-t border-stone-200 dark:border-zinc-800 relative z-20">
             <div className="flex items-center gap-3 text-xs text-stone-500 dark:text-zinc-500 mb-2">
               <span>Try asking:</span>
             </div>
             <div className="flex flex-wrap gap-2">
                {["Remote Work Tips", "AI in Marketing", "Startup Lessons", "My Coding Journey"].map(t => (
                  <button 
                    key={t}
                    onClick={() => setTopic(t)}
                    className="px-3 py-1.5 bg-stone-50 dark:bg-zinc-800 rounded-lg text-xs text-stone-600 dark:text-zinc-400 hover:bg-stone-100 dark:hover:bg-zinc-700 hover:text-orange-600 dark:hover:text-orange-400 transition-colors text-left border border-stone-200 dark:border-zinc-700 relative z-20 cursor-pointer"
                  >
                    {t}
                  </button>
                ))}
             </div>
           </div>
          )}
        </div>
      </motion.div>

      <AnimatePresence>
        {showSettings && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-stone-900/20 backdrop-blur-sm z-40"
              onClick={() => setShowSettings(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="absolute top-16 right-0 z-50 w-80"
            >
              <Card variant="glass" className="bg-white dark:bg-zinc-900 shadow-xl border border-stone-200 dark:border-zinc-700">
                 <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-sm text-stone-800 dark:text-zinc-100">Studio Settings</h3>
                    <button onClick={() => setShowSettings(false)} className="text-stone-400 hover:text-stone-600">X</button>
                 </div>
                 <SettingsPanel 
                    language={initialSettings.language || 'id'}
                    setLanguage={(l) => onSettingsChange({...initialSettings, language: l})}
                    emojiLevel={initialSettings.emojiLevel}
                    setEmojiLevel={(v) => onSettingsChange({...initialSettings, emojiLevel: v})}
                    tone={initialSettings.tone}
                    setTone={(v) => onSettingsChange({...initialSettings, tone: v})}
                    researchDepth={initialSettings.researchDepth}
                    setResearchDepth={(v) => onSettingsChange({...initialSettings, researchDepth: v})}
                 />
              </Card>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
