import { useState } from "react";
import { PlusCircleIcon } from "@heroicons/react/24/outline";
import API from "../api";

function TaskInput({ onTaskAdded, showToast }) {
  const [task, setTask] = useState("");
  const [category, setCategory] = useState("Personal");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (task.trim() === "") {
      showToast('Please enter a task', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      await API.post("/tasks", {
        // temporary demo user id: must be a valid MongoDB ObjectId string
        userId: "64cafebe0000000000000001",
        title: task.trim(),
        category,
      });

      setTask("");
      if (onTaskAdded) onTaskAdded();
      showToast('Task added successfully!');
    } catch (error) {
      console.error("Error adding task:", error);
      const errorMessage = error.response?.data?.message || 'Failed to add task. Please try again.';
      showToast(errorMessage, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="flex flex-col sm:flex-row gap-2 w-full">
        <div className="relative flex-1">
          <input
            type="text"
            value={task}
            onChange={(e) => setTask(e.target.value)}
            placeholder="What needs to be done?"
            className="w-full pl-4 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500"
            disabled={isSubmitting}
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
        </div>

        <div className="relative w-full sm:w-40">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            disabled={isSubmitting}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-700 bg-white"
          >
            <option value="Work">Work</option>
            <option value="Personal">Personal</option>
            <option value="Other">Other</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 20 20" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting || !task.trim()}
          className={`flex items-center justify-center gap-2 px-6 py-3 border border-transparent rounded-lg font-medium text-white ${
            isSubmitting || !task.trim()
              ? 'bg-blue-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
          } transition-colors duration-200`}
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Adding...
            </>
          ) : (
            <>
              <PlusCircleIcon className="h-5 w-5" />
              Add Task
            </>
          )}
        </button>
      </div>
    </form>
  );
}

export default TaskInput;
