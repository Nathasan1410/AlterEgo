'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Target, FileText, Megaphone, Settings as SettingsIcon, ChevronRight } from 'lucide-react';
import { useState } from 'react';

interface CanvasProps {
    deck: {
        topic: string;
        hook: string;
        body: string;
        cta: string;
    };
    currentStep: 'topics' | 'hooks' | 'body' | 'cta' | null;
    settings?: any;
}

interface AccordionItemProps {
    title: string;
    content: string;
    icon: any;
    color: string;
    bgColor: string;
    borderColor: string;
    isExpanded: boolean;
    onToggle: () => void;
    isEmpty: boolean;
}

function AccordionItem({ title, content, icon: Icon, color, bgColor, borderColor, isExpanded, onToggle, isEmpty }: AccordionItemProps) {
    return (
        <motion.div
            className={`relative rounded-xl border-2 transition-all overflow-hidden ${
                isEmpty 
                    ? 'bg-gray-50 dark:bg-gray-800/30 border-gray-200 dark:border-gray-700 border-dashed opacity-50' 
                    : `${bgColor} ${borderColor} shadow-lg`
            }`}
            initial={{ opacity: 0, x: 20, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
        >
            {/* Gradient Accent */}
            {!isEmpty && (
                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${color} rounded-t-xl`} />
            )}
            
            {/* Header - Clickable */}
            <button
                onClick={onToggle}
                disabled={isEmpty}
                className="w-full p-4 flex items-start gap-3 text-left hover:bg-black/5 dark:hover:bg-white/5 transition-colors disabled:cursor-not-allowed"
            >
                <div className={`p-2 rounded-lg ${!isEmpty ? `bg-gradient-to-br ${color}` : 'bg-gray-200 dark:bg-gray-700'}`}>
                    <Icon className={`w-4 h-4 ${!isEmpty ? 'text-white' : 'text-gray-400'}`} />
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                        <h4 className={`text-sm font-bold ${!isEmpty ? 'text-gray-900 dark:text-white' : 'text-gray-400'}`}>
                            {title}
                        </h4>
                        {!isEmpty && (
                            <span className="text-xs text-green-600 dark:text-green-400">Done</span>
                        )}
                    </div>
                    {!isEmpty && !isExpanded && (
                        <p className="text-xs text-gray-700 dark:text-gray-300 line-clamp-2 leading-relaxed">
                            {content}
                        </p>
                    )}
                    {isEmpty && (
                        <p className="text-xs text-gray-400 italic">Not selected yet</p>
                    )}
                </div>
                {!isEmpty && (
                    <motion.div
                        animate={{ rotate: isExpanded ? 90 : 0 }}
                        transition={{ duration: 0.2 }}
                        className="flex-shrink-0"
                    >
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                    </motion.div>
                )}
            </button>
            
            {/* Expandable Content */}
            <AnimatePresence>
                {isExpanded && !isEmpty && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                    >
                        <div className="px-4 pb-4 pt-2 border-t border-gray-200 dark:border-gray-700">
                            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                                {content}
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}

export default function Canvas({ deck, currentStep, settings }: CanvasProps) {
    const [expandedSection, setExpandedSection] = useState<string | null>('topic');
    
    // ORANGE THEME colors
    const pieces = [
        { 
            key: 'topic', 
            label: 'Topic', 
            value: deck.topic, 
            icon: Target,
            color: 'from-orange-500 to-orange-600',
            bgColor: 'bg-orange-50 dark:bg-orange-900/20',
            borderColor: 'border-orange-200 dark:border-orange-800'
        },
        { 
            key: 'hook', 
            label: 'Hook', 
            value: deck.hook, 
            icon: Sparkles,
            color: 'from-amber-500 to-amber-600',
            bgColor: 'bg-amber-50 dark:bg-amber-900/20',
            borderColor: 'border-amber-200 dark:border-amber-800'
        },
        { 
            key: 'body', 
            label: 'Body', 
            value: deck.body, 
            icon: FileText,
            color: 'from-yellow-500 to-yellow-600',
            bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
            borderColor: 'border-yellow-200 dark:border-yellow-800'
        },
        { 
            key: 'cta', 
            label: 'CTA', 
            value: deck.cta, 
            icon: Megaphone,
            color: 'from-red-500 to-red-600',
            bgColor: 'bg-red-50 dark:bg-red-900/20',
            borderColor: 'border-red-200 dark:border-red-800'
        },
    ];

    const toggleSection = (key: string) => {
        setExpandedSection(prev => prev === key ? null : key);
    };

    return (
        <div className="h-full flex flex-col gap-4 p-6 pb-20 md:pb-6">
            {/* Header - ORANGE GRADIENT */}
            <div className="text-center">
                <h3 className="text-lg font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                    Your Post Canvas
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Click to expand and view full content</p>
            </div>

            {/* Progress Bar */}
            <div className="flex gap-1">
                {pieces.map((piece, i) => (
                    <div 
                        key={piece.key}
                        className={`flex-1 h-1.5 rounded-full transition-all ${
                            piece.value ? `bg-gradient-to-r ${piece.color}` : 'bg-gray-200 dark:bg-gray-700'
                        }`}
                    />
                ))}
            </div>

            {/* Accordion Pieces */}
            <div className="flex-1 space-y-3 overflow-y-auto no-scrollbar">
                {pieces.map((piece) => (
                    <AccordionItem
                        key={piece.key}
                        title={piece.label}
                        content={piece.value}
                        icon={piece.icon}
                        color={piece.color}
                        bgColor={piece.bgColor}
                        borderColor={piece.borderColor}
                        isExpanded={expandedSection === piece.key}
                        onToggle={() => toggleSection(piece.key)}
                        isEmpty={!piece.value}
                    />
                ))}

                {/* Settings Summary */}
                {settings && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-4 p-4 bg-gray-50 dark:bg-gray-800/30 rounded-xl border border-gray-200 dark:border-gray-700"
                    >
                        <div className="flex items-center gap-2 mb-2">
                            <SettingsIcon className="w-4 h-4 text-gray-500" />
                            <h4 className="text-xs font-bold text-gray-600 dark:text-gray-400">Settings</h4>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                            <div>
                                <span className="text-gray-500">Intent:</span>
                                <span className="ml-1 font-semibold text-gray-700 dark:text-gray-300 capitalize">{settings.intent}</span>
                            </div>
                            <div>
                                <span className="text-gray-500">Length:</span>
                                <span className="ml-1 font-semibold text-gray-700 dark:text-gray-300 capitalize">{settings.length}</span>
                            </div>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
