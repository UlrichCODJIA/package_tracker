const express = require('express');
const router = express.Router();
const Package = require('../models/Package');

const { updatePropertyIfNotNull } = require('./utils');

// Get all packages
router.get('/', async (req, res) => {
    try {
        const packages = await Package.find();
        res.json(packages);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/:id', getPackage, (req, res) => {
    res.json(res.package);
});

// Middleware to get a package by ID
async function getPackage(req, res, next) {
    try {
        const query = {};
        query['package_id'] = parseInt(req.params.id);
        let package = await Package.findOne(query);
        if (!package || package == null) {
            return res.status(404).json({ message: 'Cannot find package' });
        }
        res.package = package;
        next();
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}

router.post('/', async (req, res) => {
    try {
        const package = new Package({
            active_delivery_id: req.body.active_delivery_id,
            description: req.body.description,
            weight: req.body.weight,
            dimensions: {
                width: req.body.dimensions.width,
                height: req.body.dimensions.height,
                depth: req.body.dimensions.depth
            },
            from: {
                name: req.body.from.name,
                address: req.body.from.address,
                location: { lat: req.body.from.location.lat, lng: req.body.from.location.lng }
            },
            to: {
                name: req.body.to.name,
                address: req.body.to.address,
                location: { lat: req.body.to.location.lat, lng: req.body.to.location.lng }
            }
        });

        const newPackage = await package.save();
        res.status(201).json(newPackage);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});


router.put('/:id', getPackage, async (req, res) => {
    try {
        ['active_delivery_id', 'description', 'weight', 'dimensions', 'from', 'to'].forEach(property => {
            updatePropertyIfNotNull(req.body, res.package, property);
        });

        const updatedPackage = await res.package.save();
        res.json(updatedPackage);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});


router.delete('/:id', getPackage, async (req, res) => {
    try {
        await Package.deleteOne({ package_id: res.package.package_id });
        res.json({ message: 'Deleted Package' });
    } catch (err) {
        res.status(500).json({ message: err.message});
    }
});


module.exports = router;
