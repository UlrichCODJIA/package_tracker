const express = require('express');
const router = express.Router();
const Package = require('../models/Package');

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
    if (req.body.active_delivery_id != null) {
        res.package.active_delivery_id = req.body.active_delivery_id;
    }
    if (req.body.description != null) {
        res.package.description = req.body.description;
    }
    if (req.body.weight != null) {
        res.package.weight = req.body.weight;
    }
    if (typeof req.body.dimensions == "undefined") {
        if (req.body.dimensions.width != null) {
            res.package.dimensions.width = req.body.dimensions.width;
        }
        else if (req.body.dimensions.height != null) {
            res.package.dimensions.height = req.body.dimensions.height;
        }
        else if (req.body.dimensions.depth != null) {
            res.package.dimensions.depth = req.body.dimensions.depth;
        }
    }
    if (typeof req.body.from == "undefined") {
        if (req.body.from.name != null) {
            res.package.from.name = req.body.from.name;
        }
        else if (req.body.from.address != null) {
            res.package.from.address = req.body.from.address;
        }
        if (typeof req.body.from.location == "undefined") {
            if (req.body.from.location.lat != null) {
                res.package.from.location.lat = req.body.from.location.lat;
            }
            else if (req.body.from.location.lng != null) {
                res.package.from.location.lng = req.body.from.location.lng;
            }
        }
    }
    if (typeof req.body.to == "undefined") {
        if (req.body.to.name != null) {
            res.package.to.name = req.body.to.name;
        }
        else if (req.body.to.address != null) {
            res.package.to.address = req.body.to.address;
        }
        if (typeof req.body.to.location == "undefined") {
            if (req.body.to.location.lat != null) {
                res.package.to.location.lat = req.body.to.location.lat;
            }
            else if (req.body.to.location.lng != null) {
                res.package.to.location.lng = req.body.to.location.lng;
            }
        }
    }

    try {
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
