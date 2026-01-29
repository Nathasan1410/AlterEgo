'use client';

import { motion } from 'framer-motion';
import { Zap, Share2, MessageCircle, PenTool } from 'lucide-react';

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
    if (name.includes('Style')) return 'text-teal-400 bg-teal-400/20 border-teal-400/30';
    if (name.includes('Virality')) return 'text-orange-400 bg-orange-400/20 border-orange-400/30';
    return 'text-violet-400 bg-violet-400/20 border-violet-400/30';
  };

  const getIcon = (name: string) => {
    if (name.includes('Style')) return <PenTool className="w-4 h-4" />;
    if (name.includes('Virality')) return <Share2 className="w-4 h-4" />;
    return <MessageCircle className="w-4 h-4" />;
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full bg-[#0a0a0a]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6 mb-6"
    >
      <div className="flex items-center gap-2 mb-6">
        <Zap className="w-5 h-5 text-yellow-400 fill-yellow-400" />
        <h3 className="text-lg font-bold text-white">Opik AI Quality Score</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {scores.map((item, index) => {
          const percentage = Math.round(item.score * 100);
          const colorClass = getMetricColor(item.metricName);
          
          return (
            <div key={index} className="flex flex-col gap-3 p-4 rounded-xl bg-white/5 border border-white/5 relative overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between z-10">
                <span className="text-sm font-medium text-gray-300 flex items-center gap-2">
                  {getIcon(item.metricName)}
                  {item.metricName}
                </span>
                <span className={`text-sm font-bold px-2 py-0.5 rounded-full border ${colorClass}`}>
                  {percentage}%
                </span>
              </div>

              {/* Progress Bar */}
              <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden z-10">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ duration: 1, delay: index * 0.2 }}
                  className={`h-full rounded-full ${colorClass.split(' ')[0].replace('text-', 'bg-')}`}
                />
              </div>

              {/* Reasoning */}
              <p className="text-xs text-gray-500 line-clamp-2 z-10">
                {item.reasoning}
              </p>

              {/* Background Glow */}
              <div className={`absolute -right-4 -bottom-4 w-24 h-24 rounded-full blur-3xl opacity-20 ${colorClass.split(' ')[0].replace('text-', 'bg-')}`} />
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
