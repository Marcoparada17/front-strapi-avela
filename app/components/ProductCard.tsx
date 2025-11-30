"use client";

import Link from "next/link";
import { useCart } from "@/hooks/useCart";

interface ProductCardProps {
  title: string;
  price: number | null;
  image: string | null;
  slug: string;
}

export default function ProductCard({ title, price, image, slug }: ProductCardProps) {
  const { add } = useCart();

  const finalImg =
    image
      ? image.startsWith("http")
        ? image
        : `${process.env.NEXT_PUBLIC_STRAPI_URL}${image}`
      : "/placeholder.jpg";

  /* ------------------------------------------------------------------
     🔥 MOSTRAR TOAST
  ------------------------------------------------------------------ */
  const showToast = (message: string) => {
    const toast = document.createElement("div");
    toast.innerText = message;

    Object.assign(toast.style, {
      position: "fixed",
      bottom: "25px",
      left: "50%",
      transform: "translateX(-50%)",
      background: "#fff",
      color: "#000",
      padding: "12px 20px",
      borderRadius: "8px",
      fontWeight: "bold",
      zIndex: "99999",
      boxShadow: "0 0 10px rgba(0,0,0,0.4)",
      opacity: "0",
      transition: "opacity .3s ease",
    });

    document.body.appendChild(toast);

    setTimeout(() => (toast.style.opacity = "1"), 20);
    setTimeout(() => {
      toast.style.opacity = "0";
      setTimeout(() => toast.remove(), 300);
    }, 2000);
  };

  /* ------------------------------------------------------------------
     🔥 CONTROLAR QUE SOLO SE AGREGUE UNA VEZ POR SESIÓN
  ------------------------------------------------------------------ */
  const handleAdd = (e: any) => {
    e.preventDefault();

    // leer carrito actual
    const raw = localStorage.getItem("avela_cart");
    const cart = raw ? JSON.parse(raw) : [];

    // revisar si ya existe en el carrito
    const exists = cart.some((item: any) => item.slug === slug);

    if (exists) {
      showToast("Este producto ya está en tu carrito");
      return;
    }

    // agregar normal
    add({
      title,
      price,
      image: finalImg,
      slug,
      quantity: 1,
    });

    // actualizar navbar
    window.dispatchEvent(new Event("cartUpdated"));

    showToast("Agregado al carrito");
  };

  return (
    <Link href={`/product/${slug}`} style={{ textDecoration: "none" }}>
      <div
        style={{
          background: "#111",
          borderRadius: 10,
          overflow: "hidden",
          cursor: "pointer",
          transition: "transform .2s ease",
          position: "relative",
          height: 380, // 🔥 ALTA UNIFORME
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        {/* IMG */}
        <div style={{ width: "100%", height: 250 }}>
          <img
            src={finalImg}
            alt={title}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        </div>

        {/* INFO */}
        <div style={{ padding: "12px 14px" }}>
          <h3
            style={{
              fontSize: "1rem",
              color: "white",
              marginBottom: 6,
              height: 40, // 🔥 uniforme
              overflow: "hidden",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
            }}
          >
            {title}
          </h3>

          <p
            style={{
              fontSize: "1.2rem",
              fontWeight: "bold",
              color: "#fff",
            }}
          >
            {price ? `$${price}` : "Sin precio"}
          </p>
        </div>

        {/* BOTÓN + */}
        <button
          onClick={handleAdd}
          style={{
            position: "absolute",
            bottom: 12,
            right: 12,
            width: 40,
            height: 40,
            background: "white",
            color: "black",
            border: "none",
            borderRadius: "50%",
            fontSize: "1.4rem",
            fontWeight: "bold",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            cursor: "pointer",
            boxShadow: "0 2px 6px rgba(0,0,0,0.25)",
          }}
        >
          +
        </button>
      </div>
    </Link>
  );
}
