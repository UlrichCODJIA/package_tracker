const chai = require('chai');
const chaiHttp = require('chai-http');
const { server } = require('../app');
const Delivery = require('../models/Delivery');
const testHelper = require('./test_helper');

chai.use(chaiHttp);
const should = chai.should();

describe('Deliveries', () => {
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

    // Test GET all deliveries
    describe('/GET deliveries', () => {
        it('it should GET all deliveries', (done) => {
            chai.request(server)
                .get('/api/delivery')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    done();
                });
        });
    });

    // Test POST delivery
    describe('/POST delivery', () => {
        it('it should POST a delivery', (done) => {
            let newDelivery = {
                package_id: "1",
                location: { lat: 35.6895, lng: 139.6917 },
                status: 'open'
            };

            chai.request(server)
                .post('/api/delivery')
                .send(newDelivery)
                .end((err, res) => {
                    res.should.have.status(201);
                    res.body.should.be.a('object');
                    res.body.should.have.property('status').eql('open');
                    done();
                });
        });
    });

    // Test GET delivery by ID
    describe('/GET/:id delivery', () => {
        it('it should GET a delivery by the given id', (done) => {
            let delivery = new Delivery({ package_id: "1", location: { lat: 35.6895, lng: 139.6917 }, status: 'open' });
            delivery.save((err, delivery) => {
                chai.request(server)
                    .get('/api/delivery/' + delivery.delivery_id)
                    .send(delivery)
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        res.body.should.have.property('package_id');
                        res.body.should.have.property('delivery_id').eql(delivery.delivery_id);
                    });
            });
            done();
        });
    });

    // Test PUT (update) a delivery
    describe('/PUT/:id delivery', () => {
        it('it should UPDATE a delivery given the id', (done) => {
            let delivery = new Delivery({ package_id: "1", location: { lat: 35.6895, lng: 139.6917 }, status: 'open' })
            delivery.save((err, delivery) => {
                chai.request(server)
                    .put('/api/delivery/' + delivery.delivery_id)
                    .send({ status: 'picked-up' })
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        res.body.should.have.property('status').eql('picked-up');
                    });
            });
            done();
        });
    });

    // Test DELETE a delivery
    describe('/DELETE/:id delivery', () => {
        it('it should DELETE a delivery given the id', (done) => {
            let delivery = new Delivery({ package_id: "1", location: { lat: 35.6895, lng: 139.6917 }, status: 'open' })
            delivery.save((err, delivery) => {
                chai.request(server)
                    .delete('/api/delivery/' + delivery.delivery_id)
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        res.body.should.have.property('message').eql('Deleted Delivery');
                    });
            });
            done();
        });
    });


});
