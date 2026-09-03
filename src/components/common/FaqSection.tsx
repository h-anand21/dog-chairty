import React, { useState, useMemo } from 'react';
import {
  HelpCircle,
  ChevronDown,
  Search,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Mail,
  ThumbsUp,
  ThumbsDown,
} from 'lucide-react';
import { useAudio } from '../../context/AudioContext';

interface FaqItem {
  id: string;
  category: 'adoption' | 'safety' | 'rehoming' | 'fees';
  categoryLabel: string;
  question: string;
  answer: string;
  highlights?: string[];
}

const FAQ_ITEMS: FaqItem[] = [
  {
    id: 'faq_1',
    category: 'fees',
    categoryLabel: '100% Free',
    question: 'Is adopting a dog on PawConnect completely free?',
    answer:
      'Yes, 100% free! There are zero adoption fees, zero brokerage charges, and zero platform commissions. Adoptions happen directly between loving pet parents and verified adopters.',
    highlights: ['Zero Platform Fees', 'Zero Brokerage', 'Direct Free Adoption'],
  },
  {
    id: 'faq_2',
    category: 'adoption',
    categoryLabel: 'How It Works',
    question: 'How does the adoption process work step-by-step?',
    answer:
      'The process is simple and transparent: (1) Find a dog and apply with your phone number; (2) Chat directly with the current guardian; (3) Meet the dog in person at a park or home; (4) Sign a free digital adoption agreement and welcome your new family member!',
    highlights: ['1. Apply Online', '2. Direct Chat', '3. Meet the Dog', '4. Free Handover Agreement'],
  },
  {
    id: 'faq_3',
    category: 'safety',
    categoryLabel: 'Trust & Safety',
    question: 'How do you verify dogs and prevent fake listings?',
    answer:
      'Every guardian must verify their phone number with OTP, and every dog listing includes real photos, health status, and vet vaccination records. Commercial puppy breeders are strictly banned.',
    highlights: ['Phone OTP Verified', 'Vet Health Records', 'No Commercial Breeders'],
  },
  {
    id: 'faq_4',
    category: 'rehoming',
    categoryLabel: 'List a Dog',
    question: 'Can I put my dog up for adoption if I can no longer care for them?',
    answer:
      'Yes. If life circumstances change, you can list your dog for free in under 2 minutes. You review every application, chat with potential adopters, and choose the most loving home for your dog.',
    highlights: ['Free Listing in 2 Mins', 'You Choose the Adopter', 'Verified Loving Homes'],
  }
];

