const mongoose = require('mongoose');

const orderItemSchema = mongoose.Schema({
    quantity: { type: Number, required: true },
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    dateCreated: { type: Date, default: Date.now }
});

orderItemSchema.virtual('id').get(function () {
    return this._id;
});

orderItemSchema.set('toJSON', {
    virtuals: true
});

exports.OrderItem = mongoose.model('OrderItem', orderItemSchema);
