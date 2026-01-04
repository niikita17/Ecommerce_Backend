import Product from "../models/product.js";

export const createProduct = async (req, res) => {
  try {
    const { name, description, price, category, stock } = req.body;

    // Validation
    if (!name || !description || !price || !category) {
      return res.status(400).json({
        message: "Name, description, price and category are required"
      });
    }

    if (price <= 0) {
      return res.status(400).json({
        message: "Price must be greater than 0"
      });
    }

    const product = await Product.create({
      name,
      description,
      price,
      category,
      stock,
      image: req.file?.path // supports image upload
    });

    return res.status(201).json({
      success: true,
      product
    });
  } catch (error) {
    console.error("Create Product Error:", error);
    return res.status(500).json({
      message: "Failed to create product"
    });
  }
};


export const updateProduct = async (req, res) => {
  try {
    const productId = req.params.id;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        message: "Product not found"
      });
    }

    // Update only allowed fields
    const allowedFields = [
      "name",
      "description",
      "price",
      "category",
      "stock"
    ];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        product[field] = req.body[field];
      }
    });

    if (req.file?.path) {
      product.image = req.file.path;
    }

    await product.save();

    return res.json({
      success: true,
      product
    });
  } catch (error) {
    console.error("Update Product Error:", error);
    return res.status(500).json({
      message: "Failed to update product"
    });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found"
      });
    }

    await product.deleteOne();

    return res.json({
      success: true,
      message: "Product deleted successfully"
    });
  } catch (error) {
    console.error("Delete Product Error:", error);
    return res.status(500).json({
      message: "Failed to delete product"
    });
  }
};






export const getProduct = async (req, res) => {
  try {
    const productId = req.params.id;

    const product = await Product.findOne({
      _id: productId,
      isActive: true
    });

    if (!product) {
      return res.status(404).json({
        message: "Product not found"
      });
    }

    return res.json({
      success: true,
      product
    });
    
  } catch (error) {
    console.error("Get Product Error:", error);

    // Invalid MongoDB ObjectId
    if (error.name === "CastError") {
      return res.status(400).json({
        message: "Invalid product ID"
      });
    }

    return res.status(500).json({
      message: "Failed to fetch product"
    });
  }
};


export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({ isActive: true })
      .sort({ createdAt: -1 });
 if (!products) {
      return res.status(404).json({
        message: "Product not found"
      });
    }
    return res.json({
      success: true,
      count: products.length,
      products
    });
  } catch (error) {
    console.error("Get All Products Error:", error);
    return res.status(500).json({
      message: "Failed to fetch products"
    });
  }

};
