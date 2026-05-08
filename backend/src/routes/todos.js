import { Router } from "express";
import * as todoController from "../controller/todoController.js";
import { cache } from "../middleware/cache.js";
import { upload } from "../middleware/upload.js";

import {
  validateCreateTodo,
  validateUpdateTodo,
  validateTodoId,
  validateTodoQuery,
} from "../middleware/validation.js";

const router = Router();

router.get(
  "/todos/",
  validateTodoQuery,
  cache,
  todoController.getTodosController
);

router.get("/analytics", todoController.getAnalytics);

router.get(
  "/todos/:id",
  validateTodoId,
  todoController.getTodoById
);

router.post(
  "/todos/",
  upload.array("attachments", 10),
  validateCreateTodo,
  todoController.createTodo
);

router.put(
  "/todos/:id",
  validateTodoId,
  validateUpdateTodo,
  todoController.updateTodo
);

router.patch(
  "/todos/:id",
  validateTodoId,
  validateUpdateTodo,
  todoController.patchTodo
);

router.delete(
  "/todos/:id",
  validateTodoId,
  todoController.deleteTodo
);

export default router;