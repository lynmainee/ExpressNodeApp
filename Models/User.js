const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { 
    type: String, 
    required: true, 
    unique: true 
  },
  password: { 
    type: String, 
    required: true 
  },
  profile: {
    name: { type: String, default: "" },
    bio: { type: String, default: "" },
    image: { type: String, default: null } 
  }
});

module.exports = mongoose.model('User', userSchema);