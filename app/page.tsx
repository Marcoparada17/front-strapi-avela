import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Footer from "./components/Footer";
import ProductCard from "./components/ProductCard";
import { strapiFetch } from "@/lib/strapi";

export default async function Home() {
  const res = await strapiFetch("/traje-de-banos?populate=Imagenes");
  const productos = res?.data || [];

  return (
    <>
      {/* Mobile layout especial */}

      <style>
        {`
          /* GRID mobile: 2 columnas, poco gap */
          @media (max-width: 768px) {
            .grid-home {
              grid-template-columns: repeat(2, 1fr) !important;
              gap: 12px !important;
            }

            .home-container {
              padding: 20px !important; /* reduce padding */
            }

            .card-desktop {
              display: none !important; /* oculta título y descripción */
            }

            .card-mobile-price {
              display: block !important;
              text-align: center;
              margin-top: 6px;
              font-size: 1rem;
              font-weight: bold;
            }
          }
        `}
      </style>

      <Navbar />
      <Hero />

      <main className="home-container" style={{ padding: "40px 60px" }}>
        <h2 style={{ fontSize: 28, marginBottom: 20 }}>Catálogo destacado</h2>

        <div style={{ marginBottom: 30 }}>
          <a
            href="/catalogo"
            style={{
              background: "white",
              color: "black",
              padding: "10px 18px",
              borderRadius: 6,
              fontWeight: "bold",
              textDecoration: "none",
            }}
          >
            Ver catálogo completo →
          </a>
        </div>

        {/* GRID */}
        <div
          className="grid-home"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
            gap: 30,
          }}
        >
          {productos.slice(0, 6).map((p: any) => {
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
      </main>

      <Footer />
    </>
  );
}
