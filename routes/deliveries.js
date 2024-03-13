const express = require('express');
const router = express.Router();
const Delivery = require('../models/Delivery');
const Package = require('../models/Package');

const { updatePropertyIfNotNull } = require('./utils');


router.get('/', async (req, res) => {
    try {
        const deliveries = await Delivery.find();
        res.json(deliveries);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/:id', getDelivery, (req, res) => {
    res.json(res.delivery);
});

// Middleware to get a delivery by ID
async function getDelivery(req, res, next) {
    let delivery;
    try {
        const query = {};
        query['delivery_id'] = parseInt(req.params.id);
        delivery = await Delivery.findOne(query);
        if (delivery == null) {
            return res.status(404).json({ message: 'Cannot find delivery' });
        }
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }

    res.delivery = delivery;
    next();
}

router.post('/', async (req, res) => {
    const delivery = new Delivery({
        package_id: req.body.package_id,
        pickup_time: req.body.pickup_time,
        start_time: req.body.start_time,
        end_time: req.body.end_time,
        location: req.body.location,
        status: 'open',
    });

    try {
        const newDelivery = await delivery.save();

        await Package.findOneAndUpdate(
            { package_id: newDelivery.package_id },
            { active_delivery_id: newDelivery.delivery_id }
        );

        res.status(201).json(newDelivery);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

router.put('/:id', getDelivery, async (req, res) => {
    try {
        ['pickup_time', 'start_time', 'end_time', 'location', 'status'].forEach(property => {
            updatePropertyIfNotNull(req.body, res.delivery, property);
        });

        const updatedDelivery = await res.delivery.save();
        res.json(updatedDelivery);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

router.delete('/:id', getDelivery, async (req, res) => {
    try {
        await Delivery.deleteOne({ delivery_id: res.delivery.delivery_id });
        res.json({ message: 'Deleted Delivery' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;