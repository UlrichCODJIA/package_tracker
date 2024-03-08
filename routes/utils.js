function updatePropertyIfNotNull(sourceObject, targetObject, propertyName) {
    if (sourceObject[propertyName] != null) {
        targetObject[propertyName] = sourceObject[propertyName];
    }
}

module.exports = {
    updatePropertyIfNotNull,
};