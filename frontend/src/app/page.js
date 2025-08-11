import Hero from '@/components/Hero';

export default function Home() {
  return (
    <div className="min-h-screen font-sans">
      <Hero />
      {/* Next section just to show the overlap */}
      <section className="relative z-0 bg-[var(--background)] text-[var(--ink)]">
        <div className="mx-auto max-w-[1100px] px-4 sm:px-6 md:px-8 py-16 sm:py-24">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">Featured Products</h2>
          <p className="opacity-80">
            We’ll drop product cards here next. That hero graphic should peek into this section on desktop.
          </p>
        </div>
      </section>
    </div>
  );
}
