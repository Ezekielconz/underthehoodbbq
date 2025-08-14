// app/page.js
import Hero from '@/components/Hero';
import NavSection from '@/components/NavSection';
import NewSection from '@/components/NewSection';

export const revalidate = 60;   // page-level ISR fallback

export default function Home() {
  return (
    <div className="min-h-screen font-sans">
      <Hero />
      <NavSection />
      <NewSection />
    </div>
  );
}