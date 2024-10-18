import categoryMapData from '../data/categoryMap.json';
import memoize from 'lodash/memoize';

const categoryMap = new Map(Object.entries(categoryMapData));

const matchCategory = (productName) => {
  const lowercaseName = productName.toLowerCase();
  let bestMatch = { category: 'Other', score: 0 };

  for (const [category, { include, exclude }] of categoryMap.entries()) {
    let score = 0;

    include.forEach((item) => {
      const keyword = typeof item === 'string' ? item : item.keyword;
      const weight = typeof item === 'string' ? 1 : item.weight;

      if (lowercaseName.includes(keyword.toLowerCase())) {
        score += weight;
      }
    });

    exclude.forEach((item) => {
      const keyword = typeof item === 'string' ? item : item.keyword;
      const weight = typeof item === 'string' ? -1 : item.weight;

      if (lowercaseName.includes(keyword.toLowerCase())) {
        score += weight;
      }
    });

    if (score > bestMatch.score) {
      bestMatch = { category, score };
    }
  }

  return bestMatch.category;
};

const categorizeProductsImpl = (products) => {
  const categorized = Object.keys(categoryMapData).reduce(
    (acc, category) => {
      acc[category] = [];
      return acc;
    },
    { Other: [] }
  );

  products.forEach((product) => {
    const category = matchCategory(product.name);
    categorized[category].push(product);
  });

  return categorized;
};

export const categorizeProducts = memoize(categorizeProductsImpl);
