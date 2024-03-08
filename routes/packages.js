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
    let package;
    try {
        package = await Package.findById(req.params.id);
        if (package == null) {
            return res.status(404).json({ message: 'Cannot find package' });
        }
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }

    res.package = package;
    next();
}

router.post('/', async (req, res) => {
    const package = new Package({
        package_id: req.body.package_id,
        active_delivery_id: req.body.active_delivery_id,
        description: req.body.description,
        weight: req.body.weight,
        dimensions: {
            width: req.body.width,
            height: req.body.height,
            depth: req.body.depth
        },
        from: {
            name: req.body.from_name,
            address: req.body.from_address,
            location: { lat: req.body.from_location.lat, lng: req.body.from_location.lng }
        },
        to: {
            name: req.body.to_name,
            address: req.body.to_address,
            location: { lat: req.body.to_location.lat, lng: req.body.to_location.lng }
        }
    });

    try {
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
        await res.package.remove();
        res.json({ message: 'Deleted Package' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});



module.exports = router;
