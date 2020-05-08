const NodeCache = require('node-cache');
const config = require('../../../config');
const cache = new NodeCache();

exports.put = (key, value, duration = 3600) => {
    if (config.cache.enableCaching) {
        return cache.set(key, value, duration);
    }
};

exports.get = (key) => {
    return cache.get(key);
};

exports.del = (key) => {
    return cache.del(key);
};