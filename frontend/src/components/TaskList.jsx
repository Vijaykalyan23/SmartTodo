import { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import { AnimatePresence, motion } from "framer-motion";
import API from "../api";
import TaskItem from "./TaskItem";

const TaskList = forwardRef(({ showToast, onTaskUpdate }, ref) => {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [sortBy, setSortBy] = useState('Newest');
  const [error, setError] = useState(null);

  const fetchTasks = async () => {
    try {
      setIsLoading(true);
      const res = await API.get("/tasks");
      setTasks(res.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching tasks:", err);
      setError("Failed to load tasks. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  // Expose fetchTasks() to parent using ref
  useImperativeHandle(ref, () => ({
    fetchTasks,
  }));

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleToggleComplete = async (taskId, isCompleted) => {
    try {
      await API.put(`/tasks/${taskId}`, { isCompleted });
      if (onTaskUpdate) onTaskUpdate();
      if (showToast) showToast(isCompleted ? 'Task completed!' : 'Task marked incomplete');
    } catch (err) {
      console.error("Error updating task:", err);
      if (showToast) showToast('Failed to update task', 'error');
      fetchTasks(); // Refresh to sync with server
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await API.delete(`/tasks/${taskId}`);
        setTasks(tasks.filter(task => task._id !== taskId));
        if (showToast) showToast('Task deleted successfully');
        if (onTaskUpdate) onTaskUpdate();
      } catch (err) {
        console.error("Error deleting task:", err);
        if (showToast) showToast('Failed to delete task', 'error');
      }
    }
  };

  const filteredSortedTasks = () => {
    let items = [...tasks];
    
    // Filter by category
    if (filter !== 'All') {
      items = items.filter(task => (task.category || 'Other') === filter);
    }

    // Sort tasks
    switch (sortBy) {
      case 'Newest':
        items.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case 'Oldest':
        items.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        break;
      case 'A-Z':
        items.sort((a, b) => a.title.localeCompare(b.title));
        break;
      default:
        break;
    }

    return items;
  };

  const getTaskCounts = () => {
    const total = tasks.length;
    const completed = tasks.filter(task => task.isCompleted).length;
    return { total, completed, remaining: total - completed };
  };

  const taskCounts = getTaskCounts();
  const displayTasks = filteredSortedTasks();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">{error}</p>
            <button
              onClick={fetchTasks}
              className="mt-2 text-sm font-medium text-red-700 hover:text-red-600 focus:outline-none focus:underline transition duration-150 ease-in-out"
            >
              Try again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats and Filters */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-2">
            <h2 className="text-lg font-semibold text-gray-900">Tasks</h2>
            <p className="text-sm text-gray-500">
              {taskCounts.completed} of {taskCounts.total} tasks completed
              {taskCounts.remaining > 0 && ` • ${taskCounts.remaining} remaining`}
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                <option value="All">All Tasks</option>
                <option value="Work">Work</option>
                <option value="Personal">Personal</option>
                <option value="Other">Other</option>
              </select>
            </div>
            
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                <option value="Newest">Newest First</option>
                <option value="Oldest">Oldest First</option>
                <option value="A-Z">A-Z</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Task List */}
      <div className="space-y-3">
        {displayTasks.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No tasks found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {filter === 'All' 
                ? 'Get started by creating a new task.' 
                : `No tasks found in the ${filter} category.`}
            </p>
          </div>
        ) : (
          <AnimatePresence>
            {displayTasks.map((task) => (
              <motion.div
                key={task._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.2 }}
                layout
              >
                <TaskItem
                  task={task}
                  onToggleComplete={handleToggleComplete}
                  onDelete={handleDeleteTask}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
});

export default TaskList;
