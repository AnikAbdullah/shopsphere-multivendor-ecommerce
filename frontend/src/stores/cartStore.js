import { create } from "zustand";
import { persist } from "zustand/middleware";

const getCartItemId = (product) => {
  return product.id || product.slug || product.name;
};

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product, quantity = 1) => {
        const itemId = getCartItemId(product);

        if (!itemId) return;

        const existingItem = get().items.find((item) => item.id === itemId);

        if (existingItem) {
          set({
            items: get().items.map((item) =>
              item.id === itemId
                ? {
                    ...item,
                    quantity: item.quantity + quantity,
                  }
                : item,
            ),
          });

          return;
        }

        set({
          items: [
            ...get().items,
            {
              id: itemId,
              name: product.name,
              slug: product.slug || "",
              image: product.image,
              price: product.price,
              rawPrice: product.rawPrice || 0,
              quantity,
            },
          ],
        });
      },

      removeItem: (itemId) => {
        set({
          items: get().items.filter((item) => item.id !== itemId),
        });
      },

      updateQuantity: (itemId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(itemId);
          return;
        }

        set({
          items: get().items.map((item) =>
            item.id === itemId
              ? {
                  ...item,
                  quantity,
                }
              : item,
          ),
        });
      },

      clearCart: () => {
        set({
          items: [],
        });
      },

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getSubtotal: () => {
        return get().items.reduce((total, item) => {
          return total + Number(item.rawPrice || 0) * item.quantity;
        }, 0);
      },
    }),
    {
      name: "shopsphere-cart",
    },
  ),
);
