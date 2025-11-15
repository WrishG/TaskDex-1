// Pokemon data and game constants
export const POKEMON_DATA = {
  SESSION_TYPES: ["Fire", "Water", "Grass", "Electric", "Ghost", "Psychic"],
  EXP_THRESHOLDS: {
    TIER_1: 750,
    TIER_2: 2500,
    TIER_SGL: 2250,
    TIER_BABY: 300,
    TIER_NONE: -1
  },
  list: [
    // --- GRASS ---
    { id: 1, name: "Bulbasaur", type: "Grass", evoStage: 1, nextEvo: "Ivysaur", evoExp: 750, chain: 3 },
    { id: 2, name: "Ivysaur", type: "Grass", evoStage: 2, nextEvo: "Venusaur", evoExp: 2500, chain: 3 },
    { id: 3, name: "Venusaur", type: "Grass", evoStage: 3, evoExp: -1, chain: 3 },
    { id: 43, name: "Oddish", type: "Grass", evoStage: 1, nextEvo: "Gloom", evoExp: 750, chain: 3 },
    { id: 44, name: "Gloom", type: "Grass", evoStage: 2, nextEvo: ["Vileplume", "Bellossom"], evoExp: 2250, chain: 3 },
    { id: 45, name: "Vileplume", type: "Grass", evoStage: 3, evoExp: -1, chain: 3 },
    { id: 182, name: "Bellossom", type: "Grass", evoStage: 3, evoExp: -1, chain: 3 },
    { id: 69, name: "Bellsprout", type: "Grass", evoStage: 1, nextEvo: "Weepinbell", evoExp: 750, chain: 3 },
    { id: 70, name: "Weepinbell", type: "Grass", evoStage: 2, nextEvo: "Victreebel", evoExp: 2250, chain: 3 },
    { id: 71, name: "Victreebel", type: "Grass", evoStage: 3, evoExp: -1, chain: 3 },
    { id: 152, name: "Chikorita", type: "Grass", evoStage: 1, nextEvo: "Bayleef", evoExp: 750, chain: 3 },
    { id: 153, name: "Bayleef", type: "Grass", evoStage: 2, nextEvo: "Meganium", evoExp: 2500, chain: 3 },
    { id: 154, name: "Meganium", type: "Grass", evoStage: 3, evoExp: -1, chain: 3 },
    { id: 191, name: "Sunkern", type: "Grass", evoStage: 1, nextEvo: "Sunflora", evoExp: 2250, chain: 2 },
    { id: 192, name: "Sunflora", type: "Grass", evoStage: 2, evoExp: -1, chain: 2 },
    // --- FIRE ---
    { id: 4, name: "Charmander", type: "Fire", evoStage: 1, nextEvo: "Charmeleon", evoExp: 750, chain: 3 },
    { id: 5, name: "Charmeleon", type: "Fire", evoStage: 2, nextEvo: "Charizard", evoExp: 2500, chain: 3 },
    { id: 6, name: "Charizard", type: "Fire", evoStage: 3, evoExp: -1, chain: 3 },
    { id: 37, name: "Vulpix", type: "Fire", evoStage: 1, nextEvo: "Ninetales", evoExp: 2250, chain: 2 },
    { id: 38, name: "Ninetales", type: "Fire", evoStage: 2, evoExp: -1, chain: 2 },
    { id: 58, name: "Growlithe", type: "Fire", evoStage: 1, nextEvo: "Arcanine", evoExp: 2250, chain: 2 },
    { id: 59, name: "Arcanine", type: "Fire", evoStage: 2, evoExp: -1, chain: 2 },
    { id: 136, name: "Flareon", type: "Fire", evoStage: 2, evoExp: -1, chain: 2 },
    { id: 155, name: "Cyndaquil", type: "Fire", evoStage: 1, nextEvo: "Quilava", evoExp: 750, chain: 3 },
    { id: 156, name: "Quilava", type: "Fire", evoStage: 2, nextEvo: "Typhlosion", evoExp: 2500, chain: 3 },
    { id: 157, name: "Typhlosion", type: "Fire", evoStage: 3, evoExp: -1, chain: 3 },
    { id: 240, name: "Magby", type: "Fire", evoStage: 0, nextEvo: "Magmar", evoExp: 300, chain: 2 },
    { id: 126, name: "Magmar", type: "Fire", evoStage: 1, evoExp: -1, chain: 2 },
    { id: 218, name: "Slugma", type: "Fire", evoStage: 1, nextEvo: "Magcargo", evoExp: 2250, chain: 2 },
    { id: 219, name: "Magcargo", type: "Fire", evoStage: 2, evoExp: -1, chain: 2 },
    // --- WATER ---
    { id: 7, name: "Squirtle", type: "Water", evoStage: 1, nextEvo: "Wartortle", evoExp: 750, chain: 3 },
    { id: 8, name: "Wartortle", type: "Water", evoStage: 2, nextEvo: "Blastoise", evoExp: 2500, chain: 3 },
    { id: 9, name: "Blastoise", type: "Water", evoStage: 3, evoExp: -1, chain: 3 },
    { id: 158, name: "Totodile", type: "Water", evoStage: 1, nextEvo: "Croconaw", evoExp: 750, chain: 3 },
    { id: 159, name: "Croconaw", type: "Water", evoStage: 2, nextEvo: "Feraligatr", evoExp: 2500, chain: 3 },
    { id: 160, name: "Feraligatr", type: "Water", evoStage: 3, evoExp: -1, chain: 3 },
    { id: 60, name: "Poliwag", type: "Water", evoStage: 1, nextEvo: "Poliwhirl", evoExp: 750, chain: 3 },
    { id: 61, name: "Poliwhirl", type: "Water", evoStage: 2, nextEvo: ["Poliwrath", "Politoed"], evoExp: 2250, chain: 3 },
    { id: 62, name: "Poliwrath", type: "Water", evoStage: 3, evoExp: -1, chain: 3 },
    { id: 186, name: "Politoed", type: "Water", evoStage: 3, evoExp: -1, chain: 3 },
    { id: 129, name: "Magikarp", type: "Water", evoStage: 1, nextEvo: "Gyarados", evoExp: 2250, chain: 2 },
    { id: 130, name: "Gyarados", type: "Water", evoStage: 2, evoExp: -1, chain: 2 },
    { id: 120, name: "Staryu", type: "Water", evoStage: 1, nextEvo: "Starmie", evoExp: 2250, chain: 2 },
    { id: 121, name: "Starmie", type: "Water", evoStage: 2, evoExp: -1, chain: 2 },
    { id: 133, name: "Eevee", type: "Water", evoStage: 1, nextEvo: "Vaporeon", evoExp: 2250, chain: 2 },
    { id: 134, name: "Vaporeon", type: "Water", evoStage: 2, evoExp: -1, chain: 2 },
    { id: 138, name: "Omanyte", type: "Water", evoStage: 1, nextEvo: "Omastar", evoExp: 750, chain: 2 },
    { id: 139, name: "Omastar", type: "Water", evoStage: 2, evoExp: -1, chain: 2 },
    { id: 140, name: "Kabuto", type: "Water", evoStage: 1, nextEvo: "Kabutops", evoExp: 750, chain: 2 },
    { id: 141, name: "Kabutops", type: "Water", evoStage: 2, evoExp: -1, chain: 2 },
    { id: 131, name: "Lapras", type: "Water", evoStage: 1, evoExp: -1, chain: 1 },
    { id: 223, name: "Remoraid", type: "Water", evoStage: 1, nextEvo: "Octillery", evoExp: 750, chain: 2 },
    { id: 224, name: "Octillery", type: "Water", evoStage: 2, evoExp: -1, chain: 2 },
    { id: 211, name: "Qwilfish", type: "Water", evoStage: 1, evoExp: -1, chain: 1 },
    { id: 226, name: "Mantine", type: "Water", evoStage: 1, evoExp: -1, chain: 1 },
    { id: 116, name: "Horsea", type: "Water", evoStage: 1, nextEvo: "Seadra", evoExp: 750, chain: 3 },
    { id: 117, name: "Seadra", type: "Water", evoStage: 2, nextEvo: "Kingdra", evoExp: 2250, chain: 3 },
    { id: 230, name: "Kingdra", type: "Water", evoStage: 3, evoExp: -1, chain: 3 },
    // --- ELECTRIC ---
    { id: 172, name: "Pichu", type: "Electric", evoStage: 0, nextEvo: "Pikachu", evoExp: 300, chain: 3 },
    { id: 25, name: "Pikachu", type: "Electric", evoStage: 1, nextEvo: "Raichu", evoExp: 2250, chain: 3 },
    { id: 26, name: "Raichu", type: "Electric", evoStage: 2, evoExp: -1, chain: 3 },
    { id: 135, name: "Jolteon", type: "Electric", evoStage: 2, evoExp: -1, chain: 2 },
    { id: 179, name: "Mareep", type: "Electric", evoStage: 1, nextEvo: "Flaaffy", evoExp: 750, chain: 3 },
    { id: 180, name: "Flaaffy", type: "Electric", evoStage: 2, nextEvo: "Ampharos", evoExp: 2500, chain: 3 },
    { id: 181, name: "Ampharos", type: "Electric", evoStage: 3, evoExp: -1, chain: 3 },
    { id: 239, name: "Elekid", type: "Electric", evoStage: 0, nextEvo: "Electabuzz", evoExp: 300, chain: 2 },
    { id: 125, name: "Electabuzz", type: "Electric", evoStage: 1, evoExp: -1, chain: 2 },
    // --- GHOST ---
    { id: 92, name: "Gastly", type: "Ghost", evoStage: 1, nextEvo: "Haunter", evoExp: 750, chain: 3 },
    { id: 93, name: "Haunter", type: "Ghost", evoStage: 2, nextEvo: "Gengar", evoExp: 2250, chain: 3 },
    { id: 94, name: "Gengar", type: "Ghost", evoStage: 3, evoExp: -1, chain: 3 },
    { id: 200, name: "Misdreavus", type: "Ghost", evoStage: 1, evoExp: -1, chain: 1 },
    // --- PSYCHIC ---
    { id: 63, name: "Abra", type: "Psychic", evoStage: 1, nextEvo: "Kadabra", evoExp: 750, chain: 3 },
    { id: 64, name: "Kadabra", type: "Psychic", evoStage: 2, nextEvo: "Alakazam", evoExp: 2250, chain: 3 },
    { id: 65, name: "Alakazam", type: "Psychic", evoStage: 3, evoExp: -1, chain: 3 },
    { id: 177, name: "Natu", type: "Psychic", evoStage: 1, nextEvo: "Xatu", evoExp: 2250, chain: 2 },
    { id: 178, name: "Xatu", type: "Psychic", evoStage: 2, evoExp: -1, chain: 2 },
    { id: 196, name: "Espeon", type: "Psychic", evoStage: 2, evoExp: -1, chain: 2 },
    { id: 150, name: "Mewtwo", type: "Psychic", evoStage: 1, evoExp: -1, chain: 1 },
    { id: 151, name: "Mew", type: "Psychic", evoStage: 1, evoExp: -1, chain: 1 },
    { id: 201, name: "Unown", type: "Psychic", evoStage: 1, evoExp: -1, chain: 1 },
    { id: 249, name: "Lugia", type: "Psychic", evoStage: 1, evoExp: -1, chain: 1 },
  ]
};

// Helper functions
export const getPokemonDataByName = (name) => POKEMON_DATA.list.find(p => p.name === name);
export const getPokemonIdByName = (name) => POKEMON_DATA.list.find(p => p.name === name)?.id;
export const getRandomWildPokemon = (type) => {
  const wildPool = POKEMON_DATA.list.filter(p => p.type === type && p.evoExp !== -1 && p.name !== 'Eevee');
  if (wildPool.length === 0) return null;
  const randomIndex = Math.floor(Math.random() * wildPool.length);
  return wildPool[randomIndex];
};

