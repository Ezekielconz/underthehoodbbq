// src/lib/strapi.js
const STRAPI_URL = (process.env.STRAPI_URL || '').replace(/\/$/, '');
const STRAPI_TOKEN = process.env.STRAPI_TOKEN || '';

export function mediaURL(url) {
  if (!url) return '';
  return url.startsWith('http') ? url : `${STRAPI_URL}${url}`;
}

/**
 * Pick the best URL from a Strapi media object (v4/v5, with or without .data)
 * Accepts:
 *  - { url, formats? }
 *  - { data: { attributes: { url, formats? } } }
 */
function bestMediaUrl(mediaLike) {
  if (!mediaLike) return null;
  const m = mediaLike?.data?.attributes || mediaLike?.attributes || mediaLike;
  if (!m) return null;

  const formats = m.formats || {};
  let best = null;
  for (const f of Object.values(formats)) {
    if (!best || (f?.width ?? 0) > (best?.width ?? 0)) best = f;
  }
  const url = (best?.url || m.url) || null;
  return url ? mediaURL(url) : null;
}

/** Get the best image from a "multiple media" field that may be an array or {data: []} */
function firstImageUrlFrom(images) {
  if (!images) return null;
  const arr = Array.isArray(images?.data)
    ? images.data
    : (Array.isArray(images) ? images : []);
  if (arr.length) return bestMediaUrl(arr[0]);
  return bestMediaUrl(images);
}

