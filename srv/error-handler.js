module.exports = (err, req, res, next) => {
  console.error(err.stack);

  // Handle specific CAP errors
  if (err.code === 'ENTITY_NOT_FOUND') {
    return res.status(404).json({
      error: {
        code: 'NOT_FOUND',
        message: 'The requested resource was not found'
      }
    });
  }

  // Handle validation errors
  if (err.code === 'INVALID_INPUT') {
    return res.status(400).json({
      error: {
        code: 'BAD_REQUEST',
        message: err.message,
        details: err.details
      }
    });
  }

  // Handle authorization errors
  if (err.code === 'UNAUTHORIZED') {
    return res.status(401).json({
      error: {
        code: 'UNAUTHORIZED',
        message: 'Authentication required'
      }
    });
  }

  if (err.code === 'FORBIDDEN') {
    return res.status(403).json({
      error: {
        code: 'FORBIDDEN',
        message: 'Insufficient permissions'
      }
    });
  }

  // Default error handler
  res.status(500).json({
    error: {
      code: 'INTERNAL_ERROR',
      message: 'An unexpected error occurred'
    }
  });
};