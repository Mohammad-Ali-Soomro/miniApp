import Navbar from './Navbar';

export default function Layout({ children }) {
  return (
    <div className="min-h-screen text-neo-black font-['Space_Grotesk']">
      <Navbar />
      <main className="max-w-[1100px] mx-auto px-6 pt-24 pb-8">
        {children}
      </main>
    </div>
  );
}