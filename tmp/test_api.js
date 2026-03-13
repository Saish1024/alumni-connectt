const fetch = require('node-fetch');

async function testApi() {
    try {
        const res = await fetch('http://localhost:5000/api/payouts/platform/config/platformUpiId');
        console.log('Status:', res.status);
        const data = await res.json();
        console.log('Data:', data);
    } catch (err) {
        console.error('Error:', err.message);
    }
}

testApi();
