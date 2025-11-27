import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Footer from "./components/Footer";
import ProductCard from "./components/ProductCard";
import { strapiFetch } from "@/lib/strapi";

export default async function Home() {
  const res = await strapiFetch(
    "/traje-de-banos?populate=Imagenes"
  );

  const productos = res?.data || [];

  return (
    <>
      <Navbar />
      <Hero />

      <main style={{ padding: "40px 60px" }}>
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

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
            gap: 30,
          }}
        >
          {productos.slice(0, 4).map((p: any) => {
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
