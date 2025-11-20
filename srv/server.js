const cds = require('@sap/cds');
const cors = require('./cors-middleware');
const initData = require('./init-data');

cds.on('bootstrap', app => {
    // Add JSON body parser middleware
    app.use(require('express').json());
    app.use(require('express').urlencoded({ extended: true }));
    app.use(cors);
});

// Initialize data and register handlers when service is ready
cds.on('served', async () => {
    try {
        const srv = cds.services.MaintenanceService;
        if (srv) {
            // eslint-disable-next-line no-console
            console.log('► Server: MaintenanceService detected, initializing data...');
            await initData(srv);
            // eslint-disable-next-line no-console
            console.log('✓ Server: Data initialization completed');
            
            // Register handlers directly on the service instance
            const bcrypt = require('bcryptjs');
            const { SELECT, UPDATE } = cds.ql;

            // Utility function
            async function comparePasswords(password, hash) {
                return bcrypt.compare(password, hash);
            }

            // eslint-disable-next-line no-console
            console.log('► Server: Registering handlers...');

            // Authentication action handler
            srv.on('authenticate', async (req) => {
                const { email, password } = req.data;
                
                // eslint-disable-next-line no-console
                console.log('authenticate action called with email:', email);

                if (!email || !password) {
                    return req.reject(400, 'Email and password are required');
                }

                try {
                    const { Users } = srv.entities;
                    const user = await SELECT.one.from(Users).where({ email, isActive: true });
                    
                    if (!user) {
                        // eslint-disable-next-line no-console
                        console.log('User not found for email:', email);
                        return req.reject(401, 'Invalid credentials');
                    }

                    const isValidPassword = await comparePasswords(password, user.password);
                    
                    if (!isValidPassword) {
                        // eslint-disable-next-line no-console
                        console.log('Invalid password for user:', email);
                        return req.reject(401, 'Invalid credentials');
                    }

                    // No retornar la contraseña
                    delete user.password;
                    // eslint-disable-next-line no-console
                    console.log('Authentication successful for user:', email);
                    return { ok: true, user };
                } catch (error) {
                    // eslint-disable-next-line no-console
                    console.error('Authentication error:', error);
                    req.reject(500, 'Authentication failed');
                }
            });

            // Helper function to hash passwords
            async function hashPassword(password) {
                const salt = await bcrypt.genSalt(10);
                return bcrypt.hash(password, salt);
            }

            // CRUD Handlers for MaintenanceRequests
            const { Users } = srv.entities;

            // Create MaintenanceRequest
            srv.before('CREATE', 'MaintenanceRequests', async (req) => {
                // Set defaults
                req.data.createdAt = new Date().toISOString();
                req.data.status = req.data.status || 'OPEN';
                
                // Auto-assign requestedBy if not provided (use first REQUESTER user)
                if (!req.data.requestedBy_ID) {
                    const requester = await SELECT.one.from(Users).where({ role: 'REQUESTER', isActive: true });
                    if (requester) {
                        req.data.requestedBy_ID = requester.ID;
                    }
                }
                
                // eslint-disable-next-line no-console
                console.log('Creating maintenance request:', req.data.title);
            });

            // Update MaintenanceRequest
            srv.before('UPDATE', 'MaintenanceRequests', async (req) => {
                req.data.updatedAt = new Date().toISOString();
                // eslint-disable-next-line no-console
                console.log('Updating maintenance request:', req.data.ID);
            });

            // Delete MaintenanceRequest
            srv.before('DELETE', 'MaintenanceRequests', async (req) => {
                // eslint-disable-next-line no-console
                console.log('Deleting maintenance request:', req.data.ID);
            });

            // CRUD Handlers for Users
            
            // Create User
            srv.before('CREATE', 'Users', async (req) => {
                if (req.data.password) {
                    req.data.password = await hashPassword(req.data.password);
                }
                req.data.createdAt = new Date().toISOString();
                req.data.isActive = req.data.isActive !== false; // default true
                // eslint-disable-next-line no-console
                console.log('Creating user:', req.data.email);
            });

            // Update User
            srv.before('UPDATE', 'Users', async (req) => {
                if (req.data.password) {
                    req.data.password = await hashPassword(req.data.password);
                }
                req.data.modifiedAt = new Date().toISOString();
                // eslint-disable-next-line no-console
                console.log('Updating user:', req.data.ID);
            });

            // Hide password in all Users responses
            srv.after('READ', 'Users', (each) => {
                delete each.password;
            });

            // Delete User (soft delete)
            srv.before('DELETE', 'Users', async (req) => {
                // Instead of deleting, set isActive to false
                await srv.run(UPDATE.entity('Users').set({isActive: false}).where({ID: req.data.ID}));
                req.reject(200, 'User deactivated successfully');
            });

            // CRUD Handlers for Assets
            
            // Create Asset
            srv.before('CREATE', 'Assets', async (req) => {
                req.data.createdAt = new Date().toISOString();
                req.data.isActive = req.data.isActive !== false; // default true
                // eslint-disable-next-line no-console
                console.log('Creating asset:', req.data.name);
            });

            // Update Asset
            srv.before('UPDATE', 'Assets', async (req) => {
                req.data.modifiedAt = new Date().toISOString();
                // eslint-disable-next-line no-console
                console.log('Updating asset:', req.data.ID);
            });

            // Delete Asset
            srv.before('DELETE', 'Assets', async (req) => {
                // eslint-disable-next-line no-console
                console.log('Deleting asset:', req.data.ID);
            });

            // eslint-disable-next-line no-console
            console.log('✓ Server: Handlers registered successfully');
        }
    } catch (error) {
        // eslint-disable-next-line no-console
        console.error('✗ Server: Setup failed:', error.message);
    }
});