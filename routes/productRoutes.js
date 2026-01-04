import express from"express";
 import auth from "../middleware/auth.js";
import isAdmin from"../middleware/isAdmin.js";
import {
  createProduct,
  updateProduct,
  deleteProduct,
  getProduct,
 getAllProducts,
} from "../controller/productController.js";

const router = express.Router();

router.post("/create", auth, isAdmin, createProduct);
router.put("/update/:id", auth, isAdmin, updateProduct);
router.delete("/delete/:id", auth, isAdmin, deleteProduct);

router.get("/", getAllProducts);
router.get("/:id", getProduct);


export default router;
