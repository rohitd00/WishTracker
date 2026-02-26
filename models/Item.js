const mongoose = require('mongoose');

const ItemSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
    trim: true,
  },
  tag: {
    type: String,
    trim: true,
    default: '',
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium',
  },
  completed: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Item', ItemSchema);
