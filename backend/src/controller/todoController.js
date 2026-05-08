import * as todoService from "../services/todoService.js";

export async function getTodosController(req, res) {
  const result = await todoService.getTodos(req.query);

  res.status(200).json({
    success: true,
    data: {
      todos: result.todos,
      meta: result.meta,
    },
  });
}

export async function getTodoById(req, res) {
  try {
    const id = req.params.id;

    if (!id) {
      return res.status(404).json({
        success: false,
        error: "Todo not found",
      });
    }

    const todo = await todoService.getTodoById(id);

    if (!todo) {
      return res.status(404).json({
        success: false,
        error: "Invalid todo id",
      });
    }

    res.status(200).json({
      success: true,
      data: todo,
    })
  } catch(err) {
    res.status(400).json({
      success: false,
      error: err.message,
    });
  }
}

export async function createTodo(req, res) {
  try {
    const todo = await todoService.createTodo(req.body);

    res.status(201).json({
      success: true,
      data: todo,
    });
  } catch(err) {
    res.status(400).json({
      success: false,
      error: err.message,
    })
  }

}

export async function updateTodo(req, res) {
  try {
    const id = req.params.id;
    const updated = await todoService.updateTodo(id, req.body);

    if (!updated) {
      return res.status(404).json({
        success: false,
        error: "Todo not found",
      })
    }

    res.json({
      success: true,
      data: updated,
    })
  } catch(err) {
    res.status(400).json({
      success: false,
      error: err.message,
    })
  }
}

export async function patchTodo(req, res, next) {
  try {
    const id = req.params.id;

    const body = req.body;

    if(!body || Object.keys(body).length === 0) {
      const err = new Error("Body не может быть пустым");
      (err).status = 400;
      return next(err)
    }

    const updated = await todoService.patchTodo(id, req.body);

    if (!updated) {
      const err = new Error('Not Found');
      (err).status = 400;
      return next(err);
    }

    res.json({
      success: true,
      data: updated,
    });
  } catch(error) {
    next(error);
  }
}

export async function deleteTodo(req, res, next) {
  try {
    const id = req.params.id;
    const deleted = await todoService.deleteTodo(id);

    if (!deleted) {
      const err = new Error("Todo not found");
      (err).status = 404;
      return next(err);
    }

    return res.status(204).send();
  } catch(error) {
    next(error);
  }
}

export async function getAnalytics(req, res) {
  const stats = await todoService.getAnalytics();

  res.json({
    success: true,
    data: stats,
  });
}
