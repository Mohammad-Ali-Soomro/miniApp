import { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import useApi from '../hooks/useApi';

export default function StudyPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { apiFetch } = useApi();
  
  const [deck, setDeck] = useState(null);
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [sessionDone, setSessionDone] = useState(false);
  const [isSubmittingRate, setIsSubmittingRate] = useState(false);

  const [sessionStats, setSessionStats] = useState({
    correct: 0,
    hard: 0,
    wrong: 0
  });

  const fetchStudyData = useCallback(async () => {
    try {
      setLoading(true);
      const [decksData, studyCards] = await Promise.all([
        apiFetch(`/decks`),
        apiFetch(`/decks/${id}/study`)
      ]);
      
      const foundDeck = decksData.find(d => d.id.toString() === id);
      if (!foundDeck) throw new Error("Deck not found");

      setDeck(foundDeck);
      setCards(studyCards);
      
      // Reset state for new round
      setCurrentIndex(0);
      setIsFlipped(false);
      setSessionDone(false);
      setSessionStats({ correct: 0, hard: 0, wrong: 0 });
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [id, apiFetch]);

  useEffect(() => {
    fetchStudyData();
  }, [fetchStudyData]);

  const handleRate = async (quality) => {
    if (isSubmittingRate) return;
    setIsSubmittingRate(true);
    
    try {
      const card = cards[currentIndex];
      await apiFetch(`/cards/${card.id}/review`, {
        method: 'POST',
        body: JSON.stringify({ quality })
      });
      
      setSessionStats(prev => {
        const nextStats = { ...prev };
        if (quality <= 1) nextStats.wrong++;
        else if (quality === 2) nextStats.hard++;
        else nextStats.correct++;
        return nextStats;
      });

      if (currentIndex >= cards.length - 1) {
        setSessionDone(true);
      } else {
        setCurrentIndex(prev => prev + 1);
        setIsFlipped(false);
      }
    } catch (err) {
      console.error(err);
      alert('Failed to save review: ' + err.message);
    } finally {
      setIsSubmittingRate(false);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (loading || sessionDone || cards.length === 0 || isSubmittingRate) return;
      
      if (e.code === 'Space') {
        e.preventDefault();
        if (!isFlipped) setIsFlipped(true);
      }

      if (isFlipped && !e.repeat) {
        switch(e.key) {
          case '1': e.preventDefault(); handleRate(0); break;
          case '2': e.preventDefault(); handleRate(2); break;
          case '3': e.preventDefault(); handleRate(4); break;
          case '4': e.preventDefault(); handleRate(5); break;
          default: break;
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFlipped, loading, sessionDone, cards.length, isSubmittingRate, currentIndex]); // Dependencies important for fresh state inside closure

  if (loading) {
    return (
      <div className="animate-pulse space-y-8 max-w-2xl mx-auto mt-12 text-center">
        <div className="h-4 bg-gray-300 w-1/3 mx-auto rounded"></div>
        <div className="h-8 bg-gray-300 w-full rounded border-[3px] border-neo-black"></div>
        <div className="h-[320px] bg-gray-300 border-[3px] border-neo-black rounded"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="neo-card bg-red-400 p-6 text-center text-neo-black max-w-2xl mx-auto mt-12">
        <h2 className="text-2xl font-bold">Failed to Load Session</h2>
        <p className="mt-2 font-semibold">{error}</p>
        <Link to={`/decks/${id}`} className="neo-btn bg-white mt-4 px-4 py-2 inline-block no-underline">Back to Deck</Link>
      </div>
    );
  }

  if (cards.length === 0) {
    return (
      <div className="neo-card bg-neo-green p-12 text-center max-w-2xl mx-auto mt-12 border-[4px]">
        <div className="text-[80px] mb-6 leading-none">🎉</div>
        <h2 className="text-3xl font-bold mb-4">No cards due in this deck!</h2>
        <p className="text-xl mb-8 font-semibold">You're all caught up for now.</p>
        <Link to={`/decks/${id}`} className="neo-btn bg-neo-yellow px-8 py-3 text-lg font-bold inline-block no-underline">
          Back to Deck
        </Link>
      </div>
    );
  }

  if (sessionDone) {
    const total = sessionStats.correct + sessionStats.hard + sessionStats.wrong;
    const correctPercentage = Math.round((sessionStats.correct / total) * 100) || 0;
    
    return (
      <div className="max-w-2xl mx-auto mt-8">
        <div className="neo-card bg-white p-8 md:p-12 text-center border-[4px]">
          <h1 className="text-4xl font-[800] mb-6">Session Complete! 🎓</h1>
          
          <div className="flex justify-center items-center gap-12 mb-10 pb-10 border-b-[3px] border-neo-black border-dashed">
            <div className="text-center">
              <div className="text-[64px] font-bold leading-none">{total}</div>
              <div className="font-bold uppercase tracking-wider text-sm mt-2">Cards Reviewed</div>
            </div>
            <div className="text-center">
              <div className="text-[64px] font-bold leading-none text-neo-blue">{correctPercentage}%</div>
              <div className="font-bold uppercase tracking-wider text-sm mt-2">Correct Rate</div>
            </div>
          </div>

          <div className="flex justify-center gap-6 mb-10 flex-wrap">
            <span className="bg-neo-blue text-white px-4 py-2 font-bold border-2 border-neo-black shadow-[2px_2px_0px_#1A1A1A]">
              Good/Perfect: {sessionStats.correct}
            </span>
            <span className="bg-neo-orange px-4 py-2 font-bold border-2 border-neo-black shadow-[2px_2px_0px_#1A1A1A]">
              Hard: {sessionStats.hard}
            </span>
            <span className="bg-red-500 text-white px-4 py-2 font-bold border-2 border-neo-black shadow-[2px_2px_0px_#1A1A1A]">
              Blackout: {sessionStats.wrong}
            </span>
          </div>

          <div className="flex gap-4 justify-center flex-col sm:flex-row">
            <button 
              onClick={fetchStudyData}
              className="neo-btn bg-neo-yellow px-8 py-3 text-lg font-bold"
            >
              Study Again
            </button>
            <Link 
              to={`/decks/${id}`}
              className="neo-btn bg-neo-white px-8 py-3 text-lg font-bold no-underline"
            >
              Back to Deck
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const currentCard = cards[currentIndex];
  // Calculate progress safely
  const progressPercent = Math.round((currentIndex / cards.length) * 100);

  return (
    <div className="max-w-[700px] mx-auto mt-4 px-2">
      <div className="mb-4 text-center font-bold pb-4 border-b-2 border-neo-black border-dashed flex justify-between items-center">
        <Link to={`/decks/${id}`} className="hover:underline">← Exit Study</Link>
        <div className="text-xl">Studying: <span className="underline decoration-4 decoration-neo-yellow">{deck?.name}</span></div>
        <div className="w-[100px]"></div> {/* Spacer for center alignment */}
      </div>

      <div className="mb-8 relative">
        <div className="text-center font-bold mb-2">
          Card {currentIndex + 1} of {cards.length}
        </div>
        <div className="w-full h-4 border-[3px] border-neo-black bg-white rounded-sm overflow-hidden">
          <div 
            className="h-full bg-neo-yellow border-r-[3px] border-neo-black transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      <div className="w-full max-w-[560px] h-[320px] mx-auto [perspective:1000px] mb-8 relative">
        <div 
          className={`relative w-full h-full transition-transform duration-500 [transform-style:preserve-3d] ${isFlipped ? '[transform:rotateY(180deg)]' : ''}`}
          onClick={() => { if (!isFlipped) setIsFlipped(true); }}
        >
          {/* Front */}
          <div className="neo-card absolute inset-0 w-full h-full [backface-visibility:hidden] flex flex-col items-center justify-center p-8 bg-white cursor-pointer hover:bg-gray-50 border-[4px]">
            <h2 className="text-2xl md:text-[28px] font-bold text-center leading-tight">
              {currentCard.front}
            </h2>
            <div className="absolute bottom-6 font-bold tracking-widest uppercase text-sm border-b-[3px] border-neo-yellow pb-1">
              Click to reveal answer
            </div>
          </div>

          {/* Back */}
          <div className="neo-card absolute inset-0 w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)] flex flex-col items-center justify-center p-8 bg-neo-yellow border-[4px]">
            <p className="absolute top-6 font-bold tracking-widest uppercase text-sm border-b-[3px] border-neo-black pb-1">
              You answered:
            </p>
            <h2 className="text-2xl md:text-[28px] font-bold text-center leading-tight">
              {currentCard.back}
            </h2>
          </div>
        </div>
        
        {/* Loading overlay for submissions */}
        {isSubmittingRate && (
          <div className="absolute inset-0 bg-white/50 z-10 flex items-center justify-center">
            <div className="font-bold text-xl animate-pulse">Saving...</div>
          </div>
        )}
      </div>

      {/* Buttons */}
      <div className={`transition-opacity duration-300 ${isFlipped ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
          <button 
            onClick={() => handleRate(0)}
            disabled={isSubmittingRate}
            className="neo-btn bg-red-400 text-neo-black py-4 px-2 text-sm sm:text-base border-[3px]"
          >
            <div className="text-xl mb-1">😵</div>
            Blackout
          </button>
          <button 
            onClick={() => handleRate(2)}
            disabled={isSubmittingRate}
            className="neo-btn bg-neo-orange text-neo-black py-4 px-2 text-sm sm:text-base border-[3px]"
          >
            <div className="text-xl mb-1">😬</div>
            Hard
          </button>
          <button 
            onClick={() => handleRate(4)}
            disabled={isSubmittingRate}
            className="neo-btn bg-neo-blue text-neo-black py-4 px-2 text-sm sm:text-base border-[3px]"
          >
            <div className="text-xl mb-1">🤔</div>
            Good
          </button>
          <button 
            onClick={() => handleRate(5)}
            disabled={isSubmittingRate}
            className="neo-btn bg-neo-green text-neo-black py-4 px-2 text-sm sm:text-base border-[3px]"
          >
            <div className="text-xl mb-1">⚡</div>
            Perfect
          </button>
        </div>
        <div className="text-center font-bold text-gray-500 text-sm mt-6">
          Keyboard shortcuts: <span className="bg-gray-200 px-2 py-1 rounded border-2 border-gray-400 mx-1">Space</span> to flip, <span className="bg-gray-200 px-2 py-1 rounded border-2 border-gray-400 mx-1">1-4</span> to rate
        </div>
      </div>
    </div>
  );
}