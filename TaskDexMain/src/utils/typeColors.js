// Type-based color utilities
export const getTypeHoverColor = (type) => {
  const colors = {
    'Grass': 'hover:bg-green-400 hover:ring-green-300', // Lighter green
    'Fire': 'hover:bg-red-400 hover:ring-red-300', // Lighter red
    'Water': 'hover:bg-blue-400 hover:ring-blue-300', // Lighter blue
    'Psychic': 'hover:bg-pink-300 hover:ring-pink-400', // Baby pink - correct as is
    'Ghost': 'hover:bg-blue-600 hover:ring-blue-500', // Lighter navy blue
    'Electric': 'hover:bg-yellow-300 hover:ring-yellow-200', // Lighter yellow
  };
  return colors[type] || 'hover:bg-gray-500 hover:ring-gray-400';
};

export const getTypeRingColor = (type) => {
  const colors = {
    'Grass': 'ring-green-400',
    'Fire': 'ring-red-400',
    'Water': 'ring-blue-400',
    'Psychic': 'ring-pink-400',
    'Ghost': 'ring-blue-800',
    'Electric': 'ring-yellow-400',
  };
  return colors[type] || 'ring-gray-400';
};

export const getTypeBorderColor = (type) => {
  const colors = {
    'Grass': 'border-green-600',
    'Fire': 'border-red-600',
    'Water': 'border-blue-600',
    'Psychic': 'border-pink-400',
    'Ghost': 'border-blue-900',
    'Electric': 'border-yellow-500',
  };
  return colors[type] || 'border-gray-400';
};

export const getTypeBgColor = (type) => {
  const colors = {
    'Grass': 'bg-green-900/30',
    'Fire': 'bg-red-900/30',
    'Water': 'bg-blue-900/30',
    'Psychic': 'bg-pink-900/30',
    'Ghost': 'bg-blue-950/30',
    'Electric': 'bg-yellow-900/30',
  };
  return colors[type] || 'bg-gray-800/30';
};

