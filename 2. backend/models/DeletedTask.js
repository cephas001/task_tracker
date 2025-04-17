const mongoose = require("mongoose");
const connection = require("../config/database");

const DeletedTaskSchema = new mongoose.Schema({
	task: {
		type: String,
		required: true
	},
	description: {
		type: String
	},
	date: {
		type: String,
		required: true 
	},
	agendas: [{
		agenda: {
			type: String
		},
		agendaIsCompleted: {
			type: Boolean
		}
	}],
	isCompleted: {
		type: Boolean
	},
	expire_at: {
		type: Date,
		default: Date.now(),
		expires: 50
	},
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User"
	}
},  {timestamps: true})

DeletedTaskSchema.index({"expire_at": 1}, {expireAfterSeconds: 5});

const DeletedTask = connection.model("DeletedTask", DeletedTaskSchema);

module.exports = DeletedTask;