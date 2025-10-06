const cds = require('@sap/cds');

module.exports = cds.service.impl(function () {
  const { MaintenanceRequests } = this.entities;
  const { UPDATE } = cds.ql;

  // Handler para la action 'assign' definida en service.cds
  this.on('assign', async (req) => {
    const { requestID, toUser } = req.data;
    if (!requestID || !toUser) return req.reject(400, 'requestID and toUser required');

    // Actualiza la solicitud: assignedTo + status
    await cds.transaction(req).run(
      UPDATE(MaintenanceRequests).set({ assignedTo: toUser, status: 'ASSIGNED' }).where({ ID: requestID })
    );

    // Emitimos un evento (puede ser consumido por Kyma/microservicio después)
    this.emit('MaintenanceRequestAssigned', { ID: requestID, assignedTo: toUser });

    return { ID: requestID, assignedTo: toUser };
  });

  // Aquí puedes añadir más handlers (validaciones, triggers, etc.)
});