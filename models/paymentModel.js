const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
	studentId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Student", // Make sure this matches your student model name
		required: true,
	},
	studentName: {
		type: String,
		required: true,
	},
	amount: {
		type: Number,
		required: true,
	},
	paymentFor: {
		type: String,
		default: "Semester Fees",
	},
	paymentDate: {
		type: Date,
		default: Date.now,
	},
});

module.exports = mongoose.model("Payment", paymentSchema);