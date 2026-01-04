import express from"express";
 import auth from "../middleware/auth.js";
import isAdmin from"../middleware/isAdmin.js";
const router = express.Router();

router.use(auth);

import { checkout, 
    createPayment,
    verifyPayment,
    placeOrderCOD, } from "../controller/paymentController.js";


router.use(auth);

    router.post("/method",checkout);
    router.post("/makepayment",createPayment);
    router.post("/verifyPayment",verifyPayment);
        router.post("/COD",placeOrderCOD);

export default router;