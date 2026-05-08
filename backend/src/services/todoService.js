import Todo from "../models/Todo.js";
import { clearTodosCache } from "../middleware/cache.js";

export async function getTodos(options) {
  const page = options.page ? parseInt(options.page) : 1;
  const limit = options.limit ? parseInt(options.limit) : 10;
  const offset = (page - 1) * limit;

  const filter = {};

  if (options.completed !== undefined) {
    filter.completed = options.completed === "true";
  }

  if (options.priority !== undefined) {
    filter.priority = options.priority;
  }

  if (options.search) {
    filter.$or = [
      { title: { $regex: options.search, $options: "i" } },
      { description: { $regex: options.search, $options: "i" } }
    ];
  }

  const todos = await Todo
    .find(filter)
    .sort({ createdAt: -1 })
    .skip(offset)
    .limit(limit);

  const total = await Todo.countDocuments(filter);


  return {
    todos: todos,
    meta: {
      total: total,
      page: page,
      limit: limit,
      totalPage: Math.ceil(total/ limit),
    },
  };
}

export async function getTodoById(id) {
  try {
    const todo = await Todo.findById(id);
    await clearTodosCache();
    return todo;
  } catch (err) {
    return null
  }
}

export async function createTodo(input) {

  if (!input.title || input.title.trim() === "") throw new Error ("Todo text is required")
  const newTodo = new Todo({
    title: input.title.trim(),
    description: input.description || "",
    completed: false,
    priority: input.priority || "low",
    dueDate: input.dueDate || null,
  });

  await newTodo.save();

  await clearTodosCache(); 
  return newTodo;
}

export async function updateTodo(id, input) {
  const updated = await Todo.findByIdAndUpdate(
    id,
    {
      $set: {
        ...(input.title && { title: input.title.trim() }),
        ...(input.description && { description: input.description }),
        ...(input.completed !== undefined && { completed: input.completed }),
        ...(input.priority && { priority: input.priority }),
        ...(input.dueDate && { dueDate: input.dueDate }),
      },
    },
    { new: true }
  );

  await clearTodosCache();
  return updated;
}

export async function patchTodo(id, input) {
  const updated = await Todo.findByIdAndUpdate(
    id,
    {
      $set: {
        ...(input.title && { title: input.title.trim() }),
        ...(input.description && { description: input.description }),
        ...(input.completed !== undefined && { completed: input.completed }),
        ...(input.priority && { priority: input.priority }),
        ...(input.dueDate && { dueDate: input.dueDate }),
      },
    },
    { new: true }
  );

  await clearTodosCache();
  return updated;
}

export async function deleteTodo(id) {
  const result = await Todo.deleteOne({ _id: id });
  await clearTodosCache();
  return result.deletedCount === 1;
}

export async function getAnalytics() {
  const stats = await Todo.aggregate([
    {
      $group: {
        _id: null,
        total: { $sum: 1 },
        completed: {
          $sum: { $cond: ["$completed", 1, 0] }
        },
        pending: {
          $sum: { $cond: ["$completed", 0, 1] }
        },
        low: {
          $sum: { $cond: [{ $eq: ["$priority", "low"] }, 1, 0] }
        },
        medium: {
          $sum: { $cond: [{ $eq: ["$priority", "medium"] }, 1, 0] }
        },
        high: {
          $sum: { $cond: [{ $eq: ["$priority", "high"] }, 1, 0] }
        }
      }
    }
  ]);

  return stats[0] || {
    total: 0,
    completed: 0,
    pending: 0,
    low: 0,
    medium: 0,
    high: 0,
  };
}