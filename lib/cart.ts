// lib/cart.ts
export const CART_KEY = "avela_cart";

export type CartItem = {
  sku: string;
  nombre: string;
  talla?: string | null;
  imagenUrl?: string | null;
};

export function getCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(CART_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    return [];
  }
}

export function saveCart(items: CartItem[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(CART_KEY, JSON.stringify(items));
}

export function addToCart(item: CartItem) {
  if (typeof window === "undefined") return;
  const current = getCart();
  current.push(item);
  saveCart(current);

  // Notificar a la navbar u otros componentes
  window.dispatchEvent(new CustomEvent("cartUpdated"));
}

export function clearCart() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(CART_KEY);
  window.dispatchEvent(new CustomEvent("cartUpdated"));
}

export function removeItemByIndex(index: number) {
  if (typeof window === "undefined") return;
  const current = getCart();
  if (index < 0 || index >= current.length) return;
  current.splice(index, 1);
  saveCart(current);
  window.dispatchEvent(new CustomEvent("cartUpdated"));
}
