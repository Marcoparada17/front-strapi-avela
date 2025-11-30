"use client";

import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { getCart, removeItemByIndex, clearCart } from "@/lib/cart";

export default function CartPage() {
  const [items, setItems] = useState<any[]>([]);

  const syncCart = () => {
    const cart = getCart();
    setItems(cart);
  };

  useEffect(() => {
    syncCart();

    const handler = () => syncCart();
    window.addEventListener("cartUpdated", handler);
    window.addEventListener("storage", handler);

    return () => {
      window.removeEventListener("cartUpdated", handler);
      window.removeEventListener("storage", handler);
    };
  }, []);

  const handleRemove = (index: number) => removeItemByIndex(index);
  const handleClear = () => {
    if (confirm("¿Vaciar carrito?")) clearCart();
  };

  const qty = items.length;
  const baseTotal = qty * 15;
  const hasPromo = qty >= 2;
  const promoTotal = hasPromo ? qty * 10 : baseTotal;

  const handlePay = () => {
    if (qty === 0) return;

    const list = items
      .map(
        (it, idx) =>
          `${idx + 1}. SKU: ${it.slug} — Modelo: ${it.title}`
      )
      .join("\n");

    let msg = `Hola, estoy interesada en los siguientes modelos:\n\n${list}\n\n`;

    if (hasPromo) {
      msg += `${qty} piezas — Total ${baseTotal}$ con la promo ${promoTotal}$`;
    } else {
      msg += `${qty} pieza — total ${baseTotal}$`;
    }

    const url = `https://api.whatsapp.com/send?phone=584245304372&text=${encodeURIComponent(msg)}`;
    window.open(url, "_blank");
  };

  return (
    <>
      <Navbar />

      <main
        style={{
          padding: "100px 20px 80px 20px",
          maxWidth: 900,
          margin: "0 auto",
          color: "white",
        }}
      >
        <h1 style={{ fontSize: "2rem", marginBottom: 20 }}>Carrito</h1>

        {qty === 0 ? (
          <p style={{ opacity: 0.8 }}>No tienes productos en el carrito.</p>
        ) : (
          <>
            {/* LISTA */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 16,
                marginBottom: 40,
              }}
            >
              {items.map((item, index) => (
                <div
                  key={index}
                  style={{
                    display: "flex",
                    gap: 14,
                    alignItems: "center",
                    background: "#111",
                    borderRadius: 10,
                    padding: 10,
                    border: "1px solid #222",
                  }}
                >
                  {item.image && (
                    <img
                      src={item.image}
                      alt={item.title}
                      style={{
                        width: 80,
                        height: 80,
                        objectFit: "cover",
                        borderRadius: 8,
                      }}
                    />
                  )}

                  <div style={{ flex: 1 }}>
                    <p style={{ fontWeight: "bold", marginBottom: 4 }}>
                      {item.title}
                    </p>
                    <p style={{ fontSize: "0.9rem", opacity: 0.8 }}>
                      SKU: {item.slug}
                    </p>
                  </div>

<button
  onClick={() => handleRemove(index)}
  style={{
    background: "transparent",
    color: "#ff6666",
    border: "1px solid #ff6666",
    borderRadius: 8,
    padding: "10px 16px",
    cursor: "pointer",
    fontSize: "0.9rem",
    minWidth: 110,
    textAlign: "center",
    transition: "0.25s ease",
  }}
  onMouseEnter={(e) => {
    e.currentTarget.style.background = "#ff6666";
    e.currentTarget.style.color = "#000";
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.background = "transparent";
    e.currentTarget.style.color = "#ff6666";
  }}
>
  Eliminar
</button>
                </div>
              ))}
            </div>

            {/* FACTURA */}
            <div
              style={{
                background: "#111",
                borderRadius: 10,
                padding: 20,
                border: "1px solid #222",
                marginBottom: 40,
              }}
            >
              <p style={{ fontSize: "1.1rem", marginBottom: 8 }}>
                <strong>{qty} pieza{qty !== 1 ? "s" : ""}</strong>
              </p>

              <p style={{ opacity: 0.85, marginBottom: 8 }}>
                Total: <strong>{baseTotal}$</strong>
              </p>

              {hasPromo && (
                <>
                  <p style={{ color: "#32cd32" }}>Promoción aplicada</p>

                  <div
                    style={{
                      width: "100%",
                      height: 1,
                      background: "#333",
                      margin: "12px 0",
                    }}
                  />

                  <p style={{ fontSize: "1.2rem" }}>
                    <strong>Total a pagar: {promoTotal}$</strong>
                  </p>
                </>
              )}

              {!hasPromo && (
                <p style={{ fontSize: "1.2rem" }}>
                  <strong>Total a pagar: {baseTotal}$</strong>
                </p>
              )}
            </div>

            {/* BOTONES */}
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
<button
  onClick={handlePay}
  style={{
    background: "#fff",
    color: "#000",
    padding: "12px 20px",
    borderRadius: 8,
    border: "1px solid #aaa",
    fontWeight: "bold",
    cursor: "pointer",
    minWidth: 130,
    textAlign: "center",
    transition: "0.25s ease",
  }}
  onMouseEnter={(e) => {
    e.currentTarget.style.background = "#000";
    e.currentTarget.style.color = "#fff";
    e.currentTarget.style.border = "1px solid #fff";
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.background = "#fff";
    e.currentTarget.style.color = "#000";
    e.currentTarget.style.border = "1px solid #aaa";
  }}
>
  Comprar
</button>
<button
  onClick={handleClear}
  style={{
    background: "transparent",
    color: "#fff",
    padding: "12px 20px",
    borderRadius: 8,
    border: "1px solid #555",
    cursor: "pointer",
    fontSize: "0.9rem",
    minWidth: 130,
    textAlign: "center",
    transition: "0.25s ease",
  }}
  onMouseEnter={(e) => {
    e.currentTarget.style.background = "#fff";
    e.currentTarget.style.color = "#000";
    e.currentTarget.style.border = "1px solid #fff";
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.background = "transparent";
    e.currentTarget.style.color = "#fff";
    e.currentTarget.style.border = "1px solid #555";
  }}
>
  Vaciar carrito
</button>
            </div>
          </>
        )}
      </main>

      <Footer />
    </>
  );
}
