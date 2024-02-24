const mongoose = require('mongoose');

// Define a schema for categories
const categorySchema = new mongoose.Schema({
  Category: {
    type: String,
    required: true,
    unique: true,
  },
});

const Category = mongoose.model('Category', categorySchema);

// Export the Category model for use in other files
module.exports = Category;
