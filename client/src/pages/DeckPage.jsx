import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import useApi from '../hooks/useApi';
import CardModal from '../components/CardModal';

export default function DeckPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { apiFetch } = useApi();
  
  const [deck, setDeck] = useState(null);
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cardToEdit, setCardToEdit] = useState(null);

  const fetchDeckData = async () => {
    try {
      setLoading(true);
      // Fetch all decks and cards in parallel
      const [decksData, cardsData] = await Promise.all([
        apiFetch('/decks'),
        apiFetch(`/decks/${id}/cards`)
      ]);
      
      const foundDeck = decksData.find(d => d.id.toString() === id);
      if (!foundDeck) {
        throw new Error('Deck not found');
      }
      
      setDeck(foundDeck);
      setCards(cardsData);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeckData();
  }, [id, apiFetch]);

  const handleCreateOrEditCard = async (cardData, cardId) => {
    try {
      if (cardId) {
        await apiFetch(`/cards/${cardId}`, {
          method: 'PUT',
          body: JSON.stringify(cardData)
        });
      } else {
        await apiFetch(`/decks/${id}/cards`, {
          method: 'POST',
          body: JSON.stringify(cardData)
        });
      }
      await fetchDeckData();
    } catch (err) {
      console.error(err);
      alert('Failed to save card: ' + err.message);
    }
  };

  const handleDeleteCard = async (cardId) => {
    if (!window.confirm('Are you sure you want to delete this card?')) return;
    
    try {
      await apiFetch(`/cards/${cardId}`, { method: 'DELETE' });
      await fetchDeckData();
    } catch (err) {
      console.error(err);
      alert('Failed to delete card: ' + err.message);
    }
  };

  const openCreateModal = () => {
    setCardToEdit(null);
    setIsModalOpen(true);
  };

  const openEditModal = (card) => {
    setCardToEdit(card);
    setIsModalOpen(true);
  };

  if (loading && !deck) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-6 bg-gray-300 w-1/4 rounded mb-8"></div>
        <div className="h-12 bg-gray-300 w-1/2 rounded border-[3px] border-neo-black mb-4"></div>
        <div className="h-16 bg-gray-300 w-full rounded mb-8"></div>
        <div className="space-y-4">
          {[1,2,3,4].map(k => <div key={k} className="h-20 bg-gray-300 border-[3px] border-neo-black rounded"></div>)}
        </div>
      </div>
    );
  }

  if (error || !deck) {
    return (
      <div className="neo-card bg-red-400 p-6 text-center text-neo-black">
        <h2 className="text-2xl font-bold">Failed to Load Deck</h2>
        <p className="mt-2 font-semibold">{error || 'Deck not found.'}</p>
        <Link to="/decks" className="neo-btn bg-white mt-4 px-4 py-2 inline-block no-underline">Back to Decks</Link>
      </div>
    );
  }

  const now = new Date();
  const dueTodayCount = cards.filter(c => new Date(c.next_review) <= now).length;

  return (
    <div>
      <div className="mb-6 font-bold text-lg">
        <Link to="/decks" className="hover:underline hover:bg-neo-yellow px-1">← My Decks</Link>
        <span className="text-gray-500 mx-2">/</span>
        <span>{deck.name}</span>
      </div>

      <div className="mb-8">
        <h1 className="text-[36px] font-[800] text-neo-black leading-tight mb-2">
          {deck.name}
        </h1>
        {deck.description && (
          <p className="text-lg text-gray-700 max-w-2xl">{deck.description}</p>
        )}
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-8 pb-6 border-b-[3px] border-neo-black">
        <div className="flex gap-4 w-full md:w-auto">
          <span className="border-[3px] border-neo-black bg-neo-white px-4 py-2 font-bold whitespace-nowrap">
            {cards.length} cards total
          </span>
          <span className={`border-[3px] border-neo-black px-4 py-2 font-bold whitespace-nowrap ${dueTodayCount > 0 ? 'bg-neo-orange' : 'bg-neo-white'}`}>
            {dueTodayCount} due today
          </span>
        </div>
        <div className="flex gap-4 w-full md:w-auto">
          <button 
            onClick={openCreateModal}
            className="neo-btn bg-neo-yellow px-6 py-2 flex-grow md:flex-grow-0"
          >
            + Add Card
          </button>
          <button
            onClick={() => navigate(`/study/${id}`)}
            className="neo-btn bg-neo-green px-6 py-2 font-bold flex-grow md:flex-grow-0"
            disabled={cards.length === 0}
          >
            Study Deck →
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {cards.length === 0 ? (
          <div className="neo-card bg-neo-white border-dashed p-12 text-center flex flex-col items-center border-[4px]">
            <div className="text-6xl mb-4">📇</div>
            <h2 className="text-2xl font-bold mb-2">No cards yet</h2>
            <p className="text-lg text-gray-600 mb-6 font-semibold">Add your first flashcard to get started!</p>
            <button 
              onClick={openCreateModal}
              className="neo-btn bg-neo-yellow px-8 py-3 text-xl"
            >
              + Create Card
            </button>
          </div>
        ) : (
          cards.map(card => {
            const dueDate = new Date(card.next_review);
            const isDue = dueDate <= now;
            const formattedDate = dueDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });

            return (
              <div key={card.id} className="neo-card bg-white p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4 hover:-translate-y-1 transition-transform">
                <div className="flex-1 min-w-0 w-full flex items-center">
                  <div className="font-bold truncate w-5/12 text-lg px-2 border-l-4 border-neo-yellow">{card.front}</div>
                  <div className="px-4 text-2xl font-bold text-gray-400">→</div>
                  <div className="text-neo-black/70 w-5/12 truncate px-2 border-l-4 border-neo-pink">{card.back}</div>
                </div>
                
                <div className="flex items-center gap-4 flex-shrink-0 w-full sm:w-auto justify-between sm:justify-end mt-2 sm:mt-0 px-2 sm:px-0">
                  {isDue ? (
                    <span className="bg-red-500 text-white font-bold px-2 py-1 text-xs uppercase tracking-wide border-2 border-neo-black shadow-[2px_2px_0px_#1A1A1A]">
                      Due Now
                    </span>
                  ) : (
                    <span className="bg-gray-200 text-gray-800 font-bold px-2 py-1 text-xs uppercase tracking-wide border-2 border-neo-black">
                      Due: {formattedDate}
                    </span>
                  )}
                  <div className="flex gap-2">
                    <button onClick={() => openEditModal(card)} className="text-lg hover:scale-110 transition-transform bg-white border-2 border-neo-black shadow-[2px_2px_0px_#1A1A1A] w-8 h-8 flex items-center justify-center" title="Edit">✏️</button>
                    <button onClick={() => handleDeleteCard(card.id)} className="text-lg hover:scale-110 transition-transform bg-white border-2 border-neo-black shadow-[2px_2px_0px_#1A1A1A] w-8 h-8 flex items-center justify-center" title="Delete">🗑️</button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      <CardModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={handleCreateOrEditCard} 
        cardToEdit={cardToEdit} 
      />
    </div>
  );
}