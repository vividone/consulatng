import { Check } from "lucide-react";

type Props = {
  title: string;
  description: string;
  bullets?: string[];
};

export function ServiceItem({ title, description, bullets }: Props) {
  return (
    <article className="rounded-2xl border border-grey-200 bg-white p-7 transition hover:shadow-md">
      <h3 className="font-display text-xl font-bold text-grey-900">{title}</h3>
      <p className="mt-3 text-[15px] leading-relaxed text-grey-700">{description}</p>
      {bullets && bullets.length > 0 && (
        <ul className="mt-4 space-y-2 text-[15px] text-grey-700">
          {bullets.map((b) => (
            <li key={b} className="flex items-start gap-2">
              <Check className="mt-1 h-4 w-4 shrink-0 text-accent" />
              <span>{b}</span>
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}
