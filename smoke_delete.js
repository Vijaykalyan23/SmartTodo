(async () => {
  try {
    const id = '6905ec3fd1981b1f7a566c2e';
    const res = await fetch(`http://localhost:5000/api/tasks/${id}`, {
      method: 'DELETE',
    });
    const data = await res.text();
    console.log('Status:', res.status);
    console.log('Response:', data);
  } catch (err) {
    console.error('Request failed:', err.message);
  }
})();
