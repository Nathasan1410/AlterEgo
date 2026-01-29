'use client';

import { useState, useEffect } from 'react';
import { generateContent, polishPost } from '@/lib/api-client';
import SettingsPanel from './SettingsPanel';
import ChatInput from './ChatInput';
import OpikScoreCard from './OpikScoreCard';
import Canvas from './Canvas';
import MobileCanvas from './MobileCanvas';
import OptionCarousel from './OptionCarousel';
import { useViewportCardCount } from '@/hooks/useViewportCardCount';
import { Button, Card, Skeleton } from './ui';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft } from 'lucide-react';

// Types
type CraftingPhase = 'input' | 'building' | 'confirm' | 'result';
type DeckType = {
    topic: string;
    hook: string;
    body: string;
    cta: string;
    final: string;
};

export default function PostGeneratorWizard() {
    // --- State ---
    const [phase, setPhase] = useState<CraftingPhase>('input');
    const [loading, setLoading] = useState(false);
    const [initialInput, setInitialInput] = useState(''); // NEW: Store initial prompt

    const [deck, setDeck] = useState<DeckType>({
        topic: '',
        hook: '',
        body: '',
        cta: '',
        final: ''
    });

    // The "Hand" (Current options to choose from)
    const [hand, setHand] = useState<{
        type: 'topics' | 'hooks' | 'body' | 'cta' | null;
        options: string[] | { optionA: string, optionB: string } | null;
    }>({ type: null, options: null });

    // Settings
    const [settings, setSettings] = useState({
        language: 'id',
        emojiLevel: 5,
        tone: 5,
        researchDepth: 3,
        intent: 'viral',
        length: 'medium',
        magicMode: false,
    });

    // Viewport-aware pagination
    const [isMobile, setIsMobile] = useState(false);
    
    useEffect(() => {
        setIsMobile(window.innerWidth < 768);
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const topicsPerPage = useViewportCardCount({ stepType: 'topics', isMobile, enabled: hand.type === 'topics' });
    const hooksPerPage = useViewportCardCount({ stepType: 'hooks', isMobile, enabled: hand.type === 'hooks' });
    const bodiesPerPage = useViewportCardCount({ stepType: 'body', isMobile, enabled: hand.type === 'body' });
    const ctasPerPage = useViewportCardCount({ stepType: 'cta', isMobile, enabled: hand.type === 'cta' });

    // Navigation history for back button
    const [navigationHistory, setNavigationHistory] = useState<Array<'topics' | 'hooks' | 'body' | 'cta'>>([]);
    
    // Cache generated options to avoid regeneration on back navigation
    const [optionsCache, setOptionsCache] = useState<{
        topics?: string[];
        hooks?: string[];
        body?: string[];
        cta?: string[];
    }>({});
    
    // --- Actions ---

    // 1. Start from Chat Input
    const handleStart = async (topicInput: string, newSettings: any) => {
        setInitialInput(topicInput); // Capture input
        setSettings({ ...settings, ...newSettings });
        setPhase('building');
        setLoading(true);
        setHand({ type: 'topics', options: null });

        try {
            const data = await generateContent('topics', { 
                input: topicInput,
                researchDepth: settings.researchDepth 
            });
            if (data.result) {
                setHand({ type: 'topics', options: data.result });
            }
        } catch(e) { console.error(e); }
        setLoading(false);
    };

    // 2. Select Topic -> Fetch Hooks
    const selectTopic = async (topic: string) => {
        if (hand.options && Array.isArray(hand.options)) {
            setOptionsCache(prev => ({ ...prev, topics: hand.options as string[] }));
            setNavigationHistory(prev => [...prev, 'topics']);
        }
        
        setDeck(prev => ({ ...prev, topic }));
        setHand({ type: 'hooks', options: null });
        setLoading(true);

        try {
            const data = await generateContent('hooks', { 
                input: topic, 
                intent: settings.intent 
            });
            if (data.result) {
                setHand({ type: 'hooks', options: data.result });
                setOptionsCache(prev => ({ ...prev, hooks: data.result }));
            }
        } catch(e) { console.error(e); }
        setLoading(false);
    };

    // 3. Select Hook -> Fetch Body (NO PAYMENT - removed Web3)
    const selectHook = async (hook: string) => {
        if (hand.options && Array.isArray(hand.options)) {
             setOptionsCache(prev => ({ ...prev, hooks: hand.options as string[] }));
             setNavigationHistory(prev => [...prev, 'hooks']);
        }

        setDeck(prev => ({ ...prev, hook }));
        setHand({ type: 'body', options: null });
        setLoading(true);

        try {
            const data = await generateContent('body', { 
                input: hook,
                context: deck.topic,
                intent: settings.intent,
                length: settings.length
            });
            if (data.result) {
                setHand({ type: 'body', options: data.result });
                setOptionsCache(prev => ({ ...prev, body: data.result }));
            }
        } catch(e) { console.error(e); }
        setLoading(false);
    };

    // 4. Select Body -> Fetch CTA
    const selectBody = async (body: string) => {
        if (hand.options && Array.isArray(hand.options)) {
            setOptionsCache(prev => ({ ...prev, body: hand.options as string[] }));
            setNavigationHistory(prev => [...prev, 'body']);
        }
        
        setDeck(prev => ({ ...prev, body }));
        setHand({ type: 'cta', options: null });
        setLoading(true);

        try {
            const data = await generateContent('cta', { 
                input: body, 
                intent: settings.intent 
            });
            if (data.result) {
                setHand({ type: 'cta', options: data.result });
                setOptionsCache(prev => ({ ...prev, cta: data.result }));
            }
        } catch(e) { console.error(e); }
        setLoading(false);
    };

    // 5. Select CTA -> Go to Confirmation
    const selectCTA = async (cta: string) => {
        if (hand.options && Array.isArray(hand.options)) {
            setOptionsCache(prev => ({ ...prev, cta: hand.options as string[] }));
            setNavigationHistory(prev => [...prev, 'cta']);
        }
        
        setDeck(prev => ({ ...prev, cta }));
        setHand({ type: null, options: null });
        setPhase('confirm');
    };

    const reset = () => {
        setPhase('input');
        setDeck({ topic: '', hook: '', body: '', cta: '', final: '' });
        setHand({ type: null, options: null });
        setLoading(false);
        setNavigationHistory([]);
        setOptionsCache({});
        setInitialInput('');
    };

    // Back navigation handler
    const handleBack = () => {
        if (navigationHistory.length === 0) return;
        
        const previousStep = navigationHistory[navigationHistory.length - 1];
        setNavigationHistory(prev => prev.slice(0, -1));
        
        switch (previousStep) {
            case 'topics':
                if (optionsCache.topics) {
                    setHand({ type: 'topics', options: optionsCache.topics });
                    setDeck(prev => ({ ...prev, topic: '', hook: '', body: '', cta: '', final: '' }));
                }
                break;
            case 'hooks':
                if (optionsCache.hooks) {
                    setHand({ type: 'hooks', options: optionsCache.hooks });
                    setDeck(prev => ({ ...prev, hook: '', body: '', cta: '', final: '' }));
                }
                break;
            case 'body':
                if (optionsCache.body) {
                    setHand({ type: 'body', options: optionsCache.body });
                    setDeck(prev => ({ ...prev, body: '', cta: '', final: '' }));
                }
                break;
            case 'cta':
                if (optionsCache.cta) {
                    setHand({ type: 'cta', options: optionsCache.cta });
                    setDeck(prev => ({ ...prev, cta: '', final: '' }));
                    setPhase('building');
                }
                break;
        }
    };

    // Regenerate Handlers
    const regenerateTopics = async () => {
        setLoading(true);
        try {
            const data = await generateContent('topics', { 
                input: deck.topic || 'general topics',
                researchDepth: settings.researchDepth 
            });
            if (data.result) {
                setHand({ type: 'topics', options: data.result });
            }
        } catch(e) { console.error(e); }
        setLoading(false);
    };

    const regenerateHooks = async () => {
        setLoading(true);
        try {
            const data = await generateContent('hooks', { 
                input: deck.topic, 
                intent: settings.intent 
            });
            if (data.result) {
                setHand({ type: 'hooks', options: data.result });
            }
        } catch(e) { console.error(e); }
        setLoading(false);
    };

    const regenerateBody = async () => {
        setLoading(true);
        try {
            const data = await generateContent('body', { 
                input: deck.hook,
                context: deck.topic,
                intent: settings.intent,
                length: settings.length
            });
            if (data.result) {
                setHand({ type: 'body', options: data.result });
            }
        } catch(e) { console.error(e); }
        setLoading(false);
    };

    const regenerateCTA = async () => {
        setLoading(true);
        try {
            const data = await generateContent('cta', { 
                input: deck.body, 
                intent: settings.intent 
            });
            if (data.result) {
                setHand({ type: 'cta', options: data.result });
            }
        } catch(e) { console.error(e); }
        setLoading(false);
    };

    // Score State
    const [opikScores, setOpikScores] = useState<any[]>([]);

    // ... existing state ...

    // ... existing functions ...

    const handleConfirmPolish = async () => {
        setPhase('result');
        setLoading(true);
        try {
            const fullDraft = `${deck.hook}\n\n${deck.body}\n\n${deck.cta}`;
            const data = await polishPost({
                content: fullDraft,
                tone: settings.tone,
                emojiDensity: settings.emojiLevel,
                language: settings.language
            });
            
            if (data.result) {
                setDeck(prev => ({ ...prev, final: data.result }));
                // Set Opik Scores
                if (data.scores) {
                    setOpikScores(data.scores);
                }
            }
        } catch(e) { console.error(e); }
        setLoading(false);
    };

    const handleRePolish = async () => {
        setLoading(true);
        try {
            const fullDraft = `${deck.hook}\n\n${deck.body}\n\n${deck.cta}`;
            const data = await polishPost({
                content: fullDraft,
                tone: settings.tone,
                emojiDensity: settings.emojiLevel,
                language: settings.language
            });
            if (data.result) {
                setDeck(prev => ({ ...prev, final: data.result }));
                 if (data.scores) {
                    setOpikScores(data.scores);
                 }
            }
        } catch(e) { console.error(e); }
        setLoading(false);
    };

    // --- Render ---

    // 1. RESULT PHASE
    if (phase === 'result') {
        return (
            <div className="w-full max-w-4xl mx-auto p-4 z-10 relative">
                <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-2xl border border-gray-100 dark:border-gray-700">
                    
                    {/* Header with Score */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                        <div>
                            <h2 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                                Your Viral Post is Ready!
                            </h2>
                            <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 bg-orange-100 dark:bg-orange-900/30 rounded-full text-xs font-medium text-orange-700 dark:text-orange-300">
                                <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></span>
                                Traced by Opik AI
                            </div>
                        </div>

                        {/* OPIK SCORE CARD */}
                        {opikScores && opikScores.length > 0 && (
                            <OpikScoreCard scores={opikScores} />
                        )}
                    </div>
                    
                    <pre className="whitespace-pre-wrap font-sans text-gray-700 dark:text-gray-200 text-lg leading-relaxed bg-gray-50 dark:bg-gray-900 p-6 rounded-xl border border-gray-100 dark:border-gray-800">
                        {deck.final || 'Polishing your masterpiece...'}
                    </pre>
                    <div className="mt-6 flex gap-4 flex-wrap">
                        <Button onClick={() => { navigator.clipboard.writeText(deck.final || '') }}>Copy Text</Button>
                        <Button 
                            variant="outline" 
                            onClick={handleRePolish} 
                            disabled={loading}
                            style={{ color: '#ffffff', borderColor: '#52525b' }}
                            className="hover:bg-zinc-800"
                        >
                            {loading ? 'Re-polishing...' : 'Re-Polish'}
                        </Button>
                        <Button 
                            variant="outline" 
                            onClick={reset}
                            style={{ color: '#ffffff', borderColor: '#52525b' }}
                            className="hover:bg-zinc-800"
                        >
                            Start Over
                        </Button>
                    </div>
                </div>
            </div>
        )
    }

    // 2. INPUT / BUILDING PHASE
    return (
        <div className="flex items-start justify-center min-h-screen w-full max-w-7xl mx-auto px-12 py-6 relative z-10 gap-8 overflow-x-hidden">
            
            {/* LEFT COLUMN: Conditional Layout */}
            <div className="flex-1 max-w-3xl flex flex-col" style={{ minHeight: 'calc(100vh - 48px)' }}>
                
                {/* INPUT PHASE: Centered Layout */}
                {phase === 'input' && (
                    <motion.div 
                        className="flex-1 flex flex-col items-center justify-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        {/* Greeting - ORANGE THEME */}
                        <div className="text-center animate-fade-in-up mb-8">
                            <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-600 to-amber-600 tracking-tight mb-2">
                                Hello, Creator
                            </h1>
                            <p className="text-base md:text-lg text-gray-700 dark:text-gray-400 font-medium">
                                What do you want to write today?
                            </p>
                            {/* Opik Badge */}
                            <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 bg-orange-100 dark:bg-orange-900/30 rounded-full text-xs font-medium text-orange-700 dark:text-orange-300">
                                <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></span>
                                Powered by Opik AI Observability
                            </div>
                        </div>
                        
                        {/* ChatInput - Centered */}
                        <div className="w-full">
                            <ChatInput 
                                onGenerate={handleStart} 
                                initialSettings={settings}
                                onSettingsChange={setSettings}
                            />
                        </div>
                    </motion.div>
                )}

                {/* BUILDING PHASE */}
                {phase === 'building' && (
                    <>
                        <motion.div 
                            className="flex-1 overflow-auto"
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                        >

                <AnimatePresence mode="wait">
                    {phase === 'building' && (
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="w-full mt-8"
                        >
                             {/* Progress Indicator - ORANGE THEME */}
                             <div className="flex items-center justify-between mb-6 px-4">
                                 <div className="flex gap-2">
                                    {['Topic', 'Hook', 'Body', 'CTA', 'Polish'].map((step, i) => {
                                        const stepNames = ['topics', 'hooks', 'body', 'cta'];
                                        const currentIdx = stepNames.indexOf(hand.type || '');
                                        const isActive = currentIdx !== -1 && i <= currentIdx;
                                        
                                        return (
                                            <div key={step} className={`text-xs font-bold px-3 py-1 rounded-full transition-colors ${isActive ? 'bg-orange-600 text-white' : 'bg-gray-200 dark:bg-gray-800 text-gray-400'}`}>
                                                {step}
                                            </div>
                                        )
                                    })}
                             </div>
                             </div>
                             
                             {/* Back Button */}
                             {navigationHistory.length > 0 && (
                                 <button
                                     onClick={handleBack}
                                     className="flex items-center gap-2 px-4 py-2 mb-4 text-sm text-gray-600 dark:text-gray-400 hover:text-orange-600 dark:hover:text-orange-400 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                                 >
                                     <ChevronLeft className="w-4 h-4" />
                                     Back to {navigationHistory[navigationHistory.length - 1]}
                                 </button>
                             )}
                             
                            <div className="grid grid-cols-1 gap-4">
                                {/* Loading Skeleton */}
                                {loading && (
                                    <div className="space-y-3">
                                        <Skeleton className="h-24 w-full rounded-2xl" />
                                        <Skeleton className="h-24 w-full rounded-2xl" />
                                        <Skeleton className="h-24 w-full rounded-2xl" />
                                    </div>
                                )}

                                {/* Options Carousel */}
                                {!loading && hand.options && Array.isArray(hand.options) && (
                                    <OptionCarousel
                                        options={hand.options}
                                        onSelect={(opt) => {
                                            if (hand.type === 'topics') selectTopic(opt);
                                            if (hand.type === 'hooks') selectHook(opt);
                                            if (hand.type === 'body') selectBody(opt);
                                            if (hand.type === 'cta') selectCTA(opt);
                                        }}
                                        onRegenerate={() => {
                                            if (hand.type === 'topics') regenerateTopics();
                                            if (hand.type === 'hooks') regenerateHooks();
                                            if (hand.type === 'body') regenerateBody();
                                            if (hand.type === 'cta') regenerateCTA();
                                        }}
                                        itemsPerPage={
                                            hand.type === 'topics' ? topicsPerPage :
                                            hand.type === 'hooks' ? hooksPerPage :
                                            hand.type === 'body' ? bodiesPerPage :
                                            ctasPerPage
                                        }
                                        stepType={hand.type!}
                                        loading={loading}
                                    />
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>


                        </motion.div>
                        
                        {/* ChatInput - Fixed at bottom */}
                        <motion.div 
                            className="flex-shrink-0"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: 0.1 }}
                        >
                            <ChatInput 
                                onGenerate={handleStart} 
                                initialSettings={settings}
                                onSettingsChange={setSettings}
                            />
                        </motion.div>
                    </>
                )}

                {/* CONFIRMATION PHASE */}
                {phase === 'confirm' && (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="max-w-3xl mx-auto mt-8"
                    >
                        <div className="p-8 bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700">
                            <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white text-center">
                                Ready to Polish?
                            </h2>
                            
                            <div className="space-y-6 mb-8 p-6 bg-gray-50 dark:bg-gray-900 rounded-2xl">
                                <div>
                                    <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2 uppercase tracking-wide">
                                        Hook:
                                    </p>
                                    <p className="text-lg text-gray-900 dark:text-white leading-relaxed">
                                        {deck.hook}
                                    </p>
                                </div>
                                
                                <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                                    <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2 uppercase tracking-wide">
                                        Body:
                                    </p>
                                    <p className="text-lg text-gray-900 dark:text-white leading-relaxed whitespace-pre-wrap">
                                        {deck.body}
                                    </p>
                                </div>
                                
                                <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                                    <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2 uppercase tracking-wide">
                                        CTA:
                                    </p>
                                    <p className="text-lg text-gray-900 dark:text-white leading-relaxed">
                                        {deck.cta || '(No CTA)'}
                                    </p>
                                </div>
                            </div>
                            
                            <div className="flex gap-4">
                                <button
                                    onClick={handleConfirmPolish}
                                    disabled={loading}
                                    className="flex-1 bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {loading ? (
                                        <>
                                            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                                            </svg>
                                            Polishing...
                                        </>
                                    ) : (
                                        <>Yes, Polish!</>
                                    )}
                                </button>
                                <button
                                    onClick={() => {
                                        setPhase('building');
                                        setHand({ type: 'cta', options: optionsCache.cta || [] });
                                    }}
                                    disabled={loading}
                                    className="flex-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white px-8 py-4 rounded-xl font-bold text-lg transition-all disabled:opacity-50"
                                >
                                    Edit Again
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </div>

            {/* RIGHT COLUMN: Canvas - Only show during building */}
            <AnimatePresence>
                {phase === 'building' && (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.5 }}
                        className="hidden lg:block w-96 sticky top-10 h-[calc(100vh-3rem)]"
                    >
                        <div className="h-full bg-white/20 dark:bg-black/20 backdrop-blur-2xl rounded-3xl border border-white/30 dark:border-white/10 shadow-2xl overflow-hidden">
                            <Canvas 
                                deck={deck} 
                                currentStep={hand.type}
                                settings={settings}
                            />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* MOBILE Canvas - Bottom Sheet Carousel */}
            {phase === 'building' && (
                <MobileCanvas 
                    deck={deck} 
                    currentStep={hand.type}
                />
            )}
        </div>
    );
}

