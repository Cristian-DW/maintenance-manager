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

        // 2. Create User WITHOUT Password
        console.log('Creating User without password...');
        const payload = {
            name: 'Test User No Pass',
            email: 'testusernopass@example.com',
            role: 'TECH'
            // Missing password
        };

        const createRes = await fetch(`${baseURL}/Users`, {
            method: 'POST',
            headers,
            body: JSON.stringify(payload)
        });

        if (!createRes.ok) {
            const errorText = await createRes.text();
            console.log('Expected failure:', createRes.status, errorText);
        } else {
            const createData = await createRes.json();
            console.log('User created UNEXPECTEDLY:', createData.ID);
        }

    } catch (error) {
        console.error('Test failed:', error.message);
    }
}

test();
