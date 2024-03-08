const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const packageRoutes = require('./routes/packages');
const deliveryRoutes = require('./routes/deliveries');

const app = express();

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

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
