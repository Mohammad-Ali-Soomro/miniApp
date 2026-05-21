import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 w-full h-16 bg-neo-yellow border-b-[3px] border-neo-black z-50 flex items-center justify-between px-6">
      <Link to="/" className="text-2xl font-bold text-neo-black no-underline">
        ⚡ SpacedOut
      </Link>
      <div className="flex gap-4">
        <Link to="/" className="neo-btn bg-white hover:bg-neo-yellow px-4 py-2 text-sm no-underline text-neo-black inline-block">
          Home
        </Link>
        <Link to="/decks" className="neo-btn bg-white hover:bg-neo-yellow px-4 py-2 text-sm no-underline text-neo-black inline-block">
          My Decks
        </Link>
      </div>
    </nav>
  );
}