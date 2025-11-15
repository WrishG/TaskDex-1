import React from 'react';
import { POKEMON_DATA } from '../data/pokemonData.js';
import { getTypeHoverColor, getTypeBorderColor, getTypeBgColor, getTypeRingColor } from '../utils/typeColors.js';

const style = {
  card: "bg-gray-800 p-8 rounded-2xl shadow-2xl border-2 border-gray-700",
  button: "px-6 py-3 rounded-xl font-bold transition-all duration-300 shadow-lg transform hover:scale-105",
  primaryButton: "bg-red-600 text-white hover:bg-red-700",
  secondaryButton: "bg-gray-700 text-white hover:bg-gray-600",
  input: "w-full p-3 rounded-lg bg-gray-900 border-2 border-gray-600 text-white focus:border-red-500 focus:ring-2 focus:ring-red-500",
};

export default function TasksScreen({ setScreen, userData, tasks, setTasks, setSessionConfig }) {
  const [showAddTask, setShowAddTask] = React.useState(false);
  const [selectedTask, setSelectedTask] = React.useState(null);
  const [taskName, setTaskName] = React.useState('');
  const [taskType, setTaskType] = React.useState('Psychic');
  const [taskDescription, setTaskDescription] = React.useState('');
  
  // Show welcome message only once per session (after login)
  const [showWelcome, setShowWelcome] = React.useState(() => {
    const hasSeenWelcome = sessionStorage.getItem('hasSeenWelcome');
    return !hasSeenWelcome;
  });
  
  // Hide welcome message after 5 seconds or when user dismisses it
  React.useEffect(() => {
    if (showWelcome) {
      const timer = setTimeout(() => {
        setShowWelcome(false);
        sessionStorage.setItem('hasSeenWelcome', 'true');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [showWelcome]);
  
  const handleDismissWelcome = () => {
    setShowWelcome(false);
    sessionStorage.setItem('hasSeenWelcome', 'true');
  };

  const handleSaveTask = () => {
    if (!taskName.trim()) return;
    
    const newTask = {
      id: crypto.randomUUID(),
      name: taskName,
      type: taskType,
      description: taskDescription,
      createdAt: new Date().toISOString(),
      completed: false,
    };
    
    const updatedTasks = [...(tasks || []), newTask];
    setTasks(updatedTasks);
    
    // Reset form
    setTaskName('');
    setTaskType('Psychic');
    setTaskDescription('');
    setShowAddTask(false);
  };

  const handleStartTask = (task) => {
    setSessionConfig({ 
      type: task.type, 
      studyTime: 30, 
      restTime: 5,
      taskId: task.id 
    });
    setSelectedTask(null);
    setScreen('POMODORO_RUNNING');
  };

  const getTypeButtonColor = (type) => {
    const colors = {
      'Grass': 'bg-green-600 text-white',
      'Fire': 'bg-red-600 text-white',
      'Water': 'bg-blue-600 text-white',
      'Psychic': 'bg-pink-400 text-white',
      'Ghost': 'bg-blue-900 text-white',
      'Electric': 'bg-yellow-500 text-black',
    };
    return colors[type] || 'bg-gray-600 text-white';
  };

  const trainerName = userData?.trainerName || 'Trainer';
  const firstPokemon = userData?.pokemon_inventory.find(p => p.isPartner)?.currentName || 'N/A';

  return (
    <div className="flex flex-col items-center min-h-screen p-4 bg-[#1a1a1a] text-white animate-fadeIn">
      <div className={style.card + " max-w-5xl w-full mt-8"}>
        {/* Welcome Message - Shows once after login */}
        {showWelcome && (
          <div className="mb-6 p-5 bg-red-900/30 border-2 border-red-600 rounded-xl animate-slideIn">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-2xl font-bold text-white mb-1">Welcome Back, {trainerName}!</h3>
                <p className="text-gray-300">
                  Your partner, <span className="font-semibold text-green-400">{firstPokemon}</span>, is ready to help you focus.
                </p>
              </div>
              <button
                onClick={handleDismissWelcome}
                className="text-gray-400 hover:text-white text-xl font-bold transition-colors duration-200"
              >
                ×
              </button>
            </div>
          </div>
        )}
        
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-5xl font-bold text-white">My Tasks</h2>
          <button
            className={style.button + " " + style.primaryButton + " text-lg px-8 py-4"}
            onClick={() => setShowAddTask(true)}
          >
            + Add Task
          </button>
        </div>

        {/* Tasks List */}
        <div className="space-y-5">
          {(!tasks || tasks.length === 0) ? (
            <div className="text-center py-12 bg-gray-900 rounded-xl border-2 border-gray-700">
              <p className="text-gray-300 text-lg">No tasks yet. Click "Add Task" to create your first task!</p>
            </div>
          ) : (
            tasks.map((task, index) => {
              const typeHoverClass = getTypeHoverColor(task.type);
              const typeBorderClass = getTypeBorderColor(task.type);
              const typeBgClass = getTypeBgColor(task.type);
              const typeRingClass = getTypeRingColor(task.type);
              
              return (
                <div
                  key={task.id}
                  className={`p-6 rounded-xl border-2 cursor-pointer transition-all duration-300 transform hover:scale-105 ${typeBorderClass} bg-gray-900 ${typeHoverClass} hover:ring-4 ${typeRingClass} hover:shadow-2xl`}
                  onClick={() => setSelectedTask(task)}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <span className={`px-3 py-1 rounded-lg text-sm font-bold ${getTypeButtonColor(task.type)}`}>
                          {task.type}
                        </span>
                        <h3 className="text-2xl font-bold text-white">{task.name}</h3>
                      </div>
                      {task.description && (
                        <p className="text-gray-300 mt-2">{task.description}</p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Add Task Modal */}
      {showAddTask && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 animate-fadeIn">
          <div className="bg-gray-800 p-8 rounded-2xl max-w-lg w-full mx-4 border-2 border-gray-700 shadow-2xl">
            <h3 className="text-3xl font-bold mb-6 text-white">Add New Task</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">Task Name:</label>
                <input
                  type="text"
                  value={taskName}
                  onChange={(e) => setTaskName(e.target.value)}
                  placeholder="Enter task name..."
                  className={style.input}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">Task Type:</label>
                <div className="grid grid-cols-3 gap-2">
                  {POKEMON_DATA.SESSION_TYPES.map(type => (
                    <button
                      key={type}
                      className={`py-3 rounded-lg font-bold transition-all duration-200 border-2 transform hover:scale-105 ${
                        taskType === type
                          ? `${getTypeButtonColor(type)} border-white shadow-lg scale-105`
                          : 'bg-gray-700 hover:bg-gray-600 text-white border-gray-600'
                      }`}
                      onClick={() => setTaskType(type)}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">Description:</label>
                <textarea
                  value={taskDescription}
                  onChange={(e) => setTaskDescription(e.target.value)}
                  placeholder="Describe your task..."
                  rows={4}
                  className={style.input + " resize-none"}
                />
              </div>
            </div>

            <div className="flex space-x-4 mt-6">
              <button
                className={style.button + " " + style.primaryButton + " flex-1"}
                onClick={handleSaveTask}
                disabled={!taskName.trim()}
              >
                Save Task
              </button>
              <button
                className={style.button + " " + style.secondaryButton + " flex-1"}
                onClick={() => {
                  setShowAddTask(false);
                  setTaskName('');
                  setTaskType('Psychic');
                  setTaskDescription('');
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Start Task Modal */}
      {selectedTask && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 animate-fadeIn">
          <div className="bg-gray-800 p-8 rounded-2xl max-w-md w-full mx-4 border-2 border-gray-700 text-center shadow-2xl">
            <h3 className="text-3xl font-bold mb-4 text-white">{selectedTask.name}</h3>
            <div className="mb-4">
              <span className={`px-4 py-2 rounded-lg text-sm font-bold ${getTypeButtonColor(selectedTask.type)}`}>
                {selectedTask.type}
              </span>
            </div>
            {selectedTask.description && (
              <p className="text-gray-300 mb-6">{selectedTask.description}</p>
            )}
            <div className="flex space-x-4">
              <button
                className={style.button + " " + style.primaryButton + " flex-1"}
                onClick={() => handleStartTask(selectedTask)}
              >
                Start Task
              </button>
              <button
                className={style.button + " " + style.secondaryButton + " flex-1"}
                onClick={() => setSelectedTask(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

