const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const socketIo = require('socket.io');

const Delivery = require('./models/Delivery');
const packageRoutes = require('./routes/packages');
const deliveryRoutes = require('./routes/deliveries');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "http://localhost:4200",
        methods: ["GET", "POST"]
    }
});

io.on('connection', (socket) => {
    console.log('New client connected');

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });

    socket.on('location_changed', async (data) => {
        const { delivery_id, newLocation } = data;

        try {
            const delivery = await Delivery.findById(delivery_id);
            if (!delivery) {
                socket.emit('error', 'Delivery not found');
                return;
            }

            delivery.location = newLocation;
            const updatedDelivery = await delivery.save();

            // Broadcast updated delivery to all clients
            io.emit('delivery_updated', updatedDelivery);
        } catch (err) {
            socket.emit('error', err.message);
        }
    });

    socket.on('status_changed', async (data) => {
        const { delivery_id, newStatus } = data;

        try {
            const delivery = await Delivery.findById(delivery_id);
            if (!delivery) {
                socket.emit('error', 'Delivery not found');
                return;
            }

            delivery.status = newStatus;

            // Update timestamps based on status
            if (newStatus === 'picked-up') {
                delivery.pickup_time = new Date();
            } else if (newStatus === 'in-transit') {
                delivery.start_time = new Date();
            } else if (newStatus === 'delivered' || newStatus === 'failed') {
                delivery.end_time = new Date();
            }

            const updatedDelivery = await delivery.save();

            // Broadcast updated delivery to all clients
            io.emit('delivery_updated', updatedDelivery);
        } catch (err) {
            socket.emit('error', err.message);
        }
    });
});

// Middleware
app.use(bodyParser.json());
app.use(cors());

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/packageTracker')
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

app.use('/api/package', packageRoutes);
app.use('/api/delivery', deliveryRoutes);


const PORT = process.env.PORT || 5000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
