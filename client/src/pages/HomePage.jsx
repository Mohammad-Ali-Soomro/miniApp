import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import useApi from '../hooks/useApi';

export default function HomePage() {
  const { apiFetch } = useApi();
  const [stats, setStats] = useState(null);
  const [decks, setDecks] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    Promise.all([
      apiFetch('/stats'),
      apiFetch('/decks')
    ])
      .then(([statsData, decksData]) => {
        setStats(statsData);
        setDecks(decksData);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [apiFetch]);

  if (loading) {
    return (
      <div className="animate-pulse space-y-8">
        <div className="h-10 bg-gray-300 w-1/2 rounded border-[3px] border-neo-black"></div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(k => (
            <div key={k} className="h-32 bg-gray-300 border-[3px] border-neo-black rounded"></div>
          ))}
        </div>
        <div className="h-24 bg-gray-300 border-[3px] border-neo-black rounded"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="neo-card bg-red-400 p-6 text-center text-neo-black">
        <h2 className="text-2xl font-bold">Error Loading Dashboard</h2>
        <p className="mt-2 font-semibold">{error}</p>
      </div>
    );
  }

  // Without a specific due count per deck from the backend, we approximate by linking to the largest deck
  const targetDeck = decks?.length > 0 
    ? decks.reduce((prev, current) => (prev.card_count > current.card_count ? prev : current))
    : null;

  return (
    <div className="space-y-12">
      <h1 className="text-[36px] font-[800] text-neo-black">Your Learning Dashboard</h1>
      
      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="neo-card bg-neo-blue p-6 text-center">
          <div className="text-[48px] font-bold leading-none mb-2">{stats.total_decks}</div>
          <div className="text-[16px] font-bold uppercase tracking-wider">Total Decks</div>
        </div>
        
        <div className="neo-card bg-neo-pink p-6 text-center">
          <div className="text-[48px] font-bold leading-none mb-2">{stats.total_cards}</div>
          <div className="text-[16px] font-bold uppercase tracking-wider">Total Cards</div>
        </div>
        
        <div className="neo-card bg-neo-orange p-6 text-center relative">
          {stats.due_today > 0 && (
             <span className="absolute top-3 right-3 bg-neo-black text-neo-white text-xs px-2 py-1 font-bold transform rotate-3">
               ACTION Due
             </span>
          )}
          <div className="text-[48px] font-bold leading-none mb-2">{stats.due_today}</div>
          <div className="text-[16px] font-bold uppercase tracking-wider">Due Today</div>
        </div>
        
        <div className="neo-card bg-neo-yellow p-6 text-center">
          <div className="text-[48px] font-bold leading-none mb-2">{stats.streak}</div>
          <div className="text-[16px] font-bold uppercase tracking-wider">🔥 Streak (Days)</div>
        </div>
      </div>

      {/* Due for Review Banner */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Due for Review</h2>
        {stats.due_today > 0 ? (
          <div className="neo-card bg-neo-green p-6 flex flex-col md:flex-row items-center justify-between border-4">
            <div className="text-2xl font-bold mb-4 md:mb-0">
              You have {stats.due_today} cards to review!
            </div>
            {targetDeck && (
              <Link 
                to={`/study/${targetDeck.id}`} 
                className="neo-btn bg-white hover:bg-neo-yellow px-8 py-3 text-lg no-underline text-neo-black block"
              >
                Start Reviewing
              </Link>
            )}
          </div>
        ) : (
          <div className="neo-card bg-neo-green p-6 border-4">
            <div className="text-2xl font-bold">
              🎉 You're all caught up! No cards due today.
            </div>
          </div>
        )}
      </div>

      {/* Recent Decks */}
      <div>
        <div className="flex justify-between items-center mb-6 border-b-[3px] border-neo-black pb-2">
          <h2 className="text-2xl font-bold">Recent Decks</h2>
          <Link to="/decks" className="font-bold underline hover:text-neo-pink transition-colors">
            View All Decks →
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {decks.slice(0, 3).map(deck => (
            <div key={deck.id} className="neo-card p-6 flex flex-col hover:-translate-y-1 transition-transform">
              <h3 className="text-xl font-bold truncate mb-2">{deck.name}</h3>
              <p className="text-neo-black/70 flex-grow mb-6 line-clamp-2">
                {deck.description || "No description provided."}
              </p>
              
              <div className="mt-auto flex justify-between items-center">
                <span className="bg-neo-black text-neo-white px-3 py-1 font-bold text-sm">
                  {deck.card_count} Cards
                </span>
                <Link 
                  to={`/study/${deck.id}`} 
                  className="neo-btn bg-neo-yellow px-5 py-2 text-sm font-bold no-underline"
                >
                  Study
                </Link>
              </div>
            </div>
          ))}
          
          {decks.length === 0 && (
            <div className="col-span-full neo-card bg-neo-white p-8 text-center border-dashed">
              <p className="text-lg font-bold mb-4">No decks found yet.</p>
              <Link to="/decks" className="neo-btn bg-neo-yellow px-6 py-2">Create your first deck</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}