import { useState } from 'react';
import { CheckCircle2, Mail } from 'lucide-react';

interface PageProps {
  onNavigate: (path: string) => void;
}

function TrustLayout({
  kicker,
  title,
  updated,
  children,
}: {
  kicker: string;
  title: string;
  updated?: string;
  children: React.ReactNode;
}) {
  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 pt-10 sm:pt-14">
      <header className="space-y-3 pb-8 border-b border-[#E5DFD3]">
        <div className="text-xs font-semibold uppercase tracking-widest text-[#14532D]">
          {kicker}
        </div>
        <h1 className="font-editorial text-3xl sm:text-4xl font-semibold text-[#1C1917] [text-wrap:balance]">
          {title}
        </h1>
        {updated && <p className="text-xs text-[#57534E]">Effective / Last Reviewed: {updated}</p>}
      </header>
      <div className="pt-8 space-y-6 text-[16px] text-[#292524] leading-[1.78]">
        {children}
      </div>
    </main>
  );
}

export function AboutPage({ onNavigate }: PageProps) {
  return (
    <TrustLayout kicker="About PlainLedger" title="Independent Financial Literacy Built on Transparent Math" updated="November 2026">
      <p>
        PlainLedger is an English-language personal finance publication dedicated to explaining household economics, debt arithmetic, tax-advantaged accounts, and long-term index investing in plain language—without hype, sponsored rankings, or pay-to-play product placement.
      </p>
      <h2 className="font-editorial text-2xl font-semibold text-[#1C1917] pt-2">
        Why We Exist
      </h2>
      <p>
        Most online finance websites bury basic formulas under affiliate comparison tables and sensational market predictions. PlainLedger takes the opposite approach: every guide begins with the underlying equation, illustrates it through a concrete worked dollar table, and pairs with an open browser-based calculator so readers can test their own numbers immediately.
      </p>
      <h2 className="font-editorial text-2xl font-semibold text-[#1C1917] pt-2">
        Editorial Contributors
      </h2>
      <ul className="space-y-3 bg-[#FFFFFF] border border-[#E5DFD3] rounded-lg p-6 text-sm">
        <li>
          <strong>Clara Bennett</strong> — Financial Analyst covering compound growth, fee drag, asset allocation, and mortgage amortization.
        </li>
        <li>
          <strong>David Chen</strong> — Household Economics Editor covering zero-based budgeting, debt payoff strategy, and automated cash flow.
        </li>
        <li>
          <strong>Hannah Sato</strong> — Tax &amp; Cash-Flow Researcher covering Treasury yields, marginal tax brackets, Roth/Traditional arbitrage, and HSAs.
        </li>
      </ul>
      <p>
        Have a question, correction, or topic suggestion? Reach our editorial team directly at{' '}
        <a href="mailto:chinachen05@gmail.com" className="text-[#14532D] underline underline-offset-4">
          chinachen05@gmail.com
        </a>{' '}
        or visit our{' '}
        <a
          href="/contact"
          onClick={(e) => {
            e.preventDefault();
            onNavigate('/contact');
          }}
          className="text-[#14532D] underline underline-offset-4"
        >
          Contact page
        </a>
        .
      </p>
    </TrustLayout>
  );
}

export function EditorialPolicyPage({ onNavigate }: PageProps) {
  return (
    <TrustLayout kicker="Editorial Standards" title="Editorial Independence & Fact-Checking Policy" updated="November 2026">
      <p>
        PlainLedger is committed to accurate, unbiased personal finance education. Every article and interactive calculator follows strict verification guidelines before publication.
      </p>
      <h2 className="font-editorial text-2xl font-semibold text-[#1C1917] pt-2">
        1. Zero Sponsored Editorial Placements
      </h2>
      <p>
        PlainLedger does not accept payment from banks, brokerages, credit card issuers, or insurers to publish favorable reviews or alter mathematical explanations. Display advertising via Google AdSense is kept strictly separate from editorial topics and worked examples.
      </p>
      <h2 className="font-editorial text-2xl font-semibold text-[#1C1917] pt-2">
        2. Mathematical Verification
      </h2>
      <p>
        All worked numerical examples, compounding projections, amortization tables, and debt payoff scenarios are audited using deterministic formulas and automated calculation tests. Assumptions (such as inflation rate, marginal tax bracket, or fee ratio) are explicitly stated beside every table.
      </p>
      <h2 className="font-editorial text-2xl font-semibold text-[#1C1917] pt-2">
        3. Corrections &amp; Updates
      </h2>
      <p>
        Tax rules, contribution limits, and interest rate environments evolve annually. Each guide displays its latest review date. If you identify an error or ambiguous step, please notify us at{' '}
        <a href="mailto:chinachen05@gmail.com" className="text-[#14532D] underline underline-offset-4">
          chinachen05@gmail.com
        </a>{' '}
        or via our{' '}
        <a
          href="/contact"
          onClick={(e) => {
            e.preventDefault();
            onNavigate('/contact');
          }}
          className="text-[#14532D] underline underline-offset-4"
        >
          Contact form
        </a>
        , and we will verify and update the guide promptly.
      </p>
    </TrustLayout>
  );
}

