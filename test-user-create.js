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

        // 2. Create User
        console.log('Creating User...');
        const payload = {
            name: 'Test User',
            email: 'testuser@example.com',
            role: 'TECH',
            password: 'password123' // Assuming password is required
        };

        const createRes = await fetch(`${baseURL}/Users`, {
            method: 'POST',
            headers,
            body: JSON.stringify(payload)
        });

        if (!createRes.ok) {
            const errorText = await createRes.text();
            throw new Error(`Create failed: ${createRes.status} ${createRes.statusText} - ${errorText}`);
        }

        const createData = await createRes.json();
        console.log('User created successfully:', createData.ID);

    } catch (error) {
        console.error('Test failed:', error.message);
    }
}

test();
