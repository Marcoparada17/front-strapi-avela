export const metadata = {
  title: "Avela Store",
  description: "Tu mejor opcion en moda playera",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body
        style={{
          backgroundColor: "#000",
          color: "#fff",
          margin: 0,
          padding: 0,
          fontFamily: "sans-serif",
          overflowX: "hidden",
        }}
      >
        {/* Aquí NO va navbar, aquí NO va footer */}
        {children}
      </body>
    </html>
  );
}
