import React, { useState, useMemo } from 'react';
import {
  HelpCircle,
  ChevronDown,
  Search,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Phone,
  MessageCircle,
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
    category: 'adoption',
    categoryLabel: 'Adoption Process',
    question: 'How does PawConnect’s 6-Stage Adoption Protocol work?',
    answer:
      'Our 6-stage protocol guarantees a transparent and humane adoption journey: (1) You submit a comprehensive home & pet experience application; (2) You chat directly with the verified guardian; (3) You conduct an in-person or video Meet & Greet; (4) Both parties sign the legal digital Adoption Agreement; (5) Dual-confirmation handover with OTP and vet record transfer; (6) Lifetime Gold Adoption Certificate issued!',
    highlights: ['1. Online Application', '2. Direct Chat', '3. Meet & Greet', '4. Digital Contract', '5. Verified Handover', '6. Gold Certificate'],
  },
  {
    id: 'faq_2',
    category: 'fees',
    categoryLabel: 'Fees & Costs',
    question: 'Is adopting a dog on PawConnect 100% free?',
    answer:
      'Yes! Direct adoptions on PawConnect are 100% free with zero platform commissions or hidden brokerage fees. PawConnect is built to rescue, rehome, and support canines, not for commercial profit. Some verified rescue shelters may specify nominal vaccination reimbursements if documented with hospital bills.',
    highlights: ['Zero Platform Fee', 'Zero Brokerage', '100% Non-Profit Initiative'],
  },
  {
    id: 'faq_3',
    category: 'safety',
    categoryLabel: 'Verification & Safety',
    question: 'How do you verify guardians and prevent fake listings or puppy mills?',
    answer:
      'We enforce strict multi-tier verification: Every guardian authenticates via phone OTP, GPS location coordinates, and government ID/vet clinic proof. Commercial puppy breeders and unlicensed sales are strictly forbidden and instantly removed through automated scam detection and community reporting.',
    highlights: ['Phone OTP Verification', 'Veterinary Clearance Checks', 'Strict Anti-Breeder Ban'],
  },
  {
    id: 'faq_4',
    category: 'rehoming',
    categoryLabel: 'Listing & Rehoming',
    question: 'Can I list my own dog if life circumstances change and I can’t care for them?',
    answer:
      'Yes. Life circumstances (relocation, health, family emergencies) can be tough. You can list your dog safely on PawConnect by clicking "Post Your Dog for Adoption (Free)". You retain complete control over who interviews, visits, and adopts your dog, ensuring they transition to a loving forever home.',
    highlights: ['100% Free Listing', 'Guardian Retains Full Control', 'Screened Loving Adopters'],
  },
  {
    id: 'faq_5',
    category: 'adoption',
    categoryLabel: 'Adoption Process',
    question: 'What happens during the Meet & Greet stage?',
    answer:
      'The Meet & Greet allows the prospective adopter and dog to interact in a neutral, relaxed environment (such as a local dog park or vet clinic). It ensures the dog’s temperament aligns with your household, children, or existing pets before any legal commitments are made.',
    highlights: ['Neutral Park Location', 'Temperament Evaluation', 'Zero Pressure Handover'],
  },
  {
    id: 'faq_6',
    category: 'safety',
    categoryLabel: 'Verification & Safety',
    question: 'What health and veterinary records are provided with the dog?',
    answer:
      'Every listing highlights vaccination status (Rabies, DHPPiL), neuter/spay confirmation, deworming dates, and microchip number. During handover, the physical vet vaccination passbook is handed over to the adopter along with digital copies archived on PawConnect.',
    highlights: ['Physical Vet Passbook', 'Vaccination History', 'Digital Medical Archive'],
  },
  {
    id: 'faq_7',
    category: 'rehoming',
    categoryLabel: 'Listing & Rehoming',
    question: 'How long does the verified adoption process typically take?',
    answer:
      'Most adoptions complete within 3 to 7 days. This includes application review (24 hours), in-person meet & greet (1-2 days), and digital contract signing upon mutual agreement.',
    highlights: ['Average 3-7 Days', '24h Application Response', 'Smooth Dual Handover'],
  },
  {
    id: 'faq_8',
    category: 'fees',
    categoryLabel: 'Fees & Costs',
    question: 'Do I get post-adoption support or medical advice?',
    answer:
      'Absolutely! Our volunteer community and adoption counselors remain available via WhatsApp and helpline. You also gain lifetime access to your dog’s digital profile, vaccination reminders, and community feed to share milestones.',
    highlights: ['WhatsApp Counselor Support', 'Vaccination Reminders', 'Community Social Feed'],
  }
];

