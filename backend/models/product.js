const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    richDescription: { type: String, default: '' },
    brand: { type: String, default: '' },
    price: { type: Number, default: 0 },
    image: { type: String, default: '' },
    images: [{ type: String }],
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    rating: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },
    isFeatured: { type: Boolean, default: false },
    countInStock: { type: Number, required: true, min: 0, default: 0 },
    dateCreated: { type: Date, default: Date.now }
});

// Default key for the id is "_id" so, we can create a virtual key "id"
productSchema.virtual('id').get(function () {
    return this._id;
});

productSchema.set('toJSON', {
    virtuals: true
});

exports.Product = mongoose.model('Product', productSchema);
