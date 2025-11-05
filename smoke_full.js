(async () => {
  try {
    const base = 'http://localhost:5000/api';

    // DEV_BYPASS expected to be enabled so we can call tasks endpoints without auth
    console.log('Using DEV_BYPASS (no auth) to call tasks endpoints');
    const createRes = await fetch(`${base}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: 'Smoke full task', category: 'Work' }),
    });
    const task = await createRes.json();
    console.log('Create', createRes.status, task);
    // toggle
    const toggleRes = await fetch(`${base}/tasks/${task._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isCompleted: true }),
    });
    const toggled = await toggleRes.json();
    console.log('Toggled', toggleRes.status, toggled);

    // delete
    const delRes = await fetch(`${base}/tasks/${task._id}`, {
      method: 'DELETE',
    });
    const delJson = await delRes.json();
    console.log('Deleted', delRes.status, delJson);

    // final list
    const listRes = await fetch(`${base}/tasks`, {
      method: 'GET',
    });
    const list = await listRes.json();
    console.log('Final tasks count', Array.isArray(list) ? list.length : list);
  } catch (err) {
    console.error('Smoke failed', err.message || err);
  }
})();
