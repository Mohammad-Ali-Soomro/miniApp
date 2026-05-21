import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import DecksPage from './pages/DecksPage';
import DeckPage from './pages/DeckPage';
import StudyPage from './pages/StudyPage';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/decks" element={<DecksPage />} />
          <Route path="/decks/:id" element={<DeckPage />} />
          <Route path="/study/:id" element={<StudyPage />} />
        </Routes>
      </Layout>
    </Router>
  )
}

export default App;