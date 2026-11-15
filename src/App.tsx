import { useCallback, useEffect, useState } from 'react';
import { getArticleBySlug } from './data/articles';
import { CalculatorId } from './data/articleTypes';
import { Navbar } from './components/Navbar';
import { HomePage } from './components/HomePage';
import { ArticleView } from './components/ArticleView';
import { CalculatorsHub } from './components/CalculatorsHub';
import {
  AboutPage,
  ContactPage,
  EditorialPolicyPage,
  PrivacyPolicyPage,
  TermsPage,
} from './components/TrustPages';
import { Footer } from './components/Footer';
import { CookieBanner } from './components/CookieBanner';

function updateSeoHead(title: string, description: string, pathname: string) {
  document.title = title;
  const descMeta = document.querySelector('meta[name="description"]');
  if (descMeta) descMeta.setAttribute('content', description);

  const ogTitle = document.querySelector('meta[property="og:title"]');
  if (ogTitle) ogTitle.setAttribute('content', title);

  const ogDesc = document.querySelector('meta[property="og:description"]');
  if (ogDesc) ogDesc.setAttribute('content', description);

  let canonical = document.querySelector('link[rel="canonical"]');
  if (!canonical) {
    canonical = document.createElement('link');
    canonical.setAttribute('rel', 'canonical');
    document.head.appendChild(canonical);
  }
  canonical.setAttribute('href', `${window.location.origin}${pathname}`);
}

export default function App() {
  const [path, setPath] = useState<string>(() => window.location.pathname || '/');

  const navigate = useCallback((target: string) => {
    const [rawPath, hash] = target.split('#');
    const cleanPath = rawPath || '/';

    if (cleanPath !== window.location.pathname) {
      window.history.pushState({}, '', target);
      setPath(cleanPath);
    }

    if (hash) {
      requestAnimationFrame(() => {
        const el = document.getElementById(hash);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      });
    } else {
      window.scrollTo({ top: 0, behavior: 'auto' });
    }
  }, []);

  useEffect(() => {
    const onPopState = () => {
      setPath(window.location.pathname || '/');
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  // Determine active route
  const normalizedPath = path.length > 1 && path.endsWith('/') ? path.slice(0, -1) : path;
  const articleMatch = normalizedPath.startsWith('/articles/')
    ? getArticleBySlug(normalizedPath.replace('/articles/', ''))
    : undefined;
  const isTools = normalizedPath === '/tools' || normalizedPath.startsWith('/tools/');
  const toolSlug = normalizedPath.startsWith('/tools/')
    ? (normalizedPath.replace('/tools/', '') as CalculatorId)
    : 'compound';
  const validToolId: CalculatorId = ['compound', 'debt', 'budget', 'mortgage'].includes(toolSlug)
    ? toolSlug
    : 'compound';

  useEffect(() => {
    if (articleMatch) {
      updateSeoHead(
        `${articleMatch.title} – PlainLedger`,
        articleMatch.excerpt,
        normalizedPath
      );
      return;
    }
    if (isTools) {
      updateSeoHead(
        'Interactive Financial Calculators – PlainLedger',
        'Compound interest, debt avalanche/snowball payoff, 50/30/20 budget runway, and mortgage amortization calculators.',
        normalizedPath
      );
      return;
    }
    if (normalizedPath === '/about') {
      updateSeoHead('About PlainLedger – Editorial Mission & Team', 'Learn about PlainLedger, our analysts, and our math-first personal finance mission.', '/about');
      return;
    }
    if (normalizedPath === '/editorial-policy') {
      updateSeoHead('Editorial & Fact-Check Policy – PlainLedger', 'How PlainLedger verifies financial calculations, maintains editorial independence, and updates guides.', '/editorial-policy');
      return;
    }
    if (normalizedPath === '/privacy-policy') {
      updateSeoHead('Privacy & Cookie Policy – PlainLedger', 'PlainLedger privacy practices, browser-local calculators, and Google AdSense advertising cookie disclosures.', '/privacy-policy');
      return;
    }
    if (normalizedPath === '/terms') {
      updateSeoHead('Terms of Service & Disclaimer – PlainLedger', 'Educational scope, limitation of liability, and terms of use for PlainLedger guides and calculators.', '/terms');
      return;
    }
    if (normalizedPath === '/contact') {
      updateSeoHead('Contact Us – PlainLedger', 'Contact the PlainLedger editorial desk at chinachen05@gmail.com for questions or corrections.', '/contact');
      return;
    }
    updateSeoHead(
      'PlainLedger – Independent Personal Finance Guides & Calculators',
      'Explore 26 evidence-based personal finance guides and interactive calculators covering budgeting, compound wealth, debt payoff, index investing, and tax literacy.',
      '/'
    );
  }, [normalizedPath, articleMatch, isTools]);

  let content: React.ReactNode;

  if (normalizedPath === '/' || normalizedPath === '') {
    content = <HomePage onNavigate={navigate} />;
  } else if (articleMatch) {
    content = <ArticleView article={articleMatch} onNavigate={navigate} />;
  } else if (isTools) {
    content = <CalculatorsHub initialTool={validToolId} onNavigate={navigate} />;
  } else if (normalizedPath === '/about') {
    content = <AboutPage onNavigate={navigate} />;
  } else if (normalizedPath === '/editorial-policy') {
    content = <EditorialPolicyPage onNavigate={navigate} />;
  } else if (normalizedPath === '/privacy-policy') {
    content = <PrivacyPolicyPage />;
  } else if (normalizedPath === '/terms') {
    content = <TermsPage />;
  } else if (normalizedPath === '/contact') {
    content = <ContactPage />;
  } else {
    content = (
      <main className="max-w-3xl mx-auto px-4 sm:px-6 pt-16 text-center space-y-4">
        <div className="text-xs font-semibold uppercase tracking-widest text-[#14532D]">
          Page Not Found
        </div>
        <h1 className="font-editorial text-3xl font-semibold text-[#1C1917]">
          We could not find that page.
        </h1>
        <p className="text-sm text-[#57534E]">
          Browse our 26 personal finance guides or launch one of our interactive calculators below.
        </p>
        <div className="pt-2 flex justify-center gap-3">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="px-4 py-2 text-sm font-semibold text-white bg-[#14532D] hover:bg-[#166534] rounded-md"
          >
            Return Home
          </button>
          <button
            type="button"
            onClick={() => navigate('/tools')}
            className="px-4 py-2 text-sm font-medium text-[#1C1917] border border-[#E5DFD3] bg-[#FFFFFF] rounded-md"
          >
            Open Calculators
          </button>
        </div>
      </main>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FBF9F5] text-[#1C1917]">
      <Navbar currentPath={normalizedPath} onNavigate={navigate} />
      <div className="flex-1">{content}</div>
      <Footer onNavigate={navigate} />
      <CookieBanner onNavigate={navigate} />
    </div>
  );
}
