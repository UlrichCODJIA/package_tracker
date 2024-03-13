const chai = require('chai');
const { updatePropertyIfNotNull } = require('../routes/utils');
const should = chai.should();

describe('Utility Functions', () => {
    describe('updatePropertyIfNotNull', () => {
        it('should update property if not null', () => {
            let targetObj = { existingProp: 'existing' };
            let sourceObj = { newProp: 'new', existingProp: null };

            updatePropertyIfNotNull(sourceObj, targetObj, 'newProp');
            targetObj.should.have.property('newProp').eql('new');

            updatePropertyIfNotNull(sourceObj, targetObj, 'existingProp');
            targetObj.should.have.property('existingProp').eql('existing');
        });
    });
});
