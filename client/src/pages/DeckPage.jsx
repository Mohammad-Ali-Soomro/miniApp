import { useParams } from 'react-router-dom';

export default function DeckPage() {
  const { id } = useParams();
  
  return (
    <div>
      <h1 className="text-4xl font-bold mb-4">Deck Details (ID: {id})</h1>
    </div>
  );
}