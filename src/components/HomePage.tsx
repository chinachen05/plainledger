import { useMemo, useState } from 'react';
import { ArrowRight, Calculator, Search } from 'lucide-react';
import {
  ALL_ARTICLES,
  ARTICLE_CATEGORIES,
  filterAndSortArticles,
  getLeadArticle,
  getSecondaryArticles,
} from '../data/articles';
import { ArticleCategory, CalculatorId } from '../data/articleTypes';
import heroLedgerImg from '../assets/images/editorial_hero_ledger_1794746342515.jpg';
import compoundingStillImg from '../assets/images/editorial_compounding_still_1794746343218.jpg';
import planningDeskImg from '../assets/images/editorial_planning_desk_1794746343890.jpg';

interface HomePageProps {
  onNavigate: (path: string) => void;
}

function EditorialFigure({
  src,
  alt,
  caption,
  aspectClass,
}: {
  src: string;
  alt: string;
  caption: string;
  aspectClass: string;
}) {
  const [failed, setFailed] = useState(false);

  return (
    <figure className="h-full flex flex-col">
      <div
        className={`relative overflow-hidden rounded-lg border border-[#E5DFD3] bg-[#F3EFE7] ${aspectClass}`}
      >
        {!failed ? (
          <img
            src={src}
            alt={alt}
            referrerPolicy="no-referrer"
            onError={() => setFailed(true)}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center p-6 text-center bg-gradient-to-br from-[#F3EFE7] to-[#E5DFD3]">
            <span className="font-editorial text-lg text-[#57534E]">{alt}</span>
          </div>
        )}
      </div>
      <figcaption className="mt-2 text-xs font-serif italic text-[#57534E]">
        {caption}
      </figcaption>
    </figure>
  );
}

const TOOL_CARDS: {
  id: CalculatorId;
  title: string;
  summary: string;
  metric: string;
}[] = [
  {
    id: 'compound',
    title: 'Compound Wealth & Inflation',
    summary: 'Project nominal growth, real purchasing power, and annual interest schedules.',
    metric: '1–50 Year Horizon',
  },
  {
    id: 'debt',
    title: 'Debt Payoff Planner',
    summary: 'Compare Avalanche vs. Snowball strategies across multiple balances and APRs.',
    metric: 'Interest & Months Saved',
  },
  {
    id: 'budget',
    title: '50/30/20 Budget & Runway',
    summary: 'Allocate net monthly pay and compute your emergency fund runway in months.',
    metric: 'Runway Target Tracker',
  },
  {
    id: 'mortgage',
    title: 'Mortgage Amortization',
    summary: 'Measure monthly P&I and how extra principal payments trim loan years.',
    metric: 'Annual Schedule',
  },
];

export function HomePage({ onNavigate }: HomePageProps) {
  const lead = getLeadArticle();
  const secondary = getSecondaryArticles();
  const secondaryImages = [compoundingStillImg, planningDeskImg];

  const [selectedCategory, setSelectedCategory] = useState<'All' | ArticleCategory>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'editorial' | 'quickest'>('editorial');

  const filteredArticles = useMemo(
    () => filterAndSortArticles(ALL_ARTICLES, selectedCategory, searchQuery, sortBy),
    [selectedCategory, searchQuery, sortBy]
  );

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { All: ALL_ARTICLES.length };
    for (const art of ALL_ARTICLES) {
      counts[art.category] = (counts[art.category] ?? 0) + 1;
    }
    return counts;
  }, []);

  const go = (e: React.MouseEvent, path: string) => {
    e.preventDefault();
    onNavigate(path);
  };

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-8 sm:pt-12">
      {/* Tier 1: Broadsheet Lead Feature */}
      <section aria-labelledby="lead-heading" className="pb-12 border-b border-[#E5DFD3]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-2 text-xs font-medium uppercase tracking-widest text-[#57534E]">
                <span>Lead Essay</span>
                <span aria-hidden="true">·</span>
                <span>{lead.category}</span>
                <span aria-hidden="true">·</span>
                <span className="tabular-nums">{lead.readMinutes} min read</span>
              </div>

              <h1
                id="lead-heading"
                className="font-editorial text-3xl sm:text-4xl lg:text-[2.65rem] font-semibold leading-[1.15] text-[#1C1917] [text-wrap:balance]"
              >
                {lead.title}
              </h1>

              <p className="text-base sm:text-lg text-[#292524] leading-relaxed max-w-xl">
                {lead.excerpt}
              </p>

              <p className="text-xs text-[#57534E]">
                By {lead.author}, {lead.authorRole} · Updated {lead.updatedAt}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <a
                href={`/articles/${lead.slug}`}
                onClick={(e) => go(e, `/articles/${lead.slug}`)}
                className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-[#14532D] hover:bg-[#166534] rounded-md transition-colors whitespace-nowrap"
              >
                <span>Read Full Guide</span>
                <ArrowRight className="w-4 h-4" />
              </a>
              <a
                href="/tools"
                onClick={(e) => go(e, '/tools')}
                className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-[#1C1917] border border-[#E5DFD3] bg-[#FFFFFF] hover:bg-[#F3EFE7] rounded-md transition-colors whitespace-nowrap"
              >
                <Calculator className="w-4 h-4 text-[#14532D]" />
                <span>Explore 4 Calculators</span>
              </a>
            </div>
          </div>

          <div className="lg:col-span-6">
            <EditorialFigure
              src={heroLedgerImg}
              alt="Open archival ledger book, fountain pen, and brass dividers on a stone desk"
              caption="Fig. 1 — PlainLedger pairs step-by-step mathematical guides with interactive household planning tools."
              aspectClass="aspect-[16/10] lg:h-full"
            />
          </div>
        </div>
      </section>

      {/* Tier 2: Secondary Featured Guides */}
      <section aria-label="Featured guides" className="py-12 border-b border-[#E5DFD3]">
        <div className="flex items-baseline justify-between gap-4 mb-8">
          <h2 className="font-editorial text-2xl sm:text-3xl font-semibold text-[#1C1917]">
            Featured Deep Dives
          </h2>
          <span className="text-xs font-medium uppercase tracking-widest text-[#57534E] whitespace-nowrap">
            26 Original Guides
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {secondary.map((article, idx) => (
            <article
              key={article.slug}
              className="bg-[#FFFFFF] border border-[#E5DFD3] rounded-lg p-6 flex flex-col justify-between gap-5"
            >
              <div className="space-y-4">
                <EditorialFigure
                  src={secondaryImages[idx % secondaryImages.length]}
                  alt={article.title}
                  caption={`Fig. ${idx + 2} — ${article.category} · ${article.readMinutes} min study`}
                  aspectClass="aspect-[4/3]"
                />
                <div className="flex items-center gap-2 text-xs text-[#57534E]">
                  <span>{article.category}</span>
                  <span aria-hidden="true">·</span>
                  <span className="tabular-nums">{article.readMinutes} min read</span>
                  <span aria-hidden="true">·</span>
                  <span>Updated {article.updatedAt}</span>
                </div>
                <h3 className="font-editorial text-xl sm:text-2xl font-semibold text-[#1C1917] leading-snug">
                  <a
                    href={`/articles/${article.slug}`}
                    onClick={(e) => go(e, `/articles/${article.slug}`)}
                    className="hover:text-[#14532D] transition-colors"
                  >
                    {article.title}
                  </a>
                </h3>
                <p className="text-sm text-[#57534E] leading-relaxed">{article.excerpt}</p>
              </div>

              <div className="pt-2 border-t border-[#E5DFD3] flex items-center justify-between text-sm">
                <span className="text-xs text-[#57534E]">By {article.author}</span>
                <a
                  href={`/articles/${article.slug}`}
                  onClick={(e) => go(e, `/articles/${article.slug}`)}
                  className="inline-flex items-center gap-1.5 font-semibold text-[#14532D] hover:text-[#166534]"
                >
                  <span>Read Essay</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Interactive Financial Calculators Strip */}
      <section aria-labelledby="tools-strip-heading" className="py-12 border-b border-[#E5DFD3]">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div className="space-y-1.5">
            <h2
              id="tools-strip-heading"
              className="font-editorial text-2xl sm:text-3xl font-semibold text-[#1C1917]"
            >
              Interactive Financial Calculators
            </h2>
            <p className="text-sm text-[#57534E] max-w-2xl">
              Test every concept with transparent client-side math. Zero sign-ups, zero tracking, instant year-by-year schedules.
            </p>
          </div>
          <a
            href="/tools"
            onClick={(e) => go(e, '/tools')}
            className="text-sm font-semibold text-[#14532D] hover:text-[#166534] inline-flex items-center gap-1.5 whitespace-nowrap shrink-0"
          >
            <span>Launch Full Suite</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {TOOL_CARDS.map((tool) => (
            <button
              key={tool.id}
              type="button"
              onClick={() => onNavigate(`/tools/${tool.id}`)}
              className="text-left bg-[#FFFFFF] border border-[#E5DFD3] hover:border-[#14532D] rounded-lg p-5 flex flex-col justify-between gap-4 transition-colors cursor-pointer"
            >
              <div className="space-y-2">
                <div className="text-xs font-mono text-[#57534E]">{tool.metric}</div>
                <h3 className="font-editorial text-lg font-semibold text-[#1C1917]">
                  {tool.title}
                </h3>
                <p className="text-xs text-[#57534E] leading-relaxed">{tool.summary}</p>
              </div>
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#14532D]">
                <span>Open Tool</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* Tier 3: Full 26-Article Library */}
      <section id="library" aria-labelledby="library-heading" className="pt-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
          <div className="space-y-1.5">
            <h2
              id="library-heading"
              className="font-editorial text-2xl sm:text-3xl font-semibold text-[#1C1917]"
            >
              Complete Knowledge Library
            </h2>
            <p className="text-sm text-[#57534E]">
              {ALL_ARTICLES.length} peer-reviewed personal finance guides with worked tables and formulas.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 text-[#57534E] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <label htmlFor="article-search" className="sr-only">
                Search articles
              </label>
              <input
                id="article-search"
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search topics, e.g. Roth, 401k, APR..."
                className="w-full sm:w-64 pl-9 pr-3 py-2 text-sm bg-[#FFFFFF] border border-[#E5DFD3] rounded-md text-[#1C1917] placeholder:text-[#78716C] focus:outline-none focus:border-[#14532D]"
              />
            </div>

            <label htmlFor="article-sort" className="sr-only">
              Sort articles
            </label>
            <select
              id="article-sort"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'editorial' | 'quickest')}
              className="px-3 py-2 text-sm bg-[#FFFFFF] border border-[#E5DFD3] rounded-md text-[#1C1917] focus:outline-none focus:border-[#14532D]"
            >
              <option value="editorial">Sort: Editorial Order</option>
              <option value="quickest">Sort: Quickest Read</option>
            </select>
          </div>
        </div>

        {/* Interactive Category Segmented Filter */}
        <div
          role="tablist"
          aria-label="Filter articles by category"
          className="flex flex-wrap items-center gap-1.5 p-1.5 bg-[#F3EFE7] rounded-lg mb-8 border border-[#E5DFD3]"
        >
          {ARTICLE_CATEGORIES.map((category) => {
            const active = selectedCategory === category;
            return (
              <button
                key={category}
                role="tab"
                aria-selected={active}
                type="button"
                onClick={() => setSelectedCategory(category)}
                className={`px-3.5 py-2 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 tabular-nums ${
                  active
                    ? 'bg-[#FFFFFF] text-[#1C1917] shadow-xs border border-[#E5DFD3]'
                    : 'text-[#57534E] hover:text-[#1C1917]'
                }`}
              >
                {category} ({categoryCounts[category] ?? 0})
              </button>
            );
          })}
        </div>

        {/* Article Index Grid */}
        {filteredArticles.length === 0 ? (
          <div className="bg-[#FFFFFF] border border-[#E5DFD3] rounded-lg p-10 text-center space-y-3">
            <p className="font-editorial text-lg text-[#1C1917]">
              No guides matched "{searchQuery}".
            </p>
            <p className="text-sm text-[#57534E]">
              Try clearing your search filter or browsing another financial pillar.
            </p>
            <button
              type="button"
              onClick={() => {
                setSelectedCategory('All');
                setSearchQuery('');
              }}
              className="px-4 py-2 text-xs font-semibold text-white bg-[#14532D] hover:bg-[#166534] rounded-md"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div
            data-testid="article-directory-list"
            className="grid grid-cols-1 md:grid-cols-2 gap-x-8 divide-y md:divide-y-0 border-t border-[#E5DFD3]"
          >
            {filteredArticles.map((article) => (
              <article
                key={article.slug}
                className="py-6 border-b border-[#E5DFD3] flex flex-col justify-between gap-3"
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs text-[#57534E]">
                    <span className="font-medium text-[#14532D]">{article.category}</span>
                    <span aria-hidden="true">·</span>
                    <span className="tabular-nums">{article.readMinutes} min read</span>
                    <span aria-hidden="true">·</span>
                    <span>{article.updatedAt}</span>
                  </div>

                  <h3 className="font-editorial text-lg sm:text-xl font-semibold text-[#1C1917] leading-snug">
                    <a
                      href={`/articles/${article.slug}`}
                      onClick={(e) => go(e, `/articles/${article.slug}`)}
                      className="hover:text-[#14532D] transition-colors"
                    >
                      {article.title}
                    </a>
                  </h3>

                  <p className="text-sm text-[#57534E] leading-relaxed">{article.excerpt}</p>
                </div>

                <div className="flex items-center justify-between pt-1 text-xs text-[#57534E]">
                  <span>By {article.author}</span>
                  <a
                    href={`/articles/${article.slug}`}
                    onClick={(e) => go(e, `/articles/${article.slug}`)}
                    className="font-semibold text-[#14532D] hover:text-[#166534] inline-flex items-center gap-1"
                  >
                    <span>Read Guide</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
