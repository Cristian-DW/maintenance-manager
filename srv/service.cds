using { mm as db } from '../db/schema';

service MaintenanceService @(path: '/maintenance') {
    @readonly entity Users as projection on db.Users {
        *,
        requests: redirected to MaintenanceRequests,
        assignments: redirected to MaintenanceRequests
    };
    
    @readonly entity Assets as projection on db.Assets {
        *,
        requests: redirected to MaintenanceRequests
    };
    
    entity MaintenanceRequests as projection on db.MaintenanceRequests {
        *,
        requestedBy.name as requesterName : String,
        assignedTo.name as technicianName : String,
        asset.code as assetCode : String
    } actions {
        action assign(technicianId: UUID);
        action updateStatus(newStatus: db.Status);
        action updatePriority(newPriority: Integer);
    };
}

// Roles and Authorization
annotate MaintenanceService.MaintenanceRequests with @(restrict: [
    { grant: ['READ'], to: ['REQUESTER', 'TECH', 'MANAGER'] },
    { grant: ['CREATE'], to: ['REQUESTER', 'MANAGER'] },
    { grant: ['UPDATE'], to: ['TECH', 'MANAGER'] },
    { grant: ['DELETE'], to: ['MANAGER'] }
]);

annotate MaintenanceService.Users with @(restrict: [
    { grant: ['READ'], to: ['REQUESTER', 'TECH', 'MANAGER'] }
]);

annotate MaintenanceService.Assets with @(restrict: [
    { grant: ['READ'], to: ['REQUESTER', 'TECH', 'MANAGER'] }
]);