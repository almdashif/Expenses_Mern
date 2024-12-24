import mongoose from 'mongoose';

const incomeSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        maxLength: 32
    },
    amount: {
        type: Number,
        required: true,
        trim: true,
        maxLength: 10
    },
    type: {
        type: String,
        default: 'income'
    },
    date: {
        type: Date,
        default: Date.now,
        required: true,
        maxLength: 20,
        trim: true
    },
    category: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true,
        maxLength: 100,
    },
}, { timestamps: true });


// modeule.export = mongoose.model('Income', incomeSchema);
export default mongoose.model('Income', incomeSchema);
