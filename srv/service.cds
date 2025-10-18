using { mm as db } from '../db/schema';

@requires: 'authenticated-user'
service MaintenanceService @(path: '/maintenance') {
    @readonly 
    @restrict: [
        { grant: 'READ', to: 'authenticated-user' }
    ]
    entity Users as projection on db.Users {
        *,
        requests: redirected to MaintenanceRequests,
        assignments: redirected to MaintenanceRequests
    };
    
    @readonly 
    @restrict: [
        { grant: 'READ', to: 'authenticated-user' }
    ]
    entity Assets as projection on db.Assets {
        *,
        requests: redirected to MaintenanceRequests
    };
    
    @restrict: [
        { grant: ['READ'], to: 'User' },
        { grant: ['CREATE'], to: 'User' },
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