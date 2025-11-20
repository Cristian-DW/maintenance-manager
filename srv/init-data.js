const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const { INSERT, SELECT } = require('@sap/cds').ql;

module.exports = async (srv) => {
    // eslint-disable-next-line no-console
    console.log('✓ init-data.js module loading...');
    
    // Initialize data on first run (only for in-memory db)
    const { Users, Assets } = srv.entities;
    
    // Check if data already exists
    const existingUsers = await SELECT.from(Users);
    if (existingUsers.length > 0) {
        // eslint-disable-next-line no-console
        console.log('✓ Data already initialized, users count:', existingUsers.length);
        return;
    }

    // eslint-disable-next-line no-console
    console.log('✓ Initializing data...');

    const now = new Date().toISOString();
    const salt = await bcrypt.genSalt(10);

    // Hash passwords
    const adminHash = await bcrypt.hash('admin123', salt);
    const managerHash = await bcrypt.hash('manager123', salt);
    const techHash = await bcrypt.hash('tech123', salt);
    const requesterHash = await bcrypt.hash('requester123', salt);

    // Insert Users
    const users = await INSERT.into(Users).entries([
        {
            ID: uuidv4(),
            name: 'Admin User',
            email: 'admin@example.com',
            password: adminHash,
            role: 'ADMIN',
            isActive: true,
            createdAt: now,
            modifiedAt: now,
            createdBy: 'init',
            modifiedBy: 'init'
        },
        {
            ID: uuidv4(),
            name: 'Manager User',
            email: 'manager@example.com',
            password: managerHash,
            role: 'MANAGER',
            isActive: true,
            createdAt: now,
            modifiedAt: now,
            createdBy: 'init',
            modifiedBy: 'init'
        },
        {
            ID: uuidv4(),
            name: 'Tech User',
            email: 'tech@example.com',
            password: techHash,
            role: 'TECH',
            isActive: true,
            createdAt: now,
            modifiedAt: now,
            createdBy: 'init',
            modifiedBy: 'init'
        },
        {
            ID: uuidv4(),
            name: 'Requester User',
            email: 'requester@example.com',
            password: requesterHash,
            role: 'REQUESTER',
            isActive: true,
            createdAt: now,
            modifiedAt: now,
            createdBy: 'init',
            modifiedBy: 'init'
        }
    ]);

    // eslint-disable-next-line no-console
    console.log('✓ Users initialized:', users.length);

    // Insert Assets
    const assets = await INSERT.into(Assets).entries([
        {
            ID: uuidv4(),
            code: 'AC-001',
            name: 'Air Conditioner Principal',
            location: 'Floor 1, Room 101',
            info: 'Air Conditioner 1 - HVAC System',
            status: 1,
            createdAt: now,
            modifiedAt: now,
            createdBy: 'init',
            modifiedBy: 'init'
        },
        {
            ID: uuidv4(),
            code: 'PC-001',
            name: 'Printer Canon MF452',
            location: 'Floor 2, Office Area',
            info: 'Printer Canon - Office Printer',
            status: 1,
            createdAt: now,
            modifiedAt: now,
            createdBy: 'init',
            modifiedBy: 'init'
        },
        {
            ID: uuidv4(),
            code: 'ELV-001',
            name: 'Elevator Principal',
            location: 'Main Building',
            info: 'Main passenger elevator - 8 person capacity',
            status: 1,
            createdAt: now,
            modifiedAt: now,
            createdBy: 'init',
            modifiedBy: 'init'
        }
    ]);

    // eslint-disable-next-line no-console
    console.log('✓ Assets initialized:', assets.length);
};
