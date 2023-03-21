const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
    orderItems: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'OrderItem',
            required: true
        }
    ],
    shippingAddress1: { type: String, required: true },
    shippingAddress2: { type: String, required: true },
    city: { type: String, required: true },
    zip: { type: String, required: true },
    country: { type: String, required: true },
    phone: { type: String, required: true },
    status: { type: String, required: true, default: 'pending' },
    totalPrice: { type: Number },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    dateOrdered: { type: Date, default: Date.now }
});

orderSchema.virtual('id').get(function () {
    return this._id;
});

orderSchema.set('toJSON', {
    virtuals: true
});

exports.Order = mongoose.model('Order', orderSchema);
