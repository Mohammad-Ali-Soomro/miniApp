import { useState, useEffect } from 'react';
import useApi from '../hooks/useApi';
import DeckCard from '../components/DeckCard';
import DeckModal from '../components/DeckModal';

export default function DecksPage() {
  const { apiFetch } = useApi();
  const [decks, setDecks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deckToEdit, setDeckToEdit] = useState(null);

  const fetchDecks = async () => {
    try {
      setLoading(true);
      const data = await apiFetch('/decks');
      setDecks(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDecks();
  }, [apiFetch]);

  const handleCreateOrEdit = async (deckData, id) => {
    try {
      if (id) {
        await apiFetch(`/decks/${id}`, {
          method: 'PUT',
          body: JSON.stringify(deckData)
        });
      } else {
        await apiFetch('/decks', {
          method: 'POST',
          body: JSON.stringify(deckData)
        });
      }
      await fetchDecks();
    } catch (err) {
      console.error(err);
      alert('Failed to save deck: ' + err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this deck? All its cards will also be deleted.')) {
      return;
    }
    
    try {
      await apiFetch(`/decks/${id}`, { method: 'DELETE' });
      await fetchDecks();
    } catch (err) {
      console.error(err);
      alert('Failed to delete deck: ' + err.message);
    }
  };

  const openCreateModal = () => {
    setDeckToEdit(null);
    setIsModalOpen(true);
  };

  const openEditModal = (deck) => {
    setDeckToEdit(deck);
    setIsModalOpen(true);
  };

  if (loading && decks.length === 0) {
    return (
      <div className="animate-pulse space-y-8">
        <div className="flex justify-between items-center">
          <div className="h-10 bg-gray-300 w-1/3 rounded border-[3px] border-neo-black"></div>
          <div className="h-10 bg-gray-300 w-32 rounded border-[3px] border-neo-black"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1,2,3].map(k => (
            <div key={k} className="h-[220px] bg-gray-300 border-[3px] border-neo-black rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="neo-card bg-red-400 p-6 text-center text-neo-black">
        <h2 className="text-2xl font-bold">Error Loading Decks</h2>
        <p className="mt-2 font-semibold">{error}</p>
        <button onClick={fetchDecks} className="neo-btn bg-white mt-4 px-4 py-2">Try Again</button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="text-[36px] font-[800] text-neo-black">My Decks</h1>
        <button 
          onClick={openCreateModal}
          className="neo-btn bg-neo-yellow px-6 py-3 w-full md:w-auto"
        >
          + New Deck
        </button>
      </div>

      {decks.length === 0 ? (
        <div className="neo-card bg-neo-white border-dashed p-12 text-center flex flex-col items-center border-[4px]">
          <div className="text-6xl mb-4">🗂️</div>
          <h2 className="text-2xl font-bold mb-2">No decks yet</h2>
          <p className="text-lg text-gray-600 mb-6 font-semibold">Create your first deck and start learning!</p>
          <button 
            onClick={openCreateModal}
            className="neo-btn bg-neo-yellow px-8 py-3"
          >
            Create your first one!
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {decks.map(deck => (
            <DeckCard 
              key={deck.id} 
              deck={deck} 
              onEdit={openEditModal} 
              onDelete={handleDelete} 
            />
          ))}
        </div>
      )}

      <DeckModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={handleCreateOrEdit} 
        deckToEdit={deckToEdit} 
      />
    </div>
  );
}