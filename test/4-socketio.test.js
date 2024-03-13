const chai = require('chai');
const io = require('socket.io-client');
const { server } = require('../app');
const should = chai.should();

describe('Socket.IO Events', () => {
    let socket;

    before((done) => {
        server.listen(5001, () => {
            socket = io.connect('http://localhost:5001', {
                'reconnection delay': 0,
                'reopen delay': 0,
                'force new connection': true,
            });
            socket.on('connect', () => {
                done();
            });
        });
    });

    after((done) => {
        if (socket.connected) {
            socket.disconnect();
        }
        server.close(done);
    });

    // Test 'location_changed' event
    describe('location_changed event', () => {
        it('should update delivery location', (done) => {
            socket.emit('location_changed', { delivery_id: '1', newLocation: { lat: 40, lng: -74 } });

            socket.on('delivery_updated', (updatedDelivery) => {
                updatedDelivery.should.be.an('object');
                updatedDelivery.location.should.eql({ lat: 40, lng: -74 });
            });
            done();
        });
    });

    // Test 'status_changed' event
    describe('status_changed event', () => {
        it('should update delivery status and set appropriate timestamps', (done) => {
            socket.emit('status_changed', { delivery_id: '1', newStatus: 'picked-up' });

            socket.on('delivery_updated', (updatedDelivery) => {
                updatedDelivery.should.be.an('object');
                updatedDelivery.status.should.eql('picked-up');

                should.exist(updatedDelivery.pickup_time);

                socket.emit('status_changed', { delivery_id: '1', newStatus: 'delivered' });

                socket.on('delivery_updated', (updatedDelivery) => {
                    updatedDelivery.should.be.an('object');
                    updatedDelivery.status.should.eql('delivered');

                    should.exist(updatedDelivery.end_time);
                });
            });
            done();
        });

        // Test for 'in-transit' status
        it('should update delivery status to in-transit and set start_time', (done) => {
            socket.emit('status_changed', { delivery_id: '1', newStatus: 'in-transit' });

            socket.on('delivery_updated', (updatedDelivery) => {
                updatedDelivery.should.be.an('object');
                updatedDelivery.status.should.eql('in-transit');
                should.exist(updatedDelivery.start_time);
            });
            done();
        });

        // Test for 'failed' status
        it('should update delivery status to failed and set end_time', (done) => {
            socket.emit('status_changed', { delivery_id: '1', newStatus: 'failed' });

            socket.on('delivery_updated', (updatedDelivery) => {
                updatedDelivery.should.be.an('object');
                updatedDelivery.status.should.eql('failed');
                should.exist(updatedDelivery.end_time);
            });
            done();
        });

        // Test for invalid delivery ID
        it('should not update and emit an error for invalid delivery ID', (done) => {
            socket.emit('status_changed', { delivery_id: 'invalid_id', newStatus: 'in-transit' });

            socket.on('error', (errorMsg) => {
                errorMsg.should.be.a('string');
            });
            done();
        });

        // Test for non-existent delivery ID
        it('should not update and emit an error for non-existent delivery ID', (done) => {
            socket.emit('status_changed', { delivery_id: '999', newStatus: 'delivered' });

            socket.on('error', (errorMsg) => {
                errorMsg.should.be.a('string');
            });
            done();
        });
    });


});
