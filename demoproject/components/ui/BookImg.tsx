import { getBookImageUrl } from "@/lib/types";

interface BookImgProps {
  imgId?: string;
  coverUrl?: string;
  cover_image_url?: string | null;
  alt: string;
  className?: string;
}

export function BookImg({ imgId, coverUrl, cover_image_url, alt, className = "" }: BookImgProps) {
  const url = getBookImageUrl({
    cover_image_url: cover_image_url || coverUrl || null,
    imgId: imgId || "",
  });

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={url}
      alt={alt}
      className={`object-cover bg-muted ${className}`}
      onError={(e) => {
        (e.target as HTMLImageElement).src =
          "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=560&fit=crop&auto=format";
      }}
    />
  );
}

