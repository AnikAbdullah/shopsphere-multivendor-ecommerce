import { formatCurrency } from "@/lib/formatCurrency";
import { getImageUrl } from "@/lib/getImageUrl";

export const fallbackProductImage =
  "https://images.unsplash.com/photo-1487215078519-e21cc028cb29?auto=format&fit=crop&w=600&q=80";

export const getProductsFromResponse = (responseData) => {
  if (Array.isArray(responseData)) return responseData;
  if (Array.isArray(responseData?.products)) return responseData.products;
  if (Array.isArray(responseData?.items)) return responseData.items;
  if (Array.isArray(responseData?.data)) return responseData.data;

  return [];
};

export const formatBackendProduct = (product) => {
  const finalPrice = product.salePrice || product.price || 0;
  const oldPrice = product.salePrice ? product.price : null;

  return {
    id: product._id || product.id,
    name: product.name,
    slug: product.slug,
    category:
      product.category?.slug ||
      product.category?.name ||
      product.category ||
      "",
    image: getImageUrl(product.images?.[0], fallbackProductImage),
    rating: product.ratingAverage || 0,
    rawPrice: finalPrice,
    price: formatCurrency(finalPrice),
    oldPrice: oldPrice ? formatCurrency(oldPrice) : "",
  };
};

export const mergeProductsWithFallback = (
  backendProducts,
  fallbackProducts,
  limit = 8,
) => {
  const formattedBackendProducts = backendProducts
    .filter((product) => product && product.name)
    .slice(0, limit)
    .map(formatBackendProduct);

  const backendNames = formattedBackendProducts.map((product) =>
    product.name.toLowerCase(),
  );

  const missingFallbackProducts = fallbackProducts.filter(
    (product) => !backendNames.includes(product.name.toLowerCase()),
  );

  return [...formattedBackendProducts, ...missingFallbackProducts].slice(
    0,
    limit,
  );
};
