import Cart from "../models/cart.js";
import Product from "../models/product.js";

export const addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const userId = req.user.id;

    if (!productId || quantity <= 0) {
      return res.status(400).json({ message: "Invalid data" });
    }

    const product = await Product.findById(productId);
    if (!product || !product.isActive) {
      return res.status(404).json({ message: "Product not available" });
    }

    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      cart = await Cart.create({
        user: userId,
        items: [{ product: productId, quantity }]
      });
    } else {
      const itemIndex = cart.items.findIndex(
        item => item.product.toString() === productId
      );

      if (itemIndex > -1) {
        cart.items[itemIndex].quantity += quantity;
      } else {
        cart.items.push({ product: productId, quantity });
      }
      await cart.save();
    }

    res.status(200).json({ success: true, cart });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to add item" });
  }
};


export const getMyCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id })
      .populate("items.product", "name price image");

    return res.status(200).json({
      success: true,
      cart: cart || { items: [] }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch cart" });
  }
};


export const getAllCarts = async (req, res) => {
  try {
    const carts = await Cart.find()
      .populate("user", "name email")
      .populate("items.product", "name price image");

    res.status(200).json({
      success: true,
      carts
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch carts" });
  }
};


export const getUserCart = async (req, res) => {
  try {
    const { userId } = req.params;

    const cart = await Cart.findOne({ user: userId })
      .populate("user", "name email")
      .populate("items.product", "name price image");

    if (!cart) {
      return res.status(404).json({
        message: "Cart not found"
      });
    }

    res.status(200).json({
      success: true,
      cart
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch cart" });
  }
};


export const removeFromCart = async (req, res) => {
  try {
    const  productId  = req.params.id;
    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      return res.status(404).json({
        message: "Cart not found"
      });
    }

    const itemIndex = cart.items.findIndex(
      item => item.product.toString() === productId
    );

    if (itemIndex === -1) {
      return res.status(404).json({
        message: "Product not found in cart"
      });
    }

    cart.items.splice(itemIndex, 1);

    await cart.save();

    return res.status(200).json({
      success: true,
      message: "Item removed from cart",
      cart
    });
  } catch (error) {
    console.error("Remove Cart Item Error:", error);
    return res.status(500).json({
      message: "Failed to remove item"
    });
  }
};
