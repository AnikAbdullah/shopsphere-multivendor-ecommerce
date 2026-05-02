const Order = require("../models/Order");

const createOrder = async (req, res, next) => {
  try {
    const { items, shippingAddress, paymentMethod } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Order items are required.",
      });
    }

    if (
      !shippingAddress ||
      !shippingAddress.fullName ||
      !shippingAddress.phone ||
      !shippingAddress.address ||
      !shippingAddress.city
    ) {
      return res.status(400).json({
        success: false,
        message: "Complete shipping address is required.",
      });
    }

    const orderItems = items.map((item) => ({
      product: item.product || null,
      name: item.name,
      image: item.image || "",
      price: Number(item.price),
      quantity: Number(item.quantity),
    }));

    const subtotal = orderItems.reduce((total, item) => {
      return total + item.price * item.quantity;
    }, 0);

    const deliveryFee = subtotal > 0 && subtotal < 2000 ? 120 : 0;
    const total = subtotal + deliveryFee;

    const order = await Order.create({
      customer: req.user?._id || null,
      items: orderItems,
      shippingAddress,
      paymentMethod: paymentMethod || "cash_on_delivery",
      paymentStatus: "pending",
      orderStatus: "pending",
      subtotal,
      deliveryFee,
      total,
    });

    return res.status(201).json({
      success: true,
      message: "Order created successfully.",
      data: {
        order,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getOrders = async (req, res, next) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 }).limit(20);

    return res.status(200).json({
      success: true,
      message: "Orders retrieved successfully.",
      data: {
        orders,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Order retrieved successfully.",
      data: {
        order,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createOrder,
  getOrders,
  getOrderById,
};
