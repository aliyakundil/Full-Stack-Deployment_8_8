import { Types } from "mongoose";

export function validateCreateTodo(req, res, next) {
  const { title, description, priority  } = req.body;

  const errors = [];

  if (!title || typeof title !== "string" || title.trim() === "") {
    errors.push("title is required and must be string");
  }

  if (description !== undefined && typeof description !== "string") {
    errors.push("description must be a string");
  }

  if (priority && !["low", "medium", "high"].includes(priority))
    errors.push("priority must be low, medium, or high");

  if (errors.length > 0)
    return res
      .status(400)
      .json({ success: false, error: "Validation failed", details: errors });

  next();
}

export function validateUpdateTodo(req, res, next) {
  const { title, completed, priority, dueDate } = req.body;

  const errors = [];

  if (title !== undefined && (typeof title !== "string" || title.trim() === "")) {
    errors.push("title must be a non-empty string");
  }

  if (completed !== undefined)
    if (
      typeof completed !== "boolean" &&
      completed !== "true" &&
      completed !== "false"
    )
      errors.push("completed is required and must be boolean");

  if (dueDate !== undefined && isNaN(Date.parse(dueDate))) {
    errors.push("dueDate must be a valid date");
  }

  if (
    priority !== undefined &&
    !["low", "medium", "high"].includes(priority)
  ) {
    errors.push("priority must be low, medium, or high");
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      error: "Validation failed",
      details: errors,
    });
  }

  next();
}

export function validateTodoId(req, res, next) {
  const id = req.params.id;

  const errors = [];

  if (!id) {
    errors.push("id is required");
  } else if (!Types.ObjectId.isValid(id)) {
    errors.push("id must be a valid MongoDB ObjectId");
  }

  if (errors.length > 0)
    return res
      .status(400)
      .json({ success: false, error: "Validation failed", details: errors });

  next();
}

export function validateTodoQuery(req, res, next) {
  const { page, limit, completed, priority, search } = req.query;

  const errors = [];

  if (page !== undefined) {
    const p = Number(page);
    if (!Number.isInteger(p) || p <= 0) {
      errors.push("page must be a positive integer");
    }
  }

  if (limit !== undefined) {
    const l = Number(limit);
    if (!Number.isInteger(l) || l <= 0 || l > 100) {
      errors.push("limit must be between 1 and 100");
    }
  }

  if (completed !== undefined) {
    if (completed !== "true" && completed !== "false") {
      errors.push("completed must be 'true' or 'false'");
    }
  }

  if (priority !== undefined) {
    if (!["low", "medium", "high"].includes(priority)) {
      errors.push("priority must be low, medium or high");
    }
  }

  if (search !== undefined) {
    if (typeof search !== "string" || search.trim() === "") {
      errors.push("search cannot be empty string");
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      error: "Validation failed",
      details: errors,
    });
  }

  next();
}