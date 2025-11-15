import React from 'react';

export default function WelcomeScreen({ setScreen }) {
  return (
    <div className="min-h-screen bg-[#1a1a1a] animate-fadeIn">
      {/* Header/Navigation */}
      <header className="bg-gray-900 border-b-2 border-gray-700 text-white px-6 py-4 flex justify-between items-center shadow-xl">
        <div className="flex items-center space-x-3 animate-slideIn">
          {/* Logo - Red circle with white T */}
          <div className="w-14 h-14 bg-red-600 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-300 animate-glow">
            <span className="text-white font-bold text-2xl">T</span>
          </div>
          <span className="text-2xl font-bold">TaskMon</span>
        </div>
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => setScreen('LOGIN_SIGNUP')}
            className="text-gray-300 hover:text-white transition-colors duration-200 font-semibold"
          >
            Sign In
          </button>
          <button
            onClick={() => setScreen('LOGIN_SIGNUP')}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-bold flex items-center space-x-2 transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            <span>Register</span>
            <span>→</span>
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Column - Text Content */}
          <div className="space-y-6 animate-slideIn">
            <h1 className="text-5xl md:text-6xl font-bold text-white leading-tight">
              Turn Your Tasks into an Adventure
            </h1>
            <p className="text-lg text-gray-300 leading-relaxed">
              TaskMon fuses the Pomodoro Technique with the thrill of Pokémon. Stay focused, complete your tasks, and build your unique Pokémon collection.
            </p>
            <button
              onClick={() => setScreen('LOGIN_SIGNUP')}
              className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-lg font-bold text-lg flex items-center space-x-2 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              <span>Start Your Journey</span>
              <span>→</span>
            </button>
          </div>

          {/* Right Column - Image */}
          <div className="relative">
            <div 
              className="w-full h-[500px] rounded-2xl bg-cover bg-center opacity-80"
              style={{
                backgroundImage: 'url(https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop)',
                maskImage: 'linear-gradient(to bottom, black 80%, transparent 100%)',
                WebkitMaskImage: 'linear-gradient(to bottom, black 80%, transparent 100%)'
              }}
            />
          </div>
        </div>
      </div>

      {/* Key Features Section */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center space-y-6">
          <p className="text-purple-400 text-sm font-semibold uppercase tracking-wide">
            Key Features
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-white">
            Gamify Your Productivity
          </h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Every Pomodoro session is a step forward in your Pokémon adventure.
          </p>
        </div>
      </div>
    </div>
  );
}
