import Image from 'next/image';
import Link from 'next/link';
import { getProducts } from '@/lib/strapi';

export const revalidate = 60;

export default async function ShopPage() {
  let res;
  try {
    res = await getProducts();
  } catch {
    res = { data: [] };
  }
  const items = Array.isArray(res?.data) ? res.data : [];

  return (
    <main style={{ padding: 24 }}>
      <h1>Shop</h1>

      {items.length === 0 && (
        <p>No products yet. (Make sure at least one product is <b>Published</b> in Strapi.)</p>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))', gap: 16 }}>
        {items.map((p) => {
          const a = p?.attributes ?? {};
          const img = a.images?.data?.[0]?.attributes ?? null;
          const slug = a.slug ?? String(p?.id ?? '');
          const title = a.title ?? 'Untitled';
          const price = typeof a.price === 'number' ? a.price : Number(a.price || 0);

          return (
            <Link
              key={p?.id ?? slug}
              href={slug ? `/shop/${slug}` : '#'}
              style={{ border: '1px solid #eee', padding: 12, textDecoration: 'none', color: 'inherit' }}
            >
              {img ? (
                <Image
                  src={img.url}
                  alt={img.alternativeText || title}
                  width={400}
                  height={300}
                  style={{ width: '100%', height: 'auto' }}
                />
              ) : (
                <div style={{ width: '100%', aspectRatio: '4/3', background: '#f6f6f6' }} />
              )}
              <h3>{title}</h3>
              <p>${price.toFixed(2)}</p>
            </Link>
          );
        })}
      </div>
    </main>
  );
}
