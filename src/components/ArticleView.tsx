import { useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight, Calculator, Check } from 'lucide-react';
import { Article } from '../data/articleTypes';
import { getRelatedArticles } from '../data/articles';

interface ArticleViewProps {
  article: Article;
  onNavigate: (path: string) => void;
}

export function ArticleView({ article, onNavigate }: ArticleViewProps) {
  const [scrollProgress, setScrollProgress] = useState(0);
  const related = getRelatedArticles(article, 3);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight <= 0) {
        setScrollProgress(0);
        return;
      }
      setScrollProgress(Math.min(100, Math.max(0, (scrollTop / docHeight) * 100)));
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [article.slug]);

  const go = (e: React.MouseEvent, path: string) => {
    e.preventDefault();
    onNavigate(path);
  };

  return (
    <>
      {/* Subtle reading progress indicator */}
      <div
        aria-hidden="true"
        className="fixed top-16 left-0 right-0 h-0.5 bg-transparent z-30 pointer-events-none"
      >
        <div
          className="h-full bg-[#14532D] transition-[width] duration-150"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-8 sm:pt-12">
        <div className="mb-8">
          <a
            href="/#library"
            onClick={(e) => go(e, '/#library')}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-[#57534E] hover:text-[#1C1917]"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to All 26 Guides</span>
          </a>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Main 70% Reading Column */}
          <article className="lg:col-span-8 max-w-prose">
            <header className="space-y-4 pb-8 border-b border-[#E5DFD3]">
              <div className="flex flex-wrap items-center gap-2 text-xs text-[#57534E]">
                <span className="font-semibold text-[#14532D] uppercase tracking-wider">
                  {article.category}
                </span>
                <span aria-hidden="true">·</span>
                <span className="tabular-nums">{article.readMinutes} min read</span>
                <span aria-hidden="true">·</span>
                <span>Published {article.publishedAt}</span>
                <span aria-hidden="true">·</span>
                <span>Updated {article.updatedAt}</span>
              </div>

              <h1 className="font-editorial text-3xl sm:text-4xl font-semibold text-[#1C1917] leading-[1.18] [text-wrap:balance]">
                {article.title}
              </h1>

              <p className="text-base sm:text-lg text-[#57534E] leading-relaxed">
                {article.excerpt}
              </p>

              <p className="text-xs text-[#57534E] pt-1">
                Written by <strong className="font-semibold text-[#1C1917]">{article.author}</strong>,{' '}
                {article.authorRole} · Fact-checked under PlainLedger Editorial Policy
              </p>
            </header>

            {/* Key Takeaways Box */}
            <section
              aria-label="Key takeaways"
              className="my-8 bg-[#F3EFE7] border border-[#E5DFD3] rounded-lg p-6 space-y-3"
            >
              <h2 className="font-editorial text-lg font-semibold text-[#1C1917]">
                Key Takeaways
              </h2>
              <ul className="space-y-2.5">
                {article.keyTakeaways.map((point, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-sm text-[#292524] leading-relaxed">
                    <Check className="w-4 h-4 text-[#14532D] shrink-0 mt-0.5" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* Body Prose Sections */}
            <div className="space-y-8">
              {article.sections.map((section, sIdx) => (
                <section key={section.heading} className="space-y-4">
                  <h2 className="font-editorial text-2xl font-semibold text-[#1C1917] pt-2">
                    {section.heading}
                  </h2>
                  {section.paragraphs.map((paragraph, pIdx) => {
                    const isLeadParagraph = sIdx === 0 && pIdx === 0;
                    return (
                      <p
                        key={pIdx}
                        className={`text-[16px] text-[#292524] leading-[1.78] ${
                          isLeadParagraph
                            ? 'first-letter:text-5xl first-letter:font-serif first-letter:font-semibold first-letter:float-left first-letter:mr-2 first-letter:mt-1.5 first-letter:leading-none first-letter:text-[#1C1917]'
                            : ''
                        }`}
                      >
                        {paragraph}
                      </p>
                    );
                  })}
                </section>
              ))}
            </div>

            {/* Worked Numerical Example Table */}
            <section
              aria-labelledby="worked-example-heading"
              className="my-10 bg-[#FFFFFF] border border-[#E5DFD3] rounded-lg p-6 space-y-4"
            >
              <div className="space-y-1">
                <span className="text-xs font-semibold uppercase tracking-widest text-[#14532D]">
                  Worked Example
                </span>
                <h2
                  id="worked-example-heading"
                  className="font-editorial text-xl font-semibold text-[#1C1917]"
                >
                  {article.workedExample.title}
                </h2>
                <p className="text-sm text-[#57534E]">{article.workedExample.summary}</p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-[#E5DFD3] text-xs font-semibold uppercase tracking-wider text-[#57534E]">
                      {article.workedExample.headers.map((header) => (
                        <th key={header} className="py-2.5 pr-4 whitespace-nowrap">
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E5DFD3]">
                    {article.workedExample.rows.map((row, rIdx) => (
                      <tr key={rIdx} className="text-[#1C1917]">
                        {row.map((cell, cIdx) => (
                          <td
                            key={cIdx}
                            className={`py-3 pr-4 align-top ${
                              cIdx > 0 ? 'font-mono text-xs sm:text-sm tabular-nums' : 'font-medium'
                            }`}
                          >
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Educational Disclosure */}
            <footer className="mt-10 pt-6 border-t border-[#E5DFD3] text-xs text-[#57534E] leading-relaxed space-y-2">
              <p>
                <strong>Educational Notice:</strong> Figures above illustrate mathematical principles using standardized assumptions. Individual tax brackets, lender terms, and market returns vary. PlainLedger publishes independent educational guides and does not provide individualized investment or tax advice.
              </p>
              <p>
                Spot an outdated figure or calculation detail? Email our desk at{' '}
                <a
                  href="mailto:chinachen05@gmail.com"
                  className="text-[#14532D] underline underline-offset-2"
                >
                  chinachen05@gmail.com
                </a>
                .
              </p>
            </footer>
          </article>

          {/* Right 30% Margin Rail: Companion Calculator + Related Guides */}
          <aside className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
            <div className="bg-[#FFFFFF] border border-[#E5DFD3] rounded-lg p-6 space-y-4">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#14532D]">
                <Calculator className="w-4 h-4" />
                <span>Interactive Companion</span>
              </div>
              <h2 className="font-editorial text-xl font-semibold text-[#1C1917]">
                Run Your Own Numbers
              </h2>
              <p className="text-sm text-[#57534E] leading-relaxed">
                {article.relatedToolLabel}. Apply the numbers from this guide directly to your own timeline.
              </p>
              <a
                href={`/tools/${article.relatedToolId}`}
                onClick={(e) => go(e, `/tools/${article.relatedToolId}`)}
                className="inline-flex w-full items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-[#14532D] hover:bg-[#166534] rounded-md transition-colors whitespace-nowrap shrink-0"
              >
                <span>Open Calculator</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>

            <div className="bg-[#F3EFE7] border border-[#E5DFD3] rounded-lg p-6 space-y-4">
              <h2 className="font-editorial text-lg font-semibold text-[#1C1917]">
                Related Guides
              </h2>
              <div className="divide-y divide-[#E5DFD3]">
                {related.map((item) => (
                  <div key={item.slug} className="py-3 first:pt-0 last:pb-0 space-y-1">
                    <div className="text-xs text-[#57534E]">
                      {item.category} · {item.readMinutes} min read
                    </div>
                    <a
                      href={`/articles/${item.slug}`}
                      onClick={(e) => go(e, `/articles/${item.slug}`)}
                      className="block font-editorial text-base font-medium text-[#1C1917] hover:text-[#14532D] leading-snug"
                    >
                      {item.title}
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </main>
    </>
  );
}
