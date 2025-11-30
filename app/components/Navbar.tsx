"use client";

import React, { useState, useEffect } from "react";
import { useCart } from "@/hooks/useCart";

export default function Navbar() {
  const [isMobile, setIsMobile] = useState(false);
  const [open, setOpen] = useState(false);

  const { cart } = useCart();
  const count = cart.length;

  /* CHECK MOBILE */
  useEffect(() => {
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
                height: isMobile ? 70 : 110,     // ← Logo más grande
                width: "auto",
                objectFit: "contain",
                display: "block"
              }}
            />
          </a>
        </div>

        {/* RIGHT DESKTOP */}
        {!isMobile && (
          <div style={right}>
            <a href="/cart" style={{ position: "relative" }}>
              <img src="/cart.svg" style={{ width: 28 }} />

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

        {/* RIGHT MOBILE (ONLY CART) */}
        {isMobile && (
          <a href="/cart" style={{ position: "relative" }}>
            <img src="/cart.svg" style={{ width: 28 }} />
            {count > 0 && <span style={badgeMobile}>{count}</span>}
          </a>
        )}

      </div>

      {/* MOBILE MENU */}
      {isMobile && open && (
        <div style={mobileMenu}>
          <a style={mobileLink} href="/" onClick={() => setOpen(false)}>Inicio</a>
          <a style={mobileLink} href="/catalogo" onClick={() => setOpen(false)}>Catálogo</a>
          <a style={mobileLink} href="/cart" onClick={() => setOpen(false)}>Carrito ({count})</a>

          <a style={mobileSocialLink} href="https://www.tiktok.com/@avelastore.ve" target="_blank">
            <img src="/tiktok.svg" style={mobileIcon} /> TikTok
          </a>

          <a style={mobileSocialLink} href="https://www.instagram.com/avelastore.ve" target="_blank">
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

/* ============ ESTILOS ============ */

const navbar = {
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

const leftWrapper = { display: "flex", alignItems: "center", gap: 18 };
const center = { flex: 1, display: "flex", justifyContent: "center" };
const right = { display: "flex", alignItems: "center", gap: 18 };

const link = { color: "white", textDecoration: "none", fontSize: "1rem" };
const icon = { width: 26, height: 26 };

const badge = {
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

const badgeMobile = { ...badge, top: -5, right: -7 };

const whatsapp = {
  background: "#25D366",
  color: "white",
  padding: "8px 14px",
  borderRadius: 8,
  textDecoration: "none",
  fontWeight: "bold",
};

const hamburgerBtn = {
  fontSize: 28,
  background: "none",
  border: "none",
  color: "white",
};

const mobileMenu = {
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

const mobileLink = { color: "white", fontSize: "1.1rem", textDecoration: "none" };
const mobileIcon = { width: 22, height: 22 };
const mobileSocialLink = { display: "flex", alignItems: "center", gap: 10, color: "white" };
const whatsappMobile = { ...whatsapp, width: "50%", textAlign: "center", padding: "10px 0" };
