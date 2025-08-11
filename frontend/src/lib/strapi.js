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

// --- Home (single type) ---
export async function getHome() {
  return strapiFetch('/home', {
    'populate[heroTitle]': 'true',
    'populate[heroGraphic]': 'true',
    'fields[0]': 'button1Text',
    'fields[1]': 'button1Url',
    'fields[2]': 'button2Text',
    'fields[3]': 'button2Url',
  });
}

export function extractHomeHero(homeRes) {
  const d = homeRes?.data || {};

  // heroTitle (single media)
  const heroTitleUrl =
    d?.heroTitle?.url ||                              
    d?.attributes?.heroTitle?.data?.attributes?.url;  

  // heroGraphic (multiple media → pick first)
  let heroGraphicUrl = null;
  if (Array.isArray(d?.heroGraphic) && d.heroGraphic.length) {
    heroGraphicUrl = d.heroGraphic[0]?.url;          
  } else {
    const arr = d?.attributes?.heroGraphic?.data;     
    if (Array.isArray(arr) && arr.length) {
      heroGraphicUrl = arr[0]?.attributes?.url;
    } else if (d?.heroGraphic?.url) {
      heroGraphicUrl = d.heroGraphic.url;           
    }
  }

  return {
    titleImg: heroTitleUrl ? mediaURL(heroTitleUrl) : null,
    graphicImg: heroGraphicUrl ? mediaURL(heroGraphicUrl) : null,
    primaryText: d?.button1Text ?? d?.attributes?.button1Text ?? 'Shop Now',
    primaryUrl:  d?.button1Url  ?? d?.attributes?.button1Url  ?? '/shop',
    secondaryText: d?.button2Text ?? d?.attributes?.button2Text ?? 'BBQ Services',
    secondaryUrl:  d?.button2Url  ?? d?.attributes?.button2Url  ?? '/bbqservices',
  };
}
