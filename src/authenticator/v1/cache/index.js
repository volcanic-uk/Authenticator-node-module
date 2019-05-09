const cache = require('memory-cache');

exports.addTokenToCache = async (key, value, duration) => {
    let cachedToken = await cache.put(key, value, duration);
    return cachedToken;
};

exports.getTokenFromCache = async (key) => {
    let cachedToken = await cache.get(key);
    return cachedToken;
};