import React from 'react';
import { getGifUrl } from '../utils/sprites.js';
import { getPokemonDataByName } from '../data/pokemonData.js';

const style = {
  card: "bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700",
  button: "px-6 py-3 rounded-xl font-bold transition-colors duration-300 shadow-md",
  primaryButton: "bg-blue-600 text-white hover:bg-blue-700",
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
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-gray-800 p-8 rounded-xl max-w-lg w-full text-center border-4 border-yellow-500">
        <h3 className="text-3xl font-bold text-yellow-400 mb-4">Results!</h3>
        <p className="text-lg text-white mb-6">{statusMessage}</p>
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
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-900 text-white">
      <div className={style.card + " max-w-4xl w-full text-center"}>
        <h2 className="text-3xl font-bold mb-2 text-green-400">Session Complete!</h2>
        <p className="text-lg text-gray-400 mb-6">Your partner, <strong>{partner?.currentName}</strong>, gained <span className="font-bold text-yellow-400">{expGained} EXP!</span></p>
        
        {/* Evolution Banner */}
        {isEvolving && (
          <div className="bg-purple-900/50 text-white p-3 rounded-lg mb-6 border border-purple-600">
            <p className="font-semibold text-xl">✨ Partner Evolution Pending! ✨</p>
            <p>It has enough EXP to evolve! Check results after catching.</p>
          </div>
        )}
        
        <h3 className="text-2xl font-semibold mb-4 text-blue-400">Wild Pokémon Encounter ({encounters.length} Found)</h3>
        <p className="text-gray-400 mb-6">Select <strong>up to 2</strong> Pokémon to catch and add to your team.</p>
        
        <div className="grid grid-cols-3 gap-6 mb-8">
          {encounters.map((mon, index) => (
            <div 
              key={index}
              className={`p-4 rounded-xl cursor-pointer transition-all duration-200 border-2 ${
                selectedMonIds.includes(index) ? 'border-green-500 bg-gray-700 ring-4 ring-green-500' : 'border-gray-700 hover:border-gray-500'
              } ${isSaving && !selectedMonIds.includes(index) ? 'opacity-50' : ''}`}
              onClick={() => handleSelectMon(index)}
            >
              <img
                src={getGifUrl(mon.name)}
                alt={mon.name}
                className="mx-auto mb-2"
                style={{ imageRendering: 'pixelated', width: '56px', height: '56px' }}
                onError={(e) => { e.target.onerror = null; e.target.src = getGifUrl("Placeholder"); }}
              />
              <p className="font-semibold">{mon.name}</p>
              <p className="text-xs text-gray-500">{mon.type}</p>
            </div>
          ))}
        </div>
        
        <button
          className={style.button + " " + style.primaryButton + " w-full"}
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

