const cds = require('@sap/cds');

module.exports = cds.service.impl(async function () {
    const { MaintenanceRequests, Notifications, Users } = this.entities;

    // Helper function to create notification
    async function createNotification({ userId, title, message, type, relatedRequestId }) {
        try {
            await INSERT.into(Notifications).entries({
                user_ID: userId,
                title,
                message,
                type,
                relatedRequest_ID: relatedRequestId,
                isRead: false
            });
            console.log(`✅ Notification created for user ${userId}: ${title}`);
        } catch (error) {
            console.error('❌ Error creating notification:', error);
        }
    }

    // After creating a request - notify admins/managers
    this.after('CREATE', 'MaintenanceRequests', async (data, req) => {
        try {
            // Get all admins and managers
            const managers = await SELECT.from(Users).where({ role: { in: ['ADMIN', 'MANAGER'] } });

            // Create notification for each manager
            for (const manager of managers) {
                await createNotification({
                    userId: manager.ID,
                    title: 'Nueva Solicitud de Mantenimiento',
                    message: `${data.title} - Prioridad ${data.priority}`,
                    type: 'request_created',
                    relatedRequestId: data.ID
                });
            }
        } catch (error) {
            console.error('Error in CREATE notification:', error);
        }
    });

    // After updating a request - check for assignment or status change
    this.after('UPDATE', 'MaintenanceRequests', async (data, req) => {
        try {
            // Get the updated request with associations
            const request = await SELECT.one.from(MaintenanceRequests)
                .where({ ID: data.ID })
                .columns(['ID', 'title', 'status', 'assignedTo_ID', 'requestedBy_ID']);

            if (!request) return;

            // Check if assignedTo changed
            if (data.assignedTo_ID && data.assignedTo_ID !== req.data.assignedTo_ID) {
                await createNotification({
                    userId: data.assignedTo_ID,
                    title: 'Solicitud Asignada',
                    message: `Se te ha asignado: ${request.title}`,
                    type: 'request_assigned',
                    relatedRequestId: request.ID
                });
            }

            // Check if status changed
            if (data.status && data.status !== req.data.status) {
                // Notify the requester
                if (request.requestedBy_ID) {
                    const statusLabels = {
                        'OPEN': 'Abierta',
                        'ASSIGNED': 'Asignada',
                        'IN_PROGRESS': 'En Progreso',
                        'DONE': 'Terminada',
                        'CLOSED': 'Cerrada'
                    };

                    await createNotification({
                        userId: request.requestedBy_ID,
                        title: 'Estado Actualizado',
                        message: `${request.title} - Ahora: ${statusLabels[data.status] || data.status}`,
                        type: 'status_changed',
                        relatedRequestId: request.ID
                    });
                }
            }
        } catch (error) {
            console.error('Error in UPDATE notification:', error);
        }
    });

    // Expose Notifications entity
    this.on('READ', 'Notifications', async (req, next) => {
        // Filter by current user if not admin
        if (req.user && req.user.id) {
            req.query.where({ user_ID: req.user.id });
        }
        return next();
    });
});
