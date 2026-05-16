import { Router } from "express";
import { boardController } from "../controllers/board.controller";
import { authenticate } from "../middlewares/auth";
import { validate } from "../middlewares/validate";
import { boardSchema } from "../validators";

const router = Router();

router.use(authenticate);

router.get("/", boardController.getAll);
router.get("/:id", boardController.getById);
router.post("/", validate(boardSchema), boardController.create);
router.put("/:id", validate(boardSchema), boardController.update);
router.delete("/:id", boardController.delete);

export default router;
