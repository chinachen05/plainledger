import { Article, ArticleCategory } from './articleTypes';
import { ARTICLES_PART_1 } from './articlesPart1';
import { ARTICLES_PART_2 } from './articlesPart2';

export const ALL_ARTICLES: Article[] = [...ARTICLES_PART_1, ...ARTICLES_PART_2].sort(
  (a, b) => a.id - b.id
);

export const ARTICLE_CATEGORIES: ('All' | ArticleCategory)[] = [
  'All',
  'Budgeting',
  'Saving',
  'Debt & Credit',
  'Investing',
  'Tax & Retirement',
];

export function getArticleBySlug(slug: string): Article | undefined {
  return ALL_ARTICLES.find((article) => article.slug === slug);
}

export function getLeadArticle(): Article {
  return (
    ALL_ARTICLES.find((a) => a.featuredTier === 'lead') ?? ALL_ARTICLES[0]
  );
}

export function getSecondaryArticles(): Article[] {
  return ALL_ARTICLES.filter((a) => a.featuredTier === 'secondary').slice(0, 2);
}

export function getRelatedArticles(current: Article, limit = 3): Article[] {
  const sameCategory = ALL_ARTICLES.filter(
    (a) => a.category === current.category && a.slug !== current.slug
  );
  if (sameCategory.length >= limit) {
    return sameCategory.slice(0, limit);
  }
  const fallback = ALL_ARTICLES.filter(
    (a) => a.slug !== current.slug && a.category !== current.category
  );
  return [...sameCategory, ...fallback].slice(0, limit);
}

export function filterAndSortArticles(
  articles: Article[],
  category: 'All' | ArticleCategory,
  searchQuery: string,
  sortBy: 'editorial' | 'quickest'
): Article[] {
  const q = searchQuery.trim().toLowerCase();
  const filtered = articles.filter((article) => {
    const matchesCategory = category === 'All' || article.category === category;
    if (!matchesCategory) return false;
    if (!q) return true;
    return (
      article.title.toLowerCase().includes(q) ||
      article.excerpt.toLowerCase().includes(q) ||
      article.category.toLowerCase().includes(q) ||
      article.keyTakeaways.some((t) => t.toLowerCase().includes(q))
    );
  });

  if (sortBy === 'quickest') {
    return [...filtered].sort((a, b) => a.readMinutes - b.readMinutes || a.id - b.id);
  }
  return [...filtered].sort((a, b) => b.id - a.id);
}
