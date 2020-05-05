class AuthV1Error extends Error {
    constructor({ statusCode, requestID, errorCode, message, dataError, status }) {
        super();
        this.statusCode = statusCode;
        this.requestID = requestID;
        this.errorCode = errorCode;
        this.message = message;
        this.dataError = dataError;
        this.status = status;
    }

    getMessage() {
        let tmpMessage = 'Authentication V1 Error ';
        typeof this.message === 'string' && (tmpMessage += this.message);
        return `${tmpMessage} ${this.requestID}`;
    }
}

module.exports = AuthV1Error;