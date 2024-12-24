// errors/custom-api.js

class CustomAPIError extends Error {
    constructor(message) {
        super(message)
    }
}

module.exports = CustomAPIError
