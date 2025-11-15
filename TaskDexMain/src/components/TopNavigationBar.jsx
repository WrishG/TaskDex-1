import React from 'react';
import { getGifUrl } from '../utils/sprites.js';
import { getTypeBorderColor } from '../utils/typeColors.js';
import { getPokemonDataByName } from '../data/pokemonData.js';

export default function TopNavigationBar({ setScreen, userData, currentScreen }) {
  const trainerSprite = userData?.trainerGender === 'male' ? 'TrainerMale' : 'TrainerFemale';
  const partner = userData?.pokemon_inventory.find(p => p.isPartner);
  
  // Check if partner is ready to evolve
  const partnerData = partner ? getPokemonDataByName(partner.currentName) : null;
  const isReadyToEvolve = partner && partnerData && partnerData.evoExp !== -1 && partner.exp >= partnerData.evoExp;
  
  const navItems = [
    { name: "My Tasks", screen: 'TASKS_SCREEN', icon: '📝' },
    { name: "Pokédex", screen: 'POKEDEX_VIEW', icon: '📖' },
    { name: "Friends", screen: 'FRIENDS_LIST', icon: '🫂' },
    { name: "Achievements", screen: 'ACHIEVEMENTS_VIEW', icon: '🏆' },
  ];

  // Don't show navigation on these screens
  const hideNavScreens = ['WELCOME', 'LOGIN_SIGNUP', 'STARTER_SELECT', 'POMODORO_RUNNING', 'ENCOUNTER_SCREEN', 'POMODORO_SETUP'];
  if (hideNavScreens.includes(currentScreen) || !userData) {
    return null;
  }

  return (
    <nav className="bg-white border-b-2 border-black shadow-xl sticky top-0 z-40 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Left side - Logo/Title */}
          <div className="flex items-center space-x-3 animate-slideIn">
            <div className="w-14 h-14 bg-black rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-300 animate-glow">
              <span className="text-white font-bold text-2xl">T</span>
            </div>
            <span className="text-2xl font-bold text-black">TaskMon</span>
          </div>

          {/* Center - Navigation Items */}
          <div className="flex items-center space-x-3">
            {navItems.map((item, index) => (
              <button
                key={item.screen}
                onClick={() => setScreen(item.screen)}
                className={`px-5 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center space-x-2 transform hover:scale-105 ${
                  currentScreen === item.screen
                    ? 'bg-black text-white shadow-lg ring-2 ring-gray-400'
                    : 'bg-gray-100 text-black hover:bg-gray-200 border-2 border-black'
                }`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <span className="text-xl">{item.icon}</span>
                <span className="text-sm">{item.name}</span>
              </button>
            ))}
          </div>

          {/* Right side - Trainer and Partner Sprites */}
          <div className="flex items-center space-x-3">
            {/* Trainer Profile Icon */}
            <div 
              className="relative cursor-pointer p-2 bg-white rounded-full border-2 border-black hover:bg-gray-100 transition-all shadow-xl hover:scale-110 transform duration-300"
              onClick={() => setScreen('PARTNER_SELECT_SCREEN')}
            >
              <img 
                src={getGifUrl(trainerSprite)} 
                alt="Profile"
                style={{ width: '56px', height: '56px', imageRendering: 'pixelated' }}
                onError={(e) => { e.target.onerror = null; e.target.src = getGifUrl("Placeholder"); }}
                className="rounded-full"
              />
              {/* Evolution notification */}
              {isReadyToEvolve && (
                <span className="absolute -top-1 -right-1 w-6 h-6 bg-black rounded-full flex items-center justify-center text-white font-bold text-xs animate-pulse border-2 border-white shadow-lg">
                  !
                </span>
              )}
            </div>
            
            {/* Partner Sprite with Type-Colored Circle */}
            {partner && (
              <div 
                className={`rounded-full p-2 border-4 ${getTypeBorderColor(partner.type)} cursor-pointer hover:scale-110 transition-all duration-300 shadow-xl transform`}
                onClick={() => setScreen('PARTNER_SELECT_SCREEN')}
              >
                <img 
                  src={getGifUrl(partner.currentName)} 
                  alt="Partner" 
                  style={{ width: '56px', height: '56px', imageRendering: 'pixelated' }}
                  onError={(e) => { e.target.onerror = null; e.target.src = getGifUrl("Placeholder"); }}
                  className="rounded-full"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

