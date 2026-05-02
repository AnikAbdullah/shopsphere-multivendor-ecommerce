const apiBaseUrl =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api";

const backendBaseUrl = apiBaseUrl.replace("/api", "");

export const getImageUrl = (image, fallbackImage) => {
  if (!image) return fallbackImage;

  if (typeof image === "string") {
    if (image.startsWith("http")) return image;

    if (image.startsWith("/")) {
      return `${backendBaseUrl}${image}`;
    }

    return `${backendBaseUrl}/${image}`;
  }

  if (image.url) {
    if (image.url.startsWith("http")) return image.url;

    if (image.url.startsWith("/")) {
      return `${backendBaseUrl}${image.url}`;
    }

    return `${backendBaseUrl}/${image.url}`;
  }

  return fallbackImage;
};
