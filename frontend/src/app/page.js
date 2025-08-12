import Hero from '@/components/Hero';
import NavSection from '@/components/NavSection';
import NewSection from '@/components/NewSection';

export default function Home() {
  return (
    <div className="min-h-screen font-sans">
      <Hero />
      <NavSection />
      <NewSection />
    </div>
  );
}
