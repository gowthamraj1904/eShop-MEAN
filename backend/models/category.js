const mongoose = require('mongoose');

const categorySchema = mongoose.Schema({
    name: { type: String, required: true },
    color: { type: String },
    icon: { type: String },
    image: { type: String }
});

userSchema.virtual('id').get(function () {
    return this._id;
});

userSchema.set('toJSON', {
    virtuals: true
});

exports.Category = mongoose.model('Category', categorySchema);
