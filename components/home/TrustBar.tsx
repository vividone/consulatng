import Image from "next/image";

type Client = {
  name: string;
  src: string;
  width: number;
  height: number;
};

const CLIENTS: Client[] = [
  { name: "Anotech",          src: "/clients/anotech.webp",                 width: 264, height: 65 },
  { name: "FairMoney",        src: "/clients/fairmoney.webp",               width: 300, height: 66 },
  { name: "Spie",             src: "/clients/Spie.webp",                    width: 186, height: 90 },
  { name: "Euro Engineering", src: "/clients/4-client-euro-engineer.webp",  width: 167, height: 90 },
  { name: "PA",               src: "/clients/pa.webp",                      width: 157, height: 90 },
  { name: "The White Baker",  src: "/clients/ThewhiteBaker.webp",           width: 300, height: 86 },
  { name: "Design & Print",   src: "/clients/5-client-design-print-set.webp", width: 191, height: 77 },
  { name: "Lilygate",         src: "/clients/6-client-lilygate.webp",       width: 115, height: 51 },
  { name: "Fortiori",         src: "/clients/7-client-fortiori.webp",       width: 123, height: 53 },
  { name: "Pro Expa",         src: "/clients/8-client-pro-expa.webp",       width: 116, height: 82 },
  { name: "HB",               src: "/clients/9-client-HB.webp",             width:  95, height: 79 },
  { name: "Solicitors",       src: "/clients/10-client-solicitors.webp",    width: 106, height: 59 },
  { name: "WellStaff",        src: "/clients/1-client-well-staff.webp",     width: 111, height: 70 },
];

export function TrustBar() {
  const loop = [...CLIENTS, ...CLIENTS];
  return (
    <section className="border-y border-grey-200 bg-grey-50 py-10 sm:py-12">
      <div className="container-prose">
        <p className="text-center text-xs font-semibold uppercase tracking-[0.18em] text-grey-500 sm:text-sm">
          Trusted by Leading Organisations Across the Globe
        </p>
        <div className="relative mt-6 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_15%,black_85%,transparent)] sm:mt-8">
          <ul className="flex w-max animate-scroll-x items-center gap-10 sm:gap-14">
            {loop.map((client, i) => (
              <li
                key={`${client.name}-${i}`}
                className="flex h-10 shrink-0 items-center sm:h-12"
                aria-label={client.name}
              >
                <Image
                  src={client.src}
                  alt={client.name}
                  width={client.width}
                  height={client.height}
                  className="h-full w-auto object-contain opacity-60 transition duration-300 hover:opacity-100"
                />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
