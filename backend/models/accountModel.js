import mongoose from "mongoose";

const accountSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  balance: {
    type: Number,
    default: 0,
    min: 0
  },
  transactions: [{
    amount: { type: Number, required: true },
    type: { type: String, enum: ['credit', 'debit'], required: true },
    description: { type: String },
    date: { type: Date, default: Date.now }
  }]
}, {
  timestamps: true
});

export const Account = mongoose.models.Account || mongoose.model('Account', accountSchema);
