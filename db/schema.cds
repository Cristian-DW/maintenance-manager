namespace mm;

using { cuid, managed } from '@sap/cds/common';

type Role : String(30) enum {
    ADMIN = 'ADMIN';
    REQUESTER = 'REQUESTER';
    TECH = 'TECH';
    MANAGER = 'MANAGER';
}

type Status : String(20) enum {
    OPEN = 'OPEN';
    ASSIGNED = 'ASSIGNED';
    IN_PROGRESS = 'IN_PROGRESS';
    DONE = 'DONE';
    CLOSED = 'CLOSED';
}

@assert.unique: {email: [email]}
entity Users : cuid, managed {
    name        : String(100) @mandatory;
    email       : String(200) @mandatory;
    password    : String @mandatory;
    role        : Role @mandatory;
    isActive    : Boolean default true;
    requests    : Association to many MaintenanceRequests on requests.requestedBy = $self;
    assignments : Association to many MaintenanceRequests on assignments.assignedTo = $self;
}

@assert.unique: {code: [code]}
entity Assets : cuid, managed {
    code        : String(50) @mandatory;
    name        : String(100) @mandatory;
    location    : String(200) @mandatory;
    info        : String;
    status      : Integer @mandatory default 1; // 1 = active, 0 = inactive
    qrCode      : String(100); // Unique QR code for asset identification
    requests    : Association to many MaintenanceRequests on requests.asset = $self;
}

entity MaintenanceRequests : cuid, managed {
    title       : String(200) @mandatory;
    description : String;
    status      : Status @mandatory default 'OPEN';
    priority    : Integer @mandatory default 1;
    requestedBy : Association to Users;
    assignedTo  : Association to Users;
    asset       : Association to Assets;
}

entity Notifications : cuid, managed {
    user            : Association to Users;
    title           : String(200) @mandatory;
    message         : String(500);
    type            : String(50) @mandatory; // 'request_assigned', 'status_changed', 'comment_added'
    relatedRequest  : Association to MaintenanceRequests;
    isRead          : Boolean default false;
    readAt          : DateTime;
}