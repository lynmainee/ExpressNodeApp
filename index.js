const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const User = require('./models/User');
const Entry = require('./models/Entry');

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' })); 

// MongoDB Atlas Connection String
const MONGO_URI = "mongodb://lynmaine:tootsyaii@ac-atq5r8c-shard-00-00.laxiknc.mongodb.net:27017,ac-atq5r8c-shard-00-01.laxiknc.mongodb.net:27017,ac-atq5r8c-shard-00-02.laxiknc.mongodb.net:27017/?ssl=true&replicaSet=atlas-e6073z-shard-0&authSource=admin&appName=newsjournal";

mongoose.connect(MONGO_URI)
  .then(() => console.log("Connected to the NewsJournal Atlas Cluster"))
  .catch(err => {
    console.error("Database connection error:", err.message);
    process.exit(1); 
  });



// Register
app.post('/api/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    const existingUser = await User.findOne({ username });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    const newUser = new User({ 
      username, 
      password,
      profile: { name: username, bio: "", image: null } 
    });

    await newUser.save();
    res.status(201).json({ success: true, userId: newUser._id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    // Basic lookup - In production, use bcrypt for password hashing
    const user = await User.findOne({ username, password });
    
    if (user) {
      res.json({ 
        success: true, 
        userId: user._id, 
        profile: user.profile 
      });
    } else {
      res.status(401).json({ message: "Access Denied: Invalid Credentials" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/entry', async (req, res) => {
  try {
    const { userId, date, ...updateData } = req.body;
    
    // Find entry for user on this date; create it if it doesn't exist (upsert)
    const entry = await Entry.findOneAndUpdate(
      { userId, date },
      { ...updateData },
      { upsert: true, new: true }
    );
    res.json(entry);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/entry/:userId/:date', async (req, res) => {
  try {
    const entry = await Entry.findOne({ 
      userId: req.params.userId, 
      date: req.params.date 
    });
    res.json(entry || {});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/profile/:userId', async (req, res) => {
  try {
    const { profile } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.userId,
      { profile },
      { new: true }
    );
    res.json(user.profile);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`CRÉPUSCULE Backend live on port ${PORT}`));