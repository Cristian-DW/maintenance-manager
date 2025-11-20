const cds = require('@sap/cds');
const bcrypt = require('bcryptjs');
const { validateRequest } = require('./validation');

// Funciones de utilidad para contraseñas
async function hashPassword(password) {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
}

async function comparePasswords(password, hash) {
    return bcrypt.compare(password, hash);
}

module.exports = cds.service.impl(async function () {
    const { MaintenanceRequests, Users } = this.entities;
    const { UPDATE, SELECT } = cds.ql;

    // eslint-disable-next-line no-console
    console.log('► Handlers.js: Setting up service handlers...');

    // Acción personalizada de autenticación
    this.on('authenticate', async (req) => {
        const { email, password } = req.data;
        
        // eslint-disable-next-line no-console
        console.log('authenticate action called with email:', email);

        if (!email || !password) {
            return req.reject(400, 'Email and password are required');
        }

        try {
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

    // Middleware para hashear contraseña en CREATE/UPDATE de Users
    this.before(['CREATE', 'UPDATE'], 'Users', async (req) => {
        if (req.data.password) {
            req.data.password = await hashPassword(req.data.password);
        }
    });

    // Middleware para ocultar contraseña en lecturas
    this.after('READ', 'Users', (each) => {
        delete each.password;
    });

    // Middleware para actualizar timestamps y validación
    this.before(['CREATE', 'UPDATE'], 'MaintenanceRequests', async (req) => {
        // Validar los datos de entrada
        try {
            validateRequest('MaintenanceRequest', req.data);
        } catch (error) {
            return req.reject(400, error.message, error.details);
        }

        // Para CREATE, obtener o establecer el usuario que hace la solicitud
        if (req.event === 'CREATE') {
            // Si no se proporciona requestedBy_ID, buscar por email del usuario autenticado
            if (!req.data.requestedBy_ID) {
                const userEmail = req.user?.attr?.email || req.user?.email || 'requester@example.com';
                
                try {
                    // Buscar el usuario en la base de datos
                    // Intentamos usar la entidad del servicio primero
                    const user = await SELECT.one.from(Users).where({ email: userEmail });
                    if (user && user.ID) {
                        req.data.requestedBy_ID = user.ID;
                        // eslint-disable-next-line no-console
                        console.log(`Found user ${user.ID} for email ${userEmail}`);
                    } else {
                        // Si no se encuentra, usar el usuario requester por defecto (ID: '3')
                        req.data.requestedBy_ID = '3';
                        // eslint-disable-next-line no-console
                        console.log(`User not found for email ${userEmail}, using default requester (ID: 3)`);
                    }
                } catch (error) {
                    // eslint-disable-next-line no-console
                    console.warn('Error finding user, using default requester:', error.message);
                    // Usar el usuario requester por defecto (ID: '3') - esto asegura que siempre haya un usuario
                    req.data.requestedBy_ID = '3';
                }
            }

            // Remover campos que no existen en el schema (assetCode, assetLocation)
            delete req.data.assetCode;
            delete req.data.assetLocation;
            
            req.data.createdAt = new Date().toISOString();
            req.data.status = req.data.status || 'OPEN';
            
            // eslint-disable-next-line no-console
            console.log('Creating maintenance request with data:', {
                title: req.data.title,
                asset_ID: req.data.asset_ID,
                requestedBy_ID: req.data.requestedBy_ID,
                priority: req.data.priority
            });
        }
        req.data.updatedAt = new Date().toISOString();
    });

    // Handler para asignar técnico
    this.on('assign', async (req) => {
        const { technicianId } = req.data;
        const requestId = req.params[0];

        if (!requestId || !technicianId) {
            return req.reject(400, 'Request ID and technician ID are required');
        }

        try {
            // Validar que el técnico existe y tiene el rol correcto
            const technician = await SELECT.one.from(Users).where({ ID: technicianId });
            if (!technician) return req.reject(404, 'Technician not found');
            if (technician.role !== 'TECH') return req.reject(400, 'User must be a technician');

            // Actualizar la solicitud dentro de una transacción
            await cds.transaction(req).run(
                UPDATE(MaintenanceRequests)
                    .set({
                        assignedTo_ID: technicianId,
                        status: 'ASSIGNED',
                        updatedAt: new Date().toISOString()
                    })
                    .where({ ID: requestId })
            );

            // Emitir evento
            this.emit('MaintenanceRequestAssigned', { ID: requestId, assignedTo: technicianId });

            return { success: true, requestId, technicianId };
        } catch (error) {
            req.reject(500, error.message);
        }
    });

    // Handler para actualizar estado
    this.on('updateStatus', async (req) => {
        const { newStatus } = req.data;
        const requestId = req.params[0];

        const validStatuses = ['OPEN', 'ASSIGNED', 'IN_PROGRESS', 'DONE', 'CLOSED'];
        if (!validStatuses.includes(newStatus)) {
            return req.reject(400, `Status must be one of: ${validStatuses.join(', ')}`);
        }

        await cds.transaction(req).run(
            UPDATE(MaintenanceRequests)
                .set({
                    status: newStatus,
                    updatedAt: new Date().toISOString()
                })
                .where({ ID: requestId })
        );

        this.emit('MaintenanceRequestStatusUpdated', { ID: requestId, status: newStatus });
        return { success: true, requestId, status: newStatus };
    });

    // Handler para actualizar prioridad
    this.on('updatePriority', async (req) => {
        const { newPriority } = req.data;
        const requestId = req.params[0];

        if (newPriority < 1 || newPriority > 3) {
            return req.reject(400, 'Priority must be between 1 and 3');
        }

        await cds.transaction(req).run(
            UPDATE(MaintenanceRequests)
                .set({
                    priority: newPriority,
                    updatedAt: new Date().toISOString()
                })
                .where({ ID: requestId })
        );

        this.emit('MaintenanceRequestPriorityUpdated', { ID: requestId, priority: newPriority });
        return { success: true, requestId, priority: newPriority };
    });

    // Log para debugging de las lecturas
    this.before('READ', 'MaintenanceRequests', (req) => {
        // eslint-disable-next-line no-console
        console.log('Reading MaintenanceRequests', req.query?.SELECT?.columns);
    });

    // Los campos calculados (assetCode, technicianName, requesterName) 
    // se calculan automáticamente por CAP desde las proyecciones definidas en service.cds
    // No es necesario un handler after READ para estos campos
});
