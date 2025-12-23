import { Link } from 'react-router-dom';
import React, { useMemo } from 'react';
import { srcFor, srcSetFor } from '../lib/sanityImage';

const truncateExcerpt = (text, length = 100) => {
  if (!text) return '';
  if (text.length <= length) return text;
  return text.substring(0, length) + '...';
};

const getExcerptFromBody = (body, length = 100) => {
  if (!body) return '';
  const plainText = body
    .map(block => {
      if (block._type === 'block' && block.children) {
        return block.children.map(child => child.text).join('');
      }
      return '';
    })
    .join(' ');
  return truncateExcerpt(plainText, length);
};

const PostCard = ({ post }) => {
  // Format date once
  const formattedDate = React.useMemo(() => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(new Date(post.publishedAt));
  }, [post.publishedAt]);

  // Fallback excerpt logic
  const excerpt = post.excerpt || getExcerptFromBody(post.body);

  return (
    <Link
      to={`/post/${post.slug.current}`}
      aria-label={`Read more about ${post.title}`}
      className="block"
    >
      <article
        role="article"
        className="bg-base-secondary rounded-lg shadow-lg h-full overflow-hidden group transition-transform duration-300 ease-in-out hover:scale-105"
      >
        {post.mainImage ? (
          <img
            className="w-full h-48 object-cover"
            src={post.mainImage.asset?._ref ? srcFor(post.mainImage.asset) : post.mainImage.asset.url}
            srcSet={post.mainImage.asset?._ref ? srcSetFor(post.mainImage.asset) : undefined}
            sizes="(min-width: 1024px) 33vw, 100vw"
            alt={post.title || 'Post image'}
            loading="lazy"
          />
        ) : (
          <div className="w-full h-48 bg-gray-800 flex items-center justify-center text-gray-500">
            No Image
          </div>
        )}

        <div className="p-6">
          <h3 className="text-2xl font-bold mb-2 text-text-primary group-hover:text-accent-primary transition-colors">
            {post.title}
          </h3>
          <p className="text-gray-400 text-sm mb-4">{formattedDate}</p>
          <p className="text-gray-400 text-sm line-clamp-3" title={excerpt}>
            {excerpt}
          </p>
        </div>
      </article>
    </Link>
  );
};

export default PostCard;