export const FaqSection: React.FC = () => {
  const { playPawPop } = useAudio();

  const [activeCategory, setActiveCategory] = useState<'all' | 'adoption' | 'safety' | 'rehoming' | 'fees'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>('faq_1');
  const [feedback, setFeedback] = useState<Record<string, 'up' | 'down'>>({});

  const categories = [
    { key: 'all', label: 'All Questions' },
    { key: 'adoption', label: 'Adoption Protocol' },
    { key: 'safety', label: 'Trust & Safety' },
    { key: 'rehoming', label: 'Listing & Rehoming' },
    { key: 'fees', label: 'Fees & Transparency' },
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
            <div className="p-10 text-center rounded-3xl bg-obsidian-50 dark:bg-white/5 border border-obsidian-200/60 dark:border-white/10 space-y-2">
              <div className="text-3xl">🔍🐶</div>
              <h4 className="text-sm font-black text-obsidian-900 dark:text-white">
                No matching questions found
              </h4>
              <p className="text-xs text-obsidian-500 dark:text-slate-400">
                Try searching for &quot;protocol&quot;, &quot;free&quot;, &quot;meet&quot;, or &quot;vet&quot;, or reach out on our helpline below!
              </p>
            </div>
          ) : (
            filteredFaqs.map(item => {
              const isExpanded = expandedId === item.id;
              const userFeedback = feedback[item.id];

              return (
                <div
                  key={item.id}
                  className={`rounded-3xl border transition-all overflow-hidden ${
                    isExpanded
                      ? 'bg-white dark:bg-[#121A2B] border-coral-400/80 dark:border-coral-500/60 shadow-md'
                      : 'bg-white/70 dark:bg-[#121A2B]/70 hover:bg-white dark:hover:bg-[#121A2B] border-obsidian-200/80 dark:border-white/10'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => toggleAccordion(item.id)}
                    className="w-full p-5 sm:p-6 flex items-center justify-between gap-4 text-left cursor-pointer"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                          isExpanded
                            ? 'bg-coral-500 text-white'
                            : 'bg-obsidian-100 dark:bg-white/10 text-obsidian-600 dark:text-slate-300'
                        }`}
                      >
                        <HelpCircle className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <span className="text-[10px] font-black text-coral-600 dark:text-coral-400 uppercase tracking-wider block mb-0.5">
                          {item.categoryLabel}
                        </span>
                        <h3 className="text-sm sm:text-base font-black text-obsidian-950 dark:text-white leading-snug">
                          {item.question}
                        </h3>
                      </div>
                    </div>

                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center bg-obsidian-100 dark:bg-white/10 shrink-0 transition-transform duration-300 ${
                        isExpanded ? 'rotate-180 bg-coral-100 dark:bg-coral-950/60 text-coral-600' : 'text-obsidian-500'
                      }`}
                    >
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="px-5 sm:px-6 pb-6 pt-1 text-xs text-obsidian-700 dark:text-slate-300 leading-relaxed space-y-4 border-t border-obsidian-100 dark:border-white/5 animate-in fade-in duration-200">
                      <p className="text-xs sm:text-sm font-normal">
                        {item.answer}
                      </p>

                      {item.highlights && item.highlights.length > 0 && (
                        <div className="flex flex-wrap gap-2 pt-1">
                          {item.highlights.map((tag, idx) => (
                            <span
                              key={idx}
                              className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 font-bold text-[11px] border border-emerald-200/80 dark:border-emerald-800/50"
                            >
                              <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                              <span>{tag}</span>
                            </span>
                          ))}
                        </div>
                      )}

                      <div className="pt-3 border-t border-obsidian-100 dark:border-white/5 flex items-center justify-between text-[11px] font-semibold text-obsidian-500 dark:text-slate-400">
                        <span>Was this helpful?</span>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={e => handleFeedback(item.id, 'up', e)}
                            className={`p-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1 ${
                              userFeedback === 'up'
                                ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700'
                                : 'hover:bg-obsidian-100 dark:hover:bg-white/10'
                            }`}
                          >
                            <ThumbsUp className="w-3.5 h-3.5" />
                            <span>Yes</span>
                          </button>
                          <button
                            type="button"
                            onClick={e => handleFeedback(item.id, 'down', e)}
                            className={`p-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1 ${
                              userFeedback === 'down'
                                ? 'bg-rose-100 dark:bg-rose-950/60 text-rose-700'
                                : 'hover:bg-obsidian-100 dark:hover:bg-white/10'
                            }`}
                          >
                            <ThumbsDown className="w-3.5 h-3.5" />
                            <span>No</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
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
              Our verified canine adoption counselors are available 7 days a week (9 AM - 9 PM IST).
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <a
              href="https://wa.me/918252990057?text=Hi%20PawConnect,%20I%20have%20a%20question%20about%20dog%20adoption"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-full text-xs font-black flex items-center gap-1.5 shadow-xs hover:scale-105 transition-all cursor-pointer"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>WhatsApp Us</span>
            </a>

            <a
              href="tel:+918252990057"
              className="bg-white dark:bg-white/10 hover:bg-obsidian-100 text-obsidian-900 dark:text-white border border-obsidian-200 dark:border-white/15 px-4 py-2 rounded-full text-xs font-black flex items-center gap-1.5 shadow-xs hover:scale-105 transition-all cursor-pointer"
            >
              <Phone className="w-3.5 h-3.5 text-coral-500" />
              <span>Call Helpline</span>
            </a>
          </div>
        </div>

      </div>
    </section>
  );
};
