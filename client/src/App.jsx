import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import DecksPage from './pages/DecksPage';
import DeckPage from './pages/DeckPage';
import StudyPage from './pages/StudyPage';
import NotFoundPage from './pages/NotFoundPage';
import { ToastProvider } from './components/Toast';

function App() {
  return (
    <ToastProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/decks" element={<DecksPage />} />
            <Route path="/decks/:id" element={<DeckPage />} />
            <Route path="/study/:id" element={<StudyPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Layout>
      </Router>
    </ToastProvider>
  )
}

export default App;