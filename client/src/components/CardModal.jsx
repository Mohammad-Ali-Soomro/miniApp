import { useState, useEffect } from 'react';

export default function CardModal({ isOpen, onClose, onSave, cardToEdit }) {
  const [front, setFront] = useState('');
  const [back, setBack] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (cardToEdit) {
        setFront(cardToEdit.front || '');
        setBack(cardToEdit.back || '');
      } else {
        setFront('');
        setBack('');
      }
    }
  }, [isOpen, cardToEdit]);

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
    if (!front.trim() || !back.trim()) return;
    
    setIsSubmitting(true);
    await onSave({ front, back }, cardToEdit?.id);
    setIsSubmitting(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
         onClick={(e) => {
           if (e.target === e.currentTarget) onClose();
         }}>
      <div className="neo-card w-full max-w-[600px] p-6 bg-white overflow-y-auto max-h-[90vh]">
        <h2 className="text-2xl font-bold mb-6">
          {cardToEdit ? 'Edit Flashcard' : 'Create Flashcard'}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1 space-y-4">
              <div>
                <label className="block font-bold mb-1 text-sm bg-neo-yellow inline-block px-1">What's the prompt?</label>
                <textarea 
                  className="neo-input w-full min-h-[120px] resize-y"
                  placeholder="e.g. What is the capital of France?"
                  value={front}
                  onChange={e => setFront(e.target.value)}
                  required
                  autoFocus
                />
              </div>
              <div>
                <label className="block font-bold mb-1 text-sm bg-neo-pink inline-block px-1">What's the answer?</label>
                <textarea 
                  className="neo-input w-full min-h-[120px] resize-y"
                  placeholder="e.g. Paris"
                  value={back}
                  onChange={e => setBack(e.target.value)}
                  required
                />
              </div>
            </div>
            
            <div className="flex-1">
              <label className="block font-bold mb-1 text-sm">Mini Preview (Front → Back)</label>
              <div className="neo-card bg-neo-white p-4 h-full flex flex-col items-center justify-center text-center gap-4 relative">
                <div className="absolute top-2 left-2 flex gap-1">
                  <span className="w-3 h-3 bg-neo-yellow border-2 border-neo-black rounded-full"></span>
                  <span className="w-3 h-3 bg-neo-pink border-2 border-neo-black rounded-full"></span>
                </div>
                
                <div className="w-full">
                  <span className="text-xs uppercase font-bold text-gray-500 mb-1 block">Front</span>
                  <div className="font-bold break-words">{front || '...'}</div>
                </div>
                <div className="text-2xl opacity-50">↓</div>
                <div className="w-full">
                  <span className="text-xs uppercase font-bold text-gray-500 mb-1 block">Back</span>
                  <div className="text-gray-700 break-words">{back || '...'}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-4 pt-4 border-t-2 border-neo-black border-dashed">
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
              {isSubmitting ? 'Saving...' : 'Save Card'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}