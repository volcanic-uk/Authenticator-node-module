const cache = require('memory-cache');

exports.addTokenToCache = async (key, value) => {
    let cachedToken = await cache.put(key, value);
    return cachedToken;
};

exports.getTokenFromCache = async (key) => {
    let cachedToken = await cache.get(key);
    return cachedToken;
};