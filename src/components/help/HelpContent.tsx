"use client";

import type { HelpSection } from "./helpTypes";
import {
  Sparkles,
  Rocket,
  Zap,
  Mic,
  Search,
  TrendingUp,
  Globe,
  ThumbsUp,
  CheckCircle,
  Info,
  ExternalLink,
  ShieldCheck,
  Lightbulb,
  HelpCircle,
  AlertCircle,
} from "lucide-react";

interface HelpContentProps {
  activeSection: HelpSection;
  searchQuery: string;
}

export default function HelpContent({ activeSection, searchQuery }: HelpContentProps) {
  const renderContent = () => {
    switch (activeSection) {
      case "getting-started":
        return <GettingStartedSection />;
      case "features":
        return <FeaturesSection />;
      case "tips":
        return <TipsSection />;
      case "faq":
        return <FaqSection />;
      case "troubleshooting":
        return <TroubleshootingSection />;
      default:
        return <GettingStartedSection />;
    }
  };

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="space-y-6 px-6 py-6">{renderContent()}</div>
    </div>
  );
}

function SectionHeader({
  title,
  icon: Icon,
  description,
}: {
  title: string;
  icon: any;
  description: string;
}) {
  return (
    <div>
      <div className="mb-2 flex items-center gap-3">
        <div className="rounded-lg bg-orange-500/10 p-2.5">
          <Icon className="h-6 w-6 text-orange-500" />
        </div>
        <h1 className="text-2xl font-bold text-white">{title}</h1>
      </div>
      <p className="pl-14 text-zinc-400">{description}</p>
    </div>
  );
}

function ContentBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
      <h3 className="mb-4 text-lg font-semibold text-white">{title}</h3>
      <div className="space-y-3 text-sm leading-relaxed text-zinc-300">{children}</div>
    </div>
  );
}

function OpikAIBadge() {
  return (
    <div className="mb-6 rounded-xl border border-purple-700/30 bg-gradient-to-r from-purple-900/30 to-blue-900/30 p-5">
      <div className="flex items-start gap-4">
        <div className="rounded-lg bg-purple-600 p-2.5 shadow-lg shadow-purple-500/20">
          <Sparkles className="h-6 w-6 text-white" />
        </div>
        <div className="flex-1">
          <h3 className="mb-2 text-lg font-semibold text-purple-300">Powered by OPIK AI</h3>
          <p className="mb-3 text-sm text-zinc-300">
            AlterEgo uses OPIK AI for observability and quality assurance, ensuring the content you
            generate is high-quality and consistent.
          </p>
          <div className="space-y-2 text-xs text-zinc-400">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-3.5 w-3.5 text-purple-400" />
              <span>Track AI model performance in real-time</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-3.5 w-3.5 text-purple-400" />
              <span>Monitor generation quality and accuracy</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-3.5 w-3.5 text-purple-400" />
              <span>Identify and debug issues quickly</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-3.5 w-3.5 text-purple-400" />
              <span>Data privacy compliant (no personal info collected)</span>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-4 flex items-center justify-between border-t border-purple-700/20 pt-4">
        <span className="text-xs text-zinc-500">© 2026 Commit To Change Hackathon</span>
        <a
          href="https://www.opik.ai"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-xs text-purple-400 transition-colors hover:text-purple-300"
        >
          <ExternalLink className="h-3 w-3" />
          Visit OPIK AI
        </a>
      </div>
    </div>
  );
}

