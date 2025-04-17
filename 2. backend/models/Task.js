const mongoose = require("mongoose");
const connection = require("../config/database");

const TaskSchema = new mongoose.Schema(
  {
    task: {
      type: String,
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    agendas: [
      {
        agenda: {
          type: String,
        },
        agendaIsCompleted: {
          type: Boolean,
          default: false,
        },
      },
    ],
    isCompleted: {
      type: Boolean,
      default: false,
    },
    description: {
      type: String,
    },
  },
  { timestamps: true }
);

const Task = connection.model("Task", TaskSchema);

module.exports = Task;
