const mongoose = require('mongoose');
const connectDB = require('./config/db');
const User = require('./models/userModel');

// Connect to database
connectDB();

// Sample user data with roll numbers
const users = [
  { rollNumber: 'student001', password: 'STUDENT001' },
  { rollNumber: 'student002', password: 'STUDENT002' },
  { rollNumber: 'student003', password: 'STUDENT003' },
  { rollNumber: 'student004', password: 'STUDENT004' },
  { rollNumber: 'student005', password: 'STUDENT005' },
];

// Seed function
const seedData = async () => {
  try {
    // Clear existing data
    await User.deleteMany({});
    if (process.env.NODE_ENV !== 'production') {
      console.log('Data cleared...');
    }

    // Import sample users
    await User.insertMany(users);
    if (process.env.NODE_ENV !== 'production') {
      console.log('Sample users imported!');
    }
    
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

seedData();