function toQuery(params = {}) {
  const qs = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v == null) return;
    if (Array.isArray(v)) v.forEach((vv) => qs.append(k, vv));
    else if (typeof v === 'object') {
      Object.entries(v).forEach(([kk, vv]) => {
        if (vv != null) qs.append(`${k}[${kk}]`, String(vv));
      });
    } else {
      qs.append(k, String(v));
    }
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
    // Default ISR cache for 60s; caller can override via fetchOptions.next
    next: { revalidate: 60 },
    ...fetchOptions,
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Strapi ${res.status}: ${text || res.statusText}`);
  }
  return res.json();
}

/* -----------------------------------------------------------------------------
 * Product helpers
 * ---------------------------------------------------------------------------*/

function normalizeNutrition(nArr) {
  const arr = Array.isArray(nArr) ? nArr : [];
  return arr.map((n) => ({
    servingPerPacket: n?.servingPerPacket ?? null,
    servingSize: n?.servingSize || '',
    energy: n?.energy ?? null,
    protein: n?.protein ?? null,
    fat: n?.fat ?? null,
    saturated: n?.saturated ?? null,
    carbs: n?.carbs ?? null,
    sugars: n?.sugars ?? null,
    sodiums: n?.sodiums ?? null,
    notes: n?.notes || '',
  }));
}

function normalizeProduct(node) {
  if (!node) return null;
  const id = node.id ?? node.documentId ?? null;
  const a = node.attributes || node;

  return {
    id,
    title: a.title || '',
    subTitle: a.subTitle || a.subtitle || '',
    slug: a.slug || '',
    description: a.description || '',
    price: a.price ?? null,
    image: firstImageUrlFrom(a.images) || bestMediaUrl(a.art) || null,

    // extra fields
    category: a?.category?.data?.attributes?.name || a?.category?.name || '',
    ingredients: a?.ingredients || '',
    nutrition: normalizeNutrition(a?.nutrition),
    colour: a?.colour || '',
  };
}

export function extractProducts(res) {
  const list = res?.data ?? (Array.isArray(res) ? res : []);
  return list.map(normalizeProduct).filter(Boolean);
}

export async function getProducts() {
  const data = await strapiFetch('/products', {
    'populate[0]': 'images',
    'populate[1]': 'art',
    'populate[2]': 'category',
    'populate[3]': 'nutrition',

    // top-level fields only
    'fields[0]': 'title',
    'fields[1]': 'subTitle',
    'fields[2]': 'slug',
    'fields[3]': 'price',
    'fields[4]': 'description',
    'fields[5]': 'ingredients',
    'fields[6]': 'colour',

    'sort[0]': 'title:asc',
    publicationState: 'live',
    'pagination[pageSize]': 100,
  });
  return extractProducts(data);
}

export async function getProductBySlug(slug) {
  const data = await strapiFetch('/products', {
    'filters[slug][$eq]': slug,
    'populate[0]': 'images',
    'populate[1]': 'art',
    'populate[2]': 'category',
    'populate[3]': 'nutrition',

    // top-level fields only
    'fields[0]': 'title',
    'fields[1]': 'subTitle',
    'fields[2]': 'slug',
    'fields[3]': 'price',
    'fields[4]': 'description',
    'fields[5]': 'ingredients',
    'fields[6]': 'colour',

    publicationState: 'live',
    'pagination[pageSize]': 1,
  });
  const raw = data?.data?.[0] || null;
  return raw ? normalizeProduct(raw) : null;
}

export async function getCategories() {
  return strapiFetch('/categories', { 'sort[0]': 'name:asc' });
}

export async function getGlobal() {
  return strapiFetch('/global', { 'populate[0]': 'logo' });
}

export function extractLogo(globalRes) {
  const flat = globalRes?.data?.logo;
  if (flat?.url || flat?.formats) {
    return {
      url: bestMediaUrl(flat),
      alt: flat.alternativeText || 'Under The Hood BBQ',
      width: flat.width || 160,
      height: flat.height || 48,
    };
  }
  const v4 = globalRes?.data?.attributes?.logo;
  const url = bestMediaUrl(v4);
  return url
    ? {
        url,
        alt: v4?.data?.attributes?.alternativeText || 'Under The Hood BBQ',
        width: v4?.data?.attributes?.width || 160,
        height: v4?.data?.attributes?.height || 48,
      }
    : null;
}

export function extractGlobals(res) {
  const d = res?.data || {};
  return {
    name:  d.name  ?? d.attributes?.name  ?? 'Under The Hood BBQ',
    email: d.email ?? d.attributes?.email ?? '',
    phone: d.phone ?? d.attributes?.phone ?? '',
  };
}

/* -----------------------------------------------------------------------------
 * Home + Nav Section helpers (hero removed)
 * ---------------------------------------------------------------------------*/

export async function getHome() {
  return strapiFetch(
    '/home',
    {
      // Only navSection and its subfields now
      'populate[0]': 'navSection',
      'populate[1]': 'navSection.leftItems',
      'populate[2]': 'navSection.rightItems',
      'populate[3]': 'navSection.image',
      // include product so its id/documentId is definitely present
      'populate[4]': 'navSection.product',
      ...(process.env.NODE_ENV !== 'production' ? { publicationState: 'preview' } : {}),
    }
  );
}

function _pluckItem(it) {
  if (!it) return null;
  const a = it?.attributes || it?.data?.attributes || it;
  const label = String(a?.label ?? '').trim();
  const url = a?.url ?? null;
  if (!label) return null;
  return { label, href: url || null };
}

export async function getFooter() {
  return strapiFetch('/footer', {
    'populate[0]': 'nameIcon',
    'populate[1]': 'emailIcon',
    'populate[2]': 'phoneIcon',
    'populate[3]': 'socialLinks',
    'populate[4]': 'socialLinks.icon',
  });
}

export function extractFooter(res) {
  const d = res?.data || {};
  const socials = Array.isArray(d?.socialLinks)
    ? d.socialLinks
        .map((s) => ({
          label: s?.label || '',
          url: s?.url || '',
          icon: bestMediaUrl(s?.icon),
        }))
        .filter((s) => s.url && s.label)
    : [];
  return {
    icons: {
      name:  bestMediaUrl(d?.nameIcon),
      email: bestMediaUrl(d?.emailIcon),
      phone: bestMediaUrl(d?.phoneIcon),
    },
    socials,
  };
}

/* -----------------------------------------------------------------------------
 * NewSection (homepage featured product) helpers
 * ---------------------------------------------------------------------------*/

function extractSelectedProductIdFromHome(homeRes) {
  const root = homeRes?.data || {};
  const ns =
    root.navSection ??
    root.attributes?.navSection ??
    {};
  const prod = ns?.product;

  const id =
    prod?.id ??
    prod?.data?.id ??
    (typeof prod === 'number' ? prod : null);

  const documentId =
    prod?.documentId ??
    prod?.data?.documentId ??
    null;

  return { id, documentId };
}

export async function getNewSectionProduct() {
  const isDev = process.env.NODE_ENV !== 'production';

  const home = await getHome().catch(() => null);
  const selected = extractSelectedProductIdFromHome(home);

  const params = {
    'populate[0]': 'category',
    'populate[1]': 'art',
    'fields[0]': 'title',
    'fields[1]': 'subTitle',
    'fields[2]': 'slug',
    'fields[3]': 'colour',
    'fields[4]': 'glutenFree',
    'fields[5]': 'dairyFree',
    'fields[6]': 'sugarFree',
    'fields[7]': 'veganFriendly',
    publicationState: isDev ? 'preview' : 'live',
    'pagination[pageSize]': 1,
  };

  if (selected?.id) {
    params['filters[id][$eq]'] = selected.id;
  } else if (selected?.documentId) {
    params['filters[documentId][$eq]'] = selected.documentId;
  } else {
    params['sort[0]'] = 'createdAt:desc';
  }

  // IMPORTANT: no { revalidate: 0 } — let ISR cache this like /shop
  const res = await strapiFetch('/products', params);
  return res?.data?.[0] || null;
}

export function extractNewSectionProduct(p) {
  const a = p?.attributes || p || {};
  return {
    title: a.title || '',
    subTitle: a.subTitle || a.subtitle || '',
    slug: a.slug || '',
    colour: a.colour || '#F15921',
    category: a?.category?.data?.attributes?.name || a?.category?.name || '',
    diet: {
      glutenFree: !!a.glutenFree,
      dairyFree: !!a.dairyFree,
      sugarFree: !!a.sugarFree,
      veganFriendly: !!a.veganFriendly,
    },
    art: a.art ? (a.art.data ? bestMediaUrl(a.art) : bestMediaUrl(a.art)) : null,
  };
}

export function extractNavSection(homeRes) {
  const ns =
    homeRes?.data?.navSection ??
    homeRes?.data?.attributes?.navSection ??
    {};

  // Cope with variations: leftItems vs leftitems, optional .data arrays
  const leftRaw =
    (Array.isArray(ns.leftItems) && ns.leftItems) ||
    (Array.isArray(ns.leftitems) && ns.leftitems) ||
    (Array.isArray(ns?.leftItems?.data) && ns.leftItems.data) ||
    [];
  const rightRaw =
    (Array.isArray(ns.rightItems) && ns.rightItems) ||
    (Array.isArray(ns.rightitems) && ns.rightitems) ||
    (Array.isArray(ns?.rightItems?.data) && ns.rightItems.data) ||
    [];

  const left  = leftRaw.map(_pluckItem).filter(Boolean);
  const right = rightRaw.map(_pluckItem).filter(Boolean);

  const centerImg = bestMediaUrl(ns.image) || null;

  return { left, right, centerImg };
}
