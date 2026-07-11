const express = require('express');
const router = express.Router();
const { createItem, getItems, getItemById, updateItemStatus } = require('../controllers/itemController.js');
const { protect } = require('../middleware/authMiddleware.js');
const upload = require('../middleware/uploadMiddleware.js');

// @route   POST /api/items
// @desc    Create a new item report
router.post('/', protect, upload.single('photo'), createItem);

// @route   GET /api/items
// @desc    Get all items (with filtering and sorting)
router.get('/', protect, getItems);

// @route   GET /api/items/:id
// @desc    Get item by ID
router.get('/:id', protect, getItemById);

// @route   PUT /api/items/:id/status
// @desc    Update item status (e.g., mark as returned)
router.put('/:id/status', protect, updateItemStatus);

module.exports = router;
