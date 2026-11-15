export interface CompoundInput {
  initialPrincipal: number;
  monthlyContribution: number;
  annualRatePct: number;
  years: number;
  annualInflationPct: number;
}

export interface CompoundYearRow {
  year: number;
  totalContributions: number;
  nominalBalance: number;
  realBalance: number;
  annualInterest: number;
}

export interface CompoundResult {
  finalNominalBalance: number;
  finalRealBalance: number;
  totalContributed: number;
  totalInterestEarned: number;
  schedule: CompoundYearRow[];
}

export function calculateCompoundGrowth(input: CompoundInput): CompoundResult {
  const principal = Math.max(0, input.initialPrincipal);
  const monthly = Math.max(0, input.monthlyContribution);
  const annualRate = Math.max(0, input.annualRatePct) / 100;
  const inflationRate = Math.max(0, input.annualInflationPct) / 100;
  const years = Math.max(1, Math.min(50, Math.round(input.years)));

  const monthlyRate = annualRate / 12;
  let balance = principal;
  let totalContributed = principal;
  const schedule: CompoundYearRow[] = [];

  for (let yr = 1; yr <= years; yr++) {
    const startYearBalance = balance;
    for (let m = 0; m < 12; m++) {
      balance = (balance + monthly) * (1 + monthlyRate);
      totalContributed += monthly;
    }
    const inflationFactor = Math.pow(1 + inflationRate, yr);
    const realBalance = balance / inflationFactor;
    const annualInterest = balance - startYearBalance - monthly * 12;

    schedule.push({
      year: yr,
      totalContributions: Math.round(totalContributed),
      nominalBalance: Math.round(balance),
      realBalance: Math.round(realBalance),
      annualInterest: Math.round(annualInterest),
    });
  }

  const finalNominalBalance = Math.round(balance);
  const finalRealBalance = Math.round(balance / Math.pow(1 + inflationRate, years));
  const roundedContrib = Math.round(totalContributed);

  return {
    finalNominalBalance,
    finalRealBalance,
    totalContributed: roundedContrib,
    totalInterestEarned: Math.max(0, finalNominalBalance - roundedContrib),
    schedule,
  };
}

export interface DebtItem {
  id: string;
  name: string;
  balance: number;
  aprPct: number;
  minPayment: number;
}

export type DebtStrategy = 'avalanche' | 'snowball';

export interface DebtPayoffResult {
  monthsToPayoff: number;
  totalInterestPaid: number;
  totalPaid: number;
  baselineMonths: number;
  baselineInterest: number;
  interestSaved: number;
  monthsSaved: number;
  payoffOrder: { name: string; monthPaidOff: number }[];
  monthlyBalances: { month: number; remainingBalance: number }[];
  stalled: boolean;
}

