const Database = require('better-sqlite3');
const path = require('path');

async function seed() {
    // Use direct SQLite connection for seeding
    const dbPath = path.join(__dirname, '../../db.sqlite');
    const db = new Database(dbPath);

    // Create test users
    const users = [
        { ID: '1', name: 'Manager User', email: 'manager@example.com', role: 'MANAGER' },
        { ID: '2', name: 'Tech User', email: 'tech@example.com', role: 'TECH' },
        { ID: '3', name: 'Requester User', email: 'requester@example.com', role: 'REQUESTER' }
    ];

    // Create test assets
    const assets = [
        { 
            ID: '1', 
            code: 'AC-001',
            name: 'Air Conditioner Principal',
            location: 'Floor 1, Room 101',
            info: 'Air Conditioner 1 - HVAC System',
            status: 1
        },
        { 
            ID: '2', 
            code: 'PC-001',
            name: 'Printer Canon MF452',
            location: 'Floor 2, Office Area',
            info: 'Printer Canon - Office Printer',
            status: 1
        },
        {
            ID: '3',
            code: 'ELV-001',
            name: 'Elevator Principal',
            location: 'Main Building',
            info: 'Main passenger elevator - 8 person capacity',
            status: 1
        },
        {
            ID: '4',
            code: 'GEN-001',
            name: 'Emergency Generator',
            location: 'Basement',
            info: 'Backup power generator - 200KW',
            status: 1
        },
        {
            ID: '5',
            code: 'SEC-001',
            name: 'Security System',
            location: 'All floors',
            info: 'Central security and access control system',
            status: 1
        },
        {
            ID: '6',
            code: 'AC-002',
            name: 'Air Conditioner Secondary',
            location: 'Floor 2',
            info: 'Secondary HVAC system',
            status: 0
        }
    ];

    // Create test maintenance requests
    const requests = [
        {
            ID: '1',
            title: 'AC not cooling',
            description: 'The air conditioner is not cooling properly',
            status: 'OPEN',
            priority: 2,
            requestedBy_ID: '3',
            asset_ID: '1'
        },
        {
            ID: '2',
            title: 'Printer paper jam',
            description: 'Printer keeps getting paper jams',
            status: 'IN_PROGRESS',
            priority: 1,
            requestedBy_ID: '3',
            assignedTo_ID: '2',
            asset_ID: '2'
        }
    ];

    try {
        // Insert users
        const insertUser = db.prepare(`INSERT OR IGNORE INTO mm_Users (ID, name, email, role) VALUES (?, ?, ?, ?)`);
        for (const user of users) {
            insertUser.run(user.ID, user.name, user.email, user.role);
        }
        console.log('✅ Users seeded successfully');

        // Insert assets
        const insertAsset = db.prepare(`INSERT OR IGNORE INTO mm_Assets (ID, code, name, location, info, status) VALUES (?, ?, ?, ?, ?, ?)`);
        for (const asset of assets) {
            insertAsset.run(asset.ID, asset.code, asset.name, asset.location, asset.info || null, asset.status);
        }
        console.log('✅ Assets seeded successfully');

        // Insert maintenance requests
        const insertRequest = db.prepare(`INSERT OR IGNORE INTO mm_MaintenanceRequests 
            (ID, title, description, status, priority, requestedBy_ID, assignedTo_ID, asset_ID) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`);
        for (const req of requests) {
            insertRequest.run(req.ID, req.title, req.description, req.status, req.priority, 
                req.requestedBy_ID, req.assignedTo_ID || null, req.asset_ID);
        }
        console.log('✅ Maintenance requests seeded successfully');

        db.close();
        console.log('🌱 Database seeded successfully!');
    } catch (error) {
        db.close();
        console.error('❌ Error seeding database:', error);
        throw error;
    }
}

// Check if this script is being run directly
if (require.main === module) {
    seed();
}

module.exports = { seed };