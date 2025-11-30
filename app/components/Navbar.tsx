"use client";

import React, { useState, useEffect } from "react";
import type { CSSProperties } from "react";
import { useCart } from "@/hooks/useCart";

export default function Navbar() {
  const [isMobile, setIsMobile] = useState(false);
  const [open, setOpen] = useState(false);

  // lo dejamos por si lo usas en otra cosa, pero el número lo sacamos de localStorage
  const { cart } = useCart();

  const [count, setCount] = useState(0);

  // ✅ Sincroniza el contador con localStorage y evento "cartUpdated"
  useEffect(() => {
    if (typeof window === "undefined") return;

    const syncCount = () => {
      try {
        const raw = localStorage.getItem("avela_cart");
        if (!raw) {
          setCount(0);
          return;
        }
        const arr = JSON.parse(raw);
        setCount(Array.isArray(arr) ? arr.length : 0);
      } catch {
        setCount(0);
      }
    };

    syncCount();

    window.addEventListener("cartUpdated", syncCount);
    window.addEventListener("storage", syncCount);

    return () => {
      window.removeEventListener("cartUpdated", syncCount);
      window.removeEventListener("storage", syncCount);
    };
  }, []);

  // por si el hook de contexto sí cambia, lo usamos también
  useEffect(() => {
    if (Array.isArray(cart)) {
      setCount(cart.length);
    }
  }, [cart]);

  // detectar mobile
  useEffect(() => {
    if (typeof window === "undefined") return;

    const checkMobile = () => setIsMobile(window.innerWidth < 850);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <>
      {/* NAVBAR */}
      <div style={navbar}>
        {/* LEFT */}
        <div style={leftWrapper}>
          {isMobile ? (
            <button onClick={() => setOpen(!open)} style={hamburgerBtn}>
              ☰
            </button>
          ) : (
            <>
              <a style={link} href="/">Inicio</a>
              <a style={link} href="/catalogo">Catálogo</a>
            </>
          )}
        </div>

        {/* LOGO */}
        <div style={center}>
          <a href="/" style={{ display: "flex", alignItems: "center" }}>
            <img
              src="/artboard1.svg"
              alt="Avela"
              style={{
                height: isMobile ? 70 : 110,
                width: "auto",
                objectFit: "contain",
                display: "block",
              }}
            />
          </a>
        </div>

        {/* RIGHT DESKTOP */}
        {!isMobile && (
          <div style={right}>
            <a href="/cart" style={cartLink}>
              <img src="/cart.svg" style={icon} />
              {count > 0 && <span style={badge}>{count}</span>}
            </a>

            <a href="https://www.tiktok.com/@avelastore.ve" target="_blank">
              <img src="/tiktok.svg" style={icon} />
            </a>

            <a href="https://www.instagram.com/avelastore.ve" target="_blank">
              <img src="/instagram.svg" style={icon} />
            </a>

            <a href="https://wa.link/cd114w" target="_blank" style={whatsapp}>
              Comprar
            </a>
          </div>
        )}

        {/* RIGHT MOBILE */}
        {isMobile && (
          <a href="/cart" style={cartLink}>
            <img src="/cart.svg" style={icon} />
            {count > 0 && <span style={badgeMobile}>{count}</span>}
          </a>
        )}
      </div>

      {/* MOBILE MENU */}
      {isMobile && open && (
        <div style={mobileMenu}>
          <a style={mobileLink} href="/" onClick={() => setOpen(false)}>
            Inicio
          </a>
          <a style={mobileLink} href="/catalogo" onClick={() => setOpen(false)}>
            Catálogo
          </a>
          <a style={mobileLink} href="/cart" onClick={() => setOpen(false)}>
            Carrito ({count})
          </a>

          <a
            style={mobileSocialLink}
            href="https://www.tiktok.com/@avelastore.ve"
            target="_blank"
          >
            <img src="/tiktok.svg" style={mobileIcon} /> TikTok
          </a>

          <a
            style={mobileSocialLink}
            href="https://www.instagram.com/avelastore.ve"
            target="_blank"
          >
            <img src="/instagram.svg" style={mobileIcon} /> Instagram
          </a>

          <a href="https://wa.link/cd114w" target="_blank" style={whatsappMobile}>
            Comprar
          </a>
        </div>
      )}
    </>
  );
}

/* ================= ESTILOS ================= */

const navbar: CSSProperties = {
  width: "100%",
  height: 85,
  padding: "0 20px",
  background: "rgba(0,0,0,0.8)",
  backdropFilter: "blur(6px)",
  position: "fixed",
  top: 0,
  left: 0,
  zIndex: 1000,
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  overflow: "hidden",
  boxSizing: "border-box",
};

const leftWrapper: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 18,
};

const center: CSSProperties = {
  flex: 1,
  display: "flex",
  justifyContent: "center",
};

const right: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 18,
};

const cartLink: CSSProperties = {
  position: "relative",
  display: "inline-flex",
  alignItems: "center",
};

const link: CSSProperties = {
  color: "white",
  textDecoration: "none",
  fontSize: "1rem",
};

const icon: CSSProperties = {
  width: 26,
  height: 26,
};

const badge: CSSProperties = {
  position: "absolute",
  top: -6,
  right: -10,
  background: "red",
  width: 20,
  height: 20,
  borderRadius: "50%",
  color: "white",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  fontSize: "0.8rem",
  fontWeight: "bold",
};

const badgeMobile: CSSProperties = {
  ...badge,
  top: -5,
  right: -7,
};

const whatsapp: CSSProperties = {
  background: "#25D366",
  color: "white",
  padding: "8px 14px",
  borderRadius: 8,
  textDecoration: "none",
  fontWeight: "bold",
};

const hamburgerBtn: CSSProperties = {
  fontSize: 28,
  background: "none",
  border: "none",
  color: "white",
  cursor: "pointer",
};

const mobileMenu: CSSProperties = {
  position: "fixed",
  top: 85,
  left: 0,
  width: "100%",
  background: "rgba(0,0,0,0.9)",
  padding: 20,
  display: "flex",
  flexDirection: "column",
  gap: 16,
  zIndex: 999,
};

const mobileLink: CSSProperties = {
  color: "white",
  fontSize: "1.1rem",
  textDecoration: "none",
};

const mobileIcon: CSSProperties = {
  width: 22,
  height: 22,
};

const mobileSocialLink: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 10,
  color: "white",
  textDecoration: "none",
};

const whatsappMobile: CSSProperties = {
  ...whatsapp,
  width: "50%",
  textAlign: "center",
  padding: "10px 0",
};