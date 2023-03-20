const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    passwordHash: { type: String, required: true },
    phone: { type: String, required: true },
    isAdmin: { type: Boolean, default: false },
    street: { type: String, default: '' },
    apartment: { type: String, default: '' },
    city: { type: String, default: '' },
    zip: { type: String, default: '' },
    country: { type: String, default: '' }
});

// Default key for the id is "_id" so, we can create a virtual key "id"
userSchema.virtual('id').get(function () {
    return this._id;
});

userSchema.set('toJSON', {
    virtuals: true
});

exports.User = mongoose.model('User', userSchema);
exports.userSchema = userSchema;
