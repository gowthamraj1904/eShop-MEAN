function errorHandler(error, req, res, next) {
    if (err.name === 'UnauthorizedError') {
        // Jwt authentication error
        return res.status(401).json({
            message: 'The user is not authorized',
            error
        });
    }

    if (err.name === 'ValidationError') {
        // Validation error
        return res.status(422).json({
            message: 'Validation Error',
            error
        });
    }

    // Default to 500 server error
    return res.status(500).json({
        message: 'Server Error',
        error
    });
}

module.exports = errorHandler;
