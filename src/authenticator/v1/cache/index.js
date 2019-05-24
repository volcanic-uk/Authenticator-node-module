const cache = require('memory-cache');

/**
 * @function addTokenToCache this is an asynchronous function that accepts 3 parameters the key for the token, the value which is the token itself, and then
 * the duration NOTICE! if you do not specify a duration to the token it will be stored in the run time memory forever, so pass the duration as a param from 
 * the environemnt variable file
 * 
 * @param key ideally a string containing the info for the token provided
 * @param value ideally a string containg the token needed to request authenticate requests
 * @param duration ideally a number containing the duration in which the token should expire
 */

exports.addTokenToCache = async (key, value, duration=60) => {
    try {
        let DurationInMillisecond = parseInt(duration) * 60 * 1000;
        let cachedToken = await cache.put(key, value, DurationInMillisecond);
        return cachedToken;
    } catch (error) {
        throw error;
    }
};

/**
 * @function getTokenFromCache this is an asynchronous function that accepts 1 parameter which is the key needed to retrieve the token
 * 
 * @param key ideally a string containing the info for the token to be addressed to retrieve
 */

exports.getTokenFromCache = async (key) => {
    try {
        let cachedToken = await cache.get(key);
        return cachedToken;
    } catch (error) {
        throw error;
    }
};