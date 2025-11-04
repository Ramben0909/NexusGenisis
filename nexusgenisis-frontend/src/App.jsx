import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './layout/MainLayout';
import Homepage from './pages/Homepage';
import StatsPage from './pages/StatsPage';
import TrendsScopePage from './pages/TrendsScopePage';
import ProfilePage from './pages/ProfilePage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  return (
    <Router>
      <MainLayout>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/stats" element={<StatsPage />} />
          <Route path="/trends" element={<TrendsScopePage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </MainLayout>
    </Router>
  );
}

export default App;
