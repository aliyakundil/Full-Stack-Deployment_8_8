// switch database
db = db.getSiblingDB("todoapp");

// create collection
db.createCollection("todos");

// indexes
db.todos.createIndex({ createdAt: 1 });
db.todos.createIndex({ completed: 1 });
db.todos.createIndex({ priority: 1 });
db.todos.createIndex({ dueDate: 1 });

// seed data
db.todos.insertMany([
  {
    text: "Learn Docker Compose",
    completed: false,
    priority: "high",
    attachment: null,
    dueDate: new Date("2026-05-15"),
    createdAt: new Date(),
  },
  {
    text: "Build Fullstack Todo App",
    completed: false,
    priority: "medium",
    attachment: null,
    dueDate: new Date("2026-05-20"),
    createdAt: new Date(),
  },
  {
    text: "Deploy app with Nginx",
    completed: true,
    priority: "low",
    attachment: null,
    dueDate: new Date("2026-05-10"),
    createdAt: new Date(),
  },
]);

print("MongoDB initialization completed");