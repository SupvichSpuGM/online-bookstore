// Server Component — no interactivity needed
interface BookImgProps {
  imgId: string;
  alt: string;
  className?: string;
}

export function BookImg({ imgId, alt, className = "" }: BookImgProps) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`https://images.unsplash.com/${imgId}?w=400&h=560&fit=crop&auto=format`}
      alt={alt}
      className={`object-cover bg-muted ${className}`}
    />
  );
}
