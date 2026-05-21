import { Link, useEffect } from 'react';

export default function NotFoundPage() {
  useEffect(() => {
    document.title = "SpacedOut — Page Not Found";
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <h1 className="text-[120px] font-[800] leading-none text-neo-black mb-4">404</h1>
      <h2 className="text-3xl font-bold mb-8">Page not found</h2>
      <Link to="/" className="neo-btn bg-neo-yellow px-8 py-3 text-xl no-underline text-neo-black font-bold">
        ← Go Home
      </Link>
    </div>
  );
}