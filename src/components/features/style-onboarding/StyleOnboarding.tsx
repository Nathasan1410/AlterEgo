"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, Check, Plus, Trash2 } from "lucide-react";
import { Button } from "../../ui";

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
  existingProfile,
}: StyleOnboardingProps) {
  const [posts, setPosts] = useState<string[]>(["", "", ""]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analyzedProfile, setAnalyzedProfile] = useState<StyleProfile | null>(
    existingProfile || null
  );

  const updatePost = (index: number, value: string) => {
    const newPosts = [...posts];
    newPosts[index] = value;
    setPosts(newPosts);
  };

  const addPost = () => {
    if (posts.length < 5) {
      setPosts([...posts, ""]);
    }
  };

  const removePost = (index: number) => {
    if (posts.length > 1) {
      setPosts(posts.filter((_, i) => i !== index));
    }
  };

  const analyzeStyle = async () => {
    const validPosts = posts.filter((p) => p.trim().length > 50);

    if (validPosts.length < 1) {
      setError("Please add at least 1 post with 50+ characters");
      return;
    }

    setIsAnalyzing(true);
    setError(null);

    try {
      const response = await fetch("/api/analyze-style", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ posts: validPosts }),
      });

      const data = await response.json();

      if (data.success && data.profile) {
        setAnalyzedProfile(data.profile);
        onStyleAnalyzed(data.profile, data.stylePrompt);
      } else {
        setError(data.error || "Failed to analyze style");
      }
    } catch (err) {
      console.error("Style analysis error:", err);
      setError("Failed to connect to server");
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
        className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/40 p-4 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-stone-700 bg-black/40 shadow-2xl"
        >
          {/* Header */}
          <div className="sticky top-0 z-10 flex items-center justify-between border-b border-stone-700 bg-black/40 p-6">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 p-2 shadow-lg shadow-violet-500/20">
                <Sparkles className="h-5 w-5 text-white" />
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
              className="p-2 text-stone-400 transition-colors hover:text-stone-600 dark:hover:text-zinc-300"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Content */}
          <div className="space-y-6 p-6">
            {/* Already analyzed - show profile (TEAL THEME) */}
            {analyzedProfile && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl border border-teal-200 bg-teal-50 p-4 dark:border-teal-800 dark:bg-teal-900/10"
              >
                <div className="mb-3 flex items-center gap-2">
                  <Check className="h-5 w-5 text-teal-600" />
                  <span className="font-semibold text-teal-700 dark:text-teal-400">
                    Style Profile Active
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-stone-500 dark:text-zinc-500">Tone:</span>
                    <span className="ml-2 font-medium text-stone-900 dark:text-white">
                      {analyzedProfile.tone}
                    </span>
                  </div>
                  <div>
                    <span className="text-stone-500 dark:text-zinc-500">Emoji:</span>
                    <span className="ml-2 font-medium text-stone-900 dark:text-white">
                      {analyzedProfile.emojiUsage}
                    </span>
                  </div>
                  <div>
                    <span className="text-stone-500 dark:text-zinc-500">Formatting:</span>
                    <span className="ml-2 font-medium text-stone-900 dark:text-white">
                      {analyzedProfile.formatting}
                    </span>
                  </div>
                  <div>
                    <span className="text-stone-500 dark:text-zinc-500">Sentences:</span>
                    <span className="ml-2 font-medium text-stone-900 dark:text-white">
                      {analyzedProfile.sentenceLength}
                    </span>
                  </div>
                </div>
                {analyzedProfile.vocabulary.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {analyzedProfile.vocabulary.slice(0, 5).map((word, i) => (
<span
                        key={i}
                        className="rounded-full border border-teal-100 bg-black/40 px-2 py-1 text-xs text-teal-700 shadow-sm dark:border-teal-800 dark:bg-zinc-800 dark:text-teal-300"
                      >
                        {word}
                      </span>
                  <div className="flex items-start gap-3">
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border border-stone-200 bg-stone-100 text-sm font-bold text-stone-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-400">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <textarea
                        value={post}
                        onChange={(e) => updatePost(index, e.target.value)}
                        placeholder={`Paste your LinkedIn post #${index + 1} here...`}
                        className="min-h-[120px] w-full resize-none rounded-xl border border-stone-700 bg-black/40 p-4 text-stone-900 placeholder-stone-400 outline-none transition-all focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white"
                      />
                      <div className="mt-2 flex items-center justify-between">
                        <span className="text-xs text-stone-400">
                          {post.length} characters{" "}
                          {post.length < 50 && post.length > 0 && "(min 50)"}
                        </span>
                        {posts.length > 1 && (
                          <button
                            onClick={() => removePost(index)}
                            className="flex items-center gap-1 text-xs text-rose-500 hover:text-rose-600"
                          >
                            <Trash2 className="h-3 w-3" /> Remove
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
                className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-stone-300 p-3 text-stone-500 transition-all hover:border-orange-400 hover:bg-orange-50/50 hover:text-orange-500 dark:border-zinc-700"
              >
                <Plus className="h-4 w-4" /> Add another post
              </button>
            )}

            {/* Error */}
            {error && (
              <div className="rounded-xl border border-rose-100 bg-rose-50 p-3 text-sm text-rose-600 dark:border-rose-900 dark:bg-rose-900/20 dark:text-rose-400">
                {error}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 flex gap-4 rounded-b-3xl border-t border-stone-700 bg-black/40 p-6">
            <Button variant="secondary" onClick={onClose} className="flex-1">
              {analyzedProfile ? "Close" : "Skip for now"}
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
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="mr-2 h-4 w-4 rounded-full border-2 border-white border-t-transparent"
                  />
                  Analyzing...
                </>
              ) : analyzedProfile ? (
                "Re-analyze"
              ) : (
                "Analyze My Style"
              )}
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
