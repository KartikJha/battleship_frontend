import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE } from '../constants';
import ProgressiveBoards from '../components/ProgressiveBoards';

const GridPage = () => {
  const [playerCount, setPlayerCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPlayerCount = async () => {
      try {
        const res = await fetch(`${API_BASE}/players/online/count`);
        const data = await res.json();
        setPlayerCount(data.count);
      } catch (error) {
        console.error('Error fetching player count:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlayerCount();

    // Optional: Refresh player count periodically
    const interval = setInterval(fetchPlayerCount, 30000);
    return () => clearInterval(interval);
  }, []);

  const selectBoard = (gridId) => {
    localStorage.setItem('gridId', gridId);
    navigate('/game');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 p-6">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <h2 className="text-3xl font-bold text-blue-800 text-center">
            Select Your Battle Grid
          </h2>
          <div className="flex items-center justify-center mt-2">
            <div className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-medium flex items-center">
              <div className={`w-2 h-2 rounded-full mr-2 ${loading ? 'bg-gray-300 animate-pulse' : 'bg-green-400'}`}></div>
              {loading ? 'Loading...' : `${playerCount} Players Online`}
            </div>
          </div>
        </header>
        
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <p className="text-gray-600 mb-6 text-center">
            Choose a board to start your naval battle
          </p>
          <ProgressiveBoards selectBoard={selectBoard} />
        </div>
      </div>
    </div>
  );
};

export default GridPage;