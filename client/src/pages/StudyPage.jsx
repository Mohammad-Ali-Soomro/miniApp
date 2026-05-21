import { useParams } from 'react-router-dom';

export default function StudyPage() {
  const { id } = useParams();
  
  return (
    <div>
      <h1 className="text-4xl font-bold mb-4">Studying Deck {id}</h1>
    </div>
  );
}