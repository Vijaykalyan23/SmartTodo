import { useState } from 'react';

function TaskItem({ task, onToggleComplete, onDelete }) {
  const [isCompleted, setIsCompleted] = useState(task.isCompleted || false);

  const handleToggle = async () => {
    try {
      const newCompletedState = !isCompleted;
      setIsCompleted(newCompletedState);
      if (onToggleComplete) {
        await onToggleComplete(task._id, newCompletedState);
      }
    } catch (error) {
      console.error('Error toggling task status:', error);
      setIsCompleted(!isCompleted); // Revert on error
    }
  };

  const handleDelete = async () => {
    if (onDelete) {
      await onDelete(task._id);
    }
  };

  return (
    <div className={`flex items-center p-4 mb-2 rounded-lg transition-colors duration-200 ${
      isCompleted 
        ? 'bg-gray-50 border-l-4 border-green-500' 
        : 'bg-white border-l-4 border-blue-500 shadow-sm hover:shadow-md'
    }`}>
      <div className="flex items-center flex-1">
        <input
          type="checkbox"
          checked={isCompleted}
          onChange={handleToggle}
          className="h-5 w-5 text-blue-600 rounded focus:ring-blue-500 mr-3 cursor-pointer"
        />
        <div className="flex-1">
          <p className={`text-gray-800 text-sm font-medium ${isCompleted ? 'line-through text-gray-500' : ''}`}>
            {task.title}
          </p>
          {task.category && task.category !== 'Other' && (
            <span className="inline-block mt-1 px-2 py-0.5 text-xs rounded-full bg-blue-100 text-blue-800">
              {task.category}
            </span>
          )}
        </div>
      </div>
      <button
        onClick={handleDelete}
        className="text-gray-400 hover:text-red-500 transition-colors"
        aria-label="Delete task"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>
    </div>
  );
}

export default TaskItem;
