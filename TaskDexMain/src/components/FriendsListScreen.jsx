import React from 'react';
import { getGifUrl } from '../utils/sprites.js';
import { getPokemonDataByName } from '../data/pokemonData.js';
import { queryUserByUID } from '../utils/firebaseHelpers.js';
import { getAuth } from 'firebase/auth';
import { doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { app, db } from '../config/firebase.js';

const style = {
  card: "bg-white p-6 rounded-xl shadow-lg border-2 border-gray-300",
  button: "px-6 py-3 rounded-xl font-bold transition-colors duration-300 shadow-md",
  primaryButton: "bg-red-600 text-white hover:bg-red-700",
  secondaryButton: "bg-gray-600 text-white hover:bg-gray-700",
  input: "w-full p-3 rounded-lg bg-white border-2 border-gray-300 text-black focus:border-red-500 focus:ring-2 focus:ring-red-500",
};

export default function FriendsListScreen({ setScreen, userData }) {
  const [friendIdInput, setFriendIdInput] = React.useState('');
  const [message, setMessage] = React.useState('');
  const [friendsDetail, setFriendsDetail] = React.useState([]);
  const [loadingFriends, setLoadingFriends] = React.useState(false);
  const [selectedFriendProfile, setSelectedFriendProfile] = React.useState(null);
  const [friendFullData, setFriendFullData] = React.useState(null);
  const [loadingProfile, setLoadingProfile] = React.useState(false);
  
  const currentUserId = app ? getAuth(app).currentUser?.uid : null;
  
  // Fetch details for all friends listed in userData.friends
  React.useEffect(() => {
    const fetchFriendsDetails = async () => {
      if (!userData || !userData.friends || userData.friends.length === 0) {
        setFriendsDetail([]);
        return;
      }
      
      setLoadingFriends(true);
      const details = [];
      
      for (const friendId of userData.friends) {
        const profile = await queryUserByUID(friendId);
        if (profile) {
          details.push({ 
            id: friendId, 
            isProfileComplete: profile.isProfileComplete,
            trainerGender: profile.trainerGender,
            trainerName: profile.trainerName || 'Friend',
            partnerName: profile.pokemon_inventory?.find(p => p.isPartner)?.currentName || '???',
          });
        } else {
          details.push({ id: friendId, isProfileComplete: false, partnerName: 'User Deleted', trainerName: '???' });
        }
      }
      
      setFriendsDetail(details);
      setLoadingFriends(false);
    };
    
    fetchFriendsDetails();
  }, [userData?.friends]);
  
  const handleAddFriend = async () => {
    setMessage('');
    if (!friendIdInput || friendIdInput.length < 10) { // Basic sanity check for UID length
      setMessage("Error: Invalid Trainer ID format.");
      return;
    }
    
    if (friendIdInput === currentUserId) {
      setMessage("Error: You cannot add yourself!");
      return;
    }
    
    if (userData.friends.includes(friendIdInput)) {
      setMessage("Error: This Trainer is already your friend!");
      return;
    }
    
    const friendProfile = await queryUserByUID(friendIdInput);
    if (friendProfile && friendProfile.isProfileComplete) {
      try {
        if (db && currentUserId) {
          const userDocRef = doc(db, 'artifacts', 'default-app-id', 'users', currentUserId, 'profile', 'data');
          await updateDoc(userDocRef, {
            friends: arrayUnion(friendIdInput)
          });
          setMessage(`Success! Trainer added to your Friends List.`);
          setFriendIdInput('');
        } else {
          setMessage("Error: Firebase not available.");
        }
      } catch (e) {
        setMessage("Error adding friend. Please try again.");
        console.error("Error adding friend:", e);
      }
    } else {
      setMessage("Error: Trainer ID not found or profile incomplete.");
    }
  };

  const handleViewFriendProfile = async (friend) => {
    setLoadingProfile(true);
    try {
      const fullData = await queryUserByUID(friend.id);
      setFriendFullData(fullData);
      setSelectedFriendProfile(friend);
    } catch (error) {
      console.error('Error loading friend profile:', error);
    }
    setLoadingProfile(false);
  };

  // Friend Profile Modal
  if (selectedFriendProfile && friendFullData) {
    const partnerPokemon = friendFullData.pokemon_inventory?.find(p => p.isPartner);
    const pokemonList = friendFullData.pokemon_inventory || [];

    return (
      <div className="flex flex-col items-center min-h-screen p-4 bg-[#f5f5dc] text-black">
        <div className={style.card + " max-w-4xl w-full mt-12"}>
          {/* Header with close button */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-4xl font-bold text-black">{selectedFriendProfile.trainerName}'s Profile</h2>
            <button
              className={style.button + " " + style.secondaryButton}
              onClick={() => {
                setSelectedFriendProfile(null);
                setFriendFullData(null);
              }}
            >
              ← Back
            </button>
          </div>

          {/* Profile Header */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border-2 border-blue-300">
            {/* Trainer Info */}
            <div className="flex flex-col items-center md:col-span-1">
              <img 
                src={getGifUrl(selectedFriendProfile.trainerGender === 'female' ? 'TrainerFemale' : 'TrainerMale')} 
                alt="Trainer"
                style={{ width: '64px', height: '64px', imageRendering: 'pixelated', marginBottom: '12px' }}
                onError={(e) => { e.target.onerror = null; e.target.src = getGifUrl("Placeholder"); }}
              />
              <p className="font-bold text-xl mb-2">{selectedFriendProfile.trainerName}</p>
              <p className="text-sm text-gray-600 mb-3">
                Gender: {selectedFriendProfile.trainerGender === 'female' ? '♀ Female' : '♂ Male'}
              </p>
              <p className="text-xs font-mono text-gray-600 break-all text-center">ID: {selectedFriendProfile.id}</p>
            </div>

            {/* Partner Pokemon */}
            {partnerPokemon && (
              <div className="flex flex-col items-center md:col-span-1 p-4 bg-white rounded-lg border-2 border-yellow-400">
                <p className="text-sm font-semibold text-gray-700 mb-2">Partner Pokémon</p>
                <img 
                  src={getGifUrl(partnerPokemon.currentName)} 
                  alt={partnerPokemon.currentName}
                  style={{ width: '64px', height: '64px', imageRendering: 'pixelated', marginBottom: '8px' }}
                  onError={(e) => { e.target.onerror = null; e.target.src = getGifUrl("Placeholder"); }}
                />
                <p className="font-bold text-lg">{partnerPokemon.currentName}</p>
                <p className="text-xs text-gray-600">Exp: {partnerPokemon.exp || 0}</p>
              </div>
            )}

            {/* Stats */}
            <div className="flex flex-col justify-center md:col-span-1 p-4 bg-white rounded-lg border-2 border-green-400">
              <div className="space-y-2">
                <p className="text-sm">
                  <span className="font-bold">Pokémon Caught:</span> {pokemonList.length}
                </p>
                <p className="text-sm">
                  <span className="font-bold">Pokedex Entry:</span> {friendFullData.pokedex?.length || 0}
                </p>
                <p className="text-sm">
                  <span className="font-bold">Total Exp:</span> {pokemonList.reduce((sum, p) => sum + (p.exp || 0), 0)}
                </p>
                <p className="text-sm">
                  <span className="font-bold">Achievements:</span> {friendFullData.achievements?.length || 0}
                </p>
              </div>
            </div>
          </div>

          {/* Pokemon Collection */}
          <div className="mb-8">
            <h3 className="text-2xl font-bold mb-4 text-black">Pokémon Collection ({pokemonList.length})</h3>
            
            {pokemonList.length === 0 ? (
              <p className="text-gray-600 p-4 bg-gray-100 rounded-lg border-2 border-gray-300">No Pokémon caught yet.</p>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {pokemonList.map((pokemon) => {
                  const pokemonData = getPokemonDataByName(pokemon.currentName);
                  const typeColor = {
                    'Fire': 'from-orange-400 to-red-500',
                    'Water': 'from-blue-400 to-cyan-500',
                    'Grass': 'from-green-400 to-lime-500',
                    'Electric': 'from-yellow-300 to-yellow-500',
                    'Psychic': 'from-purple-400 to-pink-500',
                    'Normal': 'from-gray-400 to-gray-500',
                    'Flying': 'from-sky-300 to-blue-400',
                    'Ground': 'from-amber-600 to-yellow-600',
                    'Rock': 'from-stone-500 to-stone-600',
                    'Bug': 'from-lime-500 to-green-600',
                    'Ghost': 'from-purple-600 to-purple-800',
                    'Steel': 'from-slate-400 to-slate-600',
                    'Ice': 'from-cyan-300 to-blue-300',
                    'Dragon': 'from-indigo-500 to-purple-600',
                    'Dark': 'from-gray-700 to-black',
                    'Fairy': 'from-pink-300 to-rose-400',
                  }[pokemon.type] || 'from-gray-400 to-gray-500';

                  return (
                    <div 
                      key={pokemon.id} 
                      className={`bg-gradient-to-br ${typeColor} p-4 rounded-lg shadow-lg border-2 border-gray-300 text-white text-center flex flex-col items-center transform transition hover:scale-105`}
                    >
                      <img 
                        src={getGifUrl(pokemon.currentName)} 
                        alt={pokemon.currentName}
                        style={{ width: '48px', height: '48px', imageRendering: 'pixelated', marginBottom: '8px' }}
                        onError={(e) => { e.target.onerror = null; e.target.src = getGifUrl("Placeholder"); }}
                      />
                      <p className="font-bold text-sm">{pokemon.currentName}</p>
                      <p className="text-xs opacity-90">Exp: {pokemon.exp || 0}</p>
                      {pokemon.isPartner && (
                        <p className="text-xs font-bold mt-1 bg-yellow-300 text-yellow-900 px-2 py-1 rounded">★ Partner</p>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Achievements Section */}
          {friendFullData.achievements && friendFullData.achievements.length > 0 && (
            <div className="mb-8">
              <h3 className="text-2xl font-bold mb-4 text-black">Achievements ({friendFullData.achievements.length})</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {friendFullData.achievements.map((achievement, idx) => (
                  <div key={idx} className="p-3 bg-yellow-100 border-2 border-yellow-400 rounded-lg text-center">
                    <p className="text-2xl mb-1">🏆</p>
                    <p className="text-xs font-semibold">{achievement.name || `Achievement ${idx + 1}`}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Back Button */}
          <button
            className={style.button + " " + style.secondaryButton + " w-full"}
            onClick={() => {
              setSelectedFriendProfile(null);
              setFriendFullData(null);
            }}
          >
            ← Back to Friends List
          </button>
        </div>
      </div>
    );
  }

  // Main Friends List Screen
  return (
    <div className="flex flex-col items-center min-h-screen p-4 bg-[#f5f5dc] text-black">
      <div className={style.card + " max-w-4xl w-full mt-12"}>
        <h2 className="text-4xl font-bold mb-4 text-black">Friends List & Multiplayer Hub</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Column 1: My ID & Copy ID */}
          <div className="md:col-span-1 space-y-4">
            <div className="p-4 bg-gray-100 rounded-lg border-2 border-gray-300">
              <h3 className="text-xl font-semibold mb-2">Your Trainer ID</h3>
              <p className="font-mono text-sm break-all text-yellow-600 mb-3 select-all">
                {currentUserId || `local-user-${userData?.trainerName || 'trainer'}`}
              </p>
              <button 
                className={style.secondaryButton + " w-full py-2 text-sm"} 
                onClick={() => {
                  const idToCopy = currentUserId || `local-user-${userData?.trainerName || 'trainer'}`;
                  if (navigator.clipboard) {
                    navigator.clipboard.writeText(idToCopy);
                    setMessage('ID copied to clipboard!');
                  } else {
                    const tempInput = document.createElement('textarea');
                    tempInput.value = idToCopy;
                    document.body.appendChild(tempInput);
                    tempInput.select();
                    document.execCommand('copy');
                    document.body.removeChild(tempInput);
                    setMessage('ID copied to clipboard!');
                  }
                }}
              >
                Copy ID
              </button>
            </div>
            
            <div className="p-4 bg-gray-100 rounded-lg border-2 border-gray-300">
              <h3 className="text-xl font-semibold mb-3">Add Friend</h3>
              <input
                type="text"
                value={friendIdInput}
                onChange={(e) => setFriendIdInput(e.target.value)}
                placeholder="Paste Trainer ID here..."
                className={style.input + " mb-3"}
              />
              <button 
                className={style.primaryButton + " w-full"}
                onClick={handleAddFriend}
              >
                Send Friendship Request
              </button>
              {message && <p className={`mt-2 text-sm ${message.startsWith('Error') ? 'text-red-600' : 'text-green-600'}`}>{message}</p>}
            </div>
          </div>
          
          {/* Column 2 & 3: Friend List */}
          <div className="md:col-span-2 space-y-4">
            <h3 className="text-2xl font-semibold text-black">Your Friends ({userData?.friends?.length || 0})</h3>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {loadingFriends ? (
                <p className="text-gray-700">Loading friends data...</p>
              ) : friendsDetail.length === 0 ? (
                <p className="text-gray-700 p-4 bg-gray-100 rounded-lg border-2 border-gray-300">You haven't added any friends yet. Share your ID!</p>
              ) : (
                friendsDetail.map(friend => (
                  <div key={friend.id} className="flex items-center p-3 bg-gray-100 rounded-lg shadow-inner justify-between border-2 border-gray-300 hover:bg-gray-200 transition">
                    <div className="flex items-center space-x-3 flex-grow">
                      <img 
                        src={getGifUrl(friend.trainerGender === 'female' ? 'TrainerFemale' : 'TrainerMale')} 
                        alt="Trainer"
                        style={{ width: '32px', height: '32px', imageRendering: 'pixelated' }}
                        onError={(e) => { e.target.onerror = null; e.target.src = getGifUrl("Placeholder"); }}
                      />
                      <div>
                        <p className="font-semibold text-lg">{friend.trainerName}</p>
                        <p className="text-xs font-mono text-gray-600 break-all">{friend.id}</p>
                      </div>
                    </div>
                    <div className="text-right mr-3">
                      <p className="text-sm text-green-600">Partner: {friend.partnerName}</p>
                      <p className="text-xs text-gray-600">Status: Active</p>
                    </div>
                    <button
                      className={style.button + " bg-blue-600 text-white hover:bg-blue-700 text-sm py-2 px-4"}
                      onClick={() => handleViewFriendProfile(friend)}
                    >
                      View Profile
                    </button>
                  </div>
                ))
              )}
            </div>
            
            <button 
              className={style.button + " bg-red-600 text-white hover:bg-red-700 w-full"}
              onClick={() => setScreen('GROUP_LOBBY')}
            >
              Start/Join Group Session
            </button>
          </div>
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