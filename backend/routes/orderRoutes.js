const express = require("express");
const mongoose = require("mongoose");
const Order = require("../models/Order");

const router = express.Router();

// =========================
// CREATE ORDER
// =========================

router.post("/", async (req, res) => {
  try {
    const order = new Order(req.body);

    const savedOrder = await order.save();

    res.status(201).json({
      message: "Order created successfully",
      order: savedOrder,
    });
  } catch (error) {
    console.error("CREATE ORDER ERROR:", error);

    res.status(400).json({
      message: "Failed to create order",
      error: error.message,
    });
  }
});

// =========================
// GET ALL ORDERS
// =========================

router.get("/", async (req, res) => {
  try {
    const orders = await Order.find().sort({
      createdAt: -1,
    });

    res.json(orders);
  } catch (error) {
    console.error("GET ORDERS ERROR:", error);

    res.status(500).json({
      message: "Failed to fetch orders",
      error: error.message,
    });
  }
});

// =========================
// UPDATE ORDER STATUS
// =========================

router.put("/:id/status", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    console.log("Updating order:");
    console.log("Order ID:", id);
    console.log("New Status:", status);

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid order ID",
      });
    }

    const allowedStatuses = [
      "Pending",
      "Processing",
      "Shipped",
      "Delivered",
      "Cancelled",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid order status",
      });
    }

    const updatedOrder =
      await Order.findByIdAndUpdate(
        id,
        { status: status },
        {
          new: true,
          runValidators: true,
        }
      );

    if (!updatedOrder) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    console.log("Order status updated successfully");

    res.json({
      message: "Order status updated successfully",
      order: updatedOrder,
    });
  } catch (error) {
    console.error("UPDATE STATUS ERROR:", error);

    res.status(500).json({
      message: "Failed to update order status",
      error: error.message,
    });
  }
});

// =========================
// DELETE ORDER
// =========================

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    console.log("Deleting order:", id);

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid order ID",
      });
    }

    const deletedOrder =
      await Order.findByIdAndDelete(id);

    if (!deletedOrder) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    console.log("Order deleted successfully");

    res.json({
      message: "Order deleted successfully",
    });
  } catch (error) {
    console.error("DELETE ORDER ERROR:", error);

    res.status(500).json({
      message: "Failed to delete order",
      error: error.message,
    });
  }
});

module.exports = router;