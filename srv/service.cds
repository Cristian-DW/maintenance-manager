using { mm as db } from '../db/schema';

@protocol: ['odata-v4', 'rest']
service MaintenanceService {
    entity Assets as projection on db.Assets;
    entity Users as projection on db.Users;
    entity MaintenanceRequests as projection on db.MaintenanceRequests;

    action authenticate(email: String, password: String) returns {
        ok: Boolean;
        user: {
            ID: String;
            email: String;
            name: String;
            role: String;
        };
        accessToken: String;
        refreshToken: String;
    };
    
    action refreshToken(refreshToken: String) returns {
        ok: Boolean;
        accessToken: String;
    };

    action register(name: String, email: String, password: String) returns {
        ok: Boolean;
        message: String;
    };
}