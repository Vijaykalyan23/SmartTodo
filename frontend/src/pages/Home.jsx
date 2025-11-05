import { useRef, useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import TaskInput from "../components/TaskInput";
import TaskList from "../components/TaskList";
import { motion, AnimatePresence } from "framer-motion";

function Home() {
  const taskListRef = useRef(null);
  const { user, logout, isLoading: authLoading } = useContext(AuthContext);
  const [toast, setToast] = useState({ message: null, type: 'success' });
  const navigate = useNavigate();

  // Redirect to login if user is not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
    }
  }, [user, navigate, authLoading]);

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect from useEffect
  }

  const handleTaskUpdate = () => {
    if (taskListRef.current) {
      taskListRef.current.fetchTasks();
    }
  };

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    const timer = setTimeout(() => {
      setToast(prev => ({ ...prev, message: null }));
    }, 3000);
    return () => clearTimeout(timer);
  };

  const handleLogoutClick = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-4xl mx-auto">
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center">
              <span className="bg-gradient-to-r from-blue-600 to-blue-400 text-white rounded-lg p-2 mr-3">
                📝
              </span>
              Smart Todo
            </h1>
            <p className="text-gray-600 mt-1">Welcome back, <span className="font-medium text-blue-600">{user?.name || 'User'}</span>!</p>
          </div>
          <button
            onClick={handleLogoutClick}
            className="flex items-center gap-2 bg-white hover:bg-gray-50 text-red-600 border border-red-200 px-4 py-2 rounded-lg shadow-sm transition-all hover:shadow-md"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
            </svg>
            Logout
          </button>
        </header>

        <main className="space-y-6">
          <TaskInput onTaskAdded={handleTaskUpdate} showToast={showToast} />
          <TaskList ref={taskListRef} onTaskUpdate={handleTaskUpdate} showToast={showToast} />
        </main>
      </div>

      {/* Toast Notification */}
      <AnimatePresence>
        {toast.message && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-6 left-1/2 -translate-x-1/2 px-6 py-3 rounded-lg shadow-lg ${
              toast.type === 'error' ? 'bg-red-500' : 'bg-green-500'
            } text-white font-medium z-50`}
          >
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Home;
