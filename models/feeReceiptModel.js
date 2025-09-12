const mongoose = require('mongoose');

const feeReceiptSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
        required: true
    },
    receiptFile: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    submittedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('FeeReceipt', feeReceiptSchema);