function GettingStartedSection() {
  return (
    <div className="space-y-6">
      <SectionHeader
        title="Getting Started"
        icon={Rocket}
        description="Quick guide to start using AlterEgo"
      />

      <ContentBlock title="What is AlterEgo?">
        <p>
          AlterEgo is an AI assistant that helps you create viral LinkedIn content in minutes, not
          hours.
        </p>
        <div className="my-4 space-y-2 rounded-lg bg-zinc-800/50 p-4">
          <div className="flex items-center gap-2 text-zinc-200">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <span>Create posts about any topic</span>
          </div>
          <div className="flex items-center gap-2 text-zinc-200">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <span>Adapt to your writing style</span>
          </div>
          <div className="flex items-center gap-2 text-zinc-200">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <span>Use voice input (hands-free)</span>
          </div>
          <div className="flex items-center gap-2 text-zinc-200">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <span>Get viral score for every post</span>
          </div>
          <div className="flex items-center gap-2 text-zinc-200">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <span>Supports Indonesian and English</span>
          </div>
        </div>
        <p className="font-medium text-orange-400">
          Creating engaging LinkedIn content is now as easy as 1-2-3: Pick a topic → AI generates →
          Copy & paste!
        </p>
      </ContentBlock>

      <ContentBlock title="How to Create Your First Post">
        <div className="space-y-4">
          <div>
            <p className="mb-1 font-medium text-orange-400">Step 1: Enter Your Topic</p>
            <ul className="ml-4 list-disc space-y-1">
              <li>Type your topic in the input box</li>
              <li>Example: "Tips for junior developers"</li>
              <li>Or use voice input 🎙️</li>
              <li>Click "Generate Topics"</li>
            </ul>
          </div>
          <div>
            <p className="mb-1 font-medium text-orange-400">Step 2: Choose Your Topic</p>
            <ul className="ml-4 list-disc space-y-1">
              <li>AI will display 10 topic options</li>
              <li>Select the one that fits best</li>
              <li>Click on the topic to select it</li>
            </ul>
          </div>
          <div>
            <p className="mb-1 font-medium text-orange-400">Step 3: Choose a Hook (Opening)</p>
            <ul className="ml-4 list-disc space-y-1">
              <li>AI will generate 5-10 hooks</li>
              <li>Hook is an attention-grabbing opening sentence</li>
              <li>Select the most eye-catching hook</li>
            </ul>
          </div>
          <div>
            <p className="mb-1 font-medium text-orange-400">Step 4: Choose Body (Post Content)</p>
            <ul className="ml-4 list-disc space-y-1">
              <li>AI will generate 5-10 body posts</li>
              <li>Body is the main content</li>
              <li>Select the most relevant and informative one</li>
            </ul>
          </div>
          <div>
            <p className="mb-1 font-medium text-orange-400">Step 5: Choose CTA (Call-to-Action)</p>
            <ul className="ml-4 list-disc space-y-1">
              <li>AI will generate 5 CTAs</li>
              <li>CTA is a call to action at the end of the post</li>
              <li>Select the one that matches your goal</li>
            </ul>
          </div>
          <div>
            <p className="mb-1 font-medium text-orange-400">Step 6: View Final Result</p>
            <ul className="ml-4 list-disc space-y-1">
              <li>Complete post will be displayed</li>
              <li>View Viral Score (scale 0-100)</li>
              <li>Copy to clipboard or edit manually</li>
            </ul>
          </div>
        </div>
      </ContentBlock>

      <ContentBlock title="Understanding the Generation Flow">
        <div className="my-4 rounded-lg bg-zinc-800/50 p-4">
          <div className="flex items-center justify-between text-center text-sm">
            <div className="flex-1">
              <div className="font-semibold text-orange-400">Topic</div>
              <div className="text-xs text-zinc-500">10x options</div>
            </div>
            <div className="px-2 text-zinc-600">→</div>
            <div className="flex-1">
              <div className="font-semibold text-orange-400">Hooks</div>
              <div className="text-xs text-zinc-500">10x options</div>
            </div>
            <div className="px-2 text-zinc-600">→</div>
            <div className="flex-1">
              <div className="font-semibold text-orange-400">Body</div>
              <div className="text-xs text-zinc-500">10x options</div>
            </div>
            <div className="px-2 text-zinc-600">→</div>
            <div className="flex-1">
              <div className="font-semibold text-orange-400">CTA</div>
              <div className="text-xs text-zinc-500">10x options</div>
            </div>
            <div className="px-2 text-zinc-600">→</div>
            <div className="flex-1">
              <div className="font-semibold text-green-400">Final Post</div>
              <div className="text-xs text-zinc-500">1x result</div>
            </div>
          </div>
        </div>
        <p>
          Each stage gives you options to choose the best one. You can regenerate options at any
          stage if you're not satisfied.
        </p>
      </ContentBlock>

      <ContentBlock title="Setting Preferences">
        <div className="space-y-4">
          <div>
            <p className="mb-2 font-medium text-orange-400">Tone</p>
            <ul className="ml-4 list-disc space-y-1">
              <li>1-3: Very Formal</li>
              <li>4-5: Formal</li>
              <li>6-7: Casual</li>
              <li>8-10: Very Casual</li>
            </ul>
          </div>
          <div>
            <p className="mb-2 font-medium text-orange-400">Emoji Level</p>
            <ul className="ml-4 list-disc space-y-1">
              <li>0: No emoji</li>
              <li>1-3: Minimal emoji</li>
              <li>4-6: Moderate emoji</li>
              <li>7-8: Many emojis</li>
            </ul>
          </div>
          <div>
            <p className="mb-2 font-medium text-orange-400">Intent (Purpose)</p>
            <ul className="ml-4 list-disc space-y-1">
              <li>Viral: Post with high viral potential</li>
              <li>Storytelling: Story-based post</li>
              <li>Educational: Educational post</li>
            </ul>
          </div>
          <div>
            <p className="mb-2 font-medium text-orange-400">Language</p>
            <ul className="ml-4 list-disc space-y-1">
              <li>Indonesian: Indonesian language</li>
              <li>English: English language</li>
            </ul>
          </div>
          <div>
            <p className="mb-2 font-medium text-orange-400">Length</p>
            <ul className="ml-4 list-disc space-y-1">
              <li>Short: Short (~200 words)</li>
              <li>Medium: Medium (~500 words)</li>
              <li>Long: Long (~800 words)</li>
            </ul>
          </div>
        </div>
      </ContentBlock>
    </div>
  );
}

