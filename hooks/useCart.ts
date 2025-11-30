"use client";

import { useEffect, useState } from "react";

export function useCart() {
  const [cart, setCart] = useState<any[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("avela_cart");
    if (saved) setCart(JSON.parse(saved));
  }, []);

  const add = (item: any) => {
    const saved = localStorage.getItem("avela_cart");
    const arr = saved ? JSON.parse(saved) : [];

    arr.push(item); // agregar sin borrar los anteriores
    localStorage.setItem("avela_cart", JSON.stringify(arr));
    setCart(arr);

    // 🔥 Esto permite que cualquier parte del sitio se actualice automáticamente.
    window.dispatchEvent(new Event("cartUpdated"));
  };

  return { cart, add };
}
