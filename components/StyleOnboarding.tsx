'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Check, Plus, Trash2 } from 'lucide-react';
import { Button } from './ui';

interface StyleProfile {
  tone: string;
  formatting: string;
  vocabulary: string[];
  emojiUsage: string;
  sentenceLength: string;
  hooks: string;
  closings: string;
  uniqueTraits: string[];
  rawAnalysis: string;
}

interface StyleOnboardingProps {
  isOpen: boolean;
  onClose: () => void;
  onStyleAnalyzed: (profile: StyleProfile, stylePrompt: string) => void;
  existingProfile?: StyleProfile | null;
}

export default function StyleOnboarding({
  isOpen,
  onClose,
  onStyleAnalyzed,
  existingProfile
}: StyleOnboardingProps) {
  const [posts, setPosts] = useState<string[]>(['', '', '']);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analyzedProfile, setAnalyzedProfile] = useState<StyleProfile | null>(existingProfile || null);

  const updatePost = (index: number, value: string) => {
    const newPosts = [...posts];
    newPosts[index] = value;
    setPosts(newPosts);
  };

  const addPost = () => {
    if (posts.length < 5) {
      setPosts([...posts, '']);
    }
  };

  const removePost = (index: number) => {
    if (posts.length > 1) {
      setPosts(posts.filter((_, i) => i !== index));
    }
  };

  const analyzeStyle = async () => {
    const validPosts = posts.filter(p => p.trim().length > 50);
    
    if (validPosts.length < 1) {
      setError('Please add at least 1 post with 50+ characters');
      return;
    }

    setIsAnalyzing(true);
    setError(null);

    try {
      const response = await fetch('/api/analyze-style', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ posts: validPosts }),
      });

      const data = await response.json();

      if (data.success && data.profile) {
        setAnalyzedProfile(data.profile);
        onStyleAnalyzed(data.profile, data.stylePrompt);
      } else {
        setError(data.error || 'Failed to analyze style');
      }
    } catch (err) {
      console.error('Style analysis error:', err);
      setError('Failed to connect to server');
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl border border-stone-200 dark:border-zinc-700"
        >
          {/* Header */}
          <div className="sticky top-0 bg-white dark:bg-zinc-900 border-b border-stone-200 dark:border-zinc-800 p-6 flex items-center justify-between z-10">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-xl shadow-lg shadow-violet-500/20">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-stone-900 dark:text-white">
                  Your Writing DNA
                </h2>
                <p className="text-sm text-stone-500 dark:text-zinc-400">
                  Paste your past LinkedIn posts to personalize AI
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-stone-400 hover:text-stone-600 dark:hover:text-zinc-300 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Already analyzed - show profile (TEAL THEME) */}
            {analyzedProfile && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-teal-50 dark:bg-teal-900/10 rounded-2xl border border-teal-200 dark:border-teal-800"
              >
                <div className="flex items-center gap-2 mb-3">
                  <Check className="w-5 h-5 text-teal-600" />
                  <span className="font-semibold text-teal-700 dark:text-teal-400">
                    Style Profile Active
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-stone-500 dark:text-zinc-500">Tone:</span>
                    <span className="ml-2 font-medium text-stone-900 dark:text-white">{analyzedProfile.tone}</span>
                  </div>
                  <div>
                    <span className="text-stone-500 dark:text-zinc-500">Emoji:</span>
                    <span className="ml-2 font-medium text-stone-900 dark:text-white">{analyzedProfile.emojiUsage}</span>
                  </div>
                  <div>
                    <span className="text-stone-500 dark:text-zinc-500">Formatting:</span>
                    <span className="ml-2 font-medium text-stone-900 dark:text-white">{analyzedProfile.formatting}</span>
                  </div>
                  <div>
                    <span className="text-stone-500 dark:text-zinc-500">Sentences:</span>
                    <span className="ml-2 font-medium text-stone-900 dark:text-white">{analyzedProfile.sentenceLength}</span>
                  </div>
                </div>
                {analyzedProfile.vocabulary.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {analyzedProfile.vocabulary.slice(0, 5).map((word, i) => (
                      <span key={i} className="px-2 py-1 bg-white dark:bg-zinc-800 text-teal-700 dark:text-teal-300 border border-teal-100 dark:border-teal-800 rounded-full text-xs shadow-sm">
                        {word}
                      </span>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* Instructions */}
            <div className="p-4 bg-stone-50 dark:bg-zinc-800/50 rounded-xl border border-stone-200 dark:border-zinc-700">
              <p className="text-sm text-stone-600 dark:text-zinc-300">
                <strong className="text-orange-600 dark:text-orange-400">Tip:</strong> Paste 2-5 of your best LinkedIn posts. The AI will learn your unique voice, 
                tone, and writing patterns to generate content that sounds exactly like you.
              </p>
            </div>

            {/* Post inputs */}
            <div className="space-y-4">
              {posts.map((post, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="relative"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-stone-100 dark:bg-zinc-800 flex items-center justify-center font-bold text-stone-500 dark:text-zinc-400 text-sm border border-stone-200 dark:border-zinc-700">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <textarea
                        value={post}
                        onChange={(e) => updatePost(index, e.target.value)}
                        placeholder={`Paste your LinkedIn post #${index + 1} here...`}
                        className="w-full p-4 bg-white dark:bg-zinc-900 border border-stone-200 dark:border-zinc-700 rounded-xl resize-none min-h-[120px] text-stone-900 dark:text-white placeholder-stone-400 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all"
                      />
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-stone-400">
                          {post.length} characters {post.length < 50 && post.length > 0 && '(min 50)'}
                        </span>
                        {posts.length > 1 && (
                          <button
                            onClick={() => removePost(index)}
                            className="text-xs text-rose-500 hover:text-rose-600 flex items-center gap-1"
                          >
                            <Trash2 className="w-3 h-3" /> Remove
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Add more button */}
            {posts.length < 5 && (
              <button
                onClick={addPost}
                className="w-full p-3 border-2 border-dashed border-stone-300 dark:border-zinc-700 rounded-xl text-stone-500 hover:border-orange-400 hover:text-orange-500 hover:bg-orange-50/50 transition-all flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" /> Add another post
              </button>
            )}

            {/* Error */}
            {error && (
              <div className="p-3 bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 rounded-xl text-sm border border-rose-100 dark:border-rose-900">
                {error}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 bg-white dark:bg-zinc-900 border-t border-stone-200 dark:border-zinc-800 p-6 flex gap-4 rounded-b-3xl">
            <Button variant="secondary" onClick={onClose} className="flex-1">
              {analyzedProfile ? 'Close' : 'Skip for now'}
            </Button>
            <Button 
              onClick={analyzeStyle} 
              disabled={isAnalyzing}
              variant={analyzedProfile ? "magic" : "primary"}
              className="flex-1"
            >
              {isAnalyzing ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"
                  />
                  Analyzing...
                </>
              ) : analyzedProfile ? (
                'Re-analyze'
              ) : (
                'Analyze My Style'
              )}
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
