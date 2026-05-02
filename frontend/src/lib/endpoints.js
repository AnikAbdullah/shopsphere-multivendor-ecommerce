export const endpoints = {
  auth: {
    register: "/auth/register",
    login: "/auth/login",
    logout: "/auth/logout",
    refresh: "/auth/refresh",
    me: "/auth/me",
  },

  users: {
    profile: "/users/profile",
    addresses: "/users/addresses",
  },

  products: {
    root: "/products",
    featured: "/products/featured",
    bySlug: (slug) => `/products/${slug}`,
  },

  categories: {
    root: "/categories",
  },

  uploads: {
    products: "/uploads/products",
  },
};
