const Item = require('../models/itemModel.js');

// @desc    Create a new item report
// @route   POST /api/items
// @access  Private
const createItem = async (req, res) => {
  const { itemName, description, location, contactInfo, reportedBy, category, contactPreference } = req.body;
  
  try {
    if (!req.file || !req.file.path) {
      return res.status(400).json({ message: 'Please upload an image' });
    }
    if (!category) {
      return res.status(400).json({ message: 'Please specify a category (lost or found)'});
    }

    const parsedContactInfo = JSON.parse(contactInfo);

    // Cloudinary returns the URL in req.file.path (multer-storage-cloudinary)
    const imageUrl = req.file.path;

    const item = new Item({
      itemName,
      description,
      location,
      photo: imageUrl, // Always use the Cloudinary URL
      contactInfo: parsedContactInfo,
      reportedBy,
      category,
      contactPreference: category === 'found' ? contactPreference === 'true' || contactPreference === true : false, // Ensure boolean, only for 'found' items
      status: 'open' // Default status
    });

    const createdItem = await item.save();

    res.status(201).json(createdItem);
  } catch (error) {
    console.error('Error creating item:', error.message);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get all items with filtering and sorting
// @route   GET /api/items
// @access  Private
const getItems = async (req, res) => {
  try {
    const { category, status, sortBy = 'createdAt', order = 'desc' } = req.query;
    
    let filter = {};
    if (category) filter.category = category;
    if (status) filter.status = status;

    let sortOptions = {};
    if (sortBy === 'latest' || sortBy === 'createdAt') {
        sortOptions.createdAt = order === 'asc' ? 1 : -1;
    } else if (sortBy === 'oldest') {
        sortOptions.createdAt = order === 'desc' ? -1 : 1; // oldest would be asc by default
    } else {
        sortOptions[sortBy] = order === 'asc' ? 1 : -1; // Allow sorting by other fields if needed
    }
    // Default sort if not specified or invalid
    if (Object.keys(sortOptions).length === 0) {
        sortOptions.createdAt = -1; 
    }

    const items = await Item.find(filter).sort(sortOptions);
    res.json(items);
  } catch (error) {
    console.error('Error fetching items:', error.message);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get item by ID
// @route   GET /api/items/:id
// @access  Private
const getItemById = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    
    if (item) {
      res.json(item);
    } else {
      res.status(404).json({ message: 'Item not found' });
    }
  } catch (error) {
    console.error('Error fetching item by ID:', error.message);
    // Mongoose CastError for invalid ObjectId format
    if (error.name === 'CastError') {
        return res.status(400).json({ message: 'Invalid item ID format' });
    }
    res.status(404).json({ message: 'Item not found' }); // Default to 404 if item not found for other reasons
  }
};

// @desc    Update item status (e.g., to 'returned')
// @route   PUT /api/items/:id/status
// @access  Private
const updateItemStatus = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    // Check if the logged-in user is the one who reported the item
    // req.user should be populated by authMiddleware and contain rollNumber
    if (item.reportedBy !== req.user.rollNumber) {
      return res.status(403).json({ message: 'User not authorized to update this item' });
    }

    // For now, we only allow updating status to 'returned' by the reporter
    // Future enhancements could allow other status changes or fields
    if (req.body.status && req.body.status === 'returned') {
        item.status = 'returned';
    } else if (req.body.status) {
        // If a status is provided but it's not 'returned', it's a bad request for this specific endpoint's current capability
        return res.status(400).json({ message: 'Invalid status update. Only marking as \'returned\' is currently supported by reporter.' });
    } else {
        // If no status is provided in the body, assume the intent was to mark as returned (simplification)
        // Or require it explicitly: return res.status(400).json({ message: 'Status field is required.' });
        item.status = 'returned'; // Default action for this endpoint if no specific status sent
    }

    const updatedItem = await item.save();
    res.json(updatedItem);

  } catch (error) {
    console.error('Error updating item status:', error.message);
    if (error.name === 'CastError') {
        return res.status(400).json({ message: 'Invalid item ID format' });
    }
    if (error.name === 'ValidationError') {
        return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Server Error' });
  }
};


module.exports = {
  createItem,
  getItems,
  getItemById,
  updateItemStatus // Export the new controller
};
