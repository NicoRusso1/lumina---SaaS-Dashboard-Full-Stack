import { Router } from "express";
import { taskController } from "../controllers/task.controller";
import { authenticate } from "../middlewares/auth";
import { validate } from "../middlewares/validate";
import { taskSchema, updateTaskSchema } from "../validators";

const router = Router();

router.use(authenticate);

// Tasks by board
router.get("/board/:boardId", taskController.getByBoard);
router.post("/board/:boardId", validate(taskSchema), taskController.create);

// Single task operations
router.get("/:id", taskController.getById);
router.put("/:id", validate(updateTaskSchema), taskController.update);
router.delete("/:id", taskController.delete);

export default router;
