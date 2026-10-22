"use client";
import { useState, type ImgHTMLAttributes } from "react";
import { resolveProductImage } from "@/lib/visual-assets";
import { ImageOff } from "lucide-react";
/** Keeps catalog actions available when an owner-supplied image cannot load. */
export function ProductImage({
  src,
  alt,
  ...props
}: Omit<ImgHTMLAttributes<HTMLImageElement>, "src"> & { src: string }) {
  src = resolveProductImage(src);
  const [failed, setFailed] = useState<string | undefined>();
  if (failed === src)
    return (
      <span
        className="product-image-fallback"
        role="img"
        aria-label={alt || "Imagem indisponível"}
      >
        <ImageOff size={30} />
        <span>Imagem indisponível</span>
      </span>
    );
  return (
    <img
      {...props}
      data-photo={src.startsWith("/products/fotos/") || undefined}
      src={src}
      alt={alt}
      decoding="async"
      onError={() => setFailed(src)}
    />
  );
}
