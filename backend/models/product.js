const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    id: Number,
    name: String,
    description: String,
    brand: String,
    price: Number,
    image: String,
    images: [],
    rating: Number,
    numReviews: Number,
    isFeatured: Boolean,
    countInStock: {
        type: Number,
        required: true
    },
    dateCreated: {
        type: Date,
        default: Date.now
    }
});

exports.Product = mongoose.model('Product', productSchema);