function FeaturesSection() {
  return (
    <div className="space-y-6">
      <SectionHeader
        title="Features"
        icon={Zap}
        description="Explore all available features in AlterEgo"
      />

      <ContentBlock title="AI Content Generation">
        <div className="mb-3 flex items-center gap-2 text-orange-400">
          <Sparkles className="h-5 w-5" />
          <p className="font-medium">Powered by Advanced AI</p>
        </div>
        <p className="mb-3">
          AlterEgo uses AI (Large Language Model) to generate high-quality LinkedIn content.
        </p>
        <p className="mb-3 font-medium">What AI does:</p>
        <ul className="ml-4 list-disc space-y-1">
          <li>Generate relevant and interesting topics</li>
          <li>Create attention-grabbing hooks</li>
          <li>Write informative and engaging body posts</li>
          <li>Create persuasive CTAs</li>
          <li>Polish content to optimize engagement</li>
        </ul>
        <p className="mt-3 text-xs text-zinc-400">
          AI is specifically configured for LinkedIn - understands optimal format, adapts to
          professional audience, and generates shareable content.
        </p>
      </ContentBlock>

      <ContentBlock title="Style Cloning">
        <div className="mb-3 flex items-center gap-2 text-purple-400">
          <Sparkles className="h-5 w-5" />
          <p className="font-medium">Clone Your Writing Style</p>
        </div>
        <p className="mb-3">Style cloning allows AI to write in your own writing style.</p>
        <p className="mb-3 font-medium">How to Use:</p>
        <ol className="ml-4 list-decimal space-y-1">
          <li>Click "Analyze Style" in the menu</li>
          <li>Upload 5-10 of your previous LinkedIn posts</li>
          <li>AI will analyze your writing patterns</li>
          <li>Generate new posts with the same style!</li>
        </ol>
        <p className="mt-3 font-medium">What is analyzed:</p>
        <ul className="ml-4 list-disc space-y-1 text-xs">
          <li>Sentence structure</li>
          <li>Word choice and vocabulary</li>
          <li>Use of punctuation</li>
          <li>Tone and voice</li>
          <li>Emoji usage pattern</li>
        </ul>
      </ContentBlock>

      <ContentBlock title="Voice Input">
        <div className="mb-3 flex items-center gap-2 text-green-400">
          <Mic className="h-5 w-5" />
          <p className="font-medium">Speak, Don't Type</p>
        </div>
        <p className="mb-3">
          Voice input allows you to enter topics or content with your voice, without typing.
        </p>
        <p className="mb-3 font-medium">How to Use:</p>
        <ol className="ml-4 list-decimal space-y-1">
          <li>Click the microphone icon 🎙️ in the input field</li>
          <li>Allow microphone access (only once)</li>
          <li>Speak in Indonesian or English</li>
          <li>AI will automatically transcribe to text</li>
        </ol>
        <p className="mt-3 font-medium">Use Cases:</p>
        <ul className="ml-4 list-disc space-y-1 text-xs">
          <li>When walking and have an idea</li>
          <li>When driving and want to capture an idea</li>
          <li>For those who speak faster than they type</li>
          <li>For multi-tasking</li>
        </ul>
      </ContentBlock>

      <ContentBlock title="Web Research">
        <div className="mb-3 flex items-center gap-2 text-blue-400">
          <Search className="h-5 w-5" />
          <p className="font-medium">Research from the Web</p>
        </div>
        <p className="mb-3">
          Web research provides AI with context from the internet to generate more accurate and
          up-to-date content.
        </p>
        <p className="mb-3 font-medium">How to Use:</p>
        <ol className="ml-4 list-decimal space-y-1">
          <li>Enter your topic</li>
          <li>Enable "Research" toggle (default on)</li>
          <li>Choose research depth (1-10)</li>
          <li>AI will search the web and generate with context</li>
        </ol>
        <p className="mt-3 font-medium">Research Depth Guide:</p>
        <ul className="ml-4 list-disc space-y-1 text-xs">
          <li>1-3: Fast, minimal context</li>
          <li>4-7: Balanced, moderate context</li>
          <li>8-10: Deep, comprehensive context</li>
        </ul>
      </ContentBlock>

      <ContentBlock title="Viral Score">
        <div className="mb-3 flex items-center gap-2 text-orange-400">
          <TrendingUp className="h-5 w-5" />
          <p className="font-medium">Score Your Content's Virality</p>
        </div>
        <p className="mb-3">
          Viral score is an AI assessment (0-100) of how likely your post is to go viral on
          LinkedIn.
        </p>
        <p className="mb-3 font-medium">Viral Score Components:</p>
        <ul className="ml-4 list-disc space-y-1 text-xs">
          <li>Engagement Value (40%): How engaging is the content?</li>
          <li>Shareability (30%): How shareable is it?</li>
          <li>Value to Audience (20%): How valuable to the audience?</li>
          <li>Originality (10%): How original and unique?</li>
        </ul>
        <p className="mt-3 font-medium">Score Breakdown:</p>
        <ul className="ml-4 list-disc space-y-1 text-xs">
          <li>90-100: Excellent - Very high viral potential</li>
          <li>70-89: Great - High viral potential</li>
          <li>50-69: Good - Decent post</li>
          <li>30-49: Fair - Can be improved</li>
          <li>0-29: Poor - Needs significant revision</li>
        </ul>
      </ContentBlock>

      <ContentBlock title="Multi-Language">
        <div className="mb-3 flex items-center gap-2 text-blue-400">
          <Globe className="h-5 w-5" />
          <p className="font-medium">Indonesian & English</p>
        </div>
        <p className="mb-3">AlterEgo supports Indonesian and English languages.</p>
        <p className="mb-3 font-medium">Language Support:</p>
        <ul className="ml-4 list-disc space-y-1 text-xs">
          <li>Input: Type or speak in ID/EN</li>
          <li>Output: Content generated in the same language</li>
          <li>Voice input: Transcription ID/EN</li>
          <li>Style cloning: Works for both languages</li>
          <li>Viral scoring: Works for both languages</li>
        </ul>
      </ContentBlock>

      <OpikAIBadge />
    </div>
  );
}

