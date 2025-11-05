(async () => {
  try {
    // fetch tasks
    const res = await fetch('http://localhost:5000/api/tasks');
    const tasks = await res.json();
    if (!tasks || tasks.length === 0) {
      console.log('No tasks to toggle');
      return;
    }
    const task = tasks[0];
    console.log('Before:', task);

    const updateRes = await fetch(`http://localhost:5000/api/tasks/${task._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isCompleted: !task.isCompleted }),
    });
    const updated = await updateRes.json();
    console.log('After:', updated);
  } catch (err) {
    console.error('Toggle failed:', err.message || err);
  }
})();
