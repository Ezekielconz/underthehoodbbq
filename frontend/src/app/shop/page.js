import Image from 'next/image';
import styles from './ShopPage.module.css';
import ShopPageClient from './ShopPageClient';
import { getProducts } from '@/lib/strapi';

export const metadata = { title: 'Shop' };

export default async function ShopPage() {
  const products = await getProducts();
  return (
    <main className={styles.page}>
      <ShopPageClient products={products} />
    </main>
  );
}
