namespace mm;


entity Users {
  key ID      : UUID;
  name        : String(100);
  email       : String(200);
  role        : String(30); // 'REQUESTER','TECH','MANAGER'
}

entity Assets {
  key ID      : UUID;
  code        : String(50);
  location    : String(200);
  info        : String;
}

entity MaintenanceRequests {
  key ID        : UUID;
  title         : String(200);
  description   : String;
  status        : String(20); // OPEN, ASSIGNED, IN_PROGRESS, DONE, CLOSED
  priority      : Integer;
  createdAt     : Timestamp;
  updatedAt     : Timestamp;
  requestedBy   : Association to Users;
  assignedTo    : Association to Users;
  asset         : Association to Assets;
}