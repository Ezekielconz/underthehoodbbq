import Image from 'next/image';
import Link from 'next/link';
import { getHome, extractHomeHero, getGlobal, extractLogo } from '@/lib/strapi';

export default async function Hero() {
  let hero = {
    titleImg: null,
    graphicImg: null,
    primaryText: 'Shop Now',
    primaryUrl: '/shop',
    secondaryText: 'BBQ Services',
    secondaryUrl: '/bbqservices',
  };

  try {
    const [homeRes, globalRes] = await Promise.all([
      getHome().catch(() => null),
      getGlobal().catch(() => null),
    ]);

    if (homeRes) hero = { ...hero, ...extractHomeHero(homeRes) };

    // Fallback: if no heroTitle image, use the site logo
    if (!hero.titleImg && globalRes) {
      const logo = extractLogo(globalRes);
      if (logo?.url) hero.titleImg = logo.url;
    }
  } catch {}

  return (
    <section className="relative isolate overflow-visible bg-[var(--ink)] text-white">
      <div className="mx-auto max-w-[1100px] px-4 sm:px-6 md:px-8 py-14 sm:py-20 md:py-24 relative">
        <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-10 md:gap-12">
          {/* LEFT */}
          <div className="z-10">
            {hero.titleImg ? (
              <Image
                src={hero.titleImg}
                alt="Under The Hood BBQ"
                width={720}
                height={300}
                priority
                className="w-[min(90vw,560px)] h-auto"
              />
            ) : (
              <h1 className="font-hand text-5xl sm:text-6xl font-bold tracking-tight">
                Under The Hood BBQ
              </h1>
            )}

            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <Link
                href={hero.primaryUrl}
                className="inline-flex items-center justify-center rounded-full bg-[var(--brand)] text-white px-6 py-3 text-base font-semibold uppercase tracking-wide hover:brightness-110 active:translate-y-[1px] transition"
              >
                {hero.primaryText}
              </Link>
              <Link
                href={hero.secondaryUrl}
                className="inline-flex items-center justify-center rounded-full border border-[var(--brand)] text-[var(--brand)] px-6 py-3 text-base font-semibold uppercase tracking-wide hover:bg-[var(--brand)] hover:text-white active:translate-y-[1px] transition"
              >
                {hero.secondaryText}
              </Link>
            </div>
          </div>

          {/* RIGHT – graphic overlaps next section */}
          <div className="relative md:static">
            {hero.graphicImg ? (
              <Image
                src={hero.graphicImg}
                alt=""
                width={720}
                height={720}
                priority
                className="pointer-events-none select-none w-[min(90vw,600px)] h-auto md:w-[560px] md:absolute md:right-0 md:bottom-[-80px]"
              />
            ) : (
              <Image
                src="/hero.svg"
                alt=""
                width={720}
                height={720}
                priority
                className="pointer-events-none select-none w-[min(90vw,600px)] h-auto md:w-[560px] md:absolute md:right-0 md:bottom-[-80px]"
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
