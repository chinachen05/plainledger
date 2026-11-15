export type ArticleCategory =
  | 'Budgeting'
  | 'Saving'
  | 'Debt & Credit'
  | 'Investing'
  | 'Tax & Retirement';

export type CalculatorId = 'compound' | 'debt' | 'budget' | 'mortgage';

export interface ArticleSection {
  heading: string;
  paragraphs: string[];
}

export interface WorkedExample {
  title: string;
  summary: string;
  headers: string[];
  rows: string[][];
}

export interface Article {
  id: number;
  slug: string;
  title: string;
  category: ArticleCategory;
  excerpt: string;
  author: string;
  authorRole: string;
  publishedAt: string;
  updatedAt: string;
  readMinutes: number;
  featuredTier?: 'lead' | 'secondary';
  keyTakeaways: string[];
  sections: ArticleSection[];
  workedExample: WorkedExample;
  relatedToolId: CalculatorId;
  relatedToolLabel: string;
}
