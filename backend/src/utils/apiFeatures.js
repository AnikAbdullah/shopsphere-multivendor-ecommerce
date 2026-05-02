const buildProductFilter = (query) => {
  const filter = {};

  if (query.search) {
    filter.$or = [
      {
        name: {
          $regex: query.search,
          $options: "i",
        },
      },
      {
        description: {
          $regex: query.search,
          $options: "i",
        },
      },
      {
        brand: {
          $regex: query.search,
          $options: "i",
        },
      },
    ];
  }

  if (query.category) {
    filter.category = query.category;
  }

  if (query.minPrice || query.maxPrice) {
    filter.price = {};

    if (query.minPrice) {
      filter.price.$gte = Number(query.minPrice);
    }

    if (query.maxPrice) {
      filter.price.$lte = Number(query.maxPrice);
    }
  }

  return filter;
};

const getSortOption = (sortQuery) => {
  if (!sortQuery) {
    return "-createdAt";
  }

  return sortQuery;
};

const getPagination = (query) => {
  const page = Math.max(Number(query.page) || 1, 1);
  const limit = Math.min(Math.max(Number(query.limit) || 12, 1), 100);
  const skip = (page - 1) * limit;

  return {
    page,
    limit,
    skip,
  };
};

module.exports = {
  buildProductFilter,
  getSortOption,
  getPagination,
};
