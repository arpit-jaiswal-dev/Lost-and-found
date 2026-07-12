const express = require('express');
const path = require('path');
const cors = require('cors');
const connectDB = require('./config/db.js');
require('dotenv').config();
const userRoutes = require('./routes/userRoutes.js');
const itemRoutes = require('./routes/itemRoutes.js');
const fs = require('fs');

const app = express();
connectDB();
app.use(cors());
app.use(express.json());

// Ensure uploads directory exists (for item images)
// const uploadsDir = path.join(__dirname, '/uploads');
// if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);
// app.use('/uploads', express.static(uploadsDir));

// API routes
app.use('/api/users', userRoutes);
app.use('/api/items', itemRoutes);

// Serve React build in production
app.get('/', (req, res) => {
  res.send('Lost & Found API is running...');
});

// Error handling middleware
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
