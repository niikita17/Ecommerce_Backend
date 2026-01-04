import express from "express";
 import auth from"../middleware/auth.js";
import isAdmin from"../middleware/isAdmin.js";
import {
  addCustomer,
  updateCustomer,
  deleteCustomer
} from "../controller/adminController.js";

const router = express.Router();
const app=express();
app.use(auth);

router.post("/add", addCustomer);
router.put("/update/:id", isAdmin,updateCustomer);
router.delete("/delete/:id", isAdmin, deleteCustomer);

export default router;
