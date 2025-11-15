import React from 'react';
import { getGifUrl } from '../utils/sprites.js';
import { getPokemonDataByName } from '../data/pokemonData.js';

export default function GlobalProfileIcon({ setScreen, userData }) {
  if (!userData || !userData.isProfileComplete) {
    return null;
  }
  
  const trainerSprite = userData.trainerGender === 'male' ? 'TrainerMale' : 'TrainerFemale';
  
  // Check if partner is ready to evolve
  const partner = userData.pokemon_inventory.find(p => p.isPartner);
  const partnerData = partner ? getPokemonDataByName(partner.currentName) : null;
  const isReadyToEvolve = partner && partnerData && partnerData.evoExp !== -1 && partner.exp >= partnerData.evoExp;

  return (
    <div 
      className="fixed top-4 right-4 z-50 cursor-pointer p-2 bg-white rounded-full border-2 border-red-600 hover:bg-red-100 transition-all shadow-lg"
      onClick={() => setScreen('PARTNER_SELECT_SCREEN')}
    >
      <img 
        src={getGifUrl(trainerSprite)} 
        alt="Profile"
        style={{ width: '48px', height: '48px', imageRendering: 'pixelated' }}
        onError={(e) => { e.target.onerror = null; e.target.src = getGifUrl("Placeholder"); }}
      />
      {/* Flashing Exclamation Mark for evolution ready */}
      {isReadyToEvolve && (
        <span className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white font-bold text-lg animate-pulse border-2 border-white">
          !
        </span>
      )}
    </div>
  );
}

