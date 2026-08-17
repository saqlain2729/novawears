"use client";

import { useState } from "react";
import Image from "next/image";

export default function ProductGallery({ images, name }: { images: string[]; name: string }) {
  const [active, setActive] = useState(0);
  const shown = images.length ? images : [""];

  return (
    <div>
      <div className="relative aspect-square bg-paper-dim overflow-hidden">
        {shown[active] && (
          <Image
            key={active}
            src={shown[active]}
            alt={name}
            fill
            priority
            className="object-cover animate-fade-in"
          />
        )}
      </div>
      {shown.length > 1 && (
        <div className="flex gap-2 mt-3">
          {shown.map((img, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`relative w-16 h-16 shrink-0 bg-paper-dim overflow-hidden border ${
                active === i ? "border-ink" : "border-transparent"
              }`}
            >
              {img && <Image src={img} alt="" fill className="object-cover" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
