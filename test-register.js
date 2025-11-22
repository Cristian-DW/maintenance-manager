const baseURL = 'http://localhost:4004/odata/v4/maintenance';

async function test() {
    try {
        // Register User
        console.log('Registering User...');
        const payload = {
            name: 'New Registered User',
            email: `newuser_${Date.now()}@example.com`,
            password: 'password123'
        };

        const registerRes = await fetch(`${baseURL}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!registerRes.ok) {
            const errorText = await registerRes.text();
            throw new Error(`Registration failed: ${registerRes.status} ${registerRes.statusText} - ${errorText}`);
        }

        const registerData = await registerRes.json();
        console.log('User registered successfully:', registerData.user.email);

        // Verify login with new user
        console.log('Verifying Login...');
        const loginRes = await fetch(`${baseURL}/authenticate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: payload.email,
                password: payload.password
            })
        });

        const loginData = await loginRes.json();
        if (loginData.ok) {
            console.log('Login successful with new user');
        } else {
            console.error('Login failed:', loginData);
        }

    } catch (error) {
        console.error('Test failed:', error.message);
    }
}

test();
