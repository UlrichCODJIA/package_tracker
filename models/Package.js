const mongoose = require('mongoose');
const MongooseSequence = require('mongoose-sequence');

const AutoIncrement = MongooseSequence(mongoose);
const Schema = mongoose.Schema;

const PackageSchema = new Schema({
    package_id: { type: Number, unique: true },
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

PackageSchema.plugin(AutoIncrement, { inc_field: 'package_id' });
module.exports = mongoose.model('Package', PackageSchema);
