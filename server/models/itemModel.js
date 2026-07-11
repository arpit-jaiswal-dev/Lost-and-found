const mongoose = require('mongoose');

const itemSchema = mongoose.Schema({
  itemName: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  photo: {
    type: String,
    required: true
  },
  contactInfo: {
    email: { type: String },
    phone: { type: String }
  },
  reportedBy: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: [true, 'Please specify the category (lost or found)'],
    enum: ['lost', 'found']
  },
  status: {
    type: String,
    required: true,
    enum: ['open', 'returned'],
    default: 'open'
  },
  contactPreference: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

const Item = mongoose.model('Item', itemSchema);

module.exports = Item;
