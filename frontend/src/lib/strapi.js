const STRAPI_URL = process.env.STRAPI_URL;
const STRAPI_TOKEN = process.env.STRAPI_TOKEN;

// Params are passed using bracketed keys like 'filters[slug][$eq]'
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
  const res = await fetch(`${STRAPI_URL}/api${path}${toQuery(params)}`, {
    headers: { Authorization: `Bearer ${STRAPI_TOKEN}` },
    next: { revalidate: 60 },
    ...fetchOptions,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Strapi ${res.status}: ${text}`);
  }
  return res.json();
}

export async function getProducts() {
  return strapiFetch('/products', {
    'populate[images][fields][0]': 'url',
    'populate[images][fields][1]': 'alternativeText',
    'populate[category][fields][0]': 'name',
    'populate[category][fields][1]': 'slug',
    'sort[0]': 'title:asc',
  });
}

export async function getProductBySlug(slug) {
  const data = await strapiFetch('/products', {
    'filters[slug][$eq]': slug,
    'populate[images]': 'true',
    'populate[category]': 'true',
    'publicationState': 'live',
    'pagination[pageSize]': 1,
  });
  return data?.data?.[0] || null;
}

export async function getCategories() {
  return strapiFetch('/categories', { 'sort[0]': 'name:asc' });
}


export async function getGlobal() {
  return strapiFetch('/global', { 'populate[logo]': 'true' });
}
