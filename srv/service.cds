using { mm as db } from '../db/schema';

@requires: 'authenticated-user'
service MaintenanceService @(path: '/maintenance') {
    @readonly 
    entity Users as projection on db.Users {
        *,
        requests: redirected to MaintenanceRequests,
        assignments: redirected to MaintenanceRequests
    };
    
    @readonly 
    entity Assets as projection on db.Assets {
        *,
        requests: redirected to MaintenanceRequests
    };
    
    @restrict: [
        { grant: ['READ', 'CREATE'], to: 'authenticated-user' },
        { grant: ['UPDATE', 'assign', 'updateStatus'], to: 'Tech' },
        { grant: ['DELETE', 'updatePriority'], to: 'Admin' }
    ]
    entity MaintenanceRequests as projection on db.MaintenanceRequests {
        *,
        requestedBy.name as requesterName : String,
        assignedTo.name as technicianName : String,
        asset.code as assetCode : String
    } actions {
        @(restrict: [{ to: 'Tech' }])
        action assign(technicianId: UUID);
        @(restrict: [{ to: 'Tech' }])
        action updateStatus(newStatus: db.Status);
        @(restrict: [{ to: 'Admin' }])
        action updatePriority(newPriority: Integer);
    };
}