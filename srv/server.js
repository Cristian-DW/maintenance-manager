const cds = require('@sap/cds');
const cors = require('./cors-middleware');

cds.on('bootstrap', app => {
    app.use(cors);
});