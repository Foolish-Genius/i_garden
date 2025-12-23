import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { PortableText } from '@portabletext/react';
import sanityClient from '../sanityClient';
import CodeBlock from './CodeBlock';
import { srcFor, srcSetFor } from '../lib/sanityImage';

// Loading skeleton for better UX while fetching
const SkeletonPost = () => (
  <article className="p-4 md:p-8 animate-pulse">
    <div className="container mx-auto max-w-4xl">
      <div className="w-full h-96 bg-base-secondary rounded-lg mb-8"></div>
      <div className="bg-base-secondary rounded-lg p-8">
        <div className="h-10 bg-gray-700 rounded w-3/4 mb-6"></div>
        <div className="h-4 bg-gray-700 rounded w-full mb-4"></div>
        <div className="h-4 bg-gray-700 rounded w-5/6"></div>
      </div>
    </div>
  </article>
);

// Sanity image renderer for PortableText
const SanityImage = ({ asset }) => {
  const src = asset?._ref ? srcFor(asset, 1200) : asset?.url;
  const srcSet = asset?._ref ? srcSetFor(asset, [600, 900, 1200]) : undefined;
  return (
    <img
      src={src}
      srcSet={srcSet}
      sizes="(min-width: 768px) 60vw, 100vw"
      alt={asset.altText || ''}
      className="rounded-lg my-6"
      loading="lazy"
    />
  );
};

const portableTextComponents = {
  types: {
    code: ({ value }) => {
      if (!value?.code) return null;
      return <CodeBlock code={value.code} language={value.language} filename={value.filename} />;
    },
    image: ({ value }) => {
      if (!value?.asset?.url) return null;
      return <SanityImage asset={{ url: value.asset.url, altText: value.alt }} />;
    },
  },
  marks: {
    link: ({ children, value }) => {
      const rel = value.href.startsWith('/') ? undefined : 'noreferrer noopener';
      return (
        <a href={value.href} target="_blank" rel={rel} className="text-accent-primary hover:underline">
          {children}
        </a>
      );
    },
  },
};

export default function SinglePost() {
  const [postData, setPostData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { slug } = useParams();

  // Update document metadata for SPA (helps when users navigate client-side)
  useEffect(() => {
    if (!postData) return; // guard so hook always runs but only acts when data is available

    const title = postData.metaTitle || postData.title;
    const description = postData.metaDescription || postData.excerpt || '';

    document.title = `${title} | The Interactive Garden`;

    // Helper to update or create meta tags
    const upsertMeta = (attr, name, content) => {
      let el;
      if (attr === 'name') el = document.querySelector(`meta[name="${name}"]`);
      else el = document.querySelector(`meta[property="${name}"]`);

      if (el) el.setAttribute('content', content || '');
      else {
        const m = document.createElement('meta');
        if (attr === 'name') m.setAttribute('name', name);
        else m.setAttribute('property', name);
        m.setAttribute('content', content || '');
        document.head.appendChild(m);
      }
    };

    upsertMeta('name', 'description', description);
    upsertMeta('property', 'og:title', title);
    upsertMeta('property', 'og:description', description);
    const ogImage = postData.ogImage?.asset?.url || postData.mainImage?.asset?.url;
    if (ogImage) upsertMeta('property', 'og:image', ogImage);

    // canonical
    let canonical = document.querySelector("link[rel='canonical']");
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', `${import.meta.env.VITE_PUBLIC_URL || 'https://yourdomain.com'}/post/${postData.slug.current}`);

    return () => {
      // optional: cleanup if you want to restore defaults
    };
  }, [postData]);

  useEffect(() => {
    const query = `*[_type == "post" && slug.current == $slug][0]{
      ...,
      mainImage{ asset->{ _ref, url } },
      "authorName": author->name,
      "authorImage": author->image.asset->url,
      linkedPosts[]->{ title, slug },
      "linkedFrom": *[_type == "post" && references(^._id)]{ title, slug },
      body[]{
        ...,
        _type == "image" => {
          "asset": asset->{
            ...,
            "_ref": _id,
            "url": url
          }
        }
      }
    }`;

    sanityClient.fetch(query, { slug })
      .then((data) => setPostData(data))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <SkeletonPost />;
  if (!postData) return <div>Post not found.</div>;

  return (
    <article className="p-4 sm:p-8">
      <div className="container mx-auto max-w-4xl">
        {postData.mainImage?.asset && (
          <img
            src={postData.mainImage.asset?._ref ? srcFor(postData.mainImage.asset, 1400) : postData.mainImage.asset.url}
            srcSet={postData.mainImage.asset?._ref ? srcSetFor(postData.mainImage.asset, [800, 1200, 1600]) : undefined}
            sizes="(min-width: 1024px) 80vw, 100vw"
            alt={postData.title}
            className="w-full h-96 object-cover rounded-lg shadow-xl mb-8"
            loading="lazy"
          />
        )}
        <div className="bg-base-secondary rounded-lg shadow-xl p-8">
          <h1 className="text-4xl lg:text-5xl mb-4 font-bold text-text-primary">{postData.title}</h1>
          <div className="flex text-gray-400 items-center mb-8">
            {postData.authorImage && (
              <img src={postData.authorImage} alt={postData.authorName || ''} className="w-10 h-10 rounded-full" loading="lazy" />
            )}
            <p className="pl-4 text-lg">{postData.authorName || 'Anonymous'}</p>
          </div>
          <div className="prose prose-lg prose-invert max-w-none text-text-primary">
            <PortableText value={postData.body} components={portableTextComponents} />
          </div>
        </div>

        {/* Bi-directional Linking Section */}
        <div className="bg-base-secondary rounded-lg shadow-xl p-8 mt-8">
          <h3 className="text-2xl font-bold text-text-primary border-b border-gray-700 pb-4 mb-4">
            Explore Connections
          </h3>

          {postData.linkedPosts?.length > 0 && (
            <div className="mb-6">
              <h4 className="font-bold text-accent-secondary mb-2">Links To:</h4>
              <ul>
                {postData.linkedPosts.map((p) => (
                  <li key={p.slug.current} className="list-disc list-inside ml-2">
                    <Link to={`/post/${p.slug.current}`} className="text-accent-primary hover:underline">
                      {p.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {postData.linkedFrom?.length > 0 && (
            <div>
              <h4 className="font-bold text-accent-secondary mb-2">Linked From:</h4>
              <ul>
                {postData.linkedFrom.map((p) => (
                  <li key={p.slug.current} className="list-disc list-inside ml-2">
                    <Link to={`/post/${p.slug.current}`} className="text-accent-primary hover:underline">
                      {p.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
