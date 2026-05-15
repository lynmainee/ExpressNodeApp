const mongoose = require('mongoose');

const entrySchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  date: { 
    type: String, 
    required: true 
  },
  entryText: String,
  mood: String,
  image: String,
  events: [{ 
    text: String, 
    completed: { type: Boolean, default: false } 
  }],
  tasks: [{ 
    text: String, 
    completed: { type: Boolean, default: false } 
  }]
}, { timestamps: true });

module.exports = mongoose.model('Entry', entrySchema);