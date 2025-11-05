(async () => {
  const base = 'http://localhost:5000/api/tasks';
  try {
    console.log('Creating task...');
    let res = await fetch(base, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: '64cafebe0000000000000001', title: 'E2E Task', category: 'Work' }),
    });
    const created = await res.json();
    console.log('Created:', created);

    const id = created._id || created.id || created._doc?._id;
    if (!id) {
      console.error('No id returned, exiting');
      return;
    }

    console.log('Fetching tasks...');
    res = await fetch(base);
    console.log('List:', await res.json());

    console.log('Toggling completion...');
    res = await fetch(`${base}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isCompleted: true }),
    });
    const updated = await res.json();
    console.log('Updated:', updated);

    console.log('Fetching single task...');
    res = await fetch(`${base}/${id}`);
    console.log('Get:', await res.json());

    console.log('Deleting task...');
    res = await fetch(`${base}/${id}`, { method: 'DELETE' });
    console.log('Delete status:', res.status);

    console.log('Final list:');
    res = await fetch(base);
    console.log(await res.json());
  } catch (err) {
    console.error('E2E failed:', err.message || err);
  }
})();