function simulateDebtSchedule(
  debts: DebtItem[],
  extraMonthly: number,
  strategy: DebtStrategy
): {
  months: number;
  totalInterest: number;
  totalPaid: number;
  payoffOrder: { name: string; monthPaidOff: number }[];
  monthlyBalances: { month: number; remainingBalance: number }[];
  stalled: boolean;
} {
  const active = debts
    .filter((d) => d.balance > 0)
    .map((d) => ({
      ...d,
      remaining: Math.max(0, d.balance),
      paidOffMonth: 0,
    }));

  if (active.length === 0) {
    return {
      months: 0,
      totalInterest: 0,
      totalPaid: 0,
      payoffOrder: [],
      monthlyBalances: [{ month: 0, remainingBalance: 0 }],
      stalled: false,
    };
  }

  const sortOrder = (a: (typeof active)[number], b: (typeof active)[number]) => {
    if (strategy === 'avalanche') {
      if (b.aprPct !== a.aprPct) return b.aprPct - a.aprPct;
      return a.remaining - b.remaining;
    }
    if (a.remaining !== b.remaining) return a.remaining - b.remaining;
    return b.aprPct - a.aprPct;
  };

  let month = 0;
  let totalInterest = 0;
  let totalPaid = 0;
  const maxMonths = 600;
  const payoffOrder: { name: string; monthPaidOff: number }[] = [];
  const initialTotal = active.reduce((acc, d) => acc + d.remaining, 0);
  const monthlyBalances: { month: number; remainingBalance: number }[] = [
    { month: 0, remainingBalance: Math.round(initialTotal) },
  ];

  // Sum of all minimum payments establishes the fixed monthly debt-service budget
  const baseMinBudget = active.reduce((sum, d) => sum + Math.max(0, d.minPayment), 0);
  const totalBudget = baseMinBudget + Math.max(0, extraMonthly);

  while (active.some((d) => d.remaining > 0.01) && month < maxMonths) {
    month += 1;

    // 1. Accrue monthly interest
    for (const d of active) {
      if (d.remaining > 0) {
        const interest = d.remaining * (Math.max(0, d.aprPct) / 100 / 12);
        d.remaining += interest;
        totalInterest += interest;
      }
    }

    // 2. Pay minimums on each active debt
    let budgetLeft = totalBudget;
    for (const d of active) {
      if (d.remaining > 0) {
        const minPay = Math.min(d.remaining, Math.max(0, d.minPayment), budgetLeft);
        d.remaining -= minPay;
        totalPaid += minPay;
        budgetLeft -= minPay;
      }
    }

    // 3. Apply remaining snowball/avalanche budget to highest-priority debt(s)
    const prioritized = [...active].filter((d) => d.remaining > 0.01).sort(sortOrder);
    for (const target of prioritized) {
      if (budgetLeft <= 0.01) break;
      const extraPay = Math.min(target.remaining, budgetLeft);
      target.remaining -= extraPay;
      totalPaid += extraPay;
      budgetLeft -= extraPay;
    }

    // 4. Record newly retired debts
    for (const d of active) {
      if (d.remaining <= 0.01 && d.paidOffMonth === 0) {
        d.remaining = 0;
        d.paidOffMonth = month;
        payoffOrder.push({ name: d.name, monthPaidOff: month });
      }
    }

    const totalRemaining = active.reduce((acc, d) => acc + d.remaining, 0);
    monthlyBalances.push({ month, remainingBalance: Math.round(totalRemaining) });
  }

  const stalled = active.some((d) => d.remaining > 0.01);

  return {
    months: month,
    totalInterest: Math.round(totalInterest),
    totalPaid: Math.round(totalPaid),
    payoffOrder,
    monthlyBalances,
    stalled,
  };
}

export function calculateDebtPayoff(
  debts: DebtItem[],
  extraMonthly: number,
  strategy: DebtStrategy
): DebtPayoffResult {
  const chosen = simulateDebtSchedule(debts, extraMonthly, strategy);
  const baseline = simulateDebtSchedule(debts, 0, strategy);

  return {
    monthsToPayoff: chosen.months,
    totalInterestPaid: chosen.totalInterest,
    totalPaid: chosen.totalPaid,
    baselineMonths: baseline.months,
    baselineInterest: baseline.totalInterest,
    interestSaved: Math.max(0, baseline.totalInterest - chosen.totalInterest),
    monthsSaved: Math.max(0, baseline.months - chosen.months),
    payoffOrder: chosen.payoffOrder,
    monthlyBalances: chosen.monthlyBalances,
    stalled: chosen.stalled,
  };
}

export interface BudgetInput {
  monthlyNetIncome: number;
  needsPct: number;
  wantsPct: number;
  savingsPct: number;
  currentEmergencySavings: number;
  monthlyEssentialExpenses: number;
  targetRunwayMonths: number;
}

export interface BudgetResult {
  needsDollars: number;
  wantsDollars: number;
  savingsDollars: number;
  pctSum: number;
  currentRunwayMonths: number;
  targetEmergencyFund: number;
  emergencyShortfall: number;
  monthsToTarget: number | null;
}

export function calculateBudgetAllocation(input: BudgetInput): BudgetResult {
  const income = Math.max(0, input.monthlyNetIncome);
  const needsDollars = Math.round((income * Math.max(0, input.needsPct)) / 100);
  const wantsDollars = Math.round((income * Math.max(0, input.wantsPct)) / 100);
  const savingsDollars = Math.round((income * Math.max(0, input.savingsPct)) / 100);
  const pctSum = Math.round((input.needsPct + input.wantsPct + input.savingsPct) * 10) / 10;

  const essentials = Math.max(1, input.monthlyEssentialExpenses);
  const currentCash = Math.max(0, input.currentEmergencySavings);
  const currentRunwayMonths = Math.round((currentCash / essentials) * 10) / 10;
  const targetEmergencyFund = Math.round(essentials * Math.max(1, input.targetRunwayMonths));
  const emergencyShortfall = Math.max(0, targetEmergencyFund - currentCash);
  const monthsToTarget =
    emergencyShortfall === 0
      ? 0
      : savingsDollars > 0
        ? Math.ceil(emergencyShortfall / savingsDollars)
        : null;

  return {
    needsDollars,
    wantsDollars,
    savingsDollars,
    pctSum,
    currentRunwayMonths,
    targetEmergencyFund,
    emergencyShortfall,
    monthsToTarget,
  };
}

