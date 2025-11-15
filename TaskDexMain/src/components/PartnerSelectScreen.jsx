import React from 'react';
import { getGifUrl } from '../utils/sprites.js';
import { getPokemonDataByName } from '../data/pokemonData.js';

const style = {
  card: "bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700",
  button: "px-6 py-3 rounded-xl font-bold transition-colors duration-300 shadow-md",
  secondaryButton: "bg-gray-600 text-white hover:bg-gray-700",
};

export default function PartnerSelectScreen({ 
  setScreen, 
  userData, 
  handleLogout, 
  handleSetNewPartner, 
  handleEvolvePartner, 
  handleUnlockPokedex, 
  handleRevertPokedex 
}) {
  const trainerSprite = userData?.trainerGender === 'male' ? 'TrainerMale' : 'TrainerFemale';
  const currentPartner = userData.pokemon_inventory.find(p => p.isPartner);
  const availablePokemon = userData.pokemon_inventory.filter(p => !p.isPartner);
  const isDevModeOn = !!userData?.original_progress_backup;
  
  // Check if partner is ready to evolve
  const partnerData = currentPartner ? getPokemonDataByName(currentPartner.currentName) : null;
  const isReadyToEvolve = partnerData && partnerData.evoExp !== -1 && currentPartner.exp >= partnerData.evoExp;

  return (
    <div className="flex flex-col items-center min-h-screen p-4 bg-gray-900 text-white">
      <div className={style.card + " max-w-4xl w-full mt-12"}>
        <h2 className="text-4xl font-bold mb-6 text-center text-blue-400">Trainer Profile</h2>

        {/* Trainer and Partner Display */}
        <div className="flex justify-center items-center space-x-8 bg-gray-700/50 p-6 rounded-xl mb-8">
          <div className="text-center">
            <img 
              src={getGifUrl(trainerSprite)} 
              alt="Trainer" 
              className="bg-gray-800 rounded-full p-2 border-2 border-blue-400"
              style={{ width: '80px', height: '80px', imageRendering: 'pixelated' }}
              onError={(e) => { e.target.onerror = null; e.target.src = getGifUrl("Placeholder"); }}
            />
            <p className="mt-2 text-lg font-semibold">{userData.trainerName}</p>
          </div>
          {currentPartner && (
            <div className="text-center">
              <img 
                src={getGifUrl(currentPartner.currentName)} 
                alt="Partner" 
                className="bg-gray-800 rounded-full p-2 border-2 border-green-400"
                style={{ width: '80px', height: '80px', imageRendering: 'pixelated' }}
                onError={(e) => { e.target.onerror = null; e.target.src = getGifUrl("Placeholder"); }}
              />
              <p className="mt-2 text-lg font-semibold">{currentPartner.currentName}</p>
              {/* Show Evolve Button or "Current Partner" */}
              {isReadyToEvolve ? (
                <button 
                  className={style.button + " bg-yellow-500 text-black text-sm py-1 mt-1 animate-pulse"}
                  onClick={() => handleEvolvePartner(currentPartner.id)}
                >
                  Evolve!
                </button>
              ) : (
                <p className="text-sm text-gray-400">Current Partner</p>
              )}
            </div>
          )}
        </div>

        {/* Available Pokémon Grid */}
        <h3 className="text-2xl font-semibold text-white mb-4">My Pokémon ({availablePokemon.length})</h3>
        <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4 max-h-60 overflow-y-auto p-4 bg-gray-900 rounded-lg mb-8">
          {availablePokemon.length === 0 && (
            <p className="text-gray-400 col-span-full text-center">Catch more Pokémon to build your party!</p>
          )}
          {availablePokemon.map(mon => {
            const evoData = getPokemonDataByName(mon.currentName);
            const expPercent = evoData && evoData.evoExp > 0 ? (mon.exp / evoData.evoExp) * 100 : 100;
            const isEvoReady = evoData && evoData.evoExp !== -1 && mon.exp >= evoData.evoExp;

            return (
              <div 
                key={mon.id} 
                className="text-center p-2 bg-gray-700 rounded-lg cursor-pointer hover:bg-green-700 hover:ring-2 ring-green-400 transition-all relative"
                onClick={() => handleSetNewPartner(mon.id)}
              >
                {/* Evolution indicator for non-partners */}
                {isEvoReady && (
                  <span className="absolute -top-2 -right-2 w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center text-black font-bold text-xs animate-pulse border-2 border-white">
                    !
                  </span>
                )}
                <img 
                  src={getGifUrl(mon.currentName)} 
                  alt={mon.currentName}
                  className="mx-auto" 
                  style={{ width: '56px', height: '56px', imageRendering: 'pixelated' }}
                  onError={(e) => { e.target.onerror = null; e.target.src = getGifUrl("Placeholder"); }}
                />
                <p className="text-xs mt-1">{mon.currentName}</p>
                {/* EXP Bar */}
                <div className="w-full bg-gray-900 rounded-full h-1.5 mt-1">
                  <div 
                    className="bg-blue-500 h-1.5 rounded-full" 
                    style={{ width: `${Math.min(expPercent, 100)}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="flex justify-between items-center mt-8">
          <button
            className={style.button + " " + style.secondaryButton}
            onClick={() => setScreen('MAIN_MENU')}
          >
            Back to Menu
          </button>
          <button 
            className="text-red-400 hover:text-red-500 text-sm font-semibold"
            onClick={handleLogout}
          >
            Log Out
          </button>
        </div>
        
        {/* Dev Tool Toggle in Profile Screen */}
        <div className="flex justify-center items-center mt-4 p-2 bg-gray-900 rounded-lg border border-gray-700 w-full">
          {isDevModeOn ? (
            <button 
              className="text-red-400 hover:text-red-500 text-xs font-semibold"
              onClick={handleRevertPokedex}
            >
              [Dev Tool: Revert to Original Progress]
            </button>
          ) : (
            <button 
              className="text-yellow-400 hover:text-yellow-500 text-xs font-semibold"
              onClick={handleUnlockPokedex}
            >
              [Dev Tool: Unlock All Pokémon]
            </button>
          )}
        </div>
      </div>
    </div>
  );
}


