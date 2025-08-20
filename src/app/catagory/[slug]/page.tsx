// app/category/[slug]/page.tsx
import { notFound } from 'next/navigation';
import { client } from '../../../../lib/prismicio';
import type { BlogPostDocument } from '../../../../prismicio-types';
import CategoryPageComponent from './CategoryPage';

interface PageProps {
  params: {
    slug: string;
  };
}

// Simplified category configs
const VALID_CATEGORIES = ['news', 'sports', 'business', 'opinion', 'features', 'initiative', 'policies', 'others'];

const CATEGORY_NAMES = {
  news: 'News',
  sports: 'Sports', 
  business: 'Business',
  opinion: 'Opinion',
  features: 'Features',
  initiative: 'Initiative',
  policies: 'Policies',
  others: 'Others'
};

async function getCategoryData(slug: string) {
  try {
    console.log(`Fetching data for category: ${slug}`);
    
    // Get all blog posts
    const allPosts: BlogPostDocument[] = await client.getAllByType("blog_post", {
      orderings: [{ field: "my.blog_post.published_date", direction: "desc" }],
    });

    console.log(`Found ${allPosts.length} total posts`);

    // For now, let's just return the first few posts regardless of category
    // You can refine the filtering later once this works
    const posts = allPosts.slice(0, 12);

    return {
      featuredArticle: posts[0] || null,
      newsArticles: posts.slice(1, 5) || [],
      opinionArticles: posts.slice(5, 9) || [],
      recommendedArticles: posts.slice(9, 12) || []
    };

  } catch (error) {
    console.error('Error in getCategoryData:', error);
    throw error;
  }
}

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = params;

  console.log(`Category page requested for: ${slug}`);

  // Check if category is valid
  if (!VALID_CATEGORIES.includes(slug)) {
    console.log(`Invalid category: ${slug}`);
    notFound();
  }

  try {
    const data = await getCategoryData(slug);
    
    if (!data.featuredArticle) {
      console.log('No featured article found');
      notFound();
    }

    return (
      <CategoryPageComponent
        categoryName={CATEGORY_NAMES[slug as keyof typeof CATEGORY_NAMES]}
        categorySlug={slug}
        {...data}
      />
    );

  } catch (error) {
    console.error(`Error loading category ${slug}:`, error);
    notFound();
  }
}

// Generate static params
export async function generateStaticParams() {
  return VALID_CATEGORIES.map((slug) => ({
    slug,
  }));
}