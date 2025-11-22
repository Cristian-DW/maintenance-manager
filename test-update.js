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

        // 2. Get a Request to update
        console.log('Fetching a Request...');
        const reqRes = await fetch(`${baseURL}/MaintenanceRequests?$top=1`, { headers });
        const reqData = await reqRes.json();
        const request = reqData.value[0];

        if (!request) {
            throw new Error('No request found to update');
        }
        console.log('Request found:', request.ID, request.title);

        // 3. Update Status
        console.log('Updating Status to IN_PROGRESS...');
        const payload = {
            status: 'IN_PROGRESS'
        };

        const updateRes = await fetch(`${baseURL}/MaintenanceRequests(${request.ID})`, {
            method: 'PATCH',
            headers,
            body: JSON.stringify(payload)
        });

        if (!updateRes.ok) {
            const errorText = await updateRes.text();
            throw new Error(`Update failed: ${updateRes.status} ${updateRes.statusText} - ${errorText}`);
        }

        const updateData = await updateRes.json();
        console.log('Request updated successfully:', updateData.ID);
        console.log('New Status:', updateData.status);

    } catch (error) {
        console.error('Test failed:', error.message);
    }
}

test();
