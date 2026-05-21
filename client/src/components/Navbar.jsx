import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const getLinkClasses = (path) => {
    const isActive = path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);
    return `neo-btn px-4 py-2 text-sm no-underline text-neo-black block md:inline-block transition-all ${
      isActive 
        ? 'bg-neo-yellow underline decoration-[3px] underline-offset-4 border-b-[3px] border-b-neo-black' 
        : 'bg-white hover:bg-neo-yellow'
    }`;
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-neo-yellow border-b-[3px] border-neo-black z-50 px-6">
      <div className="h-16 flex items-center justify-between max-w-[1100px] mx-auto">
        <Link to="/" className="text-2xl font-bold text-neo-black no-underline z-50">
          ⚡ SpacedOut
        </Link>
        
        {/* Desktop Menu */}
        <div className="hidden md:flex gap-4">
          <Link to="/" className={getLinkClasses('/')}>Home</Link>
          <Link to="/decks" className={getLinkClasses('/decks')}>My Decks</Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          className="md:hidden neo-btn bg-white px-3 py-1 font-bold z-50"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Mobile Menu dropdown */}
      {isOpen && (
        <div className="md:hidden absolute top-16 left-0 w-full bg-neo-white border-b-[3px] border-neo-black flex flex-col p-4 gap-4 shadow-xl z-40">
          <Link to="/" onClick={() => setIsOpen(false)} className={getLinkClasses('/')}>Home</Link>
          <Link to="/decks" onClick={() => setIsOpen(false)} className={getLinkClasses('/decks')}>My Decks</Link>
        </div>
      )}
    </nav>
  );
}