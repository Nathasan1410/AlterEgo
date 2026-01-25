'use client';

import React from 'react';
import { Slider } from './ui';

interface SettingsPanelProps {
  language: string;
  setLanguage: (lang: string) => void;
  emojiLevel: number;
  setEmojiLevel: (level: number) => void;
  tone: number;
  setTone: (tone: number) => void;
  researchDepth: number;
  setResearchDepth: (depth: number) => void;
}

export default function SettingsPanel({
  language,
  setLanguage,
  emojiLevel,
  setEmojiLevel,
  tone,
  setTone,
  researchDepth,
  setResearchDepth
}: SettingsPanelProps) {
  // Theme toggle removed per request

  return (
    <div className="space-y-6 text-gray-200">
          
          {/* Language Toggle */}
          <div>
            <label className="block mb-2 font-semibold text-sm text-gray-400">Language</label>
            <div className="flex gap-2 bg-white/5 p-1 rounded-xl border border-white/10">
              <button
                onClick={() => setLanguage('id')}
                className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${language === 'id' ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
              >
                Indonesia
              </button>
              <button
                onClick={() => setLanguage('en')}
                className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${language === 'en' ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
              >
                English
              </button>
            </div>
          </div>

          {/* Sliders */}
          <Slider
            label="Emoji Density"
            min={0}
            max={10}
            value={emojiLevel}
            onChange={setEmojiLevel}
            gradient="linear-gradient(to right, #f97316, #ea580c)"
            labels={['None', 'Minimal', 'Moderate', 'Rich']}
          />

          <Slider 
             label="Research Depth"
             min={1}
             max={5}
             value={researchDepth}
             onChange={setResearchDepth}
             gradient="linear-gradient(to right, #f97316, #ea580c)"
             labels={['Basic', 'Balanced', 'Deep']}
          />

          <Slider
             label="Voice / Tone"
             min={0}
             max={10}
             value={tone}
             onChange={setTone}
             gradient="linear-gradient(to right, #f97316, #ea580c)"
             labels={['Formal', 'Balanced', 'Casual']}
          />
    </div>
  );
}
