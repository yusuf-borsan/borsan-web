"use client";

import { useState } from "react";
import Image from "next/image";

export function Gallery({ images, alt }: { images: string[]; alt: string }) {
  const unique = images.length ? images : ["/machines/cnc-torna.svg"];
  const [active, setActive] = useState(0);

  return (
    <div className="flex flex-col gap-4">
      <div className="relative aspect-[4/3] overflow-hidden rounded-md border border-ink-100 bg-white">
        <Image
          src={unique[active]}
          alt={alt}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 55vw"
          className="object-contain"
        />
      </div>
      {unique.length > 1 && (
        <div className="grid grid-cols-4 gap-3">
          {unique.map((src, i) => (
            <button
              key={src + i}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`${alt} ${i + 1}`}
              aria-current={i === active}
              className={`relative aspect-[4/3] overflow-hidden rounded-sm border bg-white transition-all ${
                i === active ? "border-brand-500 ring-1 ring-brand-500" : "border-ink-100 hover:border-brand-300"
              }`}
            >
              <Image src={src} alt="" fill sizes="20vw" className="object-contain" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