export const FaqSection: React.FC = () => {
  const { playPawPop } = useAudio();

  const [activeCategory, setActiveCategory] = useState<'all' | 'adoption' | 'safety' | 'rehoming' | 'fees'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>('faq_1');
  const [feedback, setFeedback] = useState<Record<string, 'up' | 'down'>>({});

  const categories = [
    { key: 'all', label: 'All FAQs' },
    { key: 'fees', label: '💰 Free Adoption' },
    { key: 'adoption', label: '🐾 How It Works' },
    { key: 'safety', label: '🛡️ Safety & Verification' },
    { key: 'rehoming', label: '🏠 Rehoming Your Dog' },
  ];

  const filteredFaqs = useMemo(() => {
    return FAQ_ITEMS.filter(item => {
      const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
      const query = searchQuery.toLowerCase().trim();
      const matchesQuery =
        !query ||
        item.question.toLowerCase().includes(query) ||
        item.answer.toLowerCase().includes(query) ||
        (item.highlights && item.highlights.some(h => h.toLowerCase().includes(query)));
      return matchesCategory && matchesQuery;
    });
  }, [activeCategory, searchQuery]);

  const toggleAccordion = (id: string) => {
    playPawPop();
    setExpandedId(prev => (prev === id ? null : id));
  };

  const handleFeedback = (id: string, type: 'up' | 'down', e: React.MouseEvent) => {
    e.stopPropagation();
    playPawPop();
    setFeedback(prev => ({ ...prev, [id]: type }));
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-16 text-left">
      <div className="glass-card rounded-5xl p-6 sm:p-12 border border-obsidian-200/80 dark:border-white/10 shadow-elevated space-y-8">
        
        {/* Header Title & Subtitle */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-coral-50 dark:bg-coral-950/60 text-coral-700 dark:text-coral-300 font-black text-xs uppercase tracking-wider mb-2 border border-coral-200 dark:border-coral-800/60">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Everything You Need to Know</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black font-display text-obsidian-950 dark:text-white">
              Frequently Asked Questions (FAQ) 🐾
            </h2>
            <p className="text-xs sm:text-sm text-obsidian-600 dark:text-slate-300 mt-1 max-w-2xl">
              Clear answers on our verified 6-stage protocol, screening safety, zero fees, and dog rehoming.
            </p>
          </div>

          {/* Search Input Box */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-obsidian-400 dark:text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search questions (e.g. fee, contract)..."
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white dark:bg-[#121A2B] border border-obsidian-200 dark:border-white/10 text-xs font-bold text-obsidian-950 dark:text-white placeholder:text-obsidian-400 dark:placeholder:text-slate-500 outline-hidden focus:border-coral-500 shadow-xs"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 text-xs text-obsidian-400 hover:text-obsidian-600 dark:hover:text-white"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map(cat => (
            <button
              key={cat.key}
              type="button"
              onClick={() => {
                playPawPop();
                setActiveCategory(cat.key as any);
              }}
              className={`px-4 py-2 rounded-full text-xs font-bold shrink-0 transition-all cursor-pointer ${
                activeCategory === cat.key
                  ? 'bg-obsidian-900 text-white dark:bg-coral-500 dark:text-white shadow-md'
                  : 'bg-obsidian-100 hover:bg-obsidian-200 dark:bg-white/5 dark:hover:bg-white/10 text-obsidian-700 dark:text-slate-300 border border-obsidian-200/60 dark:border-white/10'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Accordion Questions List */}
        <div className="space-y-3">
          {filteredFaqs.length === 0 ? (
            <div className="p-10 text-center rounded-3xl bg-obsidian-50 dark:bg-white/5 border border-obsidian-200/60 dark:border-white/10 space-y-2 animate-in fade-in zoom-in-95 duration-200">
              <div className="text-3xl animate-bounce">🔍🐶</div>
              <h4 className="text-sm font-black text-obsidian-900 dark:text-white">
                No matching questions found
              </h4>
              <p className="text-xs text-obsidian-500 dark:text-slate-400">
                Try searching for &quot;protocol&quot;, &quot;free&quot;, &quot;meet&quot;, or &quot;vet&quot;, or reach out on our helpline below!
              </p>
            </div>
          ) : (
            filteredFaqs.map((item, index) => {
              const isExpanded = expandedId === item.id;
              const userFeedback = feedback[item.id];

              return (
                <div
                  key={item.id}
                  style={{ animationDelay: `${index * 40}ms` }}
                  className={`rounded-3xl border transition-all duration-300 overflow-hidden group animate-in fade-in slide-in-from-bottom-2 ${
                    isExpanded
                      ? 'bg-white dark:bg-[#121A2B] border-coral-400/90 dark:border-coral-500/70 shadow-lg shadow-coral-500/5 ring-2 ring-coral-500/10'
                      : 'bg-white/80 dark:bg-[#121A2B]/80 hover:bg-white dark:hover:bg-[#121A2B] border-obsidian-200/80 dark:border-white/10 hover:border-coral-300 dark:hover:border-white/20 hover:shadow-sm'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => toggleAccordion(item.id)}
                    className="w-full p-5 sm:p-6 flex items-center justify-between gap-4 text-left cursor-pointer transition-colors duration-200"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div
                        className={`w-9 h-9 rounded-2xl flex items-center justify-center shrink-0 transition-all duration-300 ${
                          isExpanded
                            ? 'bg-coral-500 text-white shadow-glow-coral scale-105'
                            : 'bg-obsidian-100 dark:bg-white/10 text-obsidian-600 dark:text-slate-300 group-hover:scale-105 group-hover:text-coral-500'
                        }`}
                      >
                        <HelpCircle className="w-4 h-4 transition-transform duration-300 group-hover:rotate-12" />
                      </div>
                      <div className="min-w-0">
                        <span className="text-[10px] font-black text-coral-600 dark:text-coral-400 uppercase tracking-wider block mb-0.5 transition-colors">
                          {item.categoryLabel}
                        </span>
                        <h3 className={`text-sm sm:text-base font-black transition-colors duration-200 leading-snug ${
                          isExpanded ? 'text-coral-600 dark:text-coral-400' : 'text-obsidian-950 dark:text-white group-hover:text-coral-500'
                        }`}>
                          {item.question}
                        </h3>
                      </div>
                    </div>

                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300 ease-out ${
                        isExpanded
                          ? 'rotate-180 bg-coral-100 dark:bg-coral-950/80 text-coral-600 scale-105'
                          : 'bg-obsidian-100 dark:bg-white/10 text-obsidian-500 group-hover:bg-coral-50 group-hover:text-coral-600'
                      }`}
                    >
                      <ChevronDown className="w-4 h-4 transition-transform duration-300" />
                    </div>
                  </button>

                  {/* Smooth Animated Accordion Drawer */}
                  <div
                    className={`grid transition-all duration-300 ease-in-out ${
                      isExpanded ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                    }`}
                  >
                    <div className="overflow-hidden">
                      <div className="px-5 sm:px-6 pb-6 pt-2 text-xs text-obsidian-700 dark:text-slate-300 leading-relaxed space-y-4 border-t border-obsidian-100 dark:border-white/5">
                        <p className="text-xs sm:text-sm font-normal leading-relaxed">
                          {item.answer}
                        </p>

                        {item.highlights && item.highlights.length > 0 && (
                          <div className="flex flex-wrap gap-2 pt-1">
                            {item.highlights.map((tag, idx) => (
                              <span
                                key={idx}
                                style={{ animationDelay: `${idx * 50}ms` }}
                                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 font-bold text-[11px] border border-emerald-200 dark:border-emerald-800/60 shadow-2xs hover:scale-105 transition-transform cursor-default"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                                <span>{tag}</span>
                              </span>
                            ))}
                          </div>
                        )}

                        <div className="pt-3 border-t border-obsidian-100 dark:border-white/5 flex items-center justify-between text-[11px] font-semibold text-obsidian-500 dark:text-slate-400">
                          <span>Was this explanation helpful?</span>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={e => handleFeedback(item.id, 'up', e)}
                              className={`px-2.5 py-1 rounded-lg transition-all duration-200 cursor-pointer flex items-center gap-1 hover:scale-105 active:scale-95 ${
                                userFeedback === 'up'
                                  ? 'bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 font-bold shadow-xs'
                                  : 'hover:bg-obsidian-100 dark:hover:bg-white/10'
                              }`}
                            >
                              <ThumbsUp className={`w-3.5 h-3.5 ${userFeedback === 'up' ? 'fill-emerald-600' : ''}`} />
                              <span>Yes</span>
                            </button>
                            <button
                              type="button"
                              onClick={e => handleFeedback(item.id, 'down', e)}
                              className={`px-2.5 py-1 rounded-lg transition-all duration-200 cursor-pointer flex items-center gap-1 hover:scale-105 active:scale-95 ${
                                userFeedback === 'down'
                                  ? 'bg-rose-100 dark:bg-rose-950/70 text-rose-700 dark:text-rose-300 font-bold shadow-xs'
                                  : 'hover:bg-obsidian-100 dark:hover:bg-white/10'
                              }`}
                            >
                              <ThumbsDown className={`w-3.5 h-3.5 ${userFeedback === 'down' ? 'fill-rose-600' : ''}`} />
                              <span>No</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Still Have Questions Banner */}
        <div className="p-6 rounded-4xl bg-gradient-to-r from-coral-500/10 via-amber-500/10 to-coral-500/10 dark:from-coral-500/15 dark:to-amber-500/15 border border-coral-200 dark:border-coral-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <div className="text-sm font-black text-obsidian-950 dark:text-white flex items-center justify-center sm:justify-start gap-2">
              <Sparkles className="w-4 h-4 text-coral-500" />
              <span>Still have a question or need personalized adoption counseling?</span>
            </div>
            <p className="text-xs text-obsidian-600 dark:text-slate-300">
              Our canine adoption team is always here to assist you via email.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <a
              href="mailto:work.himu2020@gmail.com?subject=PawConnect%20Adoption%20Question"
              className="bg-coral-500 hover:bg-coral-600 text-white px-5 py-2.5 rounded-full text-xs font-black flex items-center gap-2 shadow-xs hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              <Mail className="w-4 h-4" />
              <span>Email: work.himu2020@gmail.com</span>
            </a>
          </div>
        </div>

      </div>
    </section>
  );
};
