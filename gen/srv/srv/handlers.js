const cds = require('@sap/cds');

module.exports = cds.service.impl(function () {
    const { MaintenanceRequests, Users } = this.entities;
    const { UPDATE, SELECT } = cds.ql;

    // Middleware para actualizar timestamps
    this.before(['CREATE', 'UPDATE'], 'MaintenanceRequests', async (req) => {
        if (req.event === 'CREATE') {
            req.data.createdAt = new Date().toISOString();
            req.data.status = 'OPEN';
        }
        req.data.updatedAt = new Date().toISOString();
    });

    // Validaciones
    this.before(['CREATE', 'UPDATE'], 'MaintenanceRequests', async (req) => {
        if (req.data.priority && (req.data.priority < 1 || req.data.priority > 3)) {
            return req.reject(400, 'Priority must be between 1 and 3');
        }
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

    // Enriquecer los datos en las lecturas
    this.after('READ', 'MaintenanceRequests', (results) => {
        if (Array.isArray(results)) {
            results.forEach(enrichRequest);
        } else if (results) {
            enrichRequest(results);
        }
    });
});

// Función auxiliar para enriquecer los datos de la solicitud
function enrichRequest(request) {
    if (request.requestedBy) {
        request.requesterName = request.requestedBy.name;
    }
    if (request.assignedTo) {
        request.technicianName = request.assignedTo.name;
    }
    if (request.asset) {
        request.assetCode = request.asset.code;
    }
}