import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE } from '../constants';
import Button from '../components/Button';
import Input from '../components/Input';

const WelcomePage = () => {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const createPlayer = async () => {
    if (!name.trim()) return;

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/players`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });
      const data = await response.json();
      localStorage.setItem('playerId', data._id);
      navigate('/grid');
    } catch (error) {
      console.error('Error creating player:', error);
      alert('Failed to create player. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && name.trim()) {
      createPlayer();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 flex flex-col items-center justify-center p-4">
      <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full">
        <h1 className="text-3xl font-bold text-center text-blue-800 mb-6">
          Welcome to Battleship
        </h1>
        <div className="mb-6">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
            Your Name
          </label>
          <Input
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>
        <Button 
          onClick={createPlayer} 
          className="w-full" 
          disabled={!name.trim() || loading}
        >
          {loading ? 'Creating...' : 'Start Game'}
        </Button>
        <p className="mt-4 text-center text-gray-500 text-sm">
          Prepare for naval warfare! Enter your name to begin.
        </p>
      </div>
    </div>
  );
};

export default WelcomePage;