// Type-based color utilities

// Utility: fallback to inline style if Tailwind doesn't have a close match
const typeHexColors = {
  Bug: '#A8B820',
  Dark: '#705848',
  Dragon: '#7038F8',
  Electric: '#F8D030',
  Fighting: '#C03028',
  Fire: '#F08030',
  Ghost: '#705898',
  Grass: '#78C850',
  Ground: '#E0C068',
  Ice: '#98D8D8',
  Normal: '#A8A878',
  Poison: '#A040A0',
  Psychic: '#F85888',
  Rock: '#B8A038',
  Steel: '#B8B8D0',
  Water: '#6890F0',
};

export const getTypeHoverColor = (type) => {
  // Use Tailwind if possible, else fallback to inline style
  const tw = {
    Grass: 'hover:bg-green-600 hover:ring-green-500',
    Fire: 'hover:bg-orange-500 hover:ring-orange-400',
    Water: 'hover:bg-blue-600 hover:ring-blue-500',
    Electric: 'hover:bg-yellow-400 hover:ring-yellow-300',
    Psychic: 'hover:bg-pink-400 hover:ring-pink-400',
    Ghost: 'hover:bg-indigo-800 hover:ring-indigo-700',
    Bug: 'hover:bg-lime-500 hover:ring-lime-400',
    Dark: 'hover:bg-gray-700 hover:ring-gray-600',
    Dragon: 'hover:bg-violet-700 hover:ring-violet-600',
    Fighting: 'hover:bg-red-700 hover:ring-red-600',
    Ground: 'hover:bg-yellow-700 hover:ring-yellow-600',
    Ice: 'hover:bg-cyan-200 hover:ring-cyan-300',
    Normal: 'hover:bg-gray-400 hover:ring-gray-300',
    Poison: 'hover:bg-purple-500 hover:ring-purple-400',
    Rock: 'hover:bg-yellow-800 hover:ring-yellow-700',
    Steel: 'hover:bg-gray-300 hover:ring-gray-400',
  };
  if (tw[type]) return tw[type];
  if (typeHexColors[type]) return `hover:bg-[${typeHexColors[type]}]`;
  return 'hover:bg-gray-600 hover:ring-gray-500';
};

export const getTypeRingColor = (type) => {
  const tw = {
    Grass: 'ring-green-400',
    Fire: 'ring-orange-400',
    Water: 'ring-blue-400',
    Electric: 'ring-yellow-300',
    Psychic: 'ring-pink-400',
    Ghost: 'ring-indigo-700',
    Bug: 'ring-lime-400',
    Dark: 'ring-gray-600',
    Dragon: 'ring-violet-600',
    Fighting: 'ring-red-600',
    Ground: 'ring-yellow-600',
    Ice: 'ring-cyan-300',
    Normal: 'ring-gray-300',
    Poison: 'ring-purple-400',
    Rock: 'ring-yellow-700',
    Steel: 'ring-gray-400',
  };
  if (tw[type]) return tw[type];
  if (typeHexColors[type]) return `ring-[${typeHexColors[type]}]`;
  return 'ring-gray-400';
};

export const getTypeBorderColor = (type) => {
  const tw = {
    Grass: 'border-green-700',
    Fire: 'border-orange-700',
    Water: 'border-blue-700',
    Electric: 'border-yellow-600',
    Psychic: 'border-pink-700',
    Ghost: 'border-indigo-900',
    Bug: 'border-lime-800',
    Dark: 'border-gray-900',
    Dragon: 'border-violet-800',
    Fighting: 'border-red-900',
    Ground: 'border-yellow-900',
    Ice: 'border-cyan-600',
    Normal: 'border-gray-700',
    Poison: 'border-purple-800',
    Rock: 'border-amber-900',
    Steel: 'border-gray-600',
  };
  if (tw[type]) return tw[type];
  if (typeHexColors[type]) return `border-gray-800`;
  return 'border-gray-600';
};

export const getTypeBgColor = (type) => {
  const tw = {
    Grass: 'bg-green-500 text-white',
    Fire: 'bg-orange-500 text-white',
    Water: 'bg-blue-500 text-white',
    Electric: 'bg-yellow-400 text-gray-900',
    Psychic: 'bg-pink-500 text-white',
    Ghost: 'bg-indigo-700 text-white',
    Bug: 'bg-lime-600 text-white',
    Dark: 'bg-gray-800 text-white',
    Dragon: 'bg-violet-600 text-white',
    Fighting: 'bg-red-700 text-white',
    Ground: 'bg-yellow-700 text-white',
    Ice: 'bg-cyan-400 text-gray-900',
    Normal: 'bg-gray-500 text-white',
    Poison: 'bg-purple-600 text-white',
    Rock: 'bg-amber-700 text-white',
    Steel: 'bg-gray-400 text-gray-900',
  };
  if (tw[type]) return tw[type];
  if (typeHexColors[type]) return `text-white`;
  return 'bg-gray-500 text-white';
};

