"use client";

import Link from "next/link";

interface ProductCardProps {
  title: string;
  price: number | null;
  image: string | null;
  slug: string;
}

export default function ProductCard({ title, price, image, slug }: ProductCardProps) {
  const finalImg = image
    ? image.startsWith("http")
      ? image
      : `${process.env.NEXT_PUBLIC_STRAPI_URL}${image}`
    : "/placeholder.jpg";

  return (
    <Link href={`/product/${slug}`} style={{ textDecoration: "none" }}>
      <div
        style={{
          background: "#111",
          borderRadius: 10,
          overflow: "hidden",
          cursor: "pointer",
          transition: "transform .2s ease",
        }}
      >
        <div style={{ width: "100%", height: 280, overflow: "hidden" }}>
          <img
            src={finalImg}
            alt={title}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transition: "transform .3s ease",
            }}
          />
        </div>

        <div style={{ padding: "12px 14px" }}>
          <h3 style={{ fontSize: "1rem", color: "white", marginBottom: 8 }}>
            {title}
          </h3>

          <p style={{ fontSize: "1.2rem", fontWeight: "bold", color: "#ffffffff" }}>
            {price ? `$${price}` : "Sin precio"}
          </p>
        </div>
      </div>
    </Link>
  );
}
