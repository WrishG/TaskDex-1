import React from 'react';
import { getGifUrl } from '../utils/sprites.js';
import { queryUserByUID } from '../utils/firebaseHelpers.js';
import { getAuth } from 'firebase/auth';
import { doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { app, db } from '../config/firebase.js';

const style = {
  card: "bg-gray-800 p-8 rounded-2xl shadow-2xl border-2 border-gray-700",
  button: "px-6 py-3 rounded-xl font-bold transition-all duration-300 shadow-lg transform hover:scale-105",
  primaryButton: "bg-red-600 text-white hover:bg-red-700",
  secondaryButton: "bg-gray-700 text-white hover:bg-gray-600",
  input: "w-full p-3 rounded-lg bg-gray-900 border-2 border-gray-600 text-white focus:border-red-500 focus:ring-2 focus:ring-red-500",
};

export default function FriendsListScreen({ setScreen, userData }) {
  const [friendIdInput, setFriendIdInput] = React.useState('');
  const [message, setMessage] = React.useState('');
  const [friendsDetail, setFriendsDetail] = React.useState([]);
  const [loadingFriends, setLoadingFriends] = React.useState(false);
  
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
  
  return (
    <div className="flex flex-col items-center min-h-screen p-4 bg-[#1a1a1a] text-white animate-fadeIn">
      <div className={style.card + " max-w-5xl w-full mt-12"}>
        <h2 className="text-5xl font-bold mb-6 text-white">Friends List & Multiplayer Hub</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Column 1: My ID & Copy ID */}
          <div className="md:col-span-1 space-y-4">
            <div className="p-5 bg-gray-900 rounded-xl border-2 border-gray-700 shadow-xl">
              <h3 className="text-xl font-semibold mb-3 text-white">Your Trainer ID</h3>
              <p className="font-mono text-sm break-all text-yellow-400 mb-4 select-all">
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
            
            <div className="p-5 bg-gray-900 rounded-xl border-2 border-gray-700 shadow-xl">
              <h3 className="text-xl font-semibold mb-3 text-white">Add Friend</h3>
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
              {message && <p className={`mt-2 text-sm ${message.startsWith('Error') ? 'text-red-400' : 'text-green-400'}`}>{message}</p>}
            </div>
          </div>
          
          {/* Column 2 & 3: Friend List */}
          <div className="md:col-span-2 space-y-4">
            <h3 className="text-3xl font-semibold text-white">Your Friends ({userData?.friends?.length || 0})</h3>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {loadingFriends ? (
                <p className="text-gray-300">Loading friends data...</p>
              ) : friendsDetail.length === 0 ? (
                <p className="text-gray-300 p-4 bg-gray-900 rounded-xl border-2 border-gray-700">You haven't added any friends yet. Share your ID!</p>
              ) : (
                friendsDetail.map(friend => (
                  <div key={friend.id} className="flex items-center p-4 bg-gray-900 rounded-xl shadow-lg justify-between border-2 border-gray-700 hover:border-gray-600 transition-all duration-300 transform hover:scale-105">
                    <div className="flex items-center space-x-4">
                      <img 
                        src={getGifUrl(friend.trainerGender === 'female' ? 'TrainerFemale' : 'TrainerMale')} 
                        alt="Trainer"
                        style={{ width: '56px', height: '56px', imageRendering: 'pixelated' }}
                        onError={(e) => { e.target.onerror = null; e.target.src = getGifUrl("Placeholder"); }}
                        className="rounded-full"
                      />
                      <div>
                        <p className="font-semibold text-lg text-white">{friend.trainerName}</p>
                        <p className="text-xs font-mono text-gray-400 break-all">{friend.id}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-green-400">Partner: {friend.partnerName}</p>
                      <p className="text-xs text-gray-400">Status: Active</p>
                    </div>
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

