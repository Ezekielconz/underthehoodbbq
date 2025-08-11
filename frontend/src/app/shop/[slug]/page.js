import Image from 'next/image';
import { getProductBySlug } from '@/lib/strapi';
import Link from 'next/link';

export async function generateMetadata({ params }) {
  const product = await getProductBySlug(params.slug);
  const title = product?.attributes?.title || 'Product';
  return { title: `${title} | Under The Hood BBQ` };
}

export default async function ProductPage({ params }) {
  const product = await getProductBySlug(params.slug);
  if (!product) return <main style={{ padding: 24 }}>Not found</main>;

  const { title, description, images, price } = product.attributes;
  const imgs = images?.data || [];

  return (
    <main style={{ padding: 24 }}>
      <Link href="/shop">← Back to shop</Link>
      <h1>{title}</h1>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        <div>
          {imgs.map((img) => {
            const a = img.attributes;
            return (
              <Image
                key={img.id}
                src={a.url}
                alt={a.alternativeText || title}
                width={800}
                height={600}
                style={{ width: '100%', height: 'auto', marginBottom: 12 }}
              />
            );
          })}
        </div>
        <div>
          <p style={{ fontSize: 24, fontWeight: 600 }}>${Number(price).toFixed(2)}</p>
          {/* description is plain text in your model */}
          <p style={{ whiteSpace: 'pre-wrap' }}>{description}</p>
        </div>
      </div>
    </main>
  );
}
