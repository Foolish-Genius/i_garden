import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import sanityClient from '../sanityClient';

export default function ArchivesPage() {
  const [postsByYear, setPostsByYear] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const query = `*[_type == "post"] | order(publishedAt desc) {
      title,
      slug,
      publishedAt
    }`;

    sanityClient.fetch(query).then(posts => {
      const groupedPosts = posts.reduce((acc, post) => {
        const year = new Date(post.publishedAt).getFullYear();
        if (!acc[year]) {
          acc[year] = [];
        }
        acc[year].push(post);
        return acc;
      }, {});
      setPostsByYear(groupedPosts);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="text-center p-12">Loading archives...</div>;

  return (
    <div className="container mx-auto p-4 sm:p-8">
      <h1 className="text-5xl font-bold text-text-primary mb-8 border-b-2 border-accent-primary pb-4">
        Archives
      </h1>
      <div className="space-y-12">
        {Object.keys(postsByYear).map(year => (
          <section key={year}>
            <h2 className="text-3xl font-bold text-accent-secondary mb-6">{year}</h2>
            <ul className="space-y-4">
              {postsByYear[year].map(post => (
                <li key={post.slug.current}>
                  <Link to={`/post/${post.slug.current}`} className="flex items-baseline space-x-4 group">
                    <span className="text-gray-500 text-sm">{new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'short', day: '2-digit' })}</span>
                    <span className="text-lg text-text-primary group-hover:text-accent-primary transition-colors">{post.title}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}