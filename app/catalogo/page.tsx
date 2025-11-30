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
  // ===== Hooks SIEMPRE en el tope =====
  const [productos, setProductos] = useState<Producto[]>([]);
  const [tallas, setTallas] = useState<string[]>([]);
  const [tallaSeleccionada, setTallaSeleccionada] = useState("Todas");
  const [loading, setLoading] = useState(true);

  // 🔥 PAGINACIÓN
  const [page, setPage] = useState(1);
  const itemsPerPage = 12;

  useEffect(() => {
    async function load() {
      const res = await strapiFetch("/traje-de-banos?populate=Imagenes");
      const data: Producto[] = res?.data || [];

      setProductos(data);

      const unique = Array.from(new Set(data.map((p) => String(p.Talla))));
      setTallas(unique);

      setLoading(false);
    }

    load();
  }, []);

  // 🔥 Filtrado (no genera hooks)
  const productosFiltrados =
    tallaSeleccionada === "Todas"
      ? productos
      : productos.filter((p) => p.Talla === tallaSeleccionada);

  const totalPages = Math.ceil(productosFiltrados.length / itemsPerPage);

  const productosEnPagina = productosFiltrados.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  // Reset de página al cambiar talla
  useEffect(() => setPage(1), [tallaSeleccionada]);

  // ================================
  //  RETORNO NORMAL (loading dentro)
  // ================================
  return (
    <>
      <Navbar />

      <div style={{ padding: "120px 40px", color: "white" }}>
        <h1 style={{ fontSize: "2rem", marginBottom: 20 }}>Catálogo Completo</h1>

        {/* LOADER DENTRO DEL JSX → fijo el problema */}
        {loading && (
          <p style={{ color: "white", padding: 40 }}>Cargando catálogo…</p>
        )}

        {!loading && (
          <>
            {/* FILTROS DE TALLA */}
            <div
              style={{
                marginBottom: 20,
                display: "flex",
                gap: 10,
                flexWrap: "wrap",
              }}
            >
              <button
                onClick={() => setTallaSeleccionada("Todas")}
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

            {/* GRID */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fill, minmax(220px, 1fr))",
                gap: 25,
              }}
            >
              {productosEnPagina.map((p) => {
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

            {/* PAGINACIÓN */}
            {totalPages > 1 && (
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
                    cursor:
                      page === 1 ? "not-allowed" : "pointer",
                  }}
                >
                  ← Anterior
                </button>

                <span style={{ fontSize: 18 }}>
                  Página {page} / {totalPages}
                </span>

                <button
                  onClick={() =>
                    setPage((prev) =>
                      Math.min(prev + 1, totalPages)
                    )
                  }
                  disabled={page === totalPages}
                  style={{
                    padding: "8px 14px",
                    borderRadius: 6,
                    background:
                      page === totalPages ? "#444" : "white",
                    color:
                      page === totalPages ? "#888" : "black",
                    border: "none",
                    cursor:
                      page === totalPages
                        ? "not-allowed"
                        : "pointer",
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
