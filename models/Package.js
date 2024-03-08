const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PackageSchema = new Schema({
    package_id: { type: String, required: true },
    active_delivery_id: String,
    description: String,
    weight: Number,
    dimensions: {
        width: Number,
        height: Number,
        depth: Number
    },
    from: {
        name: String,
        address: String,
        location: { lat: Number, lng: Number }
    },
    to: {
        name: String,
        address: String,
        location: { lat: Number, lng: Number }
    }
});

module.exports = mongoose.model('Package', PackageSchema);
