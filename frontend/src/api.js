const API_BASE = import.meta.env.VITE_API_URL || "/api";

async function request(url, options = {}) {
  let storedUser = null;
  try {
    storedUser = JSON.parse(localStorage.getItem("vaishnavi_user"));
  } catch {
    storedUser = null;
  }
  const userId = localStorage.getItem("vaishnavi_user_id") || storedUser?.userId;
  const response = await fetch(`${API_BASE}${url}`, {
    headers: {
      "Content-Type": "application/json",
      ...(userId ? { "X-User-Id": userId } : {}),
      ...(options.headers || {})
    },
    ...options
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong.");
  }

  return data;
}

export const api = {
  getBooks: (params = {}) => {
    const query = new URLSearchParams();

    if (params.search) query.set("search", params.search);
    if (params.category && params.category !== "All") {
      query.set("category", params.category);
    }

    const queryString = query.toString();
    return request(`/books${queryString ? `?${queryString}` : ""}`);
  },

  register: (payload) =>
    request("/auth/register", {
      method: "POST",
      body: JSON.stringify(payload)
    }),

  login: (payload) =>
    request("/auth/login", {
      method: "POST",
      body: JSON.stringify(payload)
    }),

  getCart: () => request("/cart"),
  addToCart: (bookId) => request(`/cart/items/${bookId}`, { method: "POST" }),
  updateCartItem: (itemId, quantity) => request(`/cart/items/${itemId}`, { method: "PUT", body: JSON.stringify({ quantity }) }),
  removeCartItem: (itemId) => request(`/cart/items/${itemId}`, { method: "DELETE" }),
  checkout: () => request("/orders/checkout", { method: "POST" }),
  getLatestInvoice: () => request("/orders/latest")
};
