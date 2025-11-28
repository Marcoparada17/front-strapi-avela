"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { strapiFetch } from "@/lib/strapi";
import Sugerencias from "../../components/Sugerencias";

export default function ProductPage() {
  const { slug } = useParams();
  const router = useRouter();

  const [product, setProduct] = useState<any>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);
  const [hover, setHover] = useState(false);

  const startX = useRef<number | null>(null);
  const dragging = useRef(false);

  useEffect(() => {
    async function load() {
      const json = await strapiFetch(
        `/traje-de-banos?filters[SKU][$eq]=${slug}&populate=Imagenes`
      );

      const item = json.data?.[0] || null;
      setProduct(item);
    }

    load();
  }, [slug]);

  if (!product)
    return <p style={{ color: "white", padding: 40 }}>Cargando…</p>;

  const gallery = product.Imagenes || [];

  const getImage = (img: any) => {
    const f = img.formats || {};
    return f.medium?.url || f.small?.url || f.thumbnail?.url || img.url;
  };

  // Swipe
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

  const isMobile = typeof window !== "undefined" && window.innerWidth < 850;

  // WhatsApp dinámico
 const whatsappUrl = `https://api.whatsapp.com/send?phone=584245304372&text=${encodeURIComponent(
  `Estoy interesada en el modelo: ${product.Nombre} – SKU: ${product.SKU}`
)}`;

  return (
    <>
      <Navbar />

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

      <div
        style={{
          padding: "0 20px 120px 20px",
          color: "white",
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          gap: 40,
          justifyContent: "center",
          alignItems: isMobile ? "center" : "flex-start",
          maxWidth: 1300,
          margin: "0 auto",
        }}
      >
        {/* ===================================== */}
        {/* LEFT SIDE - IMAGES */}
        {/* ===================================== */}
        <div style={{ display: "flex", gap: 20, flexDirection: isMobile ? "column" : "row" }}>
          
          {/* Miniaturas desktop */}
          {!isMobile && (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {gallery.map((img: any, i: number) => (
                <img
                  key={i}
                  src={`${process.env.NEXT_PUBLIC_STRAPI_URL}${getImage(img)}`}
                  style={{
                    width: 70,
                    height: 70,
                    borderRadius: 8,
                    objectFit: "cover",
                    cursor: "pointer",
                    border: selectedIndex === i ? "2px solid white" : "2px solid transparent",
                  }}
                  onClick={() => setSelectedIndex(i)}
                />
              ))}
            </div>
          )}

          {/* Main image swiper */}
          <div style={{ width: isMobile ? "100%" : 450, borderRadius: 12, overflow: "hidden" }}>
            <div
              style={{
                display: "flex",
                width: "100%",
                transform: `translateX(-${selectedIndex * 100}%)`,
                transition: "transform .25s ease",
              }}
              onTouchStart={(e) => swipeStart(e.touches[0].clientX)}
              onTouchMove={(e) => swipeMove(e.touches[0].clientX)}
              onTouchEnd={swipeEnd}
              onMouseDown={(e) => swipeStart(e.clientX)}
              onMouseMove={(e) => { if (dragging.current) swipeMove(e.clientX); }}
              onMouseUp={swipeEnd}
              onMouseLeave={swipeEnd}
            >
              {gallery.map((img: any, i: number) => (
                <div key={i} style={{ flex: "0 0 100%" }}>
                  <img
                    src={`${process.env.NEXT_PUBLIC_STRAPI_URL}${getImage(img)}`}
                    onClick={() => setFullscreen(true)}
                    style={{
                      width: "100%",
                      height: isMobile ? 380 : 450,
                      objectFit: "cover",
                    }}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Miniaturas mobile debajo */}
          {isMobile && (
            <div
              style={{
                display: "flex",
                gap: 10,
                justifyContent: "center",
                marginTop: 15,
                flexWrap: "wrap",
              }}
            >
              {gallery.map((img: any, i: number) => (
                <img
                  key={i}
                  src={`${process.env.NEXT_PUBLIC_STRAPI_URL}${getImage(img)}`}
                  style={{
                    width: 60,
                    height: 60,
                    objectFit: "cover",
                    borderRadius: 8,
                    border: selectedIndex === i ? "2px solid white" : "2px solid transparent",
                    cursor: "pointer",
                  }}
                  onClick={() => setSelectedIndex(i)}
                />
              ))}
            </div>
          )}
        </div>

        {/* ===================================== */}
        {/* RIGHT SIDE - INFO */}
        {/* ===================================== */}
        <div style={{ maxWidth: 500, width: "100%" }}>
          
          {isMobile && (
            <p style={{ fontSize: "1.8rem", fontWeight: "bold", marginBottom: 10 }}>
              ${product.Precio}
            </p>
          )}

          {/* Promo */}
          <div
            style={{
              width: "90%",
              padding: "14px 18px",
              background: "white",
              borderRadius: 0,
              marginBottom: 20,
              color: "black",
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            <img src="/promo-code.svg" width={26} style={{filter: "invert(1)"}}/>
            Llévate 2 modelos por <strong>$20</strong>
          </div>

          <h1 style={{ fontSize: "2rem" }}>{product.Nombre}</h1>

          <p><strong>Talla:</strong> {product.Talla}</p>
          <p><strong>SKU:</strong> {product.SKU}</p>

          {!isMobile && (
            <p style={{ fontSize: "1.7rem", fontWeight: "bold", margin: "20px 0" }}>
              ${product.Precio}
            </p>
          )}

          {/* Buy button */}
          <a
            href={whatsappUrl}
            target="_blank"
            style={{
              display: "inline-block",
              background: hover ? "black" : "white",
              color: hover ? "white" : "black",
              padding: "14px 24px",
              borderRadius: 8,
              textDecoration: "none",
              fontWeight: "bold",
              marginTop: 25,
              transition: "all .25s ease",
            }}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
          >
            Comprar
          </a>
        </div>
      </div>

      {/* Sugerencias */}
      <div style={{ padding: "0 20px 60px 20px" }}>
        <Sugerencias />
      </div>

      <Footer />

      {/* Fullscreen */}
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
          }}
        >
          <img
            src={`${process.env.NEXT_PUBLIC_STRAPI_URL}${getImage(
              gallery[selectedIndex]
            )}`}
            style={{
              width: "90%",
              maxWidth: 900,
              objectFit: "contain",
              borderRadius: 12,
            }}
          />
        </div>
      )}
    </>
  );
}
