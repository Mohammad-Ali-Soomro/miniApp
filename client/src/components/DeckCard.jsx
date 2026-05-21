import { useNavigate, Link } from 'react-router-dom';

const COLORS = ['bg-neo-yellow', 'bg-neo-pink', 'bg-neo-blue', 'bg-neo-green', 'bg-neo-orange'];

export default function DeckCard({ deck, onEdit, onDelete }) {
  const navigate = useNavigate();
  const topColor = COLORS[deck.id % 5] || COLORS[0];

  return (
    <div 
      className="neo-card flex flex-col hover:-translate-y-1 transition-transform cursor-pointer relative overflow-hidden"
      onClick={(e) => {
        if(e.target.closest('button') || e.target.closest('a')) return;
        navigate(`/decks/${deck.id}`);
      }}
    >
      {deck.due_count > 0 && (
        <div className="absolute top-2 right-2 z-10 animate-pulse bg-neo-orange border-[2px] border-neo-black px-2 py-1 text-xs font-bold shadow-[2px_2px_0px_#1A1A1A]">
          {deck.due_count} Due
        </div>
      )}
      <div className={`h-[6px] w-full ${topColor} absolute top-0 left-0 border-b-[3px] border-neo-black`}></div>
      <div className="p-5 pt-8 flex-grow flex flex-col bg-white">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-bold truncate pr-3">{deck.name}</h3>
          <div className="flex gap-2">
            <button onClick={(e) => { e.stopPropagation(); onEdit(deck); }} className="text-lg hover:scale-110 transition-transform" title="Edit">✏️</button>
            <button onClick={(e) => { e.stopPropagation(); onDelete(deck.id); }} className="text-lg hover:scale-110 transition-transform" title="Delete">🗑️</button>
          </div>
        </div>
        <p className="text-neo-black/70 flex-grow mb-5 line-clamp-2">
          {deck.description || 'No description provided.'}
        </p>
        <div className="mb-4">
          <span className="border-[2px] border-neo-black px-2 py-1 text-xs font-bold">
            {deck.card_count || 0} cards
          </span>
        </div>
        <Link 
          to={`/study/${deck.id}`} 
          className="neo-btn bg-neo-blue w-full text-center py-2 no-underline text-neo-black"
          onClick={(e) => e.stopPropagation()}
        >
          Study Now →
        </Link>
      </div>
    </div>
  );
}