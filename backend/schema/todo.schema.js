import { Schema, model } from "mongoose";

const todoSchema = new Schema(
  {
    email: {
      type: String,
    },
    todo: {
      type: String,
      require: true,
    },
    date: {
      type: String,
      require: true,
    },
    isFinish: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Todo = model("Todo", todoSchema);

export default Todo;
