"use client";
import { useEffect, useState } from "react";

export default function Toast({ message }: { message: string }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setVisible(false), 2000);
    return () => clearTimeout(t);
  }, []);

  if (!visible) return null;

  return (
    <div style={toastStyles}>
      {message}
    </div>
  );
}

const toastStyles: React.CSSProperties = {
  position: "fixed",
  bottom: 30,
  left: "50%",
  transform: "translateX(-50%)",
  background: "#ffffffff",
  color: "#000",
  padding: "12px 20px",
  borderRadius: 8,
  fontWeight: "bold",
  zIndex: 99999,
  boxShadow: "0 0 10px rgba(0,0,0,0.5)",
};
