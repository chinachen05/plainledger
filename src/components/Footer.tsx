interface FooterProps {
  onNavigate: (path: string) => void;
}

export function Footer({ onNavigate }: FooterProps) {
  const go = (e: React.MouseEvent, path: string) => {
    e.preventDefault();
    onNavigate(path);
  };

  return (
    <footer className="border-t border-[#E5DFD3] bg-[#F3EFE7] mt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-10 border-b border-[#E5DFD3]">
          <div className="md:col-span-5 space-y-3">
            <a
              href="/"
              onClick={(e) => go(e, '/')}
              className="font-editorial text-xl font-bold text-[#1C1917] inline-block"
            >
              PlainLedger
            </a>
            <p className="text-sm text-[#57534E] leading-relaxed max-w-md">
              Independent personal finance guides and interactive calculators built around clear arithmetic, transparent assumptions, and everyday household utility.
            </p>
            <p className="text-sm text-[#57534E]">
              Editorial &amp; Corrections:{' '}
              <a
                href="mailto:chinachen05@gmail.com"
                className="text-[#14532D] underline underline-offset-4 hover:text-[#166534]"
              >
                chinachen05@gmail.com
              </a>
            </p>
          </div>

          <div className="md:col-span-3 space-y-2.5">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-[#57534E] font-sans">
              Library &amp; Tools
            </h3>
            <ul className="space-y-2 text-sm text-[#292524]">
              <li>
                <a href="/#library" onClick={(e) => go(e, '/#library')} className="hover:text-[#14532D]">
                  All 26 Finance Guides
                </a>
              </li>
              <li>
                <a href="/tools/compound" onClick={(e) => go(e, '/tools/compound')} className="hover:text-[#14532D]">
                  Compound Wealth Calculator
                </a>
              </li>
              <li>
                <a href="/tools/debt" onClick={(e) => go(e, '/tools/debt')} className="hover:text-[#14532D]">
                  Debt Payoff Planner
                </a>
              </li>
              <li>
                <a href="/tools/budget" onClick={(e) => go(e, '/tools/budget')} className="hover:text-[#14532D]">
                  50/30/20 Budget Allocator
                </a>
              </li>
              <li>
                <a href="/tools/mortgage" onClick={(e) => go(e, '/tools/mortgage')} className="hover:text-[#14532D]">
                  Mortgage Amortization Tool
                </a>
              </li>
            </ul>
          </div>

          <div className="md:col-span-4 space-y-2.5">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-[#57534E] font-sans">
              Publication &amp; Disclosures
            </h3>
            <ul className="space-y-2 text-sm text-[#292524]">
              <li>
                <a href="/about" onClick={(e) => go(e, '/about')} className="hover:text-[#14532D]">
                  About PlainLedger
                </a>
              </li>
              <li>
                <a
                  href="/editorial-policy"
                  onClick={(e) => go(e, '/editorial-policy')}
                  className="hover:text-[#14532D]"
                >
                  Editorial &amp; Fact-Check Policy
                </a>
              </li>
              <li>
                <a
                  href="/privacy-policy"
                  onClick={(e) => go(e, '/privacy-policy')}
                  className="hover:text-[#14532D]"
                >
                  Privacy &amp; Cookie Policy
                </a>
              </li>
              <li>
                <a href="/terms" onClick={(e) => go(e, '/terms')} className="hover:text-[#14532D]">
                  Terms of Service &amp; Disclaimer
                </a>
              </li>
              <li>
                <a href="/contact" onClick={(e) => go(e, '/contact')} className="hover:text-[#14532D]">
                  Contact Us
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-[#57534E]">
          <p>
            © {new Date().getFullYear()} PlainLedger. Educational content only — not personalized financial, tax, or legal advice.
          </p>
          <p className="whitespace-nowrap">
            Independent Reader Publication · No Sponsored Rankings
          </p>
        </div>
      </div>
    </footer>
  );
}
