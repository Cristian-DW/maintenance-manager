const Database = require('better-sqlite3');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');

async function seed() {
    // Use direct SQLite connection for seeding
    const dbPath = path.join(__dirname, '../../maintenance.db');
    const db = new Database(dbPath);

    // Helper to generate timestamps (CAP's managed: adds createdAt, modifiedAt)
    const now = new Date().toISOString();

    // Hash passwords
    const salt = await bcrypt.genSalt(10);
    const adminPasswordHash = await bcrypt.hash('admin123', salt);
    const managerPasswordHash = await bcrypt.hash('manager123', salt);
    const techPasswordHash = await bcrypt.hash('tech123', salt);
    const requesterPasswordHash = await bcrypt.hash('requester123', salt);

    // Create test users (generate IDs as UUIDs since using cuid mixin)
    const users = [
        { ID: uuidv4(), name: 'Admin User', email: 'admin@example.com', password: adminPasswordHash, role: 'ADMIN', isActive: 1, createdAt: now, modifiedAt: now, createdBy: 'seed', modifiedBy: 'seed' },
        { ID: uuidv4(), name: 'Manager User', email: 'manager@example.com', password: managerPasswordHash, role: 'MANAGER', isActive: 1, createdAt: now, modifiedAt: now, createdBy: 'seed', modifiedBy: 'seed' },
        { ID: uuidv4(), name: 'Tech User', email: 'tech@example.com', password: techPasswordHash, role: 'TECH', isActive: 1, createdAt: now, modifiedAt: now, createdBy: 'seed', modifiedBy: 'seed' },
        { ID: uuidv4(), name: 'Requester User', email: 'requester@example.com', password: requesterPasswordHash, role: 'REQUESTER', isActive: 1, createdAt: now, modifiedAt: now, createdBy: 'seed', modifiedBy: 'seed' }
    ];

    // Create test assets (generate IDs as UUIDs since using cuid mixin)
    const assets = [
        { ID: uuidv4(), code: 'AC-001', name: 'Air Conditioner Principal', location: 'Floor 1, Room 101', info: 'Air Conditioner 1 - HVAC System', status: 1, createdAt: now, modifiedAt: now, createdBy: 'seed', modifiedBy: 'seed' },
        { ID: uuidv4(), code: 'PC-001', name: 'Printer Canon MF452', location: 'Floor 2, Office Area', info: 'Printer Canon - Office Printer', status: 1, createdAt: now, modifiedAt: now, createdBy: 'seed', modifiedBy: 'seed' },
        { ID: uuidv4(), code: 'ELV-001', name: 'Elevator Principal', location: 'Main Building', info: 'Main passenger elevator - 8 person capacity', status: 1, createdAt: now, modifiedAt: now, createdBy: 'seed', modifiedBy: 'seed' },
        { ID: uuidv4(), code: 'GEN-001', name: 'Emergency Generator', location: 'Basement', info: 'Backup power generator - 200KW', status: 1, createdAt: now, modifiedAt: now, createdBy: 'seed', modifiedBy: 'seed' },
        { ID: uuidv4(), code: 'SEC-001', name: 'Security System', location: 'All floors', info: 'Central security and access control system', status: 1, createdAt: now, modifiedAt: now, createdBy: 'seed', modifiedBy: 'seed' },
        { ID: uuidv4(), code: 'AC-002', name: 'Air Conditioner Secondary', location: 'Floor 2', info: 'Secondary HVAC system', status: 0, createdAt: now, modifiedAt: now, createdBy: 'seed', modifiedBy: 'seed' }
    ];

    // Create test maintenance requests
    // We'll create requests after inserting users/assets and resolving their generated IDs
    const requests = [
        { title: 'AC not cooling', description: 'The air conditioner is not cooling properly', status: 'OPEN', priority: 2, requestedByEmail: 'requester@example.com', assetCode: 'AC-001' },
        { title: 'Printer paper jam', description: 'Printer keeps getting paper jams', status: 'IN_PROGRESS', priority: 1, requestedByEmail: 'requester@example.com', assignedToEmail: 'tech@example.com', assetCode: 'PC-001' }
    ];

    try {
        // Insert users with generated IDs and timestamps
        const insertUser = db.prepare(`INSERT OR IGNORE INTO mm_Users (ID, name, email, password, role, isActive, createdAt, modifiedAt, createdBy, modifiedBy) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);
        for (const user of users) {
            insertUser.run(user.ID, user.name, user.email, user.password, user.role, user.isActive, user.createdAt, user.modifiedAt, user.createdBy, user.modifiedBy);
        }
        console.log('✅ Users seeded successfully');
        console.log('   - admin@example.com / admin123');
        console.log('   - manager@example.com / manager123');
        console.log('   - tech@example.com / tech123');
        console.log('   - requester@example.com / requester123');

        // Insert assets with generated IDs and timestamps
        const insertAsset = db.prepare(`INSERT OR IGNORE INTO mm_Assets (ID, code, name, location, info, status, createdAt, modifiedAt, createdBy, modifiedBy) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);
        for (const asset of assets) {
            insertAsset.run(asset.ID, asset.code, asset.name, asset.location, asset.info || null, asset.status, asset.createdAt, asset.modifiedAt, asset.createdBy, asset.modifiedBy);
        }
        console.log('✅ Assets seeded successfully');

        // Resolve IDs for users and assets to create maintenance requests
        const getUserByEmail = db.prepare(`SELECT ID FROM mm_Users WHERE email = ? LIMIT 1`);
        const getAssetByCode = db.prepare(`SELECT ID FROM mm_Assets WHERE code = ? LIMIT 1`);

        const insertRequest = db.prepare(`INSERT OR IGNORE INTO mm_MaintenanceRequests 
            (ID, title, description, status, priority, requestedBy_ID, assignedTo_ID, asset_ID, createdAt, modifiedAt, createdBy, modifiedBy) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);

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

            insertRequest.run(uuidv4(), req.title, req.description, req.status, req.priority, requesterId, assignedToId, assetId, now, now, 'seed', 'seed');
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
