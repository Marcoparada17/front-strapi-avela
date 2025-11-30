"use client";

import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProductCard from "../components/ProductCard";
import { strapiFetch } from "@/lib/strapi";

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
  const [tallaSeleccionada, setTallaSeleccionada] = useState("Todas");
  const [loading, setLoading] = useState(true);

  // 🔥 PAGINACIÓN REAL EN STRAPI
  const [page, setPage] = useState(1);
  const pageSize = 12;
  const [pageCount, setPageCount] = useState(1);

  // 1) Cargar tallas una sola vez
  useEffect(() => {
    async function loadTallas() {
      try {
        // puedes subir pageSize si algún día tienes más productos
        const res = await strapiFetch(
          "/traje-de-banos?pagination[page]=1&pagination[pageSize]=200&fields[0]=Talla"
        );

        const data: Producto[] = res?.data || [];

        const unique = Array.from(
          new Set(
            data
              .map((p) => (p.Talla ? String(p.Talla) : ""))
              .filter((t) => t !== "")
          )
        );

        setTallas(unique);
      } catch (err) {
        console.error("Error cargando tallas", err);
      }
    }

    loadTallas();
  }, []);

  // 2) Cargar productos según página + tallaSeleccionada (paginación Strapi)
  useEffect(() => {
    async function loadProductos() {
      try {
        setLoading(true);

        let url = `/traje-de-banos?populate=Imagenes&pagination[page]=${page}&pagination[pageSize]=${pageSize}`;

        if (tallaSeleccionada !== "Todas") {
          url += `&filters[Talla][$eq]=${encodeURIComponent(
            tallaSeleccionada
          )}`;
        }

        const res = await strapiFetch(url);

        const data: Producto[] = res?.data || [];
        const metaPagination = res?.meta?.pagination;

        setProductos(data);
        setPageCount(metaPagination?.pageCount || 1);
      } catch (err) {
        console.error("Error cargando productos", err);
      } finally {
        setLoading(false);
      }
    }

    loadProductos();
  }, [page, tallaSeleccionada]);

  // cuando cambias de talla, siempre volvemos a página 1
  const handleChangeTalla = (talla: string) => {
    setTallaSeleccionada(talla);
    setPage(1);
  };

  return (
    <>
      <Navbar />

      <div style={{ padding: "120px 40px", color: "white" }}>
        <h1 style={{ fontSize: "2rem", marginBottom: 20 }}>Catálogo Completo</h1>

        {/* LOADER */}
        {loading && (
          <p style={{ color: "white", padding: 20 }}>Cargando catálogo…</p>
        )}

        {/* CONTENIDO SOLO CUANDO NO ESTÁ CARGANDO */}
        {!loading && (
          <>
            {/* FILTRO POR TALLA */}
            <div
              style={{
                marginBottom: 20,
                display: "flex",
                gap: 10,
                flexWrap: "wrap",
              }}
            >
              <button
                onClick={() => handleChangeTalla("Todas")}
                style={{
                  padding: "8px 16px",
                  background:
                    tallaSeleccionada === "Todas" ? "#32cd32" : "#222",
                  color: "white",
                  border: "1px solid #444",
                  borderRadius: 8,
                  cursor: "pointer",
                }}
              >
                Todas
              </button>

              {tallas.map((talla) => (
                <button
                  key={talla}
                  onClick={() => handleChangeTalla(talla)}
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

            {/* GRID DE PRODUCTOS (YA VIENEN PAGINADOS) */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fill, minmax(220px, 1fr))",
                gap: 25,
              }}
            >
              {productos.map((p) => {
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

              {productos.length === 0 && (
                <p style={{ gridColumn: "1 / -1", opacity: 0.8 }}>
                  No hay productos para esta talla.
                </p>
              )}
            </div>

            {/* PAGINACIÓN */}
            {pageCount > 1 && (
              <div
                style={{
                  marginTop: 35,
                  display: "flex",
                  justifyContent: "center",
                  gap: 14,
                  alignItems: "center",
                }}
              >
                <button
                  onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                  disabled={page === 1}
                  style={{
                    padding: "8px 14px",
                    borderRadius: 6,
                    background: page === 1 ? "#444" : "white",
                    color: page === 1 ? "#888" : "black",
                    border: "none",
                    cursor: page === 1 ? "not-allowed" : "pointer",
                  }}
                >
                  ← Anterior
                </button>

                <span style={{ fontSize: 18 }}>
                  Página {page} / {pageCount}
                </span>

                <button
                  onClick={() =>
                    setPage((prev) => Math.min(prev + 1, pageCount))
                  }
                  disabled={page === pageCount}
                  style={{
                    padding: "8px 14px",
                    borderRadius: 6,
                    background: page === pageCount ? "#444" : "white",
                    color: page === pageCount ? "#888" : "black",
                    border: "none",
                    cursor:
                      page === pageCount ? "not-allowed" : "pointer",
                  }}
                >
                  Siguiente →
                </button>
              </div>
            )}
          </>
        )}
      </div>

      <Footer />
    </>
  );
}
