using { mm as db } from '../db/schema';

@protocol: ['odata-v4', 'rest']
service MaintenanceService {
    entity Assets as projection on db.Assets;
    entity Users as projection on db.Users;
    entity MaintenanceRequests as projection on db.MaintenanceRequests;
}