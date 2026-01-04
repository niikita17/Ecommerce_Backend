

import express from "express";
import {
  addToCart,
  getMyCart,
  getAllCarts,
  getUserCart,
  removeFromCart,
 
} from "../controller/cartController.js";
import  auth  from "../middleware/auth.js";
import  isAdmin  from "../middleware/isAdmin.js";

const router = express.Router();

router.use(auth);

router.post("/add", addToCart);
router.get("/my",  getMyCart);
router.get("/all",  isAdmin,getAllCarts);
router.get("/:id",  isAdmin,  getUserCart);
router.delete("/:id",removeFromCart);


export default router;
