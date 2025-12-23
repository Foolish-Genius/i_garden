import { useState, useEffect, Suspense, lazy } from 'react';
import { Link } from 'react-router-dom';
import sanityClient from '../sanityClient';
import PostCard from './PostCard';
import { srcFor, srcSetFor } from '../lib/sanityImage';
const NewsletterForm = lazy(() => import('./NewsletterForm'));


export default function HomePage() {
  const [featuredPost, setFeaturedPost] = useState(null);
  const [regularPosts, setRegularPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        // Corrected and simplified query
        const query = `*[_type == "post"] | order(publishedAt desc) {
          title,
          slug,
          publishedAt,
          featured,
          mainImage{ asset->{ _ref, url } }
        }`;
        const posts = await sanityClient.fetch(query);

        const featured = posts.find(p => p.featured) || posts[0];
        const regular = posts.filter(p => p.slug.current !== featured.slug.current);
        
        setFeaturedPost(featured);
        setRegularPosts(regular);
      } catch (err) {
        setError('Failed to fetch posts. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  useEffect(() => {
    // Preload featured image to improve LCP when available
    if (!featuredPost?.mainImage?.asset) return;
    const url = featuredPost.mainImage.asset._ref
      ? srcFor(featuredPost.mainImage.asset, 1200)
      : featuredPost.mainImage.asset.url;

    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = url;
    document.head.appendChild(link);

    return () => {
      try { link.parentNode?.removeChild(link); } catch (e) { /* ignore */ }
    };
  }, [featuredPost]);

  if (loading) {
    return <div className="text-center text-text-primary p-12">Loading posts...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center p-12">{error}</div>;
  }

  return (
    <div className="container mx-auto p-4 sm:p-8">
      {featuredPost && (
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-text-primary mb-4 border-b-2 border-accent-primary pb-2">
            Featured Story
          </h2>
          <Link to={`/post/${featuredPost.slug.current}`} className="block group">
            <div className="bg-base-secondary rounded-lg shadow-xl overflow-hidden md:flex">
              {featuredPost.mainImage && (
                <img
                  className="md:w-1/2 h-64 md:h-auto object-cover"
                  src={featuredPost.mainImage.asset?._ref ? srcFor(featuredPost.mainImage.asset, 1200) : featuredPost.mainImage.asset.url}
                  srcSet={featuredPost.mainImage.asset?._ref ? srcSetFor(featuredPost.mainImage.asset, [600, 900, 1200]) : undefined}
                  sizes="(min-width: 768px) 50vw, 100vw"
                  alt={featuredPost.title}
                  loading="eager"
                />
              )}
              <div className="p-8 flex flex-col justify-center">
                <h3 className="text-4xl font-bold mb-4 text-text-primary group-hover:text-accent-primary transition-colors">
                  {featuredPost.title}
                </h3>
                <p className="text-gray-400">
                  {new Date(featuredPost.publishedAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </Link>
        </section>
      )}

      <section>
        <h2 className="text-3xl font-bold text-text-primary mb-4 border-b-2 border-accent-secondary pb-2">
          Latest Articles
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {regularPosts.map((post) => (
            <PostCard post={post} key={post.slug.current} />
          ))}
        </div>
      </section>

      <section className="mt-12 p-6 bg-base-secondary rounded-lg">
        <h3 className="text-2xl font-bold text-text-primary mb-4">Get updates</h3>
        <p className="text-gray-400 mb-4">Join the newsletter for weekly guides and exclusive tips.</p>
        <Suspense fallback={<div>Loading…</div>}>
          <NewsletterForm />
        </Suspense>
      </section>
    </div>
  );
}