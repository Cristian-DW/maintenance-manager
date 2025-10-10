namespace mm;

using { cuid } from '@sap/cds/common';

type Role : String(30) enum {
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

entity Users : cuid {
    name        : String(100) @mandatory;
    email       : String(200) @mandatory;
    role        : Role @mandatory;
    requests    : Association to many MaintenanceRequests on requests.requestedBy = $self;
    assignments : Association to many MaintenanceRequests on assignments.assignedTo = $self;
}

entity Assets : cuid {
    code        : String(50) @mandatory;
    location    : String(200) @mandatory;
    info        : String;
    requests    : Association to many MaintenanceRequests on requests.asset = $self;
}

entity MaintenanceRequests : cuid {
    title       : String(200) @mandatory;
    description : String;
    status      : Status @mandatory default 'OPEN';
    priority    : Integer @mandatory default 1;
    createdAt   : Timestamp @cds.on.insert: $now;
    updatedAt   : Timestamp @cds.on.insert: $now @cds.on.update: $now;
    requestedBy : Association to Users;
    assignedTo  : Association to Users;
    asset       : Association to Assets;
}