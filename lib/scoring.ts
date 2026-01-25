export const scoreHook = (hook: string): Record<string, number> => {
    // Robust checks for viral patterns
    const hasHookPattern = (
        hook.includes('?') ||
        hook.includes('!') ||
        hook.toLowerCase().includes('why') ||
        hook.toLowerCase().includes('how') ||
        hook.toLowerCase().includes('secret') ||
        hook.toLowerCase().includes('mistake')
    ) ? 1 : 0.5;

    const isConcise = hook.split(' ').length <= 25 ? 1 : 0.6;

    // Check key "power words" for virality
    const powerWords = ['stop', 'never', 'cheat', 'guide', 'blueprint', 'steal', 'proven'];
    const hasPowerWord = powerWords.some(w => hook.toLowerCase().includes(w)) ? 1 : 0.0;

    const viralityScore = (hasHookPattern + isConcise + hasPowerWord) / 3;

    return {
        has_hook_pattern: hasHookPattern,
        is_concise: isConcise,
        has_power_word: hasPowerWord,
        virality_score: viralityScore
    };
};

export const scoreBody = (body: string, expectedLength: string = 'medium'): Record<string, number> => {
    const wordCount = body.split(' ').length;

    let lengthScore = 0;
    switch (expectedLength) {
        case 'short':
            lengthScore = (wordCount >= 30 && wordCount <= 120) ? 1 : 0.5;
            break;
        case 'medium': // Default
            lengthScore = (wordCount >= 100 && wordCount <= 300) ? 1 : 0.6;
            break;
        case 'long':
            lengthScore = wordCount >= 250 ? 1 : 0.6;
            break;
    }

    // Formatting checks (bullet points, spacing)
    const hasFormatting = (body.includes('\n\n') || body.includes('- ')) ? 1 : 0.4;

    return {
        length_score: lengthScore,
        has_formatting: hasFormatting,
        word_count: wordCount
    };
};

export const calculateTotalScore = (hook: string, body: string, cta: string): { score: number, breakdown: any } => {
    const hookMetrics = scoreHook(hook);
    const bodyMetrics = scoreBody(body);

    // CTA Check
    const ctaScore = (cta.length > 5 && (cta.includes('?') || cta.toLowerCase().includes('comment') || cta.toLowerCase().includes('repost'))) ? 1 : 0.5;

    // Weighted Total Score (0 - 100)
    // Hook is most important (40%), Body (30%), Formatting (20%), CTA (10%)
    const weightedScore = (
        (hookMetrics.virality_score * 0.4) +
        (bodyMetrics.length_score * 0.3) +
        (bodyMetrics.has_formatting * 0.2) +
        (ctaScore * 0.1)
    ) * 100;

    return {
        score: Math.round(weightedScore),
        breakdown: {
            hook: Math.round(hookMetrics.virality_score * 100),
            body: Math.round(bodyMetrics.length_score * 100),
            formatting: Math.round(bodyMetrics.has_formatting * 100),
            cta: Math.round(ctaScore * 100)
        }
    };
};