export function PrivacyPolicyPage() {
  return (
    <TrustLayout kicker="Legal & Privacy" title="Privacy Policy & Advertising Disclosures" updated="November 15, 2026">
      <p>
        At PlainLedger, accessible from our Vercel-hosted domain, visitor privacy is treated with clarity and restraint. This Privacy Policy outlines what limited information is processed when you read guides or use our calculators.
      </p>

      <h2 className="font-editorial text-2xl font-semibold text-[#1C1917] pt-2">
        1. Calculator Inputs Stay in Your Browser
      </h2>
      <p>
        All figures entered into PlainLedger’s interactive financial calculators (income, balances, interest rates, or mortgage assumptions) are computed locally inside your browser. We do not collect, store, or transmit your financial inputs to external databases.
      </p>

      <h2 className="font-editorial text-2xl font-semibold text-[#1C1917] pt-2">
        2. Google AdSense &amp; Third-Party Advertising Cookies
      </h2>
      <p>
        PlainLedger partners with Google AdSense (Publisher ID: <code className="font-mono text-sm">ca-pub-2936167858814999</code>) to display advertising that funds free editorial content.
      </p>
      <ul className="list-disc pl-6 space-y-2">
        <li>
          Third-party vendors, including Google, use cookies to serve ads based on a user’s prior visits to this website or other websites on the internet.
        </li>
        <li>
          Google’s use of advertising cookies enables it and its partners to serve ads to visitors based on their visit to PlainLedger and/or other sites on the Internet.
        </li>
        <li>
          Users may opt out of personalized advertising at any time by visiting{' '}
          <a
            href="https://www.google.com/settings/ads"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#14532D] underline underline-offset-4"
          >
            Google Ads Settings
          </a>{' '}
          or by visiting{' '}
          <a
            href="https://www.aboutads.info/choices/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#14532D] underline underline-offset-4"
          >
            aboutads.info
          </a>
          .
        </li>
      </ul>

      <h2 className="font-editorial text-2xl font-semibold text-[#1C1917] pt-2">
        3. Local Storage &amp; Essential Cookies
      </h2>
      <p>
        PlainLedger stores your cookie banner acknowledgment locally in browser storage (<code className="font-mono text-sm">localStorage</code>) so you are not repeatedly prompted on every page visit. You can clear cookies and local storage at any time via your browser settings.
      </p>

      <h2 className="font-editorial text-2xl font-semibold text-[#1C1917] pt-2">
        4. Email Correspondence &amp; GDPR / CCPA Rights
      </h2>
      <p>
        If you email us at{' '}
        <a href="mailto:chinachen05@gmail.com" className="text-[#14532D] underline underline-offset-4">
          chinachen05@gmail.com
        </a>{' '}
        or submit an inquiry, your email address and message are used solely to respond to your request and are never sold or shared with marketing lists. Under applicable privacy laws (including GDPR and CCPA), you may request access to or deletion of any direct correspondence by emailing{' '}
        <a href="mailto:chinachen05@gmail.com" className="text-[#14532D] underline underline-offset-4">
          chinachen05@gmail.com
        </a>
        .
      </p>
    </TrustLayout>
  );
}

export function TermsPage() {
  return (
    <TrustLayout kicker="Terms & Disclaimer" title="Terms of Service & Educational Disclaimer" updated="November 15, 2026">
      <p>
        By accessing PlainLedger, you agree to be bound by these Terms of Service and acknowledge the educational scope of all content and calculators provided on this website.
      </p>
      <h2 className="font-editorial text-2xl font-semibold text-[#1C1917] pt-2">
        1. Not Licensed Financial, Tax, or Legal Advice
      </h2>
      <p>
        All articles, worked examples, and interactive calculator outputs published on PlainLedger are strictly for general educational and informational purposes. PlainLedger and its contributors are not registered investment advisors, certified public accountants, or attorneys. Always consult a qualified fiduciary advisor or tax professional before making major financial commitments.
      </p>
      <h2 className="font-editorial text-2xl font-semibold text-[#1C1917] pt-2">
        2. Accuracy &amp; Limitation of Liability
      </h2>
      <p>
        While we test every mathematical formula carefully, PlainLedger makes no warranty regarding future market performance, lender underwriting decisions, or tax law changes. Your use of any estimate or projection is at your own discretion and risk.
      </p>
      <h2 className="font-editorial text-2xl font-semibold text-[#1C1917] pt-2">
        3. Intellectual Property &amp; Contact
      </h2>
      <p>
        Original articles, tables, and site structure belong to PlainLedger. Short quoted excerpts with clear attribution and a link back are welcome. Questions regarding these terms may be directed to{' '}
        <a href="mailto:chinachen05@gmail.com" className="text-[#14532D] underline underline-offset-4">
          chinachen05@gmail.com
        </a>
        .
      </p>
    </TrustLayout>
  );
}

