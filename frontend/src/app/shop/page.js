import Image from 'next/image';
import Link from 'next/link';
import { getProducts } from '@/lib/strapi';

export const revalidate = 60;

export default async function ShopPage() {
  const data = await getProducts();
  const items = data?.data || [];

  return (
    <main style={{ padding: 24 }}>
      <h1>Shop</h1>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))',
        gap: 16
      }}>
        {items.map((p) => {
          const a = p.attributes;
          const img = a.images?.data?.[0]?.attributes;
          return (
            <Link
              key={p.id}
              href={`/shop/${a.slug}`}
              style={{
                border: '1px solid #eee',
                padding: 12,
                textDecoration: 'none',
                color: 'inherit'
              }}
            >
              {img && (
                <Image
                  src={img.url}
                  alt={img.alternativeText || a.title}
                  width={400}
                  height={300}
                  style={{ width: '100%', height: 'auto' }}
                />
              )}
              <h3>{a.title}</h3>
              <p>${Number(a.price).toFixed(2)}</p>
            </Link>
          );
        })}
      </div>
    </main>
  );
}
