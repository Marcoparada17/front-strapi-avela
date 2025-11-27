"use client";

import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProductCard from "../components/ProductCard";
import { strapiFetch } from "@/lib/strapi";

// Tipamos explícitamente lo que Strapi devuelve
interface ImagenFormato {
  url: string;
}
interface ImagenItem {
  url: string;
  formats?: {
    thumbnail?: ImagenFormato;
    small?: ImagenFormato;
    medium?: ImagenFormato;
    large?: ImagenFormato;
  };
}

interface Producto {
  id: number;
  Nombre: string;
  Talla: string;
  Precio: number | null;
  SKU: string;
  Imagenes: ImagenItem[];
}

export default function Catalogo() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [tallas, setTallas] = useState<string[]>([]);
  const [tallaSeleccionada, setTallaSeleccionada] = useState<string>("Todas");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const res = await strapiFetch(
        "/traje-de-banos?populate=Imagenes"
      );

      const data: Producto[] = res?.data || [];

      setProductos(data);

      // ============================
      // TALLAS ÚNICAS - Tipado fuerte
      // ============================
      const unique: string[] = Array.from(
        new Set(data.map((p) => String(p.Talla)))
      );

      setTallas(unique);

      setLoading(false);
    }

    load();
  }, []);

  if (loading)
    return <p style={{ color: "white", padding: 40 }}>Cargando catálogo…</p>;

  // ============================
  // FILTRO REAL POR TALLA
  // ============================
  const productosFiltrados =
    tallaSeleccionada === "Todas"
      ? productos
      : productos.filter((p) => p.Talla === tallaSeleccionada);

  return (
    <>
      <Navbar />

      <div style={{ padding: "120px 40px", color: "white" }}>
        <h1 style={{ fontSize: "2rem", marginBottom: 20 }}>Catálogo Completo</h1>

        {/* ============================
            BOTONES DE TALLA
        ============================ */}
        <div
          style={{
            marginBottom: 20,
            display: "flex",
            gap: 10,
            flexWrap: "wrap",
          }}
        >
          {/* BOTÓN "TODAS" */}
          <button
            key="todas"
            onClick={() => setTallaSeleccionada("Todas")}
            style={{
              padding: "8px 16px",
              background: tallaSeleccionada === "Todas" ? "#32cd32" : "#222",
              color: "white",
              border: "1px solid #444",
              borderRadius: 8,
              cursor: "pointer",
            }}
          >
            Todas
          </button>

          {/* LISTA DE TALLAS */}
          {tallas.map((talla) => (
            <button
              key={talla}
              onClick={() => setTallaSeleccionada(talla)}
              style={{
                padding: "8px 16px",
                background:
                  tallaSeleccionada === talla ? "#32cd32" : "#222",
                color: "white",
                border: "1px solid #444",
                borderRadius: 8,
                cursor: "pointer",
              }}
            >
              {talla}
            </button>
          ))}
        </div>

        {/* ============================
            GRID DE PRODUCTOS FILTRADOS
        ============================ */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
            gap: 25,
          }}
        >
          {productosFiltrados.map((p) => {
            const img =
              p.Imagenes?.[0]?.formats?.medium?.url ||
              p.Imagenes?.[0]?.url ||
              null;

            return (
              <ProductCard
                key={p.id}
                title={p.Nombre}
                price={p.Precio}
                image={img}
                slug={String(p.SKU)}
              />
            );
          })}
        </div>
      </div>

      <Footer />
    </>
  );
}
