"use client";

import { useEffect, useState } from "react";
import { strapiFetch } from "@/lib/strapi";

export default function Sugerencias() {
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    async function load() {
      // Pedimos solo 50 máximo para evitar cargar 500+
      const json = await strapiFetch(
        `/traje-de-banos?populate=Imagenes&pagination[pageSize]=50`
      );

      // Mezclar y tomar solo 5
      const shuffled = [...json.data]
        .sort(() => Math.random() - 0.5)
        .slice(0, 5);

      setItems(shuffled);
    }

    load();
  }, []);

  const getImage = (img: any) => {
    const f = img.formats || {};
    return f.small?.url || img.url;
  };

  return (
    <div style={{ color: "white", marginTop: 40 }}>
      <h2 style={{ fontSize: "1.6rem", marginBottom: 20 }}>Sugerencias</h2>

      <div
        style={{
          display: "flex",
          gap: 15,
          overflowX: "auto",
          paddingBottom: 6,
        }}
      >
        {items.map((p: any, index: number) => (
          <a
            key={index}
            href={`/product/${p.SKU}`}
            style={{
              minWidth: 150,
              maxWidth: 150,
              textDecoration: "none",
              color: "white",
              fontWeight: "bold",
              fontSize: "1rem",
              background: "#1d1d1dff",
              padding: 10,
              borderRadius: 8,
              flexShrink: 0,
              border: "1px solid #ffffffff",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            {/* Imagen */}
            <img
              src={`${process.env.NEXT_PUBLIC_STRAPI_URL}${getImage(
                p.Imagenes?.[0]
              )}`}
              style={{
                width: "100%",
                height: 150,
                objectFit: "cover",
                borderRadius: 6,
              }}
            />

            {/* Nombre truncado */}
            <p
              style={{
                marginTop: 8,
                textAlign: "center",
                fontSize: "0.85rem",
                lineHeight: "1.1rem",
                height: "2.2rem", // Máximo 2 líneas
                overflow: "hidden",
                textOverflow: "ellipsis",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
              }}
            >
              {p.Nombre}
            </p>
          </a>
        ))}
      </div>
    </div>
  );
}
