"use client";

import React, { useState, useEffect } from "react";

export default function Navbar() {
  const [isMobile, setIsMobile] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 850);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return (
    <>
      {/* NAVBAR */}
      <header style={header}>
        {/* LEFT + BURGER */}
        <div style={leftWrapper}>
          {isMobile && (
            <button onClick={() => setOpen(!open)} style={hamburgerBtn}>
              ☰
            </button>
          )}

          {!isMobile && (
            <div style={left}>
              <a style={link} href="/">Inicio</a>
              <a style={link} href="/catalogo">Catálogo</a>
            </div>
          )}
        </div>

        {/* LOGO */}
        <div style={center}>
          <img
            src="/artboard_1.png"
            alt="Avela Store"
            style={{ height: 140, maxWidth: 140 }}
          />
        </div>

        {/* RIGHT (desktop) */}
        {!isMobile && (
          <div style={right}>
            <a style={link} href="https://www.tiktok.com/@avelastore.ve?_r=1&_t=ZM-91gJM3Qyrr2">TIK TOK</a>
            <a style={link} href="https://www.instagram.com/avelastore.ve?igsh=ZWFjZmFyaTIybTlk" target="_blank">Instagram</a>
            <a href="https://wa.link/cd114w" target="_blank" style={whatsapp}>
              Comprar
            </a>
          </div>
        )}
      </header>

      {/* MOBILE MENU */}
      {isMobile && open && (
        <div style={mobileMenu}>
          <a style={mobileLink} href="/" onClick={() => setOpen(false)}>Inicio</a>
          <a style={mobileLink} href="/catalogo" onClick={() => setOpen(false)}>Catálogo</a>
          <a style={mobileLink} href="https://www.tiktok.com/@avelastore.ve?_r=1&_t=ZM-91gJM3Qyrr2" onClick={() => setOpen(false)}>TIK TOK</a>
          <a
            style={mobileLink}
            href="https://www.instagram.com/avelastore.ve?igsh=ZWFjZmFyaTIybTlk"
            target="_blank"
            onClick={() => setOpen(false)}
          >
            Instagram
          </a>

          {/* WHATSAPP MOBILE BUTTON (FIX) */}
          <a
            href="https://wa.link/cd114w"
            target="_blank"
            style={whatsappMobile}
          >
            Comprar
          </a>
        </div>
      )}
    </>
  );
}

/* ================== ESTILOS ================== */

const header: React.CSSProperties = {
  width: "100%",
  height: "70px",
  padding: "0 25px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  position: "fixed",
  top: 0,
  left: 0,
  zIndex: 999,
  background: "rgba(0,0,0,0.6)",
  backdropFilter: "blur(6px)",
  boxSizing: "border-box",
};

const link: React.CSSProperties = {
  color: "white",
  textDecoration: "none",
  fontSize: "1rem",
  marginRight: 18,
  whiteSpace: "nowrap",
};

const leftWrapper: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 12,
};

const left: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 18,
};

const center: React.CSSProperties = {
  flex: 1,
  display: "flex",
  justifyContent: "center",
};

const right: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 18,
};

const whatsapp: React.CSSProperties = {
  background: "#25D366",
  padding: "10px 16px",
  borderRadius: 8,
  color: "white",
  textDecoration: "none",
  fontWeight: "bold",
  whiteSpace: "nowrap",
};

/* 🔥 WHATSAPP MOBILE — botón más pequeño */
const whatsappMobile: React.CSSProperties = {
  background: "#25D366",
  padding: "8px 0",
  borderRadius: 6,
  color: "white",
  textDecoration: "none",
  fontWeight: "bold",
  fontSize: "0.95rem",
  width: "50%",
  textAlign: "center",
  marginTop: 10,
  boxSizing: "border-box",
};

const hamburgerBtn: React.CSSProperties = {
  fontSize: 28,
  background: "none",
  color: "white",
  border: "none",
  cursor: "pointer",
};

const mobileMenu: React.CSSProperties = {
  position: "fixed",
  top: 70,
  left: 0,
  width: "100%",
  background: "rgba(0,0,0,0.95)",
  padding: "20px",
  display: "flex",
  flexDirection: "column",
  gap: 12,
  zIndex: 998,
};

const mobileLink: React.CSSProperties = {
  color: "white",
  textDecoration: "none",
  fontSize: "1.1rem",
};
