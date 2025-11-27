"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { strapiFetch } from "@/lib/strapi";

export default function ProductPage() {
  const { slug } = useParams();
  const router = useRouter();

  const [product, setProduct] = useState<any>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);

  // swipe refs
  const startX = useRef<number | null>(null);
  const dragging = useRef(false);

useEffect(() => {
  async function load() {
    try {
      const r = await fetch(
        `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/traje-de-banos?filters[SKU][$eq]=${slug}&populate=*`
      );

      const json = await r.json();

      console.log("STRAPI RAW →", JSON.stringify(json, null, 2));

      const item = json.data?.[0] || null;
      setProduct(item);
    } catch (err) {
      console.error("ERROR FETCHING:", err);
    }
  }

  load();
}, [slug]);

  if (!product)
    return <p style={{ color: "white", padding: 40 }}>Cargando…</p>;

  const gallery = product.Imagenes || [];

  // =============================================
  // SAFE GET IMAGE (FUNCIONA PARA TODAS LAS IMÁGENES)
  // =============================================
  const getImage = (img: any) => {
    const formats = img.formats || {};

    return (
      formats.medium?.url ||
      formats.small?.url ||
      formats.thumbnail?.url ||
      img.url
    );
  };

  // =============================================
  // SWIPE HANDLERS (CARRUSEL + FULLSCREEN)
  // =============================================
  const swipeStart = (clientX: number) => {
    dragging.current = true;
    startX.current = clientX;
  };

  const swipeMove = (clientX: number) => {
    if (!dragging.current || startX.current === null) return;

    const delta = clientX - startX.current;

    if (delta > 80 && selectedIndex > 0) {
      setSelectedIndex(selectedIndex - 1);
      dragging.current = false;
    }
    if (delta < -80 && selectedIndex < gallery.length - 1) {
      setSelectedIndex(selectedIndex + 1);
      dragging.current = false;
    }
  };

  const swipeEnd = () => {
    dragging.current = false;
    startX.current = null;
  };

  return (
    <>
      <Navbar />

      {/* BACK BUTTON */}
      <div style={{ padding: "100px 20px 0 20px" }}>
        <button
          onClick={() => router.back()}
          style={{
            background: "transparent",
            color: "white",
            border: "none",
            fontSize: "2rem",
            cursor: "pointer",
            marginBottom: 20,
          }}
        >
          ←
        </button>
      </div>

      {/* MAIN WRAPPER */}
      <div
        style={{
          padding: "0 40px 120px 40px",
          color: "white",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {/* =============================== */}
        {/* CARRUSEL CON SWIPE */}
        {/* =============================== */}
       <div
  style={{
    width: "100%",
    maxWidth: 420,
    overflow: "hidden",
    borderRadius: 12,
    marginBottom: 20,
    touchAction: "pan-y",
  }}
>
  <div
    style={{
      display: "flex",
      transform: `translateX(-${selectedIndex * 100}%)`,
      transition: "transform .25s ease",
    }}
    onTouchStart={(e) => swipeStart(e.touches[0].clientX)}
    onTouchMove={(e) => swipeMove(e.touches[0].clientX)}
    onTouchEnd={swipeEnd}
    onMouseDown={(e) => swipeStart(e.clientX)}
    onMouseMove={(e) => {
      if (dragging.current) {
        e.preventDefault();
        swipeMove(e.clientX);
      }
    }}
    onMouseUp={swipeEnd}
    onMouseLeave={swipeEnd}
  >
    {gallery.map((img: any, i: number) => (
      <div
        key={i}
        style={{
          flex: "0 0 100%",   // 🔥 CADA SLIDE OCUPA SU ANCHO EXACTO
        }}
      >
        <img
          onClick={() => setFullscreen(true)}
          src={`${process.env.NEXT_PUBLIC_STRAPI_URL}${getImage(img)}`}
          style={{
            width: "100%",
            height: 420,
            objectFit: "cover",
            userSelect: "none",
            cursor: "pointer",
          }}
          draggable={false}
        />
      </div>
    ))}
  </div>
</div>

        {/* =============================== */}
        {/* MINIATURAS */}
        {/* =============================== */}
        <div
          style={{
            display: "flex",
            gap: 10,
            marginBottom: 30,
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          {gallery.map((img: any, i: number) => (
            <img
              key={i}
              src={`${process.env.NEXT_PUBLIC_STRAPI_URL}${getImage(img)}`}
              onClick={() => setSelectedIndex(i)}
              style={{
                width: 60,
                height: 60,
                borderRadius: 8,
                objectFit: "cover",
                cursor: "pointer",
                border:
                  selectedIndex === i
                    ? "2px solid #32cd32"
                    : "2px solid transparent",
              }}
            />
          ))}
        </div>

        {/* PRODUCT INFO */}
        <div
          style={{
            maxWidth: 500,
            width: "100%",
            textAlign: "center",
          }}
        >
          <h1 style={{ fontSize: "2rem", marginBottom: 10 }}>
            {product.Nombre}
          </h1>

          <p><strong>Talla:</strong> {product.Talla}</p>
          <p><strong>SKU:</strong> {product.SKU}</p>
          <p><strong>Precio:</strong> {product.Precio ?? "Sin precio"}</p>

          <a
            href="https://wa.link/cd114w"
            target="_blank"
            style={{
              display: "inline-block",
              background: "white",
              color: "black",
              padding: "12px 20px",
              borderRadius: 8,
              textDecoration: "none",
              fontWeight: "bold",
              marginTop: 20,
            }}
          >
            Comprar
          </a>
        </div>
      </div>

      <Footer />

      {/* =============================== */}
      {/* FULLSCREEN CON SWIPE */}
      {/* =============================== */}
{fullscreen && (
  <div
    onClick={() => setFullscreen(false)}
    style={{
      position: "fixed",
      inset: 0,
      background: "rgba(0,0,0,.95)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 9999,
      touchAction: "pan-y",
    }}
    onTouchStart={(e) => swipeStart(e.touches[0].clientX)}
    onTouchMove={(e) => swipeMove(e.touches[0].clientX)}
    onTouchEnd={swipeEnd}
    onMouseDown={(e) => swipeStart(e.clientX)}
    onMouseMove={(e) => {
      if (dragging.current) {
        e.preventDefault();
        swipeMove(e.clientX);
      }
    }}
    onMouseUp={swipeEnd}
    onMouseLeave={swipeEnd}
  >
    <img
      src={`${process.env.NEXT_PUBLIC_STRAPI_URL}${getImage(
        gallery[selectedIndex]
      )}`}
      style={{
        width: "90%",
        maxWidth: "900px",
        objectFit: "contain",
        borderRadius: 12,
      }}
      draggable={false}
    />
  </div>
)}
    </>
  );
}
