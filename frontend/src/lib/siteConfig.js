export const siteConfig = {
  name: "ShopSphere",
  description:
    "A premium multivendor e-commerce marketplace for modern online shopping.",
  url: "http://localhost:3000",
  apiUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api",
  links: {
    home: "/",
    products: "/products",
    cart: "/cart",
    wishlist: "/wishlist",
    login: "/login",
    register: "/register",
    admin: "/admin",
    seller: "/seller",
  },
};
