"use client";

import { useEffect, useState } from "react";

export default function Footer() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 750);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return (
    <footer
      style={{
        marginTop: 80,
        padding: "70px 40px",
        background: "#000",
        color: "#fff",
        borderTop: "1px solid #202020ff",
      }}
    >
      {/* ========================= */}
      {/* MAIN GRID */}
      {/* ========================= */}
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          justifyContent: isMobile ? "center" : "space-between",
          alignItems: isMobile ? "center" : "flex-start",
          gap: 40,
        }}
      >
        {/* ========================= */}
        {/* LOGO */}
        {/* ========================= */}
        <div
          style={{
            textAlign: isMobile ? "center" : "left",
            width: isMobile ? "100%" : "auto",
          }}
        >
          <img
            src="/logoft.png"
            alt="Avela"
            style={{
              width: isMobile ? "65%" : "260px",
              maxWidth: 350,
              height: "auto",
              marginBottom: 10,
              display: "block",
              marginLeft: isMobile ? "auto" : 0,
              marginRight: isMobile ? "auto" : 0,
            }}
          />

          <p
            style={{
              fontSize: "1.1rem",
              opacity: 0.85,
              marginTop: 8,
            }}
          >
            Elegancia y estilo a tu medida.
          </p>
        </div>

        {/* ========================= */}
        {/* COLUMNS */}
        {/* ========================= */}
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            gap: isMobile ? 60 : 80,
            justifyContent: isMobile ? "center" : "flex-end",
            flexWrap: "wrap",
            textAlign: isMobile ? "center" : "left",
          }}
        >
          {/* NAV */}
          <div>
            <h4 style={heading}>Navegación</h4>
            <a href="/" style={link}>Inicio</a>
            <a href="/catalogo" style={link}>Catálogo</a>
            <a href="/contacto" style={link}>Contacto</a>
          </div>

          {/* INFORMACIÓN (solo desktop) */}
          {!isMobile && (
            <div>
              <h4 style={heading}>Información</h4>
              <p style={textItem}>Envíos a todo el país con ZOOM y MRW</p>
              <p style={textItem}>Atención personalizada</p>
              <p style={textItem}>Modelos exclusivos</p>
            </div>
          )}

          {/* REDES */}
          <div>
            <h4 style={heading}>Redes</h4>
            <a
              href="https://www.instagram.com/avelastore.ve"
              target="_blank"
              style={link}
            >
              Instagram
            </a>
            <a
              href="https://www.tiktok.com/@avelastore.ve"
              target="_blank"
              style={link}
            >
              TikTok
            </a>
            <a
              href="https://api.whatsapp.com/send?phone=584245304372"
              target="_blank"
              style={link}
            >
              WhatsApp
            </a>
          </div>
        </div>
      </div>

      {/* ========================= */}
      {/* DIVIDER */}
      {/* ========================= */}
      <div
        style={{
          width: "90%",
          height: 1,
          background: "#c2c2c2ff",
          margin: "45px auto",
        }}
      />

      {/* ========================= */}
      {/* BCV */}
      {/* ========================= */}
      <div style={{ textAlign: "center", marginBottom: 25 }}>
        <img
          src="/logobcv.svg"
          alt="BCV"
          style={{
            width: 95,
            opacity: 0.6,
            marginBottom: 5,
            filter: "grayscale(100%) brightness(0.8)",
          }}
        />
        <p style={{ opacity: 0.5, fontSize: "0.8rem" }}>
          Tasa de referencia del día.
        </p>
      </div>

      {/* ========================= */}
      {/* COPYRIGHT */}
      {/* ========================= */}
      <div style={{ textAlign: "center" }}>
        <p style={{ fontSize: "0.85rem", opacity: 0.65 }}>
          © {new Date().getFullYear()} Avela Store · Todos los derechos reservados.
        </p>
        <p style={{ fontSize: "0.8rem", opacity: 0.5, marginTop: 5 }}>
          Diseñado con ❤️ en Venezuela.
        </p>
      </div>
    </footer>
  );
}

/* ========================= */
/* ESTILOS */
/* ========================= */

const heading: React.CSSProperties = {
  fontSize: "0.95rem",
  fontWeight: "bold",
  marginBottom: 10,
  opacity: 0.75,
};

const link: React.CSSProperties = {
  display: "block",
  color: "white",
  opacity: 0.75,
  textDecoration: "none",
  marginBottom: 7,
  fontSize: "0.92rem",
};

const textItem: React.CSSProperties = {
  opacity: 0.65,
  marginBottom: 7,
  fontSize: "0.92rem",
};
