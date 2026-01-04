import Order from "../models/order.js";


import Cart from "../models/cart.js";




export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({ orders });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to fetch orders"
    });
  }
};
export const getMyOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findOne({
      _id: id,
      user: req.user.id
    }).populate("user", "name email");

    if (!order) {
      return res.status(404).json({
        message: "Order not found"
      });
    }

    res.status(200).json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to fetch order"
    });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({ orders });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to fetch orders"
    });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id)
      .populate("user", "name email");

    if (!order) {
      return res.status(404).json({
        message: "Order not found"
      });
    }

    res.status(200).json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to fetch order"
    });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const allowed = ["pending", "paid", "shipped", "delivered"];
    if (!allowed.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.status = status;
    await order.save();

    res.json({ order });
  } catch (error) {
    res.status(500).json({ message: "Failed to update order" });
  }
};
