const cds = require('@sap/cds');
const cors = require('./cors-middleware');
const logger = require('./utils/logger');
const { apiLimiter } = require('./middleware/rate-limit.middleware');
const handlers = require('./handlers');

// Bootstrap middleware
cds.on('bootstrap', app => {
    // Add JSON body parser middleware
    app.use(require('express').json());
    app.use(require('express').urlencoded({ extended: true }));

    // Apply rate limiting to all routes
    app.use(apiLimiter);

    // Apply CORS
    app.use(cors);
});

// Register handlers when service is ready
cds.on('served', async () => {
    try {
        const srv = cds.services.MaintenanceService;
        if (srv) {
            logger.info('MaintenanceService detected, registering handlers...');

            // Register handlers explicitly
            await handlers.call(srv);

            logger.info('Service handlers registered successfully');
        }
    } catch (error) {
        logger.error('Server setup failed', { error: error.message });
    }
});