const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { User, Entry } = require('./models');

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' })); // Increased limit for Base64 images

mongoose.connect('mongodb://lynmaine:tootsyaii@ac-atq5r8c-shard-00-00.laxiknc.mongodb.net:27017,ac-atq5r8c-shard-00-01.laxiknc.mongodb.net:27017,ac-atq5r8c-shard-00-02.laxiknc.mongodb.net:27017/?ssl=true&replicaSet=atlas-e6073z-shard-0&authSource=admin&appName=newsjournal');

app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username, password }); // Simplified for now
  if (user) {
    res.json({ success: true, userId: user._id, profile: user.profile });
  } else {
    res.status(401).json({ message: "Invalid credentials" });
  }
});

app.get('/api/entry/:userId/:date', async (req, res) => {
  const entry = await Entry.findOne({ 
    userId: req.params.userId, 
    date: req.params.date 
  });
  res.json(entry || {});
});

app.post('/api/entry', async (req, res) => {
  const { userId, date, ...updateData } = req.body;
  
  const entry = await Entry.findOneAndUpdate(
    { userId, date },
    { ...updateData },
    { upsert: true, new: true }
  );
  res.json(entry);
});

app.put('/api/profile/:userId', async (req, res) => {
  const { profile } = req.body;
  const user = await User.findByIdAndUpdate(
    req.params.userId,
    { profile },
    { new: true }
  );
  res.json(user.profile);
});

app.listen(5000, () => console.log('Server running on port 5000'));