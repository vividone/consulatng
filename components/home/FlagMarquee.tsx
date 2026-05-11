const COUNTRIES = [
  "🇳🇬", "🇬🇧", "🇫🇷", "🇳🇱", "🇺🇸", "🇩🇪", "🇮🇳", "🇨🇳",
  "🇦🇪", "🇿🇦", "🇯🇵", "🇧🇷", "🇮🇹", "🇪🇸", "🇨🇦", "🇰🇷",
  "🇸🇬", "🇸🇪", "🇦🇺", "🇲🇽", "🇧🇪", "🇮🇪", "🇨🇭", "🇵🇹",
];

export function FlagMarquee() {
  // duplicate the list so the loop is seamless
  const loop = [...COUNTRIES, ...COUNTRIES];

  return (
    <div
      aria-label="Countries we serve"
      className="relative border-y border-white/10 bg-white/[0.04] py-5 backdrop-blur-sm"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-primary-dark to-transparent"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-primary-dark to-transparent"
      />
      <div className="overflow-hidden">
        <ul className="flex w-max animate-scroll-x items-center gap-6 sm:gap-10">
          {loop.map((flag, i) => (
            <li
              key={i}
              className="shrink-0 select-none text-2xl leading-none opacity-90 transition hover:scale-110 hover:opacity-100 sm:text-3xl"
              aria-hidden
            >
              {flag}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
