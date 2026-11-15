import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateBudgetAllocation,
  calculateCompoundGrowth,
  calculateDebtPayoff,
  calculateMortgageAmortization,
} from './financeMath';

test('compound growth calculates nominal and inflation-adjusted real balances', () => {
  const result = calculateCompoundGrowth({
    initialPrincipal: 10000,
    monthlyContribution: 500,
    annualRatePct: 8,
    years: 10,
    annualInflationPct: 2.5,
  });

  assert.equal(result.totalContributed, 70000);
  assert.ok(result.finalNominalBalance > 110000, 'Expected nominal balance > $110k');
  assert.ok(
    result.finalRealBalance < result.finalNominalBalance,
    'Real inflation-adjusted balance must be lower than nominal'
  );
  assert.equal(result.schedule.length, 10);
});

test('debt avalanche saves more or equal interest than snowball when APRs differ', () => {
  const debts = [
    { id: '1', name: 'Store Card', balance: 2000, aprPct: 24, minPayment: 60 },
    { id: '2', name: 'Auto Loan', balance: 8000, aprPct: 6, minPayment: 220 },
    { id: '3', name: 'Credit Card', balance: 5000, aprPct: 19, minPayment: 120 },
  ];

  const avalanche = calculateDebtPayoff(debts, 200, 'avalanche');
  const snowball = calculateDebtPayoff(debts, 200, 'snowball');

  assert.equal(avalanche.stalled, false);
  assert.equal(snowball.stalled, false);
  assert.ok(avalanche.totalInterestPaid <= snowball.totalInterestPaid);
  assert.ok(avalanche.interestSaved > 0);
  assert.ok(avalanche.monthsSaved > 0);
});

test('budget allocation computes emergency runway and target months accurately', () => {
  const budget = calculateBudgetAllocation({
    monthlyNetIncome: 6000,
    needsPct: 50,
    wantsPct: 30,
    savingsPct: 20,
    currentEmergencySavings: 7000,
    monthlyEssentialExpenses: 3500,
    targetRunwayMonths: 6,
  });

  assert.equal(budget.needsDollars, 3000);
  assert.equal(budget.wantsDollars, 1800);
  assert.equal(budget.savingsDollars, 1200);
  assert.equal(budget.pctSum, 100);
  assert.equal(budget.currentRunwayMonths, 2);
  assert.equal(budget.targetEmergencyFund, 21000);
  assert.equal(budget.emergencyShortfall, 14000);
  assert.equal(budget.monthsToTarget, 12);
});

test('mortgage amortization reduces interest and term when extra principal is added', () => {
  const res = calculateMortgageAmortization({
    homePrice: 400000,
    downPaymentPct: 20,
    annualInterestPct: 6.5,
    termYears: 30,
    extraMonthlyPrincipal: 300,
  });

  assert.equal(res.loanAmount, 320000);
  assert.ok(res.baseMonthlyPayment > 2000 && res.baseMonthlyPayment < 2100);
  assert.ok(res.interestSaved > 70000, 'Extra $300/mo should save substantial interest');
  assert.ok(res.monthsSaved > 60, 'Extra $300/mo should cut years off 30-year mortgage');
});

import { ALL_ARTICLES, filterAndSortArticles } from '../data/articles';

test('article catalog meets minimum 25 on-point articles with unique slugs', () => {
  assert.ok(ALL_ARTICLES.length >= 25, `Expected >= 25 articles, got ${ALL_ARTICLES.length}`);
  const slugs = new Set(ALL_ARTICLES.map((a) => a.slug));
  assert.equal(slugs.size, ALL_ARTICLES.length, 'All article slugs must be unique');

  for (const article of ALL_ARTICLES) {
    assert.ok(article.sections.length >= 2, `${article.slug} needs >= 2 sections`);
    assert.ok(article.keyTakeaways.length >= 3, `${article.slug} needs >= 3 takeaways`);
    assert.ok(article.workedExample.rows.length >= 2, `${article.slug} needs worked example rows`);
  }
});

test('filterAndSortArticles filters by category and search query accurately', () => {
  const investingOnly = filterAndSortArticles(ALL_ARTICLES, 'Investing', '', 'editorial');
  assert.ok(investingOnly.length >= 5);
  assert.ok(investingOnly.every((a) => a.category === 'Investing'));

  const searchHits = filterAndSortArticles(ALL_ARTICLES, 'All', 'Rule of 72', 'editorial');
  assert.ok(searchHits.some((a) => a.slug === 'compound-interest-rule-of-72-explained'));
});

