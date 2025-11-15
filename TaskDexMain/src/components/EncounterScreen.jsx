import React from 'react';
import { getGifUrl } from '../utils/sprites.js';
import { getPokemonDataByName } from '../data/pokemonData.js';
import { getTypeHoverColor, getTypeBorderColor, getTypeBgColor, getTypeRingColor } from '../utils/typeColors.js';

const style = {
  card: "bg-white p-8 rounded-2xl shadow-2xl border-2 border-black",
  button: "px-6 py-3 rounded-xl font-bold transition-all duration-300 shadow-lg transform hover:scale-105",
  primaryButton: "bg-black text-white hover:bg-gray-800",
};

export default function EncounterScreen({ setScreen, sessionConfig, userData, saveCaughtPokemon }) {
  const { encounters, expGained } = sessionConfig;
  const [selectedMonIds, setSelectedMonIds] = React.useState([]);
  const [isSaving, setIsSaving] = React.useState(false);
  const [showStatus, setShowStatus] = React.useState(false);
  const [statusMessage, setStatusMessage] = React.useState('');
  const partner = userData?.pokemon_inventory.find(p => p.isPartner);
  
  // Check if the partner has enough EXP to evolve (pre-catch status)
  const partnerData = getPokemonDataByName(partner?.currentName);
  const isEvolving = partnerData?.evoExp !== -1 && partner.exp + expGained >= partnerData?.evoExp;
  
  const handleSelectMon = (index) => {
    setSelectedMonIds(prev => {
      if (prev.includes(index)) {
        return prev.filter(mid => mid !== index);
      } else if (prev.length < 2) {
        return [...prev, index];
      }
      return prev;
    });
  };
  
  const handleFinalCatch = async () => {
    if (selectedMonIds.length === 0 || isSaving) return;
    setIsSaving(true);
    
    const caughtMonNames = encounters
      .filter((_, index) => selectedMonIds.includes(index))
      .map(mon => mon.name);
      
    // Use the centralized saving function
    const status = await saveCaughtPokemon(caughtMonNames, expGained);
    let messages = [];
    if (status.hasEvolved) {
      messages.push(`✨ ${partner.currentName} is ready to evolve! Check your profile!`);
    }
    if (status.hasNewPokemon) {
      messages.push(`📖 New Pokémon registered in the Pokédex!`);
    }
    messages.push(`You caught ${caughtMonNames.join(', ')}!`);
    setStatusMessage(messages.join(' | '));
    setShowStatus(true);
    setIsSaving(false);
  };
  
  const handleProceed = () => {
    setScreen('BREAK_PHASE_TRIGGER');
  };
  
  // Status Modal component
  const StatusModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 animate-fadeIn">
      <div className="bg-white p-8 rounded-2xl max-w-lg w-full text-center border-4 border-yellow-500 shadow-2xl">
        <h3 className="text-3xl font-bold text-yellow-600 mb-4">Results!</h3>
        <p className="text-lg text-black mb-6">{statusMessage}</p>
        <button 
          className={style.button + " bg-green-600 text-white hover:bg-green-700 w-full"}
          onClick={handleProceed}
        >
          Start Break Session
        </button>
      </div>
    </div>
  );
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-white text-black animate-fadeIn">
      <div className={style.card + " max-w-5xl w-full text-center"}>
        <h2 className="text-4xl font-bold mb-3 text-green-600">Session Complete!</h2>
        <p className="text-lg text-gray-700 mb-8">Your partner, <strong className="text-black">{partner?.currentName}</strong>, gained <span className="font-bold text-yellow-600">{Math.floor(expGained)} EXP!</span></p>
        
        {/* Evolution Banner */}
        {isEvolving && (
          <div className="bg-purple-100 text-black p-4 rounded-xl mb-8 border-2 border-purple-600 animate-pulse">
            <p className="font-semibold text-xl">✨ Partner Evolution Pending! ✨</p>
            <p className="text-gray-700">It has enough EXP to evolve! Check results after catching.</p>
          </div>
        )}
        
        <h3 className="text-3xl font-semibold mb-4 text-black">Wild Pokémon Encounter ({encounters.length} Found)</h3>
        <p className="text-gray-700 mb-8 text-lg">Select <strong className="text-black">up to 2</strong> Pokémon to catch and add to your team.</p>
        
        <div className="grid grid-cols-3 gap-6 mb-8">
          {encounters.map((mon, index) => {
            const typeHoverClass = getTypeHoverColor(mon.type);
            const typeBorderClass = getTypeBorderColor(mon.type);
            const typeBgClass = getTypeBgColor(mon.type);
            const typeRingClass = getTypeRingColor(mon.type);
            const isSelected = selectedMonIds.includes(index);
            
            return (
              <div 
                key={index}
                className={`p-5 rounded-xl cursor-pointer transition-all duration-300 border-2 transform hover:scale-110 ${
                  isSelected 
                    ? `${typeBorderClass} ${typeBgClass} ring-4 ${typeRingClass} scale-105 shadow-2xl` 
                    : `border-black bg-white ${typeHoverClass} hover:ring-2`
                } ${isSaving && !isSelected ? 'opacity-50' : ''}`}
                onClick={() => handleSelectMon(index)}
              >
              <img
                src={getGifUrl(mon.name)}
                alt={mon.name}
                className="mx-auto mb-3"
                style={{ imageRendering: 'pixelated', width: '72px', height: '72px' }}
                onError={(e) => { e.target.onerror = null; e.target.src = getGifUrl("Placeholder"); }}
              />
              <p className="font-semibold text-black text-lg">{mon.name}</p>
              <p className="text-sm text-gray-600">{mon.type}</p>
              </div>
            );
          })}
        </div>
        
        <button
          className={style.button + " " + style.primaryButton + " w-full text-lg py-4"}
          onClick={handleFinalCatch}
          disabled={selectedMonIds.length === 0 || isSaving}
        >
          {isSaving ? 'Saving Data...' : `Catch ${selectedMonIds.length} Pokémon`}
        </button>
      </div>
      
      {showStatus && <StatusModal />}
    </div>
  );
}

