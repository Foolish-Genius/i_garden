import { createClient } from '@sanity/client';

export default createClient({
  projectId: import.meta.env.VITE_SANITY_PROJECT_ID,
  dataset: import.meta.env.VITE_SANITY_DATASET,
  useCdn: true, // false = fresh data
  apiVersion: '2025-09-24',
});