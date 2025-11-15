import React from 'react';
import { formatTime } from '../utils/formatTime.js';
import { getRandomWildPokemon } from '../data/pokemonData.js';
import { getGifUrl } from '../utils/sprites.js';
import { getTypeHoverColor, getTypeBorderColor, getTypeBgColor, getTypeRingColor } from '../utils/typeColors.js';

const style = {
  card: "bg-white p-8 rounded-2xl shadow-2xl border-2 border-black",
  button: "px-6 py-3 rounded-xl font-bold transition-all duration-300 shadow-lg transform hover:scale-105",
  secondaryButton: "bg-gray-800 text-white hover:bg-gray-900",
};

export default function PomodoroRunningScreen({ setScreen, sessionConfig, userData, handleSessionComplete, saveCaughtPokemon }) {
  const workDuration = sessionConfig?.studyTime || 30;
  const breakDuration = sessionConfig?.restTime || 5;
  const numSessions = sessionConfig?.numSessions || 4;
  const taskName = sessionConfig?.taskName || 'Focus Session';
  const sessionType = sessionConfig?.type || 'Fire';
  
  // State for current session tracking
  const [currentSession, setCurrentSession] = React.useState(1);
  const [isWorkPhase, setIsWorkPhase] = React.useState(true);
  const [timeLeft, setTimeLeft] = React.useState(workDuration * 60);
  const [isRunning, setIsRunning] = React.useState(true);
  const [completedSessions, setCompletedSessions] = React.useState(0);
  const [timerKey, setTimerKey] = React.useState(0);
  
  // Pokemon encounter state (shown after work phase completes)
  const [showEncounterScreen, setShowEncounterScreen] = React.useState(false);
  const [encounters, setEncounters] = React.useState([]);
  const [expGained, setExpGained] = React.useState(0);
  const [selectedMonIds, setSelectedMonIds] = React.useState([]);
  const [caughtMonIds, setCaughtMonIds] = React.useState([]);
  const [isSaving, setIsSaving] = React.useState(false);
  
  const timerRef = React.useRef(null);
  
  // Refs to track current values
  const currentSessionRef = React.useRef(currentSession);
  const isWorkPhaseRef = React.useRef(isWorkPhase);
  
  // Keep refs in sync with state
  React.useEffect(() => {
    currentSessionRef.current = currentSession;
    isWorkPhaseRef.current = isWorkPhase;
  }, [currentSession, isWorkPhase]);
  
  // Calculate encounters and EXP when work completes
  const calculateEncounters = React.useCallback((durationMinutes, type) => {
    const totalEncounters = Math.floor(durationMinutes / 10);
    const expGain = Math.floor(durationMinutes / 30 * 100);
    
    const wildPokemon = [];
    for (let i = 0; i < totalEncounters; i++) {
      const wildMonData = getRandomWildPokemon(type);
      if (wildMonData) {
        wildPokemon.push(wildMonData);
      }
    }
    
    return { encounters: wildPokemon, expGain };
  }, []);
  
  // Timer logic
  React.useEffect(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    if (!isRunning || showEncounterScreen) {
      return;
    }
    
    timerRef.current = setInterval(() => {
      setTimeLeft((prevTime) => {
        const newTime = prevTime - 1;
        
        if (newTime <= 0) {
          if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
          }
          
          setTimeout(() => {
            const currentPhase = isWorkPhaseRef.current;
            const currentSessionNum = currentSessionRef.current;
            
            if (currentPhase) {
              // Work phase completed - show encounter screen
              const { encounters: newEncounters, expGain } = calculateEncounters(workDuration, sessionType);
              setEncounters(newEncounters);
              setExpGained(expGain);
              setSelectedMonIds([]);
              setCaughtMonIds([]);
              setShowEncounterScreen(true);
              setIsRunning(false);
              
              // Update EXP
              if (handleSessionComplete) {
                handleSessionComplete(workDuration, sessionType, true);
              }
            } else {
              // Break phase completed - move to next session
              if (currentSessionNum < numSessions) {
                setCompletedSessions(prev => prev + 1);
                setCurrentSession(prev => prev + 1);
                setIsWorkPhase(true);
                setTimeLeft(workDuration * 60);
                setTimerKey(prev => prev + 1);
                setIsRunning(true);
              } else {
                // All sessions complete
                setCompletedSessions(prev => prev + 1);
                setScreen('MAIN_MENU');
              }
            }
          }, 0);
          
          return 0;
        }
        return newTime;
      });
    }, 1000);
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isRunning, isWorkPhase, timerKey, numSessions, workDuration, breakDuration, sessionType, calculateEncounters, handleSessionComplete, setScreen, showEncounterScreen]);
  
  const handleEndSession = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    const currentPhase = isWorkPhaseRef.current;
    
    if (currentPhase) {
      // Ending during work: show encounter screen
      const { encounters: newEncounters, expGain } = calculateEncounters(workDuration, sessionType);
      setEncounters(newEncounters);
      setExpGained(expGain);
      setSelectedMonIds([]);
      setCaughtMonIds([]);
      setShowEncounterScreen(true);
      setIsRunning(false);
      
      // Update EXP
      if (handleSessionComplete) {
        handleSessionComplete(workDuration, sessionType, true);
      }
    } else {
      // Ending during break: go back to menu
      setScreen('MAIN_MENU');
    }
  };
  
  const handleSkip = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    const currentPhase = isWorkPhaseRef.current;
    const currentSessionNum = currentSessionRef.current;
    
    if (currentPhase) {
      // Skipping during work: show encounter screen
      const { encounters: newEncounters, expGain } = calculateEncounters(workDuration, sessionType);
      setEncounters(newEncounters);
      setExpGained(expGain);
      setSelectedMonIds([]);
      setCaughtMonIds([]);
      setShowEncounterScreen(true);
      setIsRunning(false);
      
      // Update EXP
      if (handleSessionComplete) {
        handleSessionComplete(workDuration, sessionType, true);
      }
    } else {
      // Skipping during break: move to next session
      setCompletedSessions(prev => prev + 1);
      
      const nextSession = currentSessionNum + 1;
      if (nextSession <= numSessions) {
        setCurrentSession(nextSession);
        setIsWorkPhase(true);
        setTimeLeft(workDuration * 60);
        setTimerKey(prev => prev + 1);
        setIsRunning(true);
      } else {
        setScreen('MAIN_MENU');
      }
    }
  };
  
  const handleSelectMon = (index) => {
    if (caughtMonIds.includes(index)) {
      return;
    }
    
    setSelectedMonIds(prev => {
      if (prev.includes(index)) {
        return prev.filter(mid => mid !== index);
      } else if (prev.length < 2) {
        return [...prev, index];
      }
      return prev;
    });
  };
  
  const handleCatchPokemon = async () => {
    if (selectedMonIds.length === 0 || isSaving || !saveCaughtPokemon) return;
    
    setIsSaving(true);
    const caughtMonNames = encounters
      .filter((_, index) => selectedMonIds.includes(index))
      .map(mon => mon.name);
    
    await saveCaughtPokemon(caughtMonNames, expGained);
    setIsSaving(false);
    
    // Mark these pokemon as caught
    setCaughtMonIds(prev => [...prev, ...selectedMonIds]);
    setSelectedMonIds([]);
  };
  
  const handleProceedToBreak = () => {
    // After catching pokemon, start break
    setShowEncounterScreen(false);
    setIsWorkPhase(false);
    setTimeLeft(breakDuration * 60);
    setEncounters([]);
    setSelectedMonIds([]);
    setCaughtMonIds([]);
    setTimerKey(prev => prev + 1);
    setIsRunning(true);
  };
  
  // Status text
  const statusText = isWorkPhase 
    ? `Work Session ${currentSession}/${numSessions}`
    : `Break Time ${currentSession}/${numSessions}`;
  
  const isBreak = !isWorkPhase;
  const headerColor = isBreak ? 'text-green-600' : 'text-red-600';
  const totalTime = isBreak ? breakDuration * 60 : workDuration * 60;
  const progress = totalTime > 0 ? (1 - (timeLeft / totalTime)) * 100 : 0;
  
  // Show encounter screen
  if (showEncounterScreen) {
    return (
      <div className="flex flex-col items-center min-h-screen p-4 bg-white text-black animate-fadeIn">
        <div className={style.card + " max-w-2xl w-full mt-12"}>
          <h2 className="text-4xl font-bold mb-3 text-center text-green-600">Session Complete!</h2>
          <p className="text-lg text-gray-700 mb-8 text-center">
            Your partner gained <span className="font-bold text-yellow-600">{Math.floor(expGained)} EXP!</span>
          </p>
          
          {encounters.length > 0 ? (
            <>
              <h3 className="text-2xl font-bold mb-4 text-center text-black">Wild Pokémon Encounter ({encounters.length} Found)</h3>
              <p className="text-gray-700 mb-6 text-center">Select up to 2 Pokémon to catch</p>
              
              <div className="grid grid-cols-3 gap-4 mb-6">
                {encounters.map((mon, index) => {
                  const isSelected = selectedMonIds.includes(index);
                  const isCaught = caughtMonIds.includes(index);
                  const typeHoverClass = getTypeHoverColor(mon.type);
                  const typeBorderClass = getTypeBorderColor(mon.type);
                  const typeBgClass = getTypeBgColor(mon.type);
                  const typeRingClass = getTypeRingColor(mon.type);
                  
                  return (
                    <div
                      key={index}
                      className={`p-3 rounded-lg transition-all duration-200 border-2 relative transform hover:scale-110 ${
                        isCaught
                          ? 'border-gray-400 bg-gray-200 opacity-60 cursor-not-allowed'
                          : isSelected
                          ? `cursor-pointer ${typeBorderClass} ${typeBgClass} ring-4 ${typeRingClass} scale-105 shadow-xl`
                          : `cursor-pointer border-gray-300 bg-white ${typeHoverClass} hover:ring-2`
                      }`}
                      onClick={() => !isCaught && handleSelectMon(index)}
                    >
                      {isCaught && (
                        <div className="absolute top-1 right-1 bg-green-500 rounded-full w-6 h-6 flex items-center justify-center">
                          <span className="text-white text-xs font-bold">✓</span>
                        </div>
                      )}
                      <img
                        src={getGifUrl(mon.name)}
                        alt={mon.name}
                        className="mx-auto mb-1"
                        style={{ imageRendering: 'pixelated', width: '64px', height: '64px' }}
                        onError={(e) => { e.target.onerror = null; e.target.src = getGifUrl("Placeholder"); }}
                      />
                      <p className="font-semibold text-sm text-center text-black">{mon.name}</p>
                      <p className="text-xs text-gray-600 text-center">{mon.type}</p>
                    </div>
                  );
                })}
              </div>
              
              {selectedMonIds.length > 0 && (
                <button
                  className={style.button + " bg-green-600 text-white hover:bg-green-700 w-full mb-4"}
                  onClick={handleCatchPokemon}
                  disabled={isSaving}
                >
                  {isSaving ? 'Saving...' : `Catch ${selectedMonIds.length} Pokémon`}
                </button>
              )}
              
              <button
                className={style.button + " bg-blue-600 text-white hover:bg-blue-700 w-full"}
                onClick={handleProceedToBreak}
              >
                Proceed to Break
              </button>
            </>
          ) : (
            <div className="text-center">
              <p className="text-gray-700 mb-6">No Pokémon encountered this session.</p>
              <button
                className={style.button + " bg-blue-600 text-white hover:bg-blue-700 w-full"}
                onClick={handleProceedToBreak}
              >
                Proceed to Break
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col items-center min-h-screen p-4 bg-white text-black animate-fadeIn">
      <div className={style.card + " max-w-2xl w-full mt-12"}>
        {/* Task Name */}
        <h2 className={`text-4xl font-bold mb-6 text-center ${headerColor}`}>
          {taskName}
        </h2>
        
        {/* Timer Display */}
        <div className="text-center mb-6">
          <div className="text-8xl font-mono font-extrabold mb-4 text-black bg-gray-100 p-6 rounded-lg shadow-inner border-2 border-black">
            {formatTime(timeLeft)}
          </div>
          
          {/* Status Text */}
          <p className="text-gray-700 text-xl mb-4 font-semibold">
            {statusText}
          </p>
          
          {/* Visual Tracker Dots */}
          <div className="flex justify-center items-center space-x-2 mb-4">
            {Array.from({ length: numSessions }, (_, i) => {
              const sessionNum = i + 1;
              const isCompleted = sessionNum <= completedSessions;
              return (
                <span
                  key={sessionNum}
                  className={`text-3xl ${isCompleted ? 'text-green-600' : 'text-gray-300'}`}
                >
                  ●
                </span>
              );
            })}
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full bg-gray-300 rounded-full h-3 mb-8">
          <div 
            className={`h-3 rounded-full transition-all duration-300 ${isBreak ? 'bg-green-500' : 'bg-red-500'}`} 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        
        {/* Controls */}
        <div className="flex justify-center space-x-4">
          <button
            className={style.button + " " + style.secondaryButton}
            onClick={() => setIsRunning(!isRunning)}
          >
            {isRunning ? 'Pause' : 'Resume'}
          </button>
          <button
            className={style.button + " bg-yellow-500 text-black hover:bg-yellow-600"}
            onClick={handleSkip}
          >
            Skip Session
          </button>
          <button
            className={style.button + " bg-red-600 text-white hover:bg-red-700"}
            onClick={handleEndSession}
          >
            End Session
          </button>
        </div>
      </div>
    </div>
  );
}
