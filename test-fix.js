const baseURL = 'http://localhost:4004/odata/v4/maintenance';

async function test() {
    try {
        // 1. Authenticate
        console.log('Authenticating...');
        const authRes = await fetch(`${baseURL}/authenticate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: 'admin@example.com',
                password: 'admin123'
            })
        });

        const authData = await authRes.json();
        if (!authData.ok) {
            throw new Error('Authentication failed');
        }

        const token = authData.accessToken;
        const headers = {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        };
        console.log('Authenticated.');

        // 2. Get Tech User
        console.log('Fetching Tech User...');
        const usersRes = await fetch(`${baseURL}/Users?$filter=role eq 'TECH'`, { headers });
        const usersData = await usersRes.json();
        const techUser = usersData.value[0];

        if (!techUser) {
            throw new Error('No tech user found');
        }
        console.log('Tech User found:', techUser.name, techUser.ID);

        // 3. Get Asset
        console.log('Fetching Asset...');
        const assetsRes = await fetch(`${baseURL}/Assets`, { headers });
        const assetsData = await assetsRes.json();
        const asset = assetsData.value[0];

        if (!asset) {
            throw new Error('No asset found');
        }
        console.log('Asset found:', asset.name, asset.ID);

        // 4. Create Request with assignedTo_ID
        console.log('Creating Request...');
        const payload = {
            title: 'Test Request from Script',
            description: 'Testing assignedTo_ID',
            priority: 3,
            asset_ID: asset.ID,
            assignedTo_ID: techUser.ID,
            status: 'OPEN'
        };

        const createRes = await fetch(`${baseURL}/MaintenanceRequests`, {
            method: 'POST',
            headers,
            body: JSON.stringify(payload)
        });

        if (!createRes.ok) {
            const errorText = await createRes.text();
            throw new Error(`Request failed: ${createRes.status} ${createRes.statusText} - ${errorText}`);
        }

        const createData = await createRes.json();
        console.log('Request created successfully:', createData.ID);
        console.log('Assigned To:', createData.assignedTo_ID);

    } catch (error) {
        console.error('Test failed:', error.message);
    }
}

test();
