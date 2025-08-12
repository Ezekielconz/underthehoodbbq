const STRAPI_URL = process.env.STRAPI_URL;
const STRAPI_TOKEN = process.env.STRAPI_TOKEN;

export function mediaURL(url) {
  if (!url) return '';
  return url.startsWith('http') ? url : `${STRAPI_URL}${url}`;
}

function bestMediaUrl(mediaLike) {
  if (!mediaLike) return null;
  const m = mediaLike?.data?.attributes || mediaLike;
  if (!m) return null;

  const formats = m.formats || {};
  let best = null;
  for (const f of Object.values(formats)) {
    if (!best || (f?.width ?? 0) > (best?.width ?? 0)) best = f;
  }
  const url = (best?.url || m.url) || null;
  return url ? mediaURL(url) : null;
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
    next: { revalidate: 60 },
    ...fetchOptions,
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Strapi ${res.status}: ${text || res.statusText}`);
  }
  return res.json();
}

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

export async function getGlobal() {
  return strapiFetch('/global', { populate: 'logo' });
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

export async function getHome() {
  return strapiFetch(
    '/home',
    {
      'populate[heroTitle]': 'true',
      'populate[heroGraphic]': 'true',
      'fields[0]': 'button1Text',
      'fields[1]': 'button1Url',
      'fields[2]': 'button2Text',
      'fields[3]': 'button2Url',

      // --- navSection + nested components ---
      'populate[navSection]': 'true',
      'populate[navSection][populate]': 'deep',
      'populate[navSection][populate][leftItems]': 'true',
      'populate[navSection][populate][rightItems]': 'true',
      'populate[navSection][populate][image]': 'true',
      'populate[navSection][populate][product]': 'true', // <-- ensure product id is there

      ...(process.env.NODE_ENV !== 'production' ? { publicationState: 'preview' } : {}),
    },
    { next: { revalidate: 0 } }
  );
}

// Normalize item: either direct fields or { attributes: { ... } } or { data:{attributes:{...}} }
function _pluckItem(it) {
  if (!it) return null;
  const a = it?.attributes || it?.data?.attributes || it;
  const label = String(a?.label ?? '').trim();
  const url = a?.url ?? null;
  if (!label) return null;
  return { label, href: url || null };
}

export function extractHomeHero(homeRes) {
  const d = homeRes?.data || {};
  const heroTitle   = d?.heroTitle   ?? d?.attributes?.heroTitle   ?? null;
  const heroGraphic = d?.heroGraphic ?? d?.attributes?.heroGraphic ?? null;

  const titleImg   = bestMediaUrl(heroTitle);
  const graphicImg =
    Array.isArray(heroGraphic) ? bestMediaUrl(heroGraphic[0]) : bestMediaUrl(heroGraphic);

  return {
    titleImg: titleImg || null,
    graphicImg: graphicImg || null,
    primaryText:   d?.button1Text ?? d?.attributes?.button1Text ?? 'Shop Now',
    primaryUrl:    d?.button1Url  ?? d?.attributes?.button1Url  ?? '/shop',
    secondaryText: d?.button2Text ?? d?.attributes?.button2Text ?? 'BBQ Services',
    secondaryUrl:  d?.button2Url  ?? d?.attributes?.button2Url  ?? '/bbqservices',
  };
}

export async function getFooter() {
  return strapiFetch('/footer', {
    'populate[nameIcon]': 'true',
    'populate[emailIcon]': 'true',
    'populate[phoneIcon]': 'true',
    'populate[socialLinks][populate]': 'icon',
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

/* ---------------------------------------------------------------------------------------
 * NewSection helpers
 * - Prefer product selected on Home.navSection.product
 * - Fallback to latest product
 * -------------------------------------------------------------------------------------*/

function extractSelectedProductIdFromHome(homeRes) {
  const ns =
    homeRes?.data?.navSection ??
    homeRes?.data?.attributes?.navSection ??
    {};
  const prod = ns?.product;
  return prod?.id ?? prod?.data?.id ?? null;
}

export async function getNewSectionProduct() {
  // Try to read selected product id from Home
  const home = await getHome().catch(() => null);
  const selectedId = extractSelectedProductIdFromHome(home);

  const params = {
    populate: 'category,art',
    'fields[0]': 'title',
    'fields[1]': 'subTitle',
    'fields[2]': 'slug',
    'fields[3]': 'colour',
    'fields[4]': 'glutenFree',
    'fields[5]': 'dairyFree',
    'fields[6]': 'sugarFree',
    'fields[7]': 'veganFriendly',
    publicationState: 'live',
    'pagination[pageSize]': 1,
  };

  if (selectedId) {
    params['filters[id][$eq]'] = selectedId;
  } else {
    params['sort[0]'] = 'createdAt:desc';
  }

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
    category: a?.category?.data?.attributes?.name || '',
    diet: {
      glutenFree: !!a.glutenFree,
      dairyFree: !!a.dairyFree,
      sugarFree: !!a.sugarFree,
      veganFriendly: !!a.veganFriendly,
    },
    art: bestMediaUrl(a.art) || null,
  };
}

/* (Optional: keep your previous helpers if you still want them elsewhere) */
export async function getLatestProductLite() {
  const res = await strapiFetch('/products', {
    populate: 'category,art',
    'fields[0]': 'title',
    'fields[1]': 'subTitle',
    'fields[2]': 'slug',
    'fields[3]': 'colour',
    'fields[4]': 'glutenFree',
    'fields[5]': 'dairyFree',
    'fields[6]': 'sugarFree',
    'fields[7]': 'veganFriendly',
    sort: 'createdAt:desc',
    publicationState: 'live',
    'pagination[pageSize]': 1,
  });
  return res?.data?.[0] || null;
}

export function extractLatestProduct(p) {
  const a = p?.attributes || p || {};
  return {
    title: a.title || '',
    subTitle: a.subTitle || a.subtitle || '',
    slug: a.slug || '',
    colour: a.colour || '#F15921',
    category: a?.category?.data?.attributes?.name || '',
    diet: {
      glutenFree: !!a.glutenFree,
      dairyFree: !!a.dairyFree,
      sugarFree: !!a.sugarFree,
      veganFriendly: !!a.veganFriendly,
    },
    art: bestMediaUrl(a.art) || null,
  };
}
