// src/components/Nav.js
import Navbar from './Navbar';
import { getGlobal, extractLogo } from '@/lib/strapi';

export default async function Nav() {
  let logo = null;
  try {
    const res = await getGlobal();
    logo = extractLogo(res);
  } catch {}
  return <Navbar logo={logo} />;
}
