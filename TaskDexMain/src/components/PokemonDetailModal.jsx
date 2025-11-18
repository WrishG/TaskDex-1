import React from 'react';
import { getGifUrl } from '../utils/sprites.js';
import { POKEMON_DATA } from '../data/pokemonData.js';
import { POKEDEX_ENTRIES } from '../data/pokedexEntries.js';
import { getTypeBgColor, getTypeBorderColor } from '../utils/typeColors.js';

export default function PokemonDetailModal({ open, onClose, pokemon, loading, error }) {
  if (!open) return null;

  // Try to find local POKEMON_DATA entry for richer metadata and to get the same gif sprite
  const localEntry = pokemon ? POKEMON_DATA.list.find(p => p.id === pokemon.id) : null;
  const spriteUrl = localEntry ? getGifUrl(localEntry.name) : pokemon?.sprites?.front_default;

  // Calculate evolution position in chain
  const getEvolutionInfo = (entry) => {
    if (!entry) return null;
    const chainLength = entry.chain || 0;
    const evoStage = entry.evoStage || 1;
    const nextEvo = entry.nextEvo;

    let position = '';
    if (chainLength === 1) {
      position = 'Does not evolve';
    } else if (evoStage === 1) {
      position = `Base form (Stage 1/${chainLength})`;
    } else if (evoStage === chainLength) {
      position = `Final evolution (Stage ${evoStage}/${chainLength})`;
    } else {
      position = `Intermediate form (Stage ${evoStage}/${chainLength})`;
    }

    return {
      position,
      nextEvo,
      chainLength,
      evoStage,
    };
  };

  const evoInfo = getEvolutionInfo(localEntry);
  const fallbackEntry = pokemon ? (POKEDEX_ENTRIES.find(e => e.id === pokemon.id)?.entry) : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-xl p-4 w-full max-w-5xl mx-4 my-4">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-2xl font-bold">Pokédex Entry</h3>
          <button className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 text-sm" onClick={onClose}>Close</button>
        </div>

        {loading && <div className="text-center py-4 text-gray-600">Loading...</div>}
        {error && <div className="text-red-600 text-center py-2 text-sm">{error}</div>}

        {!loading && !error && !pokemon && <div className="text-center py-2 text-gray-600 text-sm">No data available.</div>}

        {pokemon && (
          <div className="flex gap-3">
            {/* Left: Sprite + Type/Rarity Box */}
            <div className="flex-shrink-0 text-center">
              <div className="bg-gray-100 rounded-lg p-3 inline-block mb-2">
                <img src={spriteUrl} alt={pokemon.name} className="mx-auto" style={{ width: 100, height: 100 }} />
              </div>
              <div className="text-sm font-semibold text-gray-600 mb-1">#{String(pokemon.id).padStart(3, '0')}</div>
              <div className="text-2xl font-bold capitalize mb-2">{pokemon.name}</div>

              {/* Centered, colored Type Box */}
              {pokemon.types.length > 0 && (
                <div className="flex flex-col gap-1 justify-center mb-2">
                  {pokemon.types.map(t => (
                    <span
                      key={t}
                      className={`text-xs font-semibold px-3 py-1 rounded capitalize border-2 ${getTypeBgColor(
                        t
                      )} ${getTypeBorderColor(t)}`}
                    >
                      {t}
                    </span>
                  ))}
                </div>
              )}

              {/* Type and Rarity - separate lines */}
              {localEntry && (
                <div className="text-xs text-gray-700 space-y-0.5">
                  <div>
                    <span 
                      className={`inline-block px-2 py-1 rounded text-xs font-semibold border capitalize ${getTypeBgColor(
                        localEntry.type
                      )} ${getTypeBorderColor(localEntry.type)}`}
                    >
                      {localEntry.type}
                    </span>
                  </div>
                  <div>Rarity: <span className="font-semibold">{localEntry.rarity === 1 ? 'Rare' : 'Common'}</span></div>
                </div>
              )}
            </div>

            {/* Right: Details in 3-column layout */}
            <div className="flex-1 grid grid-cols-3 gap-4 text-sm">
              {/* Column 1: Classification, Height, Weight, Abilities */}
              <div className="space-y-1">
                <div>
                  <strong className="block text-sm">Classification:</strong>
                  <span className="text-sm text-gray-700">{localEntry ? `${localEntry.type} species` : '—'}</span>
                </div>
                <div>
                  <strong className="block text-sm">Height:</strong>
                  <span className="text-sm text-gray-700">{pokemon.height}</span>
                </div>
                <div>
                  <strong className="block text-sm">Weight:</strong>
                  <span className="text-sm text-gray-700">{pokemon.weight}</span>
                </div>
                <div>
                  <strong className="block text-sm mb-0.5">Abilities:</strong>
                  <div className="text-sm space-y-0">
                    {pokemon.abilities.map(a => (
                      <div key={a.name} className="capitalize text-gray-700">
                        {a.name}{a.is_hidden ? ' (h)' : ''}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Column 2: Base Stats */}
              <div className="pr-12">
                <strong className="block text-sm mb-0.5">Base Stats:</strong>
                <div className="space-y-0.5 text-sm">
                  {pokemon.stats.map(s => (
                    <div key={s.name} className="flex justify-between px-2 py-0.5 bg-gray-50 rounded">
                      <span className="capitalize text-gray-700">{s.name.slice(0, 3)}</span>
                      <span className="font-semibold text-gray-900">{s.base}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Column 3: Evolution Info + Description Space */}
              <div className="space-y-3">
                {evoInfo && (
                  <div className="text-sm">
                    <strong className="block text-sm mb-0.5">Evolution:</strong>
                    <div className="text-sm text-gray-700 space-y-0">
                      <div>{evoInfo.position}</div>
                      {evoInfo.nextEvo && (
                        <div>
                          → {Array.isArray(evoInfo.nextEvo) ? evoInfo.nextEvo.join(' / ') : evoInfo.nextEvo}
                        </div>
                      )}
                    </div>
                  </div>
                )}
                <div className="text-sm">
                  <strong className="block text-sm mb-0.5">Description:</strong>
                  <div className="text-sm text-gray-600 italic h-20 overflow-y-auto border border-gray-200 rounded p-1">
                    {localEntry?.entry || fallbackEntry || 'No description available.'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
