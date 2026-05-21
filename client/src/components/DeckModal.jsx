import { useState, useEffect } from 'react';

export default function DeckModal({ isOpen, onClose, onSave, deckToEdit }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (deckToEdit) {
        setName(deckToEdit.name || '');
        setDescription(deckToEdit.description || '');
      } else {
        setName('');
        setDescription('');
      }
    }
  }, [isOpen, deckToEdit]);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    
    setIsSubmitting(true);
    await onSave({ name, description }, deckToEdit?.id);
    setIsSubmitting(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
         onClick={(e) => {
           if (e.target === e.currentTarget) onClose();
         }}>
      <div className="neo-card w-full max-w-[480px] p-6 bg-white">
        <h2 className="text-2xl font-bold mb-6">
          {deckToEdit ? 'Edit Deck' : 'Create Deck'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-bold mb-1 text-sm">Name</label>
            <input 
              type="text" 
              className="neo-input w-full"
              placeholder="e.g. Spanish Vocabulary"
              value={name}
              onChange={e => setName(e.target.value)}
              required
              autoFocus
            />
          </div>
          <div>
            <label className="block font-bold mb-1 text-sm">Description (optional)</label>
            <textarea 
              className="neo-input w-full min-h-[100px]"
              placeholder="What is this deck about?"
              value={description}
              onChange={e => setDescription(e.target.value)}
            />
          </div>
          <div className="flex gap-4 pt-4">
            <button 
              type="button" 
              className="neo-btn bg-white px-6 py-2 flex-1"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="neo-btn bg-neo-yellow px-6 py-2 flex-1"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}