function TipsSection() {
  return (
    <div className="space-y-6">
      <SectionHeader
        title="Tips & Tricks"
        icon={Lightbulb}
        description="Tips to maximize your use of AlterEgo"
      />

      <ContentBlock title="Improving Viral Score">
        <div className="space-y-3">
          <div>
            <p className="mb-1 font-medium text-orange-400">1. Use Powerful Hooks</p>
            <p className="text-xs">❌ "Tips for junior developers"</p>
            <p className="text-xs text-green-400">
              ✅ "I wish someone told me this 5 years ago..."
            </p>
          </div>
          <div>
            <p className="mb-1 font-medium text-orange-400">2. Tell Stories, Don't Just List</p>
            <p className="text-xs">❌ "Here are 5 tips for productivity"</p>
            <p className="text-xs text-green-400">
              ✅ "I used to struggle with productivity until I discovered..."
            </p>
          </div>
          <div>
            <p className="mb-1 font-medium text-orange-400">3. Use Data and Numbers</p>
            <p className="text-xs">❌ "Productivity is important"</p>
            <p className="text-xs text-green-400">
              ✅ "Using these techniques, I increased my productivity by 200%"
            </p>
          </div>
          <div>
            <p className="mb-1 font-medium text-orange-400">4. Ask Questions</p>
            <p className="text-xs text-green-400">
              ✅ "Which of these tips resonates most with you? Comment below!"
            </p>
          </div>
          <div>
            <p className="mb-1 font-medium text-orange-400">5. Use Relevant Hashtags</p>
            <p className="text-xs">❌ #post #tips</p>
            <p className="text-xs text-green-400">
              ✅ #ProductivityTips #CareerAdvice #TechIndustry
            </p>
          </div>
          <div>
            <p className="mb-1 font-medium text-orange-400">6. Post at Optimal Times</p>
            <p className="text-xs">Weekdays: 8-9 AM, 12-1 PM, 5-6 PM (local time)</p>
          </div>
          <div>
            <p className="mb-1 font-medium text-orange-400">7. Add Personal Touch</p>
            <ul className="ml-4 list-disc text-xs">
              <li>Share personal experiences</li>
              <li>Use your authentic voice</li>
              <li>Connect emotionally with audience</li>
            </ul>
          </div>
          <div>
            <p className="mb-1 font-medium text-orange-400">8. Format for Readability</p>
            <ul className="ml-4 list-disc text-xs">
              <li>Use paragraphs (max 3-4 lines each)</li>
              <li>Use bullet points for lists</li>
              <li>Add white space</li>
            </ul>
          </div>
        </div>
      </ContentBlock>

      <ContentBlock title="Topics That Perform Well">
        <div className="space-y-2 text-xs">
          <p className="font-medium">1. Listicles (List Articles)</p>
          <p className="ml-2 text-zinc-400">"7 mistakes I made as junior developer"</p>
          <p className="mt-2 font-medium">2. Personal Stories</p>
          <p className="ml-2 text-zinc-400">"I failed at X, here's what I learned"</p>
          <p className="mt-2 font-medium">3. Contrarian Views</p>
          <p className="ml-2 text-zinc-400">"Why I disagree with common advice about X"</p>
          <p className="mt-2 font-medium">4. How-To Guides</p>
          <p className="ml-2 text-zinc-400">"How I built X from scratch in Y hours"</p>
          <p className="mt-2 font-medium">5. Industry Insights</p>
          <p className="ml-2 text-zinc-400">"What nobody tells you about X"</p>
          <p className="mt-2 font-medium">6. Career Advice</p>
          <p className="ml-2 text-zinc-400">"If you want to be X, stop doing Y"</p>
          <p className="mt-2 font-medium">7. Productivity Hacks</p>
          <p className="ml-2 text-zinc-400">"This one trick saved me 2 hours daily"</p>
          <p className="mt-2 font-medium">8. Industry Trends</p>
          <p className="ml-2 text-zinc-400">"X is changing the game for Y"</p>
        </div>
      </ContentBlock>

      <ContentBlock title="Voice Input Best Practices">
        <div className="space-y-2 text-xs">
          <p className="font-medium">1. Speak Clearly and Concisely</p>
          <p className="ml-2 text-zinc-400">Articulate words clearly, speak at moderate pace</p>
          <p className="font-medium">2. Use Natural Language</p>
          <p className="ml-2 text-zinc-400">Speak like you're talking to a friend</p>
          <p className="font-medium">3. Provide Context When Needed</p>
          <p className="ml-2 text-zinc-400">❌ "Productivity"</p>
          <p className="ml-2 text-green-400">
            ✅ "I want to write about productivity tips for junior developers"
          </p>
          <p className="font-medium">4. Be Patient with Transcription</p>
          <p className="ml-2 text-zinc-400">Transcription takes 2-5 seconds</p>
          <p className="font-medium">5. Check for Accuracy</p>
          <p className="ml-2 text-zinc-400">Always review transcribed text</p>
        </div>
      </ContentBlock>

      <ContentBlock title="Tips for Effective Web Research">
        <div className="space-y-2 text-xs">
          <p className="font-medium">1. Understand Research Depth</p>
          <ul className="ml-2 list-disc space-y-1 text-zinc-400">
            <li>1-3 (Quick): Good for general topics, when speed matters</li>
            <li>4-7 (Balanced): Good for topics with some complexity</li>
            <li>8-10 (Deep): Good for technical or data-driven topics</li>
          </ul>
          <p className="mt-2 font-medium">2. Use Specific Topics</p>
          <p className="ml-2 text-zinc-400">❌ "AI"</p>
          <p className="ml-2 text-green-400">
            ✅ "How AI is transforming customer service in 2026"
          </p>
          <p className="mt-2 font-medium">3. Leverage Real-Time Data</p>
          <p className="ml-2 text-zinc-400">Web research gives latest information and trends</p>
          <p className="mt-2 font-medium">4. Combine Research with Personal Experience</p>
          <p className="ml-2 text-zinc-400">
            Research provides facts, personal experience adds authenticity
          </p>
        </div>
      </ContentBlock>

      <ContentBlock title="LinkedIn-Specific Tips">
        <div className="space-y-2 text-xs">
          <p className="font-medium">1. Optimize for LinkedIn Algorithm</p>
          <p className="ml-2 text-zinc-400">
            Engagement matters most, post consistently, respond to comments
          </p>
          <p className="font-medium">2. Format for LinkedIn</p>
          <p className="ml-2 text-zinc-400">
            Use paragraphs (max 3-4 lines each), use bullet points, add white space
          </p>
          <p className="font-medium">3. Hook is Everything</p>
          <p className="ml-2 text-zinc-400">First line determines if people stop scrolling</p>
          <p className="font-medium">4. Value First, Promote Later</p>
          <p className="ml-2 text-zinc-400">Give value before asking for anything</p>
          <p className="font-medium">5. Engage, Don't Just Post</p>
          <p className="ml-2 text-zinc-400">Comment on others' posts, respond to comments</p>
          <p className="font-medium">6. Use LinkedIn Analytics</p>
          <p className="ml-2 text-zinc-400">Check what performs best, post more of what works</p>
          <p className="font-medium">7. Timing Matters</p>
          <p className="ml-2 text-zinc-400">Best times: Tue-Thu, 8-9 AM, 12-1 PM, 5-6 PM</p>
          <p className="font-medium">8. Build Personal Brand</p>
          <p className="ml-2 text-zinc-400">
            Be consistent in your voice and topics, share authentic experiences
          </p>
        </div>
      </ContentBlock>
    </div>
  );
}

