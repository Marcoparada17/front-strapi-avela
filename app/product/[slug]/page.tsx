"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { strapiFetch } from "@/lib/strapi";
import Sugerencias from "@/app/components/Sugerencias";
import { addToCart, CartItem } from "@/lib/cart";
import Toast from "@/app/components/Toast"; // <-- AGREGADO

export default function ProductPage() {
  const { slug } = useParams();
  const router = useRouter();

  const [product, setProduct] = useState<any>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [toast, setToast] = useState(""); // <-- AGREGADO

  // swipe refs
  const startX = useRef<number | null>(null);
  const dragging = useRef(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 850);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    async function load() {
      try {
        const json = await strapiFetch(
          `/traje-de-banos?filters[SKU][$eq]=${slug}&populate=Imagenes`
        );

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

  const getImage = (img: any) => {
    if (!img) return null;
    const formats = img.formats || {};
    return (
      formats.medium?.url ||
      formats.small?.url ||
      formats.thumbnail?.url ||
      img.url
    );
  };

  // swipe handlers
  const swipeStart = (clientX: number) => {
    dragging.current = true;
    startX.current = clientX;
  };

  const swipeMove = (clientX: number) => {
    if (!dragging.current || startX.current === null) return;

    const delta = clientX - startX.current;

    if (delta > 80 && selectedIndex > 0) {
      setSelectedIndex((prev) => prev - 1);
      dragging.current = false;
    }
    if (delta < -80 && selectedIndex < gallery.length - 1) {
      setSelectedIndex((prev) => prev + 1);
      dragging.current = false;
    }
  };

  const swipeEnd = () => {
    dragging.current = false;
    startX.current = null;
  };

  const firstImg = gallery[0] ? getImage(gallery[0]) : null;

  const handleAddToCart = () => {
    const item: CartItem = {
      sku: product.SKU,
      nombre: product.Nombre,
      talla: product.Talla,
      imagenUrl: firstImg
        ? `${process.env.NEXT_PUBLIC_STRAPI_URL}${firstImg}`
        : null,
    };

    addToCart(item);

    // 🔥 TOAST EN VEZ DE ALERT
    setToast("Agregado al carrito 🛒");
  };

  const handleWhatsAppBuy = () => {
    const msg = `Hola, estoy interesada en el modelo ${product.Nombre}.\nSKU: ${product.SKU}\nTalla: ${product.Talla ?? "N/A"}`;
    const url = `https://api.whatsapp.com/send?phone=584245304372&text=${encodeURIComponent(
      msg
    )}`;
    window.open(url, "_blank");
  };

  return (
    <>
      {toast && <Toast message={toast} />} {/* <-- TOAST AQUÍ */}

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

      {/* MAIN LAYOUT */}
      <div
        style={{
          padding: "0 20px 60px 20px",
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
        {/* IZQUIERDA: galería */}
        <div style={{ display: "flex", gap: 20 }}>
          {/* MINIATURAS EN COLUMNA (SOLO DESKTOP) */}
          {!isMobile && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 10,
                height: "fit-content",
              }}
            >
              {gallery.map((img: any, i: number) => (
                <img
                  key={i}
                  src={`${process.env.NEXT_PUBLIC_STRAPI_URL}${getImage(img)}`}
                  onClick={() => setSelectedIndex(i)}
                  style={{
                    width: 70,
                    height: 70,
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
          )}

          {/* IMAGEN PRINCIPAL */}
          <div
            style={{
              width: isMobile ? "100%" : 450,
              overflow: "hidden",
              borderRadius: 12,
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
                <div key={i} style={{ flex: "0 0 100%" }}>
                  <img
                    src={`${process.env.NEXT_PUBLIC_STRAPI_URL}${getImage(img)}`}
                    onClick={() => setFullscreen(true)}
                    style={{
                      width: "100%",
                      height: isMobile ? 360 : 450,
                      objectFit: "cover",
                      borderRadius: 12,
                      cursor: "pointer",
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* DERECHA */}
        <div
          style={{
            maxWidth: 500,
            width: "100%",
          }}
        >
          {/* Precio (mobile arriba) */}
          {isMobile && (
            <p
              style={{
                fontSize: "1.8rem",
                fontWeight: "bold",
                marginBottom: 10,
                marginTop: 20,
              }}
            >
              ${product.Precio ?? "—"}
            </p>
          )}

          {/* PROMO mobile */}
          {isMobile && (
            <div
              style={{
                width: "90%",
                padding: "12px 16px",
                background: "#fff",
                borderRadius: 8,
                marginBottom: 20,
                textAlign: "left",
                color: "#000",
                display: "flex",
                alignItems: "center",
                gap: 10,
              }}
            >
              <img
                src="/promo.svg"
                alt="Promo"
                style={{ width: 26, height: 26, filter: "invert(1)" }}
              />
              <div style={{ fontSize: "0.9rem" }}>
                <strong>Llévate dos modelos</strong> que te gusten por solo{" "}
                <strong>$20</strong>.
              </div>
            </div>
          )}

          {/* Título */}
          <h1 style={{ fontSize: "2rem", marginBottom: 10 }}>
            {product.Nombre}
          </h1>

          {/* SKU y talla */}
          <p>
            <strong>Talla:</strong> {product.Talla}
          </p>
          <p>
            <strong>SKU:</strong> {product.SKU}
          </p>

          {/* Precio desktop */}
          {!isMobile && (
            <p
              style={{
                fontSize: "1.7rem",
                margin: "20px 0",
                fontWeight: "bold",
              }}
            >
              ${product.Precio ?? "—"}
            </p>
          )}

          {/* Botones */}
          <div style={{ display: "flex", gap: 12, marginTop: 25, flexWrap: "wrap" }}>
            <button
              onClick={handleAddToCart}
              style={{
                background: "#fff",
                color: "#000",
                padding: "12px 20px",
                borderRadius: 8,
                border: "none",
                fontWeight: "bold",
                cursor: "pointer",
                minWidth: 140,
              }}
            >
              Agregar al carrito
            </button>

            <button
              onClick={handleWhatsAppBuy}
              style={{
                background: "#000",
                color: "#fff",
                padding: "12px 20px",
                borderRadius: 8,
                border: "1px solid #fff",
                fontWeight: "bold",
                cursor: "pointer",
                minWidth: 140,
              }}
            >
              COMPRAR
            </button>
          </div>

          {/* Promo desktop */}
          {!isMobile && (
            <div
              style={{
                marginTop: 30,
                padding: "12px 16px",
                background: "#fff",
                borderRadius: 8,
                color: "#000",
                display: "flex",
                alignItems: "center",
                gap: 10,
                maxWidth: 380,
              }}
            >
              <img
                src="/promo.svg"
                alt="Promo"
                style={{ width: 26, height: 26, filter: "invert(1)" }}
              />
              <div style={{ fontSize: "0.9rem" }}>
                <strong>Llévate dos modelos</strong> que te gusten por solo{" "}
                <strong>$20</strong>.
              </div>
            </div>
          )}
        </div>
      </div>

      <div style={{ padding: "0 20px 80px 20px", maxWidth: 1300, margin: "0 auto" }}>
        <Sugerencias />
      </div>

      <Footer />

      {/* FULLSCREEN VIEWER */}
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
