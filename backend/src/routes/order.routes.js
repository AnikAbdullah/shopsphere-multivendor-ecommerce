const express = require("express");
const {
  createOrder,
  getOrders,
  getOrderById,
} = require("../controllers/order.controller");

const router = express.Router();

router.route("/").post(createOrder).get(getOrders);

router.get("/:id", getOrderById);

module.exports = router;
