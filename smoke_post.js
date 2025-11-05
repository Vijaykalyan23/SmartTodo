(async () => {
  try {
    // use a valid 24-char hex ObjectId string for userId
    const res = await fetch('http://localhost:5000/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: '64cafebe0000000000000001', title: 'Smoke test task', category: 'Personal' }),
    });
    const data = await res.text();
    console.log('Status:', res.status);
    console.log('Response:', data);
  } catch (err) {
    console.error('Request failed:', err.message);
  }
})();
