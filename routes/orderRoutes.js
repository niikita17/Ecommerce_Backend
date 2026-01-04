import express from"express";
 import auth from "../middleware/auth.js";
import isAdmin from"../middleware/isAdmin.js";
import {

  getMyOrders,
getMyOrderById,
getAllOrders,
getOrderById,
updateOrderStatus
} from "../controller/orderController.js";

const router = express.Router();
router.use(auth);

router.get("/my/all", getMyOrders);
router.get("/my/:id", auth, getMyOrderById);
router.get("/all", auth, isAdmin, getAllOrders);
router.get("/:id", auth, isAdmin, getOrderById);
router.put("/:id", auth, isAdmin, updateOrderStatus
);

export default router;
