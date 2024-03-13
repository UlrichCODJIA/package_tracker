const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongod;

/**
 * Initialize and start the in-memory database.
 */
module.exports.startDatabase = async () => {
    mongod = await MongoMemoryServer.create();
    return mongod.getUri();
};

/**
 * Connect to the in-memory database.
 */
module.exports.connect = async () => {
    const uri = await this.startDatabase();

    // Check and close any existing connection
    if (mongoose.connection.readyState === 1) {
        await mongoose.connection.close();
    }

    const mongooseOpts = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    };

    await mongoose.connect(uri, mongooseOpts);
};

/**
 * Drop database, close the connection, and stop mongod.
 */
module.exports.closeDatabase = async () => {
    if (mongoose.connection) {
        await mongoose.connection.dropDatabase();
        await mongoose.connection.close();
    }
    if (mongod) await mongod.stop();
};

/**
 * Remove all the data for all db collections.
 */
module.exports.clearDatabase = async () => {
    const collections = mongoose.connection.collections;

    for (const key in collections) {
        if (collections[key]) {
            await collections[key].deleteMany();
        }
    }
};
