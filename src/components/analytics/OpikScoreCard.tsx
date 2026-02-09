"use client";

import { motion } from "framer-motion";
import { Zap, Share2, MessageCircle, PenTool } from "lucide-react";

interface ScoreItem {
  metricName: string;
  score: number;
  reasoning: string;
}

interface OpikScoreCardProps {
  scores: ScoreItem[];
}

export default function OpikScoreCard({ scores }: OpikScoreCardProps) {
  if (!scores || scores.length === 0) return null;

  const getMetricColor = (name: string) => {
    if (name.includes("Style")) return "text-teal-400 bg-teal-400/20 border-teal-400/30";
    if (name.includes("Virality")) return "text-orange-400 bg-orange-400/20 border-orange-400/30";
    return "text-violet-400 bg-violet-400/20 border-violet-400/30";
  };

  const getIcon = (name: string) => {
    if (name.includes("Style")) return <PenTool className="h-4 w-4" />;
    if (name.includes("Virality")) return <Share2 className="h-4 w-4" />;
    return <MessageCircle className="h-4 w-4" />;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-6 w-full rounded-2xl border border-white/10 bg-[#0a0a0a]/80 p-6 backdrop-blur-xl"
    >
      <div className="mb-6 flex items-center gap-2">
        <Zap className="h-5 w-5 fill-yellow-400 text-yellow-400" />
        <h3 className="text-lg font-bold text-white">Opik AI Quality Score</h3>
      </div>

      <div className="flex flex-wrap gap-4">
        {scores.map((item, index) => {
          const percentage = Math.round(item.score * 100);
          const colorClass = getMetricColor(item.metricName);

          return (
            <div
              key={index}
              className="relative flex min-w-[200px] flex-1 flex-col gap-3 overflow-hidden rounded-xl border border-white/5 bg-black/5 p-4"
            >
              {/* Header */}
              <div className="z-10 flex items-center justify-between">
                <span className="flex items-center gap-2 text-sm font-medium text-gray-300">
                  {getIcon(item.metricName)}
                  {item.metricName}
                </span>
                <span className={`rounded-full border px-2 py-0.5 text-sm font-bold ${colorClass}`}>
                  {percentage}%
                </span>
              </div>

              {/* Progress Bar */}
              <div className="z-10 h-2 w-full overflow-hidden rounded-full bg-black/10">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ duration: 1, delay: index * 0.2 }}
                  className={`h-full rounded-full ${colorClass.split(" ")[0].replace("text-", "bg-")}`}
                />
              </div>

              {/* Reasoning */}
              <p className="z-10 line-clamp-2 text-xs text-gray-500">{item.reasoning}</p>

              {/* Background Glow */}
              <div
                className={`absolute -bottom-4 -right-4 h-24 w-24 rounded-full opacity-20 blur-3xl ${colorClass.split(" ")[0].replace("text-", "bg-")}`}
              />
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
