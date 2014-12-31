// NotAuthorizedError
// ------------------
// Thrown if a used tries to do something they do not
// have sufficent permissions for.
function NotAuthorizedError(message) {
    this.message = message;
    this.stack = new Error().stack;
    this.code = 401;
    this.type = this.name;
}

NotAuthorizedError.prototype = Object.create(Error.prototype);
NotAuthorizedError.prototype.name = 'NotAuthorizedError';

module.exports = NotAuthorizedError;
