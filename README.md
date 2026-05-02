# ShopSphere Multivendor E-Commerce

ShopSphere is a full-stack multivendor e-commerce website built with Next.js, Node.js, Express, MongoDB, and Stripe test checkout.

## Project Goal

The goal of this project is to build a modern marketplace where:

- Customers can browse products, use a cart, place orders, apply coupons, and write reviews.
- Sellers can manage their own products.
- Admins can manage products, categories, orders, users, coupons, reviews, and dashboard analytics.

## Design and UX Direction

ShopSphere should feel like a modern interactive marketplace, not a blog-style website.

The frontend should focus on shopping actions, product discovery, smooth animations, and clear user flows.

### Marketplace Experience

The UI should include:

- Premium sticky navigation
- Large marketplace-style hero banner
- Product-focused layout
- Search bar with strong visibility
- Category browsing
- Featured product sections
- Flash deal style sections
- Trending products
- New arrivals
- Best sellers
- Product cards with direct shopping actions
- Cart and wishlist interactions
- Smooth loading states
- Clean empty states
- Responsive mobile-first design

### Product Card Requirements

Product cards should feel like real e-commerce cards.

Each product card should support:

- Product image
- Discount badge when sale price exists
- Wishlist heart button
- Quick view action
- Product name
- Category or brand
- Rating display
- Regular price and sale price
- Stock status
- Add to cart button
- Hover animation

Avoid blog-style cards with long descriptions and “read more” behavior.

### Product Listing Requirements

The product listing page should include:

- Search input
- Category filter
- Price range filter
- Sorting dropdown
- Pagination
- Loading skeletons
- Empty state when no product is found
- Responsive product grid
- Mobile filter drawer

### Product Detail Requirements

The product detail page should include:

- Image gallery
- Product title
- Rating summary
- Price and sale price
- Stock status
- Variant selector
- Quantity selector
- Add to cart button
- Wishlist button
- Product description
- Related products section

### Cart and Wishlist Experience

The cart and wishlist should feel interactive.

They should include:

- Cart side drawer
- Quantity update controls
- Remove item button
- Subtotal and total calculation
- Clear checkout button
- Empty cart design
- Empty wishlist design
- Toast messages for actions

### Admin and Seller Dashboards

Dashboards should feel like real management panels.

They should include:

- Dashboard cards
- Charts
- Product tables
- Order tables
- Status badges
- Action buttons
- Clean forms
- Responsive layouts

## Tech Stack

### Frontend

- Next.js App Router
- JavaScript
- Tailwind CSS
- shadcn/ui
- Motion
- Axios
- Zustand
- Recharts

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- Zod Validation
- Multer Local Image Upload
- Stripe Test Checkout

## Folder Structure

```txt
shopsphere-multivendor-ecommerce/
  frontend/
  backend/
  README.md
  .gitignore
```
