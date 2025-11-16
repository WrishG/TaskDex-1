// Type color definitions for all variants
const typeColors = {
  Bug: {
    bg: 'bg-lime-600',
    border: 'border-lime-600',
    ring: 'ring-lime-400',
    hover: 'hover:bg-lime-500 hover:ring-lime-400',
    text: 'text-white',
    hex: '#A8B820',
  },
  Dark: {
    bg: 'bg-gray-800',
    border: 'border-gray-700',
    ring: 'ring-gray-600',
    hover: 'hover:bg-gray-700 hover:ring-gray-600',
    text: 'text-white',
    hex: '#705848',
  },
  Dragon: {
    bg: 'bg-violet-700',
    border: 'border-violet-700',
    ring: 'ring-violet-600',
    hover: 'hover:bg-violet-700 hover:ring-violet-600',
    text: 'text-white',
    hex: '#7038F8',
  },
  Electric: {
    bg: 'bg-yellow-400',
    border: 'border-yellow-400',
    ring: 'ring-yellow-300',
    hover: 'hover:bg-yellow-400 hover:ring-yellow-300',
    text: 'text-black',
    hex: '#F8D030',
  },
  Fighting: {
    bg: 'bg-red-700',
    border: 'border-red-700',
    ring: 'ring-red-600',
    hover: 'hover:bg-red-700 hover:ring-red-600',
    text: 'text-white',
    hex: '#C03028',
  },
  Fire: {
    bg: 'bg-orange-500',
    border: 'border-orange-500',
    ring: 'ring-orange-400',
    hover: 'hover:bg-orange-500 hover:ring-orange-400',
    text: 'text-white',
    hex: '#F08030',
  },
  Ghost: {
    bg: 'bg-indigo-900',
    border: 'border-indigo-800',
    ring: 'ring-indigo-700',
    hover: 'hover:bg-indigo-800 hover:ring-indigo-700',
    text: 'text-white',
    hex: '#705898',
  },
  Grass: {
    bg: 'bg-green-600',
    border: 'border-green-600',
    ring: 'ring-green-400',
    hover: 'hover:bg-green-600 hover:ring-green-500',
    text: 'text-white',
    hex: '#78C850',
  },
  Ground: {
    bg: 'bg-yellow-700',
    border: 'border-yellow-700',
    ring: 'ring-yellow-600',
    hover: 'hover:bg-yellow-700 hover:ring-yellow-600',
    text: 'text-white',
    hex: '#E0C068',
  },
  Ice: {
    bg: 'bg-cyan-200',
    border: 'border-cyan-200',
    ring: 'ring-cyan-300',
    hover: 'hover:bg-cyan-200 hover:ring-cyan-300',
    text: 'text-black',
    hex: '#98D8D8',
  },
  Normal: {
    bg: 'bg-gray-400',
    border: 'border-gray-400',
    ring: 'ring-gray-300',
    hover: 'hover:bg-gray-400 hover:ring-gray-300',
    text: 'text-black',
    hex: '#A8A878',
  },
  Poison: {
    bg: 'bg-purple-500',
    border: 'border-purple-500',
    ring: 'ring-purple-400',
    hover: 'hover:bg-purple-500 hover:ring-purple-400',
    text: 'text-white',
    hex: '#A040A0',
  },
  Psychic: {
    bg: 'bg-pink-400',
    border: 'border-pink-400',
    ring: 'ring-pink-400',
    hover: 'hover:bg-pink-400 hover:ring-pink-400',
    text: 'text-white',
    hex: '#F85888',
  },
  Rock: {
    bg: 'bg-yellow-800',
    border: 'border-yellow-800',
    ring: 'ring-yellow-700',
    hover: 'hover:bg-yellow-800 hover:ring-yellow-700',
    text: 'text-white',
    hex: '#B8A038',
  },
  Steel: {
    bg: 'bg-gray-300',
    border: 'border-gray-300',
    ring: 'ring-gray-400',
    hover: 'hover:bg-gray-300 hover:ring-gray-400',
    text: 'text-black',
    hex: '#B8B8D0',
  },
  Water: {
    bg: 'bg-blue-600',
    border: 'border-blue-600',
    ring: 'ring-blue-400',
    hover: 'hover:bg-blue-600 hover:ring-blue-500',
    text: 'text-white',
    hex: '#6890F0',
  },
};

// Utility functions for each color variant
export const getTypeBgColor = (type) => typeColors[type]?.bg || 'bg-gray-700';
export const getTypeBorderColor = (type) => typeColors[type]?.border || 'border-gray-400';
export const getTypeRingColor = (type) => typeColors[type]?.ring || 'ring-gray-400';
export const getTypeHoverColor = (type) => typeColors[type]?.hover || 'hover:bg-gray-600 hover:ring-gray-500';
export const getTypeTextColor = (type) => typeColors[type]?.text || 'text-white';
export const getTypeHexColor = (type) => typeColors[type]?.hex || '#888888';

