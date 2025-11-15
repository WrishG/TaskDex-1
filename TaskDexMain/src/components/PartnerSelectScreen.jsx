import React from 'react';
import { getGifUrl } from '../utils/sprites.js';
import { getPokemonDataByName } from '../data/pokemonData.js';
import { getTypeHoverColor, getTypeBorderColor, getTypeRingColor } from '../utils/typeColors.js';

const style = {
  card: "bg-white p-8 rounded-2xl shadow-2xl border-2 border-black",
  button: "px-6 py-3 rounded-xl font-bold transition-all duration-300 shadow-lg transform hover:scale-105",
  secondaryButton: "bg-gray-800 text-white hover:bg-gray-900",
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
    <div className="flex flex-col items-center min-h-screen p-4 bg-white text-black animate-fadeIn">
      <div className={style.card + " max-w-5xl w-full mt-12"}>
        <h2 className="text-5xl font-bold mb-8 text-center text-black">Trainer Profile</h2>

        {/* Trainer and Partner Display */}
        <div className="flex justify-center items-center space-x-12 bg-gray-100 p-8 rounded-2xl mb-10 border-2 border-black shadow-xl">
          <div className="text-center transform hover:scale-105 transition-transform duration-300">
            <img 
              src={getGifUrl(trainerSprite)} 
              alt="Trainer" 
              className="bg-white rounded-full p-3 border-4 border-black shadow-lg"
              style={{ width: '140px', height: '140px', imageRendering: 'pixelated' }}
              onError={(e) => { e.target.onerror = null; e.target.src = getGifUrl("Placeholder"); }}
            />
            <p className="mt-3 text-xl font-semibold text-black">{userData.trainerName}</p>
          </div>
          {currentPartner && (
            <div className="text-center transform hover:scale-105 transition-transform duration-300">
              <img 
                src={getGifUrl(currentPartner.currentName)} 
                alt="Partner" 
                className={`bg-white rounded-full p-3 border-4 ${getTypeBorderColor(currentPartner.type)} shadow-lg`}
                style={{ width: '140px', height: '140px', imageRendering: 'pixelated' }}
                onError={(e) => { e.target.onerror = null; e.target.src = getGifUrl("Placeholder"); }}
              />
              <p className="mt-3 text-xl font-semibold text-black">{currentPartner.currentName}</p>
              {/* EXP Display */}
              {partnerData && partnerData.evoExp !== -1 ? (
                <div className="mt-3">
                  <p className="text-sm text-black font-semibold">
                    EXP: {Math.floor(currentPartner.exp || 0)} / {partnerData.evoExp}
                  </p>
                  <div className="w-full bg-gray-300 rounded-full h-3 mt-2 max-w-[150px] mx-auto">
                    <div 
                      className="bg-black h-3 rounded-full transition-all duration-500" 
                      style={{ width: `${Math.min(((currentPartner.exp || 0) / partnerData.evoExp) * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-gray-600 mt-3">Max Level</p>
              )}
              {/* Show Evolve Button or "Current Partner" */}
              {isReadyToEvolve ? (
                <button 
                  className={style.button + " bg-yellow-500 text-black text-sm py-2 mt-3 animate-pulse hover:bg-yellow-400"}
                  onClick={() => handleEvolvePartner(currentPartner.id)}
                >
                  Evolve!
                </button>
              ) : (
                <p className="text-sm text-gray-600 mt-3">Current Partner</p>
              )}
            </div>
          )}
        </div>

        {/* Available Pokémon Grid */}
        <h3 className="text-3xl font-semibold text-black mb-6">My Pokémon ({availablePokemon.length})</h3>
        <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-5 max-h-96 overflow-y-auto p-6 bg-gray-100 rounded-xl mb-8 border-2 border-black shadow-xl">
          {availablePokemon.length === 0 && (
            <p className="text-gray-600 col-span-full text-center text-lg">Catch more Pokémon to build your party!</p>
          )}
          {availablePokemon.map((mon, index) => {
            const evoData = getPokemonDataByName(mon.currentName);
            const expPercent = evoData && evoData.evoExp > 0 ? (mon.exp / evoData.evoExp) * 100 : 100;
            const isEvoReady = evoData && evoData.evoExp !== -1 && mon.exp >= evoData.evoExp;
            const typeHoverClass = getTypeHoverColor(mon.type);
            const typeRingClass = getTypeRingColor(mon.type);

            return (
              <div 
                key={mon.id} 
                className={`text-center p-3 bg-white rounded-xl cursor-pointer border-2 border-black ${typeHoverClass} hover:ring-4 ${typeRingClass} transition-all duration-300 relative transform hover:scale-110 hover:shadow-xl`}
                onClick={() => handleSetNewPartner(mon.id)}
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                {/* Evolution indicator for non-partners */}
                {isEvoReady && (
                  <span className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center text-black font-bold text-xs animate-pulse border-2 border-white shadow-lg">
                    !
                  </span>
                )}
                <img 
                  src={getGifUrl(mon.currentName)} 
                  alt={mon.currentName}
                  className="mx-auto" 
                  style={{ width: '80px', height: '80px', imageRendering: 'pixelated' }}
                  onError={(e) => { e.target.onerror = null; e.target.src = getGifUrl("Placeholder"); }}
                />
                <p className="text-sm mt-2 text-black font-semibold">{mon.currentName}</p>
                {/* EXP Display */}
                {evoData && evoData.evoExp !== -1 ? (
                  <>
                    <p className="text-xs text-black mt-1 font-semibold">
                      {Math.floor(mon.exp || 0)} / {evoData.evoExp}
                    </p>
                    <div className="w-full bg-gray-300 rounded-full h-2 mt-2">
                      <div 
                        className="bg-black h-2 rounded-full transition-all duration-500" 
                        style={{ width: `${Math.min(expPercent, 100)}%` }}
                      ></div>
                    </div>
                  </>
                ) : (
                  <p className="text-xs text-gray-600 mt-1">Max Level</p>
                )}
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
            className="text-red-600 hover:text-red-700 text-sm font-semibold transition-colors duration-200"
            onClick={handleLogout}
          >
            Log Out
          </button>
        </div>
        
        {/* Dev Tool Toggle in Profile Screen */}
        <div className="flex justify-center items-center mt-4 p-3 bg-gray-100 rounded-lg border-2 border-black w-full">
          {isDevModeOn ? (
            <button 
              className="text-red-600 hover:text-red-700 text-xs font-semibold transition-colors duration-200"
              onClick={handleRevertPokedex}
            >
              [Dev Tool: Revert to Original Progress]
            </button>
          ) : (
            <button 
              className="text-yellow-600 hover:text-yellow-700 text-xs font-semibold transition-colors duration-200"
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


