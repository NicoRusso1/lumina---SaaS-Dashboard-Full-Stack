import { Router } from "express";
import { userController } from "../controllers/user.controller";
import { authenticate, authorize } from "../middlewares/auth";

const router = Router();

router.use(authenticate, authorize("ADMIN"));

router.get("/", userController.getAll);
router.get("/:id", userController.getById);

export default router;
