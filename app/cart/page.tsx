"use client";

import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { getCart, removeItemByIndex, clearCart, CartItem } from "@/lib/cart";

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([]);

  const syncCart = () => {
    const cart = getCart();
    setItems(cart);
  };

  useEffect(() => {
    if (typeof window === "undefined") return;
    syncCart();

    const handler = () => syncCart();
    window.addEventListener("cartUpdated", handler);
    window.addEventListener("storage", handler);

    return () => {
      window.removeEventListener("cartUpdated", handler);
      window.removeEventListener("storage", handler);
    };
  }, []);

  const handleRemove = (index: number) => {
    removeItemByIndex(index);
  };

  const handleClear = () => {
    if (confirm("¿Vaciar carrito?")) {
      clearCart();
    }
  };

  const handlePay = () => {
    if (items.length === 0) return;

    const list = items
      .map(
        (it, idx) =>
          `${idx + 1}. SKU: ${it.sku} — Modelo: ${it.nombre}${
            it.talla ? ` — Talla: ${it.talla}` : ""
          }`
      )
      .join("\n");

    const qty = items.length;
    const baseTotal = qty * 15;
    const hasPromo = qty >= 2;
    const promoTotal = hasPromo ? qty * 10 : baseTotal;

    let msg = `Hola, estoy interesada en los siguientes modelos:\n\n${list}\n\n`;

    if (hasPromo) {
      msg += `${qty} piezas — total ${baseTotal}$ con la promo ${promoTotal}$`;
    } else {
      msg += `${qty} pieza — total ${baseTotal}$`;
    }

    const url = `https://api.whatsapp.com/send?phone=584245304372&text=${encodeURIComponent(
      msg
    )}`;
    window.open(url, "_blank");
  };

  // ==== CÁLCULO FACTURA ====
  const qty = items.length;
  const baseTotal = qty * 15;
  const hasPromo = qty >= 2;
  const promoTotal = hasPromo ? qty * 10 : baseTotal;

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
            {/* LISTA DE ITEMS */}
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
                  {item.imagenUrl && (
                    <img
                      src={item.imagenUrl}
                      alt={item.nombre}
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
                      {item.nombre}
                    </p>
                    <p style={{ fontSize: "0.9rem", opacity: 0.8 }}>
                      SKU: {item.sku}
                    </p>
                    {item.talla && (
                      <p style={{ fontSize: "0.9rem", opacity: 0.8 }}>
                        Talla: {item.talla}
                      </p>
                    )}
                  </div>

                  <button
                    onClick={() => handleRemove(index)}
                    style={{
                      background: "transparent",
                      color: "#ff6666",
                      border: "1px solid #ff6666",
                      borderRadius: 6,
                      padding: "6px 10px",
                      cursor: "pointer",
                      fontSize: "0.8rem",
                    }}
                  >
                    Eliminar
                  </button>
                </div>
              ))}
            </div>

            {/* FACTURA — TOTAL */}
            <div
              style={{
                background: "#111",
                borderRadius: 10,
                padding: "20px",
                border: "1px solid #222",
                marginBottom: 40,
              }}
            >
              <p style={{ fontSize: "1.1rem", marginBottom: 8 }}>
                <strong>{qty} pieza{qty !== 1 ? "s" : ""}</strong>
              </p>

              {/* Total base */}
              <p style={{ opacity: 0.85, marginBottom: 8 }}>
                Total: <strong>{baseTotal}$</strong>
              </p>

              {hasPromo && (
                <>
                  <p style={{ color: "#32cd32", marginBottom: 8 }}>
                    Promoción aplicada
                  </p>

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

            {/* BOTONES AL FINAL */}
            <div
              style={{
                display: "flex",
                gap: 10,
                flexWrap: "wrap",
              }}
            >
              <button
                onClick={handlePay}
                style={{
                  background: "#fff",
                  color: "#000",
                  padding: "12px 20px",
                  borderRadius: 8,
                  border: "none",
                  fontWeight: "bold",
                  cursor: "pointer",
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
