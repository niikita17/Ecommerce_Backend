import Cart from "../models/cart.js";
import Order from "../models/order.js";
import Product from "../models/product.js";

 const prepareOrderFromCart = async (cart) => {
  let totalAmount = 0;
  const orderItems = [];

  for (const item of cart.items) {
    if (item.quantity > item.product.stock) {
      throw new Error(`Insufficient stock for product ${item.product._id}`);
    }

    totalAmount += item.product.price * item.quantity;

    orderItems.push({
      product: item.product._id,
      quantity: item.quantity,
      price: item.product.price
    });
  }

  return { totalAmount, orderItems };
};

export const checkout = async (req, res) => {
  try {
     
    const  paymentMethod  = req.body.paymentMethod;

    if (!["ONLINE", "COD"].includes(paymentMethod)) {
      return res.status(400).json({
        message: "Invalid payment method"
      });
    }

    const cart = await Cart.findOne({ user: req.user.id });

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        message: "Cart is empty"
      });
    }

    res.status(200).json({
      success: true,
      paymentMethod,
      message: "Checkout validation successful"
    });

  } catch (error) {
    res.status(500).json({ message: "Checkout failed" });
  }
};


export const createPayment = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id })
      .populate("items.product", "price stock");

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        message: "Cart is empty"
      });
    }

    const { totalAmount } = await prepareOrderFromCart(cart);

    res.status(200).json({
      success: true,
      amount: totalAmount,
      currency: "INR"
    });

  } catch (error) {
    return res.status(400).json({
      message: error.message
    });
  }
};
export const verifyPayment = async (req, res) => {
  
  const session = await Cart.startSession();
  session.startTransaction();
  try {
    const {  paymentId,paymentStatus } = req.body;
 console.log(paymentId,paymentStatus);

    if (!paymentId || paymentStatus !== "success") {
      return res.status(400).json({
        message: "Payment verification failed"
      });
    }

    const cart = await Cart.findOne({ user: req.user.id })
      .populate("items.product", "price stock")
      .session(session);

    if (!cart || cart.items.length === 0) {
      throw new Error("Cart not found");
    }
 

    const { totalAmount, orderItems } = await prepareOrderFromCart(cart);


    // Reduce stock
    for (const item of cart.items) {
      item.product.stock -= item.quantity;
      await item.product.save({ session });
    }

    const order = await Order.create([{
      user: req.user.id,
      orderItems,
      totalPrice: totalAmount,
      status:"pending",
      paymentMethod: "ONLINE",
      paymentStatus: "paid",
      paymentInfo:{ paymentId }
    }], { session });
 

    await Cart.findOneAndDelete({ user: req.user.id }).session(session);

    await session.commitTransaction();

    res.status(201).json({
      success: true,
      order: order[0]
    });

  } catch (error) {
    await session.abortTransaction();
    res.status(400).json({
      message: error.message
    });
  } finally {
    session.endSession();
  }
};
export const placeOrderCOD = async (req, res) => {
  const session = await Cart.startSession();
  session.startTransaction();

  try {
    const cart = await Cart.findOne({ user: req.user.id })
      .populate("items.product", "price stock")
      .session(session);

    if (!cart || cart.items.length === 0) {
      throw new Error("Cart is empty");
    }

    const { totalAmount, orderItems } = await prepareOrderFromCart(cart);

    for (const item of cart.items) {
      item.product.stock -= item.quantity;
      await item.product.save({ session });
    }

    const order = await Order.create([{
      user: req.user.id,
      orderItems,
      totalPrice: totalAmount,
      paymentMethod: "COD",
      paymentStatus: "pending",
      
        paymentInfo:{ paymentId:0}
      
    }], { session });

    await Cart.findOneAndDelete({ user: req.user.id }).session(session);

    await session.commitTransaction();

    res.status(201).json({
      success: true,
      order: order[0]
    });

  } catch (error) {
    await session.abortTransaction();
    res.status(400).json({
      message: error.message
    });
  } finally {
    session.endSession();
  }
};
