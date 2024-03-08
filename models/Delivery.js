const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DeliverySchema = new Schema({
    delivery_id: { type: String, required: true },
    package_id: { type: String, required: true },
    pickup_time: Date,
    start_time: Date,
    end_time: Date,
    location: { lat: Number, lng: Number },
    status: {
        type: String,
        enum: ['open', 'picked-up', 'in-transit', 'delivered', 'failed']
    }
});

module.exports = mongoose.model('Delivery', DeliverySchema);
