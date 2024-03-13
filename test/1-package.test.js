const chai = require('chai');
const chaiHttp = require('chai-http');
const { server } = require('../app');
const Package = require('../models/Package');
const testHelper = require('./test_helper');

chai.use(chaiHttp);
const should = chai.should();

describe('Packages', () => {
    before(async () => {
        await testHelper.startDatabase();
        await testHelper.connect();
    });

    afterEach(async () => {
        await testHelper.clearDatabase();
    });

    after(async () => {
        await testHelper.closeDatabase();
    });

    // Test GET all packages
    describe('/GET packages', () => {
        it('it should GET all packages', (done) => {
            chai.request(server)
                .get('/api/package')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    done();
                });
        });
    });

    // Test POST package
    describe('/POST package', () => {
        it('it should POST a package', (done) => {
            let newPackage = {
                description: "A small package",
                weight: 5,
                dimensions: { width: 10, height: 20, depth: 30 },
                from: {
                    name: "Alice",
                    address: "123 Wonderland",
                    location: { lat: 35.6895, lng: 139.6917 }
                },
                to: {
                    name: "Bob",
                    address: "456 Fantasy Road",
                    location: { lat: 40.7128, lng: -74.0060 }
                }
            };

            chai.request(server)
                .post('/api/package')
                .send(newPackage)
                .end((err, res) => {
                    res.should.have.status(201);
                    res.body.should.be.a('object');
                    res.body.should.have.property('description');
                    done();
                });
        });
    });

    // Test GET package by ID
    describe('/GET/:id package', () => {
        it('it should GET a package by the given id', async () => {
            const newPackage = new Package({
                description: "A small package",
                weight: 5,
                dimensions: { width: 10, height: 20, depth: 30 },
                from: {
                    name: "Alice",
                    address: "123 Wonderland",
                    location: { lat: 35.6895, lng: 139.6917 }
                },
                to: {
                    name: "Bob",
                    address: "456 Fantasy Road",
                    location: { lat: 40.7128, lng: -74.0060 }
                }
            });
            await newPackage.save();

            chai.request(server)
                .get('/api/package/' + newPackage.package_id)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('package_id').eql(newPackage.package_id);
                });
        });
    });

    // Test PUT (update) a package
    describe('/PUT/:id package', () => {
        it('it should UPDATE a package given the id', async () => {
            const newPackage = new Package({
                description: "A small package",
                weight: 5,
                dimensions: { width: 10, height: 20, depth: 30 },
                from: {
                    name: "Alice",
                    address: "123 Wonderland",
                    location: { lat: 35.6895, lng: 139.6917 }
                },
                to: {
                    name: "Bob",
                    address: "456 Fantasy Road",
                    location: { lat: 40.7128, lng: -74.0060 }
                }
            });
            await newPackage.save();

            chai.request(server)
                .put('/api/package/' + newPackage.package_id)
                .send({ weight: 10 })
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('weight').eql(10);
                });
        });
    });

    // Test DELETE a package
    describe('/DELETE/:id package', () => {
        it('it should DELETE a package given the id', async () => {
            const newPackage = new Package({
                description: "A small package",
                weight: 5,
                dimensions: { width: 10, height: 20, depth: 30 },
                from: {
                    name: "Alice",
                    address: "123 Wonderland",
                    location: { lat: 35.6895, lng: 139.6917 }
                },
                to: {
                    name: "Bob",
                    address: "456 Fantasy Road",
                    location: { lat: 40.7128, lng: -74.0060 }
                }
            });
            await newPackage.save();

            const res = await chai.request(server)
            .delete('/api/package/' + newPackage.package_id)
            .end((err, res) => {
                if (err) console.log(err);

                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('message').eql('Deleted Package');
            });
        });
    });


});
