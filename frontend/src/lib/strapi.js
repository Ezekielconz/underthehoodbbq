const STRAPI_URL = process.env.STRAPI_URL;
const STRAPI_TOKEN = process.env.STRAPI_TOKEN;

export function mediaURL(url) {
  if (!url) return '';
  return url.startsWith('http') ? url : `${STRAPI_URL}${url}`;
}

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
    next: { revalidate: 60 },
    ...fetchOptions,
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Strapi ${res.status}: ${text || res.statusText}`);
  }
  return res.json();
}

/* Products */
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

/* Global (single type, v5 shape) */
export async function getGlobal() {
  return strapiFetch('/global', { 'populate[logo]': 'true' });
}

export function extractLogo(globalRes) {
  const l = globalRes?.data?.logo; // v5 flattened
  if (l?.url) {
    return {
      url: mediaURL(l.url),
      alt: l.alternativeText || 'Under The Hood BBQ',
      width: l.width || 160,
      height: l.height || 48,
    };
  }
  // v4 fallback
  const l2 = globalRes?.data?.attributes?.logo?.data?.attributes;
  return l2?.url
    ? {
        url: mediaURL(l2.url),
        alt: l2.alternativeText || 'Under The Hood BBQ',
        width: l2.width || 160,
        height: l2.height || 48,
      }
    : null;
}
