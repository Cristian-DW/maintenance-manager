const cds = require('@sap/cds');
const cors = require('./cors-middleware');
const bcrypt = require('bcryptjs');
const { SELECT } = cds.ql;

cds.on('bootstrap', app => {
    // Add JSON body parser middleware
    app.use(require('express').json());
    app.use(require('express').urlencoded({ extended: true }));
    app.use(cors);
    
    // Custom authentication endpoint
    app.post('/odata/v4/maintenance/authenticate', async (req, res) => {
        try {
            const { email, password } = req.body;
            
            if (!email || !password) {
                return res.status(400).json({ ok: false, message: 'Email and password are required' });
            }
            
            // Query user using CDS QL
            const user = await SELECT.one.from('mm.Users').where({ email });
            
            if (!user) {
                return res.status(401).json({ ok: false, message: 'Invalid credentials' });
            }
            
            // Verify password
            const isValid = await bcrypt.compare(password, user.password);
            if (!isValid) {
                return res.status(401).json({ ok: false, message: 'Invalid credentials' });
            }
            
            // Return user without password
            delete user.password;
            res.json({ ok: true, user });
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error('Authentication error:', error);
            res.status(500).json({ ok: false, message: 'Authentication failed' });
        }
    });
});