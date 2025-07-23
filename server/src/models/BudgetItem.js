const mongoose = require('mongoose');

const BudgetItemSchema = new mongoose.Schema({
  name:        { type: String, required: true },
  amount:      { type: Number, required: true, min: 0 },
  category:    { type: String, default: 'Uncategorized' },
  details:     { type: String, default: '' },
  timestamp:   { type: Date,   default: Date.now }, // stored in UTC
  type:        { type: String, enum: ['income', 'expense'], default: 'expense' },
  userId:      { type: String, default: 'default' } // placeholder for future auth
}, { timestamps: true });

module.exports = mongoose.model('BudgetItem', BudgetItemSchema);
