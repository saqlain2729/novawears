import Link from "next/link";
import Image from "next/image";
import { Category } from "@/types";

export default function CategoryCard({ category }: { category: Category }) {
  return (
    <Link href={`/shop?category=${category.slug}`} className="group block">
      <div className="relative aspect-[3/4] overflow-hidden bg-ink">
        {category.image && (
          <Image
            src={category.image}
            alt={category.name}
            fill
            sizes="(max-width: 768px) 50vw, 33vw"
            className="object-cover opacity-70 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:opacity-90 group-hover:scale-[1.05]"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/10 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-6">
          <h3 className="font-display text-xl text-paper tracking-wide">{category.name}</h3>
          {category.description && (
            <p className="mt-1.5 text-sm text-silver line-clamp-2">{category.description}</p>
          )}
          <span className="mt-4 inline-flex items-center gap-1.5 text-[11px] tracking-widest2 uppercase text-paper border-b border-paper/60 pb-1 group-hover:border-paper transition-colors">
            Explore
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="transition-transform group-hover:translate-x-1">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </span>
        </div>
      </div>
    </Link>
  );
}
