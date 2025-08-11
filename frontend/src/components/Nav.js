import Navbar from './Navbar';
import { getGlobal } from '@/lib/strapi';

export default async function Nav() {
  let logo = null;
  try {
    const res = await getGlobal();
    const a = res?.data?.attributes?.logo?.data?.attributes;
    if (a) {
      logo = {
        url: a.url,
        alt: a.alternativeText || 'Under The Hood BBQ',
        width: a.width || 160,
        height: a.height || 48,
      };
    }
  } catch (e) {
    // fine to fall back to text logo
  }
  return <Navbar logo={logo} />;
}
