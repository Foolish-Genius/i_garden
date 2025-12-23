import { createImageUrlBuilder } from '@sanity/image-url';
import sanityClient from '../sanityClient';

const builder = createImageUrlBuilder(sanityClient);

export function urlFor(source) {
  return builder.image(source);
}

export function srcFor(source, width = 800) {
  if (!source) return '';
  return builder.image(source).width(width).auto('format').url();
}

export function srcSetFor(source, widths = [400, 800, 1200]) {
  if (!source) return '';
  return widths
    .map((w) => `${builder.image(source).width(w).auto('format').url()} ${w}w`)
    .join(', ');
}