export function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [topic, setTopic] = useState('Editorial Question or Correction');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      setError('Please complete your name, email address, and message before submitting.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError('Please enter a valid email address.');
      return;
    }
    setError('');
    setSubmitted(true);
  };

  return (
    <TrustLayout kicker="Get in Touch" title="Contact the PlainLedger Editorial Desk">
      <p>
        We welcome reader feedback, mathematical correction notes, calculator suggestions, and privacy or advertising inquiries. You can reach us directly by email or use the message form below.
      </p>

      <div className="bg-[#FFFFFF] border border-[#E5DFD3] rounded-lg p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="text-xs font-semibold uppercase tracking-widest text-[#57534E]">
            Direct Editorial &amp; Support Email
          </div>
          <a
            href="mailto:chinachen05@gmail.com"
            className="inline-flex items-center gap-2 text-lg font-semibold text-[#14532D] hover:text-[#166534]"
          >
            <Mail className="w-5 h-5" />
            <span>chinachen05@gmail.com</span>
          </a>
        </div>
        <div className="text-xs text-[#57534E]">
          Typical response window: 1–2 business days
        </div>
      </div>

      {submitted ? (
        <div
          role="status"
          className="bg-[#ECFDF5] border border-[#14532D]/30 rounded-lg p-6 space-y-3"
        >
          <div className="flex items-center gap-2 text-[#14532D] font-semibold">
            <CheckCircle2 className="w-5 h-5" />
            <span>Inquiry Prepared for Editorial Desk</span>
          </div>
          <p className="text-sm text-[#292524]">
            Thank you, {name}. Your note regarding <strong>{topic}</strong> has been validated. For immediate delivery from your mail client, you may also send directly to{' '}
            <a
              href={`mailto:chinachen05@gmail.com?subject=${encodeURIComponent(
                `[PlainLedger] ${topic} — ${name}`
              )}&body=${encodeURIComponent(`Reply-To: ${email}\n\n${message}`)}`}
              className="text-[#14532D] underline font-semibold"
            >
              chinachen05@gmail.com
            </a>
            .
          </p>
          <button
            type="button"
            onClick={() => {
              setSubmitted(false);
              setName('');
              setEmail('');
              setMessage('');
            }}
            className="px-4 py-2 text-xs font-semibold text-[#14532D] border border-[#14532D]/30 bg-[#FFFFFF] rounded-md"
          >
            Send Another Note
          </button>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          noValidate
          className="bg-[#FFFFFF] border border-[#E5DFD3] rounded-lg p-6 space-y-4"
        >
          {error && (
            <div role="alert" className="text-sm text-[#9A3412] font-medium">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label htmlFor="contact-name" className="block text-xs font-medium text-[#292524]">
                Your Name
              </label>
              <input
                id="contact-name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Alex Rivera"
                className="w-full px-3 py-2 text-sm bg-[#FBF9F5] border border-[#E5DFD3] rounded-md focus:outline-none focus:border-[#14532D]"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="contact-email" className="block text-xs font-medium text-[#292524]">
                Email Address
              </label>
              <input
                id="contact-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="alex@example.com"
                className="w-full px-3 py-2 text-sm bg-[#FBF9F5] border border-[#E5DFD3] rounded-md focus:outline-none focus:border-[#14532D]"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="contact-topic" className="block text-xs font-medium text-[#292524]">
              Topic
            </label>
            <select
              id="contact-topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-[#FBF9F5] border border-[#E5DFD3] rounded-md focus:outline-none focus:border-[#14532D]"
            >
              <option>Editorial Question or Correction</option>
              <option>Calculator Feedback</option>
              <option>Privacy or Advertising Inquiry</option>
              <option>General Feedback</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="contact-message" className="block text-xs font-medium text-[#292524]">
              Message
            </label>
            <textarea
              id="contact-message"
              rows={5}
              required
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Write your question, article title, or calculation feedback..."
              className="w-full px-3 py-2 text-sm bg-[#FBF9F5] border border-[#E5DFD3] rounded-md focus:outline-none focus:border-[#14532D]"
            />
          </div>

          <button
            type="submit"
            className="px-5 py-2.5 text-sm font-semibold text-white bg-[#14532D] hover:bg-[#166534] rounded-md transition-colors"
          >
            Submit Inquiry
          </button>
        </form>
      )}
    </TrustLayout>
  );
}
