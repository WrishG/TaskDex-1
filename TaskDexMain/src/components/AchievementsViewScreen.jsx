import React from 'react';

const style = {
  card: "bg-white p-8 rounded-2xl shadow-2xl border-2 border-black",
  button: "px-6 py-3 rounded-xl font-bold transition-all duration-300 shadow-lg transform hover:scale-105",
  secondaryButton: "bg-gray-800 text-white hover:bg-gray-900",
};

export default function AchievementsViewScreen({ setScreen, userData }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-white text-black animate-fadeIn">
      <div className={style.card + " max-w-5xl w-full text-center"}>
        <h2 className="text-5xl font-bold mb-6 text-black">Achievements</h2>
        <p className="text-gray-700 mb-6 text-lg">Your achievements will appear here.</p>
        <button
          className={style.button + " " + style.secondaryButton + " mt-8"}
          onClick={() => setScreen('MAIN_MENU')}
        >
          Back to Menu
        </button>
      </div>
    </div>
  );
}

