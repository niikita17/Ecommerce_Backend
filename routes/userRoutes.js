import express from"express";
const app = express();
 import auth from "../middleware/auth.js";
import isAdmin from"../middleware/isAdmin.js";
import {
  create,
  update,

} from "../controller/userController.js";

const router = express.Router();

router.post("/add",  create);
router.put("/update", auth, update);

export default router;