function FaqSection() {
  const faqs = [
    {
      q: "Is AlterEgo free?",
      a: "Yes, AlterEgo is currently free to use. We may add premium features in the future, but core features will remain free.",
    },
    {
      q: "Is the generated content original?",
      a: "Yes, every content is freshly generated by AI for you. There is no plagiarism or copying from other sources.",
    },
    {
      q: "How long does it take to generate a post?",
      a: "Usually 30-60 seconds for the entire flow. Time varies depending on research depth, server load, and internet connection.",
    },
    {
      q: "Can I edit the generated content?",
      a: "Of course! You can edit the generated content at any time. AI provides a good draft, but you still have full control.",
    },
    {
      q: "Is my data safe?",
      a: "Yes, privacy and security are our priorities. Voice input is processed on servers and not stored, content is not stored in our database.",
    },
    {
      q: "Can AlterEgo write in other languages?",
      a: "Currently AlterEgo only supports Indonesian and English. We may add more languages in the future.",
    },
    {
      q: "Can AI create content for other platforms?",
      a: "Currently AlterEgo is configured specifically for LinkedIn. However, content can be adapted for Twitter, Instagram, or other platforms.",
    },
    {
      q: "How do I improve viral score?",
      a: "Choose attention-grabbing hooks, use storytelling or data, add questions for engagement, use relevant hashtags.",
    },
    {
      q: "Does style cloning always work?",
      a: "Style cloning works well if you upload 5-10 posts with consistent style and long enough to be analyzed.",
    },
    {
      q: "What if voice input is not accurate?",
      a: "Speak more clearly and slowly, ensure a quiet environment, rephrase or provide more context, edit transcribed text.",
    },
  ];

  return (
    <div className="space-y-6">
      <SectionHeader
        title="FAQ"
        icon={HelpCircle}
        description="Answers to frequently asked questions"
      />

      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <ContentBlock key={index} title={faq.q}>
            <p>{faq.a}</p>
          </ContentBlock>
        ))}
      </div>

      <ContentBlock title="Contact Support">
        <p className="mb-2">If you experience issues or have questions:</p>
        <ul className="ml-4 list-disc space-y-1 text-xs">
          <li>Email: support@alterego.ai</li>
          <li>Twitter: @AlterEgoAI</li>
          <li>LinkedIn: AlterEgo</li>
          <li>GitHub: Create issue in repository</li>
        </ul>
        <p className="mt-2 text-xs text-zinc-400">
          We will respond as soon as possible (usually within 24 hours on weekdays).
        </p>
      </ContentBlock>
    </div>
  );
}

