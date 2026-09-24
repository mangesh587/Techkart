const express = require("express");
const mongoose = require("mongoose");

const Order = require("../models/Order");
const User = require("../models/User");

const {
  protect,
  adminOnly,
} = require("../middleware/authMiddleware");

const router = express.Router();


// =====================================================
// CREATE ORDER - CUSTOMER
// =====================================================

router.post(
  "/",
  protect,
  async (req, res) => {
    try {

      // Get logged-in user from JWT
      const userId = req.user.id;

      if (!userId) {
        return res.status(401).json({
          message: "User information not found",
        });
      }

      // Find actual logged-in user
      const user = await User.findById(userId);

      if (!user) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      const {
        customer,
        products,
        paymentMethod,
        totalAmount,
      } = req.body;


      // Validate products
      if (
        !products ||
        !Array.isArray(products) ||
        products.length === 0
      ) {
        return res.status(400).json({
          message: "Order must contain at least one product",
        });
      }


      // Validate payment method
      const allowedPaymentMethods = [
        "cod",
        "upi",
        "card",
      ];

      if (
        !allowedPaymentMethods.includes(
          paymentMethod
        )
      ) {
        return res.status(400).json({
          message: "Invalid payment method",
        });
      }


      // Validate total amount
      if (
        typeof totalAmount !== "number" ||
        totalAmount <= 0
      ) {
        return res.status(400).json({
          message: "Invalid order total",
        });
      }


      /*
       * IMPORTANT
       *
       * We use the logged-in user's email
       * instead of trusting the email entered
       * manually in the checkout form.
       *
       * This guarantees that My Orders can
       * find the order later.
       */

      const customerData = {
        ...customer,
        email: user.email,
      };


      const order = new Order({
        customer: customerData,
        products: products,
        paymentMethod: paymentMethod,
        totalAmount: totalAmount,
        status: "Pending",
      });


      const savedOrder = await order.save();


      console.log(
        "ORDER CREATED SUCCESSFULLY"
      );

      console.log(
        "User:",
        user.email
      );

      console.log(
        "Order ID:",
        savedOrder._id
      );


      res.status(201).json({
        message: "Order created successfully",
        order: savedOrder,
      });

    } catch (error) {

      console.error(
        "CREATE ORDER ERROR:",
        error
      );

      res.status(400).json({
        message: "Failed to create order",
        error: error.message,
      });
    }
  }
);


// =====================================================
// GET MY ORDERS - CUSTOMER
// =====================================================

router.get(
  "/my-orders",
  protect,
  async (req, res) => {
    try {

      const userId = req.user.id;

      if (!userId) {
        return res.status(401).json({
          message: "User information not found",
        });
      }


      // Find logged-in user
      const user = await User.findById(userId);

      if (!user) {
        return res.status(404).json({
          message: "User not found",
        });
      }


      console.log(
        "MY ORDERS REQUEST"
      );

      console.log(
        "Logged-in user:",
        user.email
      );


      // Find orders using logged-in user's email
      const orders = await Order.find({
        "customer.email": user.email,
      }).sort({
        createdAt: -1,
      });


      console.log(
        "Orders found:",
        orders.length
      );


      res.json(orders);

    } catch (error) {

      console.error(
        "GET MY ORDERS ERROR:",
        error
      );

      res.status(500).json({
        message: "Failed to fetch your orders",
        error: error.message,
      });
    }
  }
);


// =====================================================
// GET ALL ORDERS - ADMIN
// =====================================================

router.get(
  "/",
  protect,
  adminOnly,
  async (req, res) => {
    try {

      const orders = await Order.find()
        .sort({
          createdAt: -1,
        });


      res.json(orders);

    } catch (error) {

      console.error(
        "GET ORDERS ERROR:",
        error
      );

      res.status(500).json({
        message: "Failed to fetch orders",
        error: error.message,
      });
    }
  }
);


// =====================================================
// UPDATE ORDER STATUS - ADMIN
// =====================================================

router.put(
  "/:id/status",
  protect,
  adminOnly,
  async (req, res) => {
    try {

      const { id } = req.params;
      const { status } = req.body;


      console.log(
        "Updating order:"
      );

      console.log(
        "Order ID:",
        id
      );

      console.log(
        "New Status:",
        status
      );


      if (
        !mongoose.Types.ObjectId.isValid(id)
      ) {
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


      if (
        !allowedStatuses.includes(status)
      ) {
        return res.status(400).json({
          message: "Invalid order status",
        });
      }


      const updatedOrder =
        await Order.findByIdAndUpdate(
          id,
          {
            status: status,
          },
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


      console.log(
        "Order status updated successfully"
      );


      res.json({
        message:
          "Order status updated successfully",
        order: updatedOrder,
      });

    } catch (error) {

      console.error(
        "UPDATE STATUS ERROR:",
        error
      );

      res.status(500).json({
        message: "Failed to update order status",
        error: error.message,
      });
    }
  }
);


// =====================================================
// DELETE ORDER - ADMIN
// =====================================================

router.delete(
  "/:id",
  protect,
  adminOnly,
  async (req, res) => {
    try {

      const { id } = req.params;


      console.log(
        "Deleting order:",
        id
      );


      if (
        !mongoose.Types.ObjectId.isValid(id)
      ) {
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


      console.log(
        "Order deleted successfully"
      );


      res.json({
        message:
          "Order deleted successfully",
      });

    } catch (error) {

      console.error(
        "DELETE ORDER ERROR:",
        error
      );

      res.status(500).json({
        message:
          "Failed to delete order",
        error: error.message,
      });
    }
  }
);


module.exports = router;
