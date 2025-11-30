"use client";

import { useEffect, useState } from "react";

export default function Hero() {
  const [bg, setBg] = useState("/hero.png");
  const [heroHeight, setHeroHeight] = useState("70vh");
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const updateHero = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);

      if (mobile) {
        setBg("/fondomobile.jpg");
        setHeroHeight("100vh");
      } else {
        setBg("/hero.png");
        setHeroHeight("70vh"); // 🔥 más alto que antes
      }
    };

    updateHero();
    window.addEventListener("resize", updateHero);
    return () => window.removeEventListener("resize", updateHero);
  }, []);

  return (
    <section
      style={{
        width: "100%",
        maxWidth: "100vw",
        overflow: "hidden", 
        height: heroHeight,
        backgroundImage: `url(${bg})`,
        backgroundSize: "cover",
        backgroundPosition: isMobile ? "center" : "top center", // 👌 FIX corte
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "scroll", // 🔥 FIX scroll overlay
        display: "flex",
        alignItems: "center",
        padding: "0 20px",
        color: "white",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        <h1
          style={{
            fontSize: "3rem",
            marginBottom: 10,
            fontWeight: "bold",
            lineHeight: 1.1,
          }}
        >
          Productos únicos, hechos para ti
        </h1>

        <p
          style={{
            fontSize: "1.3rem",
            opacity: 0.9,
            maxWidth: "500px",
          }}
        >
          Explora nuestra colección exclusiva y encuentra tu estilo.
        </p>

        <a
          href="/catalogo"
          style={{
            marginTop: 20,
            padding: "12px 25px",
            borderRadius: 6,
            background: "#ffffff",
            color: "#000",
            fontWeight: "bold",
            fontSize: 16,
            display: "inline-block",
            textDecoration: "none",
          }}
        >
          Ver catálogo
        </a>
      </div>
    </section>
  );
}
