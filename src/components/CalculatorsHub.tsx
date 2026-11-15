import { useEffect, useMemo, useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { CalculatorId } from '../data/articleTypes';
import {
  calculateBudgetAllocation,
  calculateCompoundGrowth,
  calculateDebtPayoff,
  calculateMortgageAmortization,
  DebtItem,
  DebtStrategy,
  formatCurrency,
} from '../utils/financeMath';

interface CalculatorsHubProps {
  initialTool?: CalculatorId;
  onNavigate: (path: string) => void;
}

const TOOL_TABS: { id: CalculatorId; label: string }[] = [
  { id: 'compound', label: 'Compound Wealth' },
  { id: 'debt', label: 'Debt Payoff' },
  { id: 'budget', label: '50/30/20 Budget' },
  { id: 'mortgage', label: 'Mortgage Planner' },
];

export function CalculatorsHub({ initialTool = 'compound', onNavigate }: CalculatorsHubProps) {
  const [activeTool, setActiveTool] = useState<CalculatorId>(initialTool);

  useEffect(() => {
    setActiveTool(initialTool);
  }, [initialTool]);

  const selectTool = (toolId: CalculatorId) => {
    setActiveTool(toolId);
    onNavigate(`/tools/${toolId}`);
  };

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-8 sm:pt-12">
      <div className="space-y-3 pb-8 border-b border-[#E5DFD3]">
        <div className="text-xs font-semibold uppercase tracking-widest text-[#14532D]">
          Financial Planning Suite
        </div>
        <h1 className="font-editorial text-3xl sm:text-4xl font-semibold text-[#1C1917] [text-wrap:balance]">
          Interactive Financial Calculators
        </h1>
        <p className="text-sm sm:text-base text-[#57534E] max-w-2xl leading-relaxed">
          All calculations run directly inside your browser with zero account sign-ups or data collection. Adjust any assumption below to inspect exact year-by-year outcomes.
        </p>
      </div>

      {/* Tool Selector Tabs */}
      <div
        role="tablist"
        aria-label="Select financial calculator"
        className="flex flex-wrap items-center gap-1.5 p-1.5 bg-[#F3EFE7] border border-[#E5DFD3] rounded-lg my-8"
      >
        {TOOL_TABS.map((tab) => {
          const active = activeTool === tab.id;
          return (
            <button
              key={tab.id}
              role="tab"
              aria-selected={active}
              type="button"
              onClick={() => selectTool(tab.id)}
              className={`px-4 py-2 text-xs sm:text-sm rounded-md whitespace-nowrap shrink-0 cursor-pointer ${
                active
                  ? 'bg-[#FFFFFF] text-[#14532D] font-semibold shadow-xs border border-[#E5DFD3]'
                  : 'text-[#57534E] font-medium hover:text-[#1C1917]'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {activeTool === 'compound' && <CompoundCalculator />}
      {activeTool === 'debt' && <DebtCalculator />}
      {activeTool === 'budget' && <BudgetCalculator />}
      {activeTool === 'mortgage' && <MortgageCalculator />}
    </main>
  );
}

function CompoundCalculator() {
  const [initialPrincipal, setInitialPrincipal] = useState(10000);
  const [monthlyContribution, setMonthlyContribution] = useState(500);
  const [annualRatePct, setAnnualRatePct] = useState(8);
  const [years, setYears] = useState(20);
  const [annualInflationPct, setAnnualInflationPct] = useState(2.5);
  const [showTable, setShowTable] = useState(false);

  const result = useMemo(
    () =>
      calculateCompoundGrowth({
        initialPrincipal,
        monthlyContribution,
        annualRatePct,
        years,
        annualInflationPct,
      }),
    [initialPrincipal, monthlyContribution, annualRatePct, years, annualInflationPct]
  );

  // SVG chart scaling
  const width = 640;
  const height = 240;
  const pad = 28;
  const maxVal = Math.max(1000, ...result.schedule.map((r) => r.nominalBalance));
  const pointsCount = result.schedule.length;

  const toX = (idx: number) =>
    pad + ((idx + 1) / Math.max(1, pointsCount)) * (width - pad * 2);
  const toY = (val: number) =>
    height - pad - (val / maxVal) * (height - pad * 2);

  const startX = pad;
  const startY = toY(initialPrincipal);

  const nominalPath =
    `M ${startX} ${startY} ` +
    result.schedule.map((r, i) => `L ${toX(i).toFixed(1)} ${toY(r.nominalBalance).toFixed(1)}`).join(' ');
  const realPath =
    `M ${startX} ${startY} ` +
    result.schedule.map((r, i) => `L ${toX(i).toFixed(1)} ${toY(r.realBalance).toFixed(1)}`).join(' ');
  const contribPath =
    `M ${startX} ${startY} ` +
    result.schedule.map((r, i) => `L ${toX(i).toFixed(1)} ${toY(r.totalContributions).toFixed(1)}`).join(' ');

  return (
    <section aria-label="Compound Wealth Calculator" className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      <div className="lg:col-span-5 bg-[#FFFFFF] border border-[#E5DFD3] rounded-lg p-6 space-y-5">
        <h2 className="font-editorial text-xl font-semibold text-[#1C1917]">
          Assumptions
        </h2>

        <NumberInput
          id="compound-initial"
          label="Initial Deposit ($)"
          value={initialPrincipal}
          min={0}
          max={10000000}
          step={500}
          onChange={setInitialPrincipal}
        />
        <NumberInput
          id="compound-monthly"
          label="Monthly Contribution ($)"
          value={monthlyContribution}
          min={0}
          max={100000}
          step={50}
          onChange={setMonthlyContribution}
        />
        <RangeInput
          id="compound-rate"
          label="Expected Annual Return"
          value={annualRatePct}
          min={1}
          max={15}
          step={0.5}
          unit="%"
          onChange={setAnnualRatePct}
        />
        <RangeInput
          id="compound-years"
          label="Time Horizon"
          value={years}
          min={1}
          max={45}
          step={1}
          unit=" yrs"
          onChange={setYears}
        />
        <RangeInput
          id="compound-inflation"
          label="Annual Inflation Assumption"
          value={annualInflationPct}
          min={0}
          max={8}
          step={0.5}
          unit="%"
          onChange={setAnnualInflationPct}
        />
      </div>

      <div className="lg:col-span-7 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard
            label={`Nominal Value (Yr ${years})`}
            value={formatCurrency(result.finalNominalBalance)}
            accent
          />
          <StatCard
            label="Inflation-Adjusted Real"
            value={formatCurrency(result.finalRealBalance)}
          />
          <StatCard
            label="Total Compound Growth"
            value={formatCurrency(result.totalInterestEarned)}
          />
        </div>

        <div className="bg-[#FFFFFF] border border-[#E5DFD3] rounded-lg p-6 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="font-editorial text-lg font-semibold text-[#1C1917]">
              Nominal vs. Purchasing-Power Trajectory
            </h3>
            <div className="flex items-center gap-4 text-xs text-[#57534E]">
              <span className="inline-flex items-center gap-1.5">
                <span className="w-3 h-0.5 bg-[#14532D] inline-block" /> Nominal
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="w-3 h-0.5 bg-[#78350F] inline-block" /> Real
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="w-3 h-0.5 bg-[#A8A29E] inline-block" /> Contributed
              </span>
            </div>
          </div>

          <svg
            viewBox={`0 0 ${width} ${height}`}
            role="img"
            aria-label="Compound wealth trajectory chart"
            className="w-full h-auto"
          >
            {[0.25, 0.5, 0.75, 1].map((frac) => {
              const y = height - pad - frac * (height - pad * 2);
              return (
                <g key={frac}>
                  <line x1={pad} y1={y} x2={width - pad} y2={y} stroke="#E5DFD3" strokeDasharray="3 3" />
                  <text x={pad} y={y - 4} fontSize="10" fill="#78716C">
                    {formatCurrency(Math.round(maxVal * frac))}
                  </text>
                </g>
              );
            })}
            <path d={contribPath} fill="none" stroke="#A8A29E" strokeWidth="2" strokeDasharray="4 4" />
            <path d={realPath} fill="none" stroke="#78350F" strokeWidth="2.2" />
            <path d={nominalPath} fill="none" stroke="#14532D" strokeWidth="2.8" />
          </svg>

          <div className="flex items-center justify-between pt-2 border-t border-[#E5DFD3] text-xs text-[#57534E]">
            <span>
              Out-of-pocket contributions: <strong className="font-mono tabular-nums text-[#1C1917]">{formatCurrency(result.totalContributed)}</strong>
            </span>
            <button
              type="button"
              onClick={() => setShowTable((s) => !s)}
              className="font-semibold text-[#14532D] hover:text-[#166534]"
            >
              {showTable ? 'Hide Year-by-Year Schedule' : 'View Year-by-Year Schedule'}
            </button>
          </div>

          {showTable && (
            <div className="overflow-x-auto max-h-72 overflow-y-auto border-t border-[#E5DFD3] pt-3">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-[#E5DFD3] text-[#57534E] uppercase">
                    <th className="py-2 pr-3">Year</th>
                    <th className="py-2 pr-3">Contributed</th>
                    <th className="py-2 pr-3">Nominal Balance</th>
                    <th className="py-2 pr-3">Real Value</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5DFD3] font-mono tabular-nums">
                  {result.schedule.map((row) => (
                    <tr key={row.year}>
                      <td className="py-2 pr-3 font-sans">Yr {row.year}</td>
                      <td className="py-2 pr-3">{formatCurrency(row.totalContributions)}</td>
                      <td className="py-2 pr-3 font-semibold text-[#14532D]">{formatCurrency(row.nominalBalance)}</td>
                      <td className="py-2 pr-3">{formatCurrency(row.realBalance)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function DebtCalculator() {
  const [debts, setDebts] = useState<DebtItem[]>([
    { id: 'd1', name: 'Retail Card', balance: 3200, aprPct: 24.9, minPayment: 95 },
    { id: 'd2', name: 'Primary Credit Card', balance: 6800, aprPct: 19.5, minPayment: 175 },
    { id: 'd3', name: 'Auto Loan', balance: 9500, aprPct: 6.2, minPayment: 260 },
  ]);
  const [extraMonthly, setExtraMonthly] = useState(250);
  const [strategy, setStrategy] = useState<DebtStrategy>('avalanche');

  const result = useMemo(
    () => calculateDebtPayoff(debts, extraMonthly, strategy),
    [debts, extraMonthly, strategy]
  );

  const alternate = useMemo(
    () => calculateDebtPayoff(debts, extraMonthly, strategy === 'avalanche' ? 'snowball' : 'avalanche'),
    [debts, extraMonthly, strategy]
  );

  const updateDebt = (id: string, field: keyof DebtItem, value: string | number) => {
    setDebts((prev) =>
      prev.map((d) => (d.id === id ? { ...d, [field]: value } : d))
    );
  };

  const addDebt = () => {
    setDebts((prev) => [
      ...prev,
      {
        id: `d-${Date.now()}`,
        name: `Account ${prev.length + 1}`,
        balance: 2500,
        aprPct: 15,
        minPayment: 75,
      },
    ]);
  };

  const removeDebt = (id: string) => {
    setDebts((prev) => (prev.length > 1 ? prev.filter((d) => d.id !== id) : prev));
  };

  return (
    <section aria-label="Debt Payoff Planner" className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      <div className="lg:col-span-6 bg-[#FFFFFF] border border-[#E5DFD3] rounded-lg p-6 space-y-5">
        <div className="flex items-center justify-between gap-4">
          <h2 className="font-editorial text-xl font-semibold text-[#1C1917]">
            Your Active Debts
          </h2>
          <button
            type="button"
            onClick={addDebt}
            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-[#14532D] border border-[#E5DFD3] rounded-md hover:bg-[#F3EFE7]"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Account</span>
          </button>
        </div>

        <div className="space-y-3">
          {debts.map((debt) => (
            <div
              key={debt.id}
              className="p-3.5 bg-[#FBF9F5] border border-[#E5DFD3] rounded-md space-y-3"
            >
              <div className="flex items-center justify-between gap-2">
                <label htmlFor={`debt-name-${debt.id}`} className="sr-only">
                  Account name
                </label>
                <input
                  id={`debt-name-${debt.id}`}
                  type="text"
                  value={debt.name}
                  onChange={(e) => updateDebt(debt.id, 'name', e.target.value)}
                  className="text-sm font-semibold text-[#1C1917] bg-transparent border-b border-transparent focus:border-[#14532D] focus:outline-none w-full"
                />
                {debts.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeDebt(debt.id)}
                    aria-label={`Remove ${debt.name}`}
                    className="p-1 text-[#57534E] hover:text-[#9A3412]"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              <div className="grid grid-cols-3 gap-2.5">
                <div>
                  <label htmlFor={`bal-${debt.id}`} className="block text-[11px] text-[#57534E] mb-1">
                    Balance ($)
                  </label>
                  <input
                    id={`bal-${debt.id}`}
                    type="number"
                    min={0}
                    value={debt.balance}
                    onChange={(e) => updateDebt(debt.id, 'balance', Number(e.target.value) || 0)}
                    className="w-full px-2.5 py-1.5 text-xs font-mono tabular-nums bg-[#FFFFFF] border border-[#E5DFD3] rounded"
                  />
                </div>
                <div>
                  <label htmlFor={`apr-${debt.id}`} className="block text-[11px] text-[#57534E] mb-1">
                    APR (%)
                  </label>
                  <input
                    id={`apr-${debt.id}`}
                    type="number"
                    min={0}
                    max={60}
                    step={0.1}
                    value={debt.aprPct}
                    onChange={(e) => updateDebt(debt.id, 'aprPct', Number(e.target.value) || 0)}
                    className="w-full px-2.5 py-1.5 text-xs font-mono tabular-nums bg-[#FFFFFF] border border-[#E5DFD3] rounded"
                  />
                </div>
                <div>
                  <label htmlFor={`min-${debt.id}`} className="block text-[11px] text-[#57534E] mb-1">
                    Min/Mo ($)
                  </label>
                  <input
                    id={`min-${debt.id}`}
                    type="number"
                    min={0}
                    value={debt.minPayment}
                    onChange={(e) => updateDebt(debt.id, 'minPayment', Number(e.target.value) || 0)}
                    className="w-full px-2.5 py-1.5 text-xs font-mono tabular-nums bg-[#FFFFFF] border border-[#E5DFD3] rounded"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <NumberInput
          id="debt-extra"
          label="Extra Monthly Payment Toward Priority Debt ($)"
          value={extraMonthly}
          min={0}
          max={25000}
          step={25}
          onChange={setExtraMonthly}
        />

        <div className="space-y-1.5">
          <span className="block text-xs font-medium text-[#292524]">Repayment Order</span>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setStrategy('avalanche')}
              className={`px-3 py-2 text-xs font-semibold rounded-md border transition-colors ${
                strategy === 'avalanche'
                  ? 'bg-[#14532D] text-white border-[#14532D]'
                  : 'bg-[#FFFFFF] text-[#292524] border-[#E5DFD3] hover:bg-[#F3EFE7]'
              }`}
            >
              Avalanche (Highest APR)
            </button>
            <button
              type="button"
              onClick={() => setStrategy('snowball')}
              className={`px-3 py-2 text-xs font-semibold rounded-md border transition-colors ${
                strategy === 'snowball'
                  ? 'bg-[#14532D] text-white border-[#14532D]'
                  : 'bg-[#FFFFFF] text-[#292524] border-[#E5DFD3] hover:bg-[#F3EFE7]'
              }`}
            >
              Snowball (Smallest Balance)
            </button>
          </div>
        </div>
      </div>

      <div className="lg:col-span-6 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard
            label="Time to Debt-Free"
            value={result.stalled ? 'Increase Min' : `${result.monthsToPayoff} mos`}
            accent
          />
          <StatCard
            label="Total Interest Paid"
            value={formatCurrency(result.totalInterestPaid)}
          />
          <StatCard
            label="Interest Saved vs. Min"
            value={formatCurrency(result.interestSaved)}
          />
        </div>

        <div className="bg-[#FFFFFF] border border-[#E5DFD3] rounded-lg p-6 space-y-4">
          <h3 className="font-editorial text-lg font-semibold text-[#1C1917]">
            Payoff Sequence &amp; Strategy Comparison
          </h3>

          <p className="text-sm text-[#57534E] leading-relaxed">
            Adding <strong className="font-mono text-[#1C1917]">{formatCurrency(extraMonthly)}/mo</strong> saves{' '}
            <strong className="font-mono text-[#14532D]">{result.monthsSaved} months</strong> and{' '}
            <strong className="font-mono text-[#14532D]">{formatCurrency(result.interestSaved)}</strong> compared to minimum payments alone.
            {strategy === 'avalanche' && alternate.totalInterestPaid > result.totalInterestPaid && (
              <span>
                {' '}
                Avalanche saves <strong className="font-mono text-[#1C1917]">{formatCurrency(alternate.totalInterestPaid - result.totalInterestPaid)}</strong> more interest than Snowball.
              </span>
            )}
          </p>

          <div className="divide-y divide-[#E5DFD3] border-t border-[#E5DFD3]">
            {result.payoffOrder.map((entry, idx) => (
              <div key={entry.name} className="py-2.5 flex items-center justify-between text-sm">
                <span className="text-[#1C1917] font-medium">
                  {idx + 1}. {entry.name}
                </span>
                <span className="font-mono text-xs tabular-nums text-[#57534E]">
                  Paid off in Month {entry.monthPaidOff}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function BudgetCalculator() {
  const [monthlyNetIncome, setMonthlyNetIncome] = useState(5500);
  const [needsPct, setNeedsPct] = useState(50);
  const [wantsPct, setWantsPct] = useState(30);
  const [savingsPct, setSavingsPct] = useState(20);
  const [currentEmergencySavings, setCurrentEmergencySavings] = useState(6500);
  const [monthlyEssentialExpenses, setMonthlyEssentialExpenses] = useState(2750);
  const [targetRunwayMonths, setTargetRunwayMonths] = useState(6);

  const result = useMemo(
    () =>
      calculateBudgetAllocation({
        monthlyNetIncome,
        needsPct,
        wantsPct,
        savingsPct,
        currentEmergencySavings,
        monthlyEssentialExpenses,
        targetRunwayMonths,
      }),
    [
      monthlyNetIncome,
      needsPct,
      wantsPct,
      savingsPct,
      currentEmergencySavings,
      monthlyEssentialExpenses,
      targetRunwayMonths,
    ]
  );

  return (
    <section aria-label="50/30/20 Budget and Emergency Runway Calculator" className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      <div className="lg:col-span-5 bg-[#FFFFFF] border border-[#E5DFD3] rounded-lg p-6 space-y-5">
        <h2 className="font-editorial text-xl font-semibold text-[#1C1917]">
          Monthly Cash Flow &amp; Reserves
        </h2>

        <NumberInput
          id="budget-net"
          label="Monthly Net Take-Home Pay ($)"
          value={monthlyNetIncome}
          min={0}
          max={100000}
          step={100}
          onChange={setMonthlyNetIncome}
        />

        <div className="grid grid-cols-3 gap-2.5">
          <div>
            <label htmlFor="pct-needs" className="block text-xs text-[#57534E] mb-1">
              Needs (%)
            </label>
            <input
              id="pct-needs"
              type="number"
              min={0}
              max={100}
              value={needsPct}
              onChange={(e) => setNeedsPct(Number(e.target.value) || 0)}
              className="w-full px-2.5 py-2 text-sm font-mono tabular-nums bg-[#FBF9F5] border border-[#E5DFD3] rounded-md"
            />
          </div>
          <div>
            <label htmlFor="pct-wants" className="block text-xs text-[#57534E] mb-1">
              Wants (%)
            </label>
            <input
              id="pct-wants"
              type="number"
              min={0}
              max={100}
              value={wantsPct}
              onChange={(e) => setWantsPct(Number(e.target.value) || 0)}
              className="w-full px-2.5 py-2 text-sm font-mono tabular-nums bg-[#FBF9F5] border border-[#E5DFD3] rounded-md"
            />
          </div>
          <div>
            <label htmlFor="pct-savings" className="block text-xs text-[#57534E] mb-1">
              Savings (%)
            </label>
            <input
              id="pct-savings"
              type="number"
              min={0}
              max={100}
              value={savingsPct}
              onChange={(e) => setSavingsPct(Number(e.target.value) || 0)}
              className="w-full px-2.5 py-2 text-sm font-mono tabular-nums bg-[#FBF9F5] border border-[#E5DFD3] rounded-md"
            />
          </div>
        </div>

        {result.pctSum !== 100 && (
          <p className="text-xs text-[#9A3412] font-medium">
            Total allocation is currently {result.pctSum}%. Adjust buckets so total equals 100%.
          </p>
        )}

        <NumberInput
          id="budget-essentials"
          label="Bare-Bones Essential Monthly Burn ($)"
          value={monthlyEssentialExpenses}
          min={100}
          max={50000}
          step={100}
          onChange={setMonthlyEssentialExpenses}
        />
        <NumberInput
          id="budget-cash"
          label="Current Liquid Emergency Savings ($)"
          value={currentEmergencySavings}
          min={0}
          max={500000}
          step={250}
          onChange={setCurrentEmergencySavings}
        />
        <RangeInput
          id="budget-runway-target"
          label="Target Emergency Runway"
          value={targetRunwayMonths}
          min={3}
          max={12}
          step={1}
          unit=" mos"
          onChange={setTargetRunwayMonths}
        />
      </div>

      <div className="lg:col-span-7 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard label={`Needs (${needsPct}%)`} value={formatCurrency(result.needsDollars)} />
          <StatCard label={`Wants (${wantsPct}%)`} value={formatCurrency(result.wantsDollars)} />
          <StatCard
            label={`Savings (${savingsPct}%)`}
            value={formatCurrency(result.savingsDollars)}
            accent
          />
        </div>

        <div className="bg-[#FFFFFF] border border-[#E5DFD3] rounded-lg p-6 space-y-4">
          <h3 className="font-editorial text-lg font-semibold text-[#1C1917]">
            Emergency Runway Diagnostic
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div className="p-4 bg-[#F3EFE7] rounded-md border border-[#E5DFD3]">
              <div className="text-xs text-[#57534E]">Current Essential Runway</div>
              <div className="font-mono text-2xl font-semibold text-[#1C1917] tabular-nums mt-1">
                {result.currentRunwayMonths} months
              </div>
            </div>
            <div className="p-4 bg-[#F3EFE7] rounded-md border border-[#E5DFD3]">
              <div className="text-xs text-[#57534E]">
                {targetRunwayMonths}-Month Target Reserve
              </div>
              <div className="font-mono text-2xl font-semibold text-[#14532D] tabular-nums mt-1">
                {formatCurrency(result.targetEmergencyFund)}
              </div>
            </div>
          </div>

          <p className="text-sm text-[#292524] leading-relaxed">
            {result.emergencyShortfall === 0 ? (
              <span>
                Your liquid reserve already covers your full{' '}
                <strong>{targetRunwayMonths}-month essential target</strong>. Direct monthly savings toward tax-advantaged investing or high-APR debt.
              </span>
            ) : (
              <span>
                Remaining shortfall to reach {targetRunwayMonths} months:{' '}
                <strong className="font-mono tabular-nums">{formatCurrency(result.emergencyShortfall)}</strong>. At{' '}
                <strong className="font-mono tabular-nums">{formatCurrency(result.savingsDollars)}/mo</strong> saved, you will close the gap in{' '}
                <strong className="font-mono tabular-nums">
                  {result.monthsToTarget !== null ? `${result.monthsToTarget} months` : '—'}
                </strong>
                .
              </span>
            )}
          </p>
        </div>
      </div>
    </section>
  );
}

function MortgageCalculator() {
  const [homePrice, setHomePrice] = useState(400000);
  const [downPaymentPct, setDownPaymentPct] = useState(20);
  const [annualInterestPct, setAnnualInterestPct] = useState(6.5);
  const [termYears, setTermYears] = useState(30);
  const [extraMonthlyPrincipal, setExtraMonthlyPrincipal] = useState(250);

  const result = useMemo(
    () =>
      calculateMortgageAmortization({
        homePrice,
        downPaymentPct,
        annualInterestPct,
        termYears,
        extraMonthlyPrincipal,
      }),
    [homePrice, downPaymentPct, annualInterestPct, termYears, extraMonthlyPrincipal]
  );

  return (
    <section aria-label="Mortgage Amortization Calculator" className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      <div className="lg:col-span-5 bg-[#FFFFFF] border border-[#E5DFD3] rounded-lg p-6 space-y-5">
        <h2 className="font-editorial text-xl font-semibold text-[#1C1917]">
          Loan Terms
        </h2>

        <NumberInput
          id="mort-price"
          label="Home Purchase Price ($)"
          value={homePrice}
          min={50000}
          max={5000000}
          step={5000}
          onChange={setHomePrice}
        />
        <RangeInput
          id="mort-down"
          label="Down Payment"
          value={downPaymentPct}
          min={3}
          max={50}
          step={1}
          unit="%"
          onChange={setDownPaymentPct}
        />
        <RangeInput
          id="mort-rate"
          label="Interest Rate"
          value={annualInterestPct}
          min={2.5}
          max={11}
          step={0.125}
          unit="%"
          onChange={setAnnualInterestPct}
        />

        <div className="space-y-1.5">
          <span className="block text-xs font-medium text-[#292524]">Amortization Term</span>
          <div className="grid grid-cols-3 gap-2">
            {[15, 20, 30].map((yr) => (
              <button
                key={yr}
                type="button"
                onClick={() => setTermYears(yr)}
                className={`px-3 py-2 text-xs font-semibold rounded-md border ${
                  termYears === yr
                    ? 'bg-[#14532D] text-white border-[#14532D]'
                    : 'bg-[#FFFFFF] text-[#292524] border-[#E5DFD3] hover:bg-[#F3EFE7]'
                }`}
              >
                {yr} Years
              </button>
            ))}
          </div>
        </div>

        <NumberInput
          id="mort-extra"
          label="Extra Monthly Principal Payment ($)"
          value={extraMonthlyPrincipal}
          min={0}
          max={10000}
          step={50}
          onChange={setExtraMonthlyPrincipal}
        />
      </div>

      <div className="lg:col-span-7 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard
            label="Scheduled Monthly P&I"
            value={formatCurrency(result.baseMonthlyPayment)}
            accent
          />
          <StatCard
            label="Interest Saved"
            value={formatCurrency(result.interestSaved)}
          />
          <StatCard
            label="Time Cut From Loan"
            value={`${(result.monthsSaved / 12).toFixed(1)} yrs`}
          />
        </div>

        <div className="bg-[#FFFFFF] border border-[#E5DFD3] rounded-lg p-6 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[#57534E]">
            <span>
              Loan Amount: <strong className="font-mono text-[#1C1917]">{formatCurrency(result.loanAmount)}</strong>
            </span>
            <span>
              Total Interest With Extra: <strong className="font-mono text-[#1C1917]">{formatCurrency(result.totalInterestWithExtra)}</strong>
            </span>
          </div>

          <div className="overflow-x-auto max-h-72 overflow-y-auto border-t border-[#E5DFD3] pt-3">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#E5DFD3] text-[#57534E] uppercase">
                  <th className="py-2 pr-3">Year</th>
                  <th className="py-2 pr-3">Principal Paid</th>
                  <th className="py-2 pr-3">Interest Paid</th>
                  <th className="py-2 pr-3">Ending Balance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5DFD3] font-mono tabular-nums">
                {result.annualSchedule.map((row) => (
                  <tr key={row.year}>
                    <td className="py-2 pr-3 font-sans">Yr {row.year}</td>
                    <td className="py-2 pr-3 text-[#14532D] font-medium">{formatCurrency(row.principalPaid)}</td>
                    <td className="py-2 pr-3">{formatCurrency(row.interestPaid)}</td>
                    <td className="py-2 pr-3">{formatCurrency(row.endingBalance)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}

function StatCard({ label, value, accent = false }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="bg-[#FFFFFF] border border-[#E5DFD3] rounded-lg p-4 space-y-1">
      <div className="text-xs text-[#57534E]">{label}</div>
      <div
        className={`font-mono text-xl sm:text-2xl font-semibold tabular-nums ${
          accent ? 'text-[#14532D]' : 'text-[#1C1917]'
        }`}
      >
        {value}
      </div>
    </div>
  );
}

function NumberInput({
  id,
  label,
  value,
  min,
  max,
  step,
  onChange,
}: {
  id: string;
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (n: number) => void;
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-xs font-medium text-[#292524]">
        {label}
      </label>
      <input
        id={id}
        type="number"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Math.max(min, Number(e.target.value) || 0))}
        className="w-full px-3 py-2 text-sm font-mono tabular-nums bg-[#FBF9F5] border border-[#E5DFD3] rounded-md text-[#1C1917] focus:outline-none focus:border-[#14532D]"
      />
    </div>
  );
}

function RangeInput({
  id,
  label,
  value,
  min,
  max,
  step,
  unit,
  onChange,
}: {
  id: string;
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit: string;
  onChange: (n: number) => void;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-xs">
        <label htmlFor={id} className="font-medium text-[#292524]">
          {label}
        </label>
        <span className="font-mono tabular-nums font-semibold text-[#14532D]">
          {value}
          {unit}
        </span>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-[#14532D]"
      />
    </div>
  );
}
