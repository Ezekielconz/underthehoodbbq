// src/lib/strapi.js
const STRAPI_URL = process.env.STRAPI_URL;
const STRAPI_TOKEN = process.env.STRAPI_TOKEN;

// Turn relative Strapi media URLs into absolute URLs
export function mediaURL(url) {
  if (!url) return '';
  return url.startsWith('http') ? url : `${STRAPI_URL}${url}`;
}

// Build bracket-style query strings, e.g. filters[slug][$eq]
function toQuery(params = {}) {
  const qs = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v == null) return;
    if (Array.isArray(v)) v.forEach((vv) => qs.append(k, vv));
    else qs.append(k, String(v));
  });
  const s = qs.toString();
  return s ? `?${s}` : '';
}

export async function strapiFetch(path, params = {}, fetchOptions = {}) {
  if (!STRAPI_URL) throw new Error('Missing STRAPI_URL');

  const res = await fetch(`${STRAPI_URL}/api${path}${toQuery(params)}`, {
    headers: {
      Accept: 'application/json',
      ...(STRAPI_TOKEN ? { Authorization: `Bearer ${STRAPI_TOKEN}` } : {}),
    },
    // default ISR cache
    next: { revalidate: 60 },
    ...fetchOptions,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Strapi ${res.status}: ${text || res.statusText}`);
  }
  return res.json();
}

/* ---------- Products ---------- */

export async function getProducts() {
  return strapiFetch('/products', {
    populate: 'images,category',
    'fields[0]': 'title',
    'fields[1]': 'slug',
    'fields[2]': 'price',
    'fields[3]': 'description',
    'sort[0]': 'title:asc',
    publicationState: 'live',
    'pagination[pageSize]': 100,
  });
}

export async function getProductBySlug(slug) {
  const data = await strapiFetch('/products', {
    'filters[slug][$eq]': slug,
    populate: 'images,category',
    publicationState: 'live',
    'pagination[pageSize]': 1,
  });
  return data?.data?.[0] || null;
}

export async function getCategories() {
  return strapiFetch('/categories', { 'sort[0]': 'name:asc' });
}

/* ---------- Global (single type) ---------- */

export async function getGlobal() {
  // If you named it "site" instead of "global", change the path
  return strapiFetch('/global', {
    'populate[logo]': 'true',
    'populate[logo][fields][0]': 'url',
    'populate[logo][fields][1]': 'alternativeText',
    'populate[logo][fields][2]': 'width',
    'populate[logo][fields][3]': 'height',
  });
}

// Convenience extractor for your Navbar server wrapper
export function extractLogo(globalRes) {
  const a = globalRes?.data?.attributes;
  const l = a?.logo?.data?.attributes;
  if (!l) return null;
  return {
    url: mediaURL(l.url),
    alt: l.alternativeText || 'Under The Hood BBQ',
    width: l.width || 160,
    height: l.height || 48,
  };
}