export interface MortgageInput {
  homePrice: number;
  downPaymentPct: number;
  annualInterestPct: number;
  termYears: number;
  extraMonthlyPrincipal: number;
}

export interface MortgageYearRow {
  year: number;
  principalPaid: number;
  interestPaid: number;
  endingBalance: number;
}

export interface MortgageResult {
  loanAmount: number;
  downPaymentDollars: number;
  baseMonthlyPayment: number;
  totalInterestBase: number;
  totalInterestWithExtra: number;
  interestSaved: number;
  monthsBase: number;
  monthsWithExtra: number;
  monthsSaved: number;
  annualSchedule: MortgageYearRow[];
}

export function calculateMortgageAmortization(input: MortgageInput): MortgageResult {
  const price = Math.max(0, input.homePrice);
  const downPct = Math.max(0, Math.min(95, input.downPaymentPct));
  const downPaymentDollars = Math.round((price * downPct) / 100);
  const loanAmount = Math.max(0, price - downPaymentDollars);
  const termMonths = Math.max(12, Math.round(input.termYears) * 12);
  const monthlyRate = Math.max(0, input.annualInterestPct) / 100 / 12;
  const extra = Math.max(0, input.extraMonthlyPrincipal);

  if (loanAmount === 0) {
    return {
      loanAmount: 0,
      downPaymentDollars,
      baseMonthlyPayment: 0,
      totalInterestBase: 0,
      totalInterestWithExtra: 0,
      interestSaved: 0,
      monthsBase: 0,
      monthsWithExtra: 0,
      monthsSaved: 0,
      annualSchedule: [],
    };
  }

  const baseMonthlyPayment =
    monthlyRate === 0
      ? loanAmount / termMonths
      : (loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, termMonths))) /
        (Math.pow(1 + monthlyRate, termMonths) - 1);

  const totalInterestBase = Math.max(0, baseMonthlyPayment * termMonths - loanAmount);

  // Simulate with extra principal
  let balance = loanAmount;
  let month = 0;
  let totalInterestWithExtra = 0;
  const annualSchedule: MortgageYearRow[] = [];
  let yearPrincipal = 0;
  let yearInterest = 0;

  while (balance > 0.01 && month < termMonths) {
    month += 1;
    const interest = balance * monthlyRate;
    totalInterestWithExtra += interest;
    yearInterest += interest;

    const scheduledPrincipal = Math.min(balance, baseMonthlyPayment - interest);
    const extraPrincipal = Math.min(balance - scheduledPrincipal, extra);
    const totalPrincipalThisMonth = scheduledPrincipal + extraPrincipal;
    balance -= totalPrincipalThisMonth;
    yearPrincipal += totalPrincipalThisMonth;

    if (month % 12 === 0 || balance <= 0.01) {
      annualSchedule.push({
        year: Math.ceil(month / 12),
        principalPaid: Math.round(yearPrincipal),
        interestPaid: Math.round(yearInterest),
        endingBalance: Math.max(0, Math.round(balance)),
      });
      yearPrincipal = 0;
      yearInterest = 0;
    }
  }

  const roundedInterestExtra = Math.round(totalInterestWithExtra);
  const roundedInterestBase = Math.round(totalInterestBase);

  return {
    loanAmount: Math.round(loanAmount),
    downPaymentDollars,
    baseMonthlyPayment: Math.round(baseMonthlyPayment),
    totalInterestBase: roundedInterestBase,
    totalInterestWithExtra: roundedInterestExtra,
    interestSaved: Math.max(0, roundedInterestBase - roundedInterestExtra),
    monthsBase: termMonths,
    monthsWithExtra: month,
    monthsSaved: Math.max(0, termMonths - month),
    annualSchedule,
  };
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value);
}