function TroubleshootingSection() {
  const issues = [
    {
      title: "AI not responding / generation stuck",
      solutions: [
        "Check internet connection, ensure it's stable",
        "Try regenerating (server might be busy)",
        "Reduce research depth to 1-3 for testing",
        "Clear browser cache and refresh page",
        "Contact support if issue persists",
      ],
    },
    {
      title: "Generated content is not relevant",
      solutions: [
        "Provide more specific topics",
        "Add more context (audience, industry, examples)",
        "Adjust preferences (tone, length, intent)",
        "Use style cloning to adapt to your style",
        "Generate multiple options and select the most relevant",
      ],
    },
    {
      title: "Low viral score",
      solutions: [
        "Choose more attention-grabbing hooks",
        "Add storytelling or interesting data points",
        "Use questions at the end of the post",
        "Add relevant hashtags (3-5 specific ones)",
        "Edit manually for more personalization",
      ],
    },
    {
      title: "Voice input not working",
      solutions: [
        "Allow microphone access in browser",
        "Check microphone (not muted)",
        "Use modern browser (Chrome/Edge recommended)",
        "Ensure quiet environment for better accuracy",
        "Re-allow microphone access in browser settings",
      ],
    },
    {
      title: "Style cloning not working well",
      solutions: [
        "Upload more posts (minimum 5-10)",
        "Select posts that are representative and have consistent style",
        "Ensure posts are long enough (minimum 3-4 sentences)",
        "Try generating without style cloning for comparison",
        "Be patient with analysis (it takes time)",
      ],
    },
    {
      title: "Cannot copy post to clipboard",
      solutions: [
        "Ensure browser allows clipboard",
        "Copy manually (Ctrl+C / Cmd+C)",
        "Try different browser (Chrome/Edge recommended)",
        "Use browser's native copy (right-click → Copy)",
      ],
    },
    {
      title: "Page loading very slow",
      solutions: [
        "Check internet connection (slow internet = slow loading)",
        "Clear browser cache and cookies",
        "Close other unnecessary tabs",
        "Restart browser to free up memory",
        "Use modern browser and update to latest version",
      ],
    },
  ];

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Troubleshooting"
        icon={AlertCircle}
        description="Solutions to common issues"
      />

      {issues.map((issue, index) => (
        <ContentBlock key={index} title={issue.title}>
          <ul className="space-y-1">
            {issue.solutions.map((solution, sIndex) => (
              <li key={sIndex} className="flex gap-2">
                <span className="mt-0.5 text-orange-400">•</span>
                <span>{solution}</span>
              </li>
            ))}
          </ul>
        </ContentBlock>
      ))}

      <ContentBlock title="Contact Support">
        <p className="mb-2">If issue persists after trying the solutions above:</p>
        <ul className="ml-4 list-disc space-y-1 text-xs">
          <li>Email: support@alterego.ai</li>
          <li>Screenshot error message</li>
          <li>Describe steps to reproduce</li>
        </ul>
      </ContentBlock>

      <OpikAIBadge />
    </div>
  );
}
