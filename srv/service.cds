using mm from '../db/schema';

service MaintenanceService {
  entity MaintenanceRequests as projection on mm.MaintenanceRequests;
  entity Assets as projection on mm.Assets;
  entity Users as projection on mm.Users;

  // acción sencilla para asignar una solicitud (la manejaremos en handlers)
  action assign(requestID: UUID, toUser: UUID);
}