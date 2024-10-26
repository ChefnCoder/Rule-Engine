const mongoose = require('mongoose');

const RuleSchema = new mongoose.Schema({
  rule: { type: String, required: true },
  ast: { type: Object, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Rule', RuleSchema);
