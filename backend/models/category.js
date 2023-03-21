const mongoose = require('mongoose');

const categorySchema = mongoose.Schema({
    name: { type: String, required: true },
    color: { type: String },
    icon: { type: String },
    image: { type: String }
});

categorySchema.virtual('id').get(function () {
    return this._id;
});

categorySchema.set('toJSON', {
    virtuals: true
});

exports.Category = mongoose.model('Category', categorySchema);
