namespace mm;

using { cuid, managed } from '@sap/cds/common';

entity Notifications : cuid, managed {
    user        : Association to Users;
    title       : String(200) @mandatory;
    message     : String(500);
    type        : String(50) @mandatory; // 'request_assigned', 'status_changed', 'comment_added', etc.
    relatedRequest : Association to MaintenanceRequests;
    isRead      : Boolean default false;
    readAt      : DateTime;
}
