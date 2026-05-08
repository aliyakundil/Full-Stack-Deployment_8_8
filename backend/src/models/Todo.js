import mongoose from "mongoose";

const todoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true,
    },
    completed: Boolean,
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "low"
    },
    dueDate: {
      type: Date,
    },
    attachments: [
      {
        filename: String,
        originalName: String,
        mimetype: String,
        size: Number,
        uploadDate: { type: Date, default: Date.now }
      }
    ]
  },
  { timestamps: true }
);

todoSchema.index({ createdAt: -1 });
todoSchema.index({ completed: 1 });
todoSchema.index({ priority: 1 });

const Todo = mongoose.model("Todo", todoSchema);

export default Todo;