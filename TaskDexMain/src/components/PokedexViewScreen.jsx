import React from 'react';
import { getGifUrl } from '../utils/sprites.js';
import { POKEMON_DATA } from '../data/pokemonData.js';
import { getTypeHoverColor, getTypeRingColor } from '../utils/typeColors.js';

const style = {
  card: "bg-gray-800 p-8 rounded-2xl shadow-2xl border-2 border-gray-700",
  button: "px-6 py-3 rounded-xl font-bold transition-all duration-300 shadow-lg transform hover:scale-105",
  secondaryButton: "bg-gray-700 text-white hover:bg-gray-600",
};

export default function PokedexViewScreen({ setScreen, userData }) {
  const caughtPokemonIds = new Set((userData?.pokedex || []).map(p => p.id));
  const allPokemon = [...POKEMON_DATA.list].sort((a, b) => a.id - b.id);
  const caughtCount = userData?.pokedex.length || 0;
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-[#1a1a1a] text-white animate-fadeIn">
      <div className={style.card + " max-w-6xl w-full text-center"}>
        <h2 className="text-5xl font-bold mb-6 text-white">Pokédex View</h2>
        <h3 className="text-2xl font-semibold mb-6 text-gray-400">Registered Species ({caughtCount} / {allPokemon.length})</h3>
        <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-5 max-h-[600px] overflow-y-auto p-6 bg-gray-900 rounded-xl mx-auto border-2 border-gray-700 shadow-xl">
          {allPokemon.map((pokemon, index) => {
            const isCaught = caughtPokemonIds.has(pokemon.id);
            const typeHoverClass = getTypeHoverColor(pokemon.type);
            const typeRingClass = getTypeRingColor(pokemon.type);
            
            return (
              <div 
                key={pokemon.id} 
                className={`text-center p-4 bg-gray-800 rounded-xl border-2 border-gray-600 transition-all duration-300 transform hover:scale-110 hover:shadow-xl ${
                  isCaught 
                    ? `${typeHoverClass} hover:ring-4 ${typeRingClass} cursor-pointer` 
                    : `opacity-60 ${typeHoverClass} hover:opacity-80 hover:ring-2 cursor-pointer`
                }`}
                style={{ animationDelay: `${index * 0.02}s` }}
              >
                {isCaught ? (
                  <>
                    <img 
                      src={getGifUrl(pokemon.name)} 
                      alt={pokemon.name}
                      className="mx-auto" 
                      style={{ width: '80px', height: '80px', imageRendering: 'pixelated' }}
                      onError={(e) => { e.target.onerror = null; e.target.src = getGifUrl("Placeholder"); }}
                    />
                    <p className="text-sm mt-2 text-white font-semibold">{pokemon.name}</p>
                  </>
                ) : (
                  <>
                    <div className="mx-auto flex items-center justify-center bg-gray-700 rounded-lg" style={{ width: '80px', height: '80px' }}>
                      <span className="text-5xl text-gray-400 font-bold">?</span>
                    </div>
                    <p className="text-sm mt-2 text-gray-400 font-semibold">???</p>
                  </>
                )}
              </div>
            );
          })}
        </div>
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

