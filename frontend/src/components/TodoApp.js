// frontend/src/components/TodoApp.js

import React, { useEffect, useState } from "react";

const API_BASE =
  process.env.REACT_APP_API_URL || "http://localhost/api";

export default function TodoApp() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(false);

  const [text, setText] = useState("");
  const [priority, setPriority] = useState("medium");
  const [file, setFile] = useState(null);

  // fetch todos
  const fetchTodos = async () => {
    try {
      setLoading(true);

      const response = await fetch(`${API_BASE}/todos`);

      if (!response.ok) {
        throw new Error("Failed to fetch todos");
      }

      const data = await response.json();

      setTodos(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  // create todo
  const handleCreateTodo = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();

      formData.append("text", text);
      formData.append("priority", priority);

      if (file) {
        formData.append("attachment", file);
      }

      const response = await fetch(`${API_BASE}/todos`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to create todo");
      }

      setText("");
      setPriority("medium");
      setFile(null);

      fetchTodos();
    } catch (error) {
      console.error(error);
    }
  };

  // toggle completed
  const toggleTodo = async (todo) => {
    try {
      const response = await fetch(`${API_BASE}/todos/${todo._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          completed: !todo.completed,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update todo");
      }

      fetchTodos();
    } catch (error) {
      console.error(error);
    }
  };

  // delete todo
  const deleteTodo = async (id) => {
    try {
      const response = await fetch(`${API_BASE}/todos/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete todo");
      }

      fetchTodos();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div style={{ maxWidth: "700px", margin: "40px auto" }}>
      <h1>Todo App</h1>

      {/* create form */}
      <form onSubmit={handleCreateTodo}>
        <div style={{ marginBottom: "10px" }}>
          <input
            type="text"
            placeholder="Todo text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            required
            style={{ width: "100%", padding: "10px" }}
          />
        </div>

        <div style={{ marginBottom: "10px" }}>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <div style={{ marginBottom: "10px" }}>
          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
          />
        </div>

        <button type="submit">Create Todo</button>
      </form>

      <hr />

      {/* todos list */}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div>
          {todos.length === 0 ? (
            <p>No todos found</p>
          ) : (
            todos.map((todo) => (
              <div
                key={todo._id}
                style={{
                  border: "1px solid #ccc",
                  padding: "15px",
                  marginBottom: "10px",
                  borderRadius: "8px",
                }}
              >
                <h3
                  style={{
                    textDecoration: todo.completed
                      ? "line-through"
                      : "none",
                  }}
                >
                  {todo.text}
                </h3>

                <p>
                  <strong>Priority:</strong> {todo.priority}
                </p>

                <p>
                  <strong>Status:</strong>{" "}
                  {todo.completed ? "Completed" : "Pending"}
                </p>

                {/* attachment */}
                {todo.attachment && (
                  <p>
                    <a
                      href={`${API_BASE.replace(
                        "/api",
                        ""
                      )}/uploads/${todo.attachment}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      View Attachment
                    </a>
                  </p>
                )}

                <div style={{ display: "flex", gap: "10px" }}>
                  <button onClick={() => toggleTodo(todo)}>
                    {todo.completed
                      ? "Mark Pending"
                      : "Mark Completed"}
                  </button>

                  <button onClick={() => deleteTodo(todo._id)}>
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}