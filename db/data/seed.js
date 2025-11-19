const Database = require('better-sqlite3');
const path = require('path');

async function seed() {
    // Use direct SQLite connection for seeding
    const dbPath = path.join(__dirname, '../../db.sqlite');
    const db = new Database(dbPath);

    // Create test users (do NOT set ID - let CAP generate cuid)
    const users = [
        { name: 'Manager User', email: 'manager@example.com', role: 'MANAGER' },
        { name: 'Tech User', email: 'tech@example.com', role: 'TECH' },
        { name: 'Requester User', email: 'requester@example.com', role: 'REQUESTER' }
    ];

    // Create test assets
    // Create test assets (do NOT set ID - let CAP generate cuid)
    const assets = [
        { code: 'AC-001', name: 'Air Conditioner Principal', location: 'Floor 1, Room 101', info: 'Air Conditioner 1 - HVAC System', status: 1 },
        { code: 'PC-001', name: 'Printer Canon MF452', location: 'Floor 2, Office Area', info: 'Printer Canon - Office Printer', status: 1 },
        { code: 'ELV-001', name: 'Elevator Principal', location: 'Main Building', info: 'Main passenger elevator - 8 person capacity', status: 1 },
        { code: 'GEN-001', name: 'Emergency Generator', location: 'Basement', info: 'Backup power generator - 200KW', status: 1 },
        { code: 'SEC-001', name: 'Security System', location: 'All floors', info: 'Central security and access control system', status: 1 },
        { code: 'AC-002', name: 'Air Conditioner Secondary', location: 'Floor 2', info: 'Secondary HVAC system', status: 0 }
    ];

    // Create test maintenance requests
    // We'll create requests after inserting users/assets and resolving their generated IDs
    const requests = [
        { title: 'AC not cooling', description: 'The air conditioner is not cooling properly', status: 'OPEN', priority: 2, requestedByEmail: 'requester@example.com', assetCode: 'AC-001' },
        { title: 'Printer paper jam', description: 'Printer keeps getting paper jams', status: 'IN_PROGRESS', priority: 1, requestedByEmail: 'requester@example.com', assignedToEmail: 'tech@example.com', assetCode: 'PC-001' }
    ];

    try {
        // Insert users (do not provide ID)
        const insertUser = db.prepare(`INSERT OR IGNORE INTO mm_Users (name, email, role) VALUES (?, ?, ?)`);
        for (const user of users) {
            insertUser.run(user.name, user.email, user.role);
        }
        console.log('✅ Users seeded successfully');

        // Insert assets (do not provide ID)
        const insertAsset = db.prepare(`INSERT OR IGNORE INTO mm_Assets (code, name, location, info, status) VALUES (?, ?, ?, ?, ?)`);
        for (const asset of assets) {
            insertAsset.run(asset.code, asset.name, asset.location, asset.info || null, asset.status);
        }
        console.log('✅ Assets seeded successfully');

        // Resolve IDs for users and assets to create maintenance requests
        const getUserByEmail = db.prepare(`SELECT ID FROM mm_Users WHERE email = ? LIMIT 1`);
        const getAssetByCode = db.prepare(`SELECT ID FROM mm_Assets WHERE code = ? LIMIT 1`);

        const insertRequest = db.prepare(`INSERT OR IGNORE INTO mm_MaintenanceRequests 
            (title, description, status, priority, requestedBy_ID, assignedTo_ID, asset_ID) 
            VALUES (?, ?, ?, ?, ?, ?, ?)`);

        for (const req of requests) {
            const requesterRow = getUserByEmail.get(req.requestedByEmail);
            const requesterId = requesterRow ? requesterRow.ID : null;
            let assignedToId = null;
            if (req.assignedToEmail) {
                const assignedRow = getUserByEmail.get(req.assignedToEmail);
                assignedToId = assignedRow ? assignedRow.ID : null;
            }
            const assetRow = getAssetByCode.get(req.assetCode);
            const assetId = assetRow ? assetRow.ID : null;

            insertRequest.run(req.title, req.description, req.status, req.priority, requesterId, assignedToId, assetId);
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