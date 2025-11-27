const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";
const STRAPI_TOKEN = process.env.NEXT_PUBLIC_STRAPI_TOKEN;

export async function strapiFetch(path: string, options: RequestInit = {}) {
  const url = `${STRAPI_URL}/api${path}`;

  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (STRAPI_TOKEN) {
    headers["Authorization"] = `Bearer ${STRAPI_TOKEN}`;
  }

  const res = await fetch(url, {
    ...options,
    headers: {
      ...headers,
      ...(options.headers || {}),
    },
    cache: "no-store", // evita cache si quieres SSR fresh
  });

  if (!res.ok) {
    console.error("Strapi error:", await res.text());
    throw new Error("Error fetching Strapi");
  }

  return res.json();
}
