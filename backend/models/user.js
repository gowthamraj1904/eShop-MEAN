const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name: { type: String, required: true },
    image: { type: String },
    countInStock: { type: Number, required: true, default: 0 }
});

exports.User = mongoose.model('User', userSchema);
