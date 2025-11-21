const cds = require('@sap/cds');
const cors = require('./cors-middleware');
const initData = require('./init-data');
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

// Initialize data when service is ready
cds.on('served', async () => {
    try {
        const srv = cds.services.MaintenanceService;
        if (srv) {
            logger.info('MaintenanceService detected, initializing data and handlers...');

            // Register handlers explicitly
            await handlers.call(srv);

            await initData(srv);
            logger.info('Data initialization completed');
        }
    } catch (error) {
        logger.error('Server setup failed', { error: error.message });
    }
});