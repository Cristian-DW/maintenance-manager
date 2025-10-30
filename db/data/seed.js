const cds = require('@sap/cds');

async function seed(passedDb) {
    const db = passedDb || await cds.connect.to('db');
    const { Users, Assets, MaintenanceRequests } = db.entities;

    // Create test users
    const users = [
        { ID: '1', name: 'Admin User', email: 'admin@example.com', role: 'ADMIN' },
        { ID: '2', name: 'Tech User', email: 'tech@example.com', role: 'TECH' },
        { ID: '3', name: 'Regular User', email: 'user@example.com', role: 'USER' }
    ];

    // Create test assets
    const assets = [
        { 
            ID: '1', 
            code: 'AC-001', 
            name: 'Air Conditioner 1', 
            type: 'HVAC',
            location: 'Floor 1, Room 101',
            status: 'ACTIVE'
        },
        { 
            ID: '2', 
            code: 'PC-001', 
            name: 'Printer Canon', 
            type: 'PRINTER',
            location: 'Floor 2, Office Area',
            status: 'ACTIVE'
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
            asset_ID: '1',
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            ID: '2',
            title: 'Printer paper jam',
            description: 'Printer keeps getting paper jams',
            status: 'IN_PROGRESS',
            priority: 1,
            requestedBy_ID: '3',
            assignedTo_ID: '2',
            asset_ID: '2',
            createdAt: new Date(),
            updatedAt: new Date()
        }
    ];

    try {
        // Insert test data
        await INSERT.into(Users).entries(users);
        console.log('✅ Users seeded successfully');

        await INSERT.into(Assets).entries(assets);
        console.log('✅ Assets seeded successfully');

        await INSERT.into(MaintenanceRequests).entries(requests);
        console.log('✅ Maintenance requests seeded successfully');

        console.log('🌱 Database seeded successfully!');
    } catch (error) {
        console.error('❌ Error seeding database:', error);
        throw error;
    }
}

// Check if this script is being run directly
if (require.main === module) {
    seed();
}

module.exports = { seed };