import { useState, useEffect } from 'react'
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useNavigate,
} from 'react-router-dom'

import React from 'react';
import PropTypes from 'prop-types';
import './BattleshipBoard.css';
import ProgressiveBoards from './ProgressiveBoards';

const API_BASE = 'https://engaging-weevil-preferably.ngrok-free.app'

const Button = ({ onClick, className, children, disabled = false }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`px-4 py-2 rounded-md font-medium transition-colors ${
        disabled
          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
          : 'bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg active:scale-95'
      } ${className}`}
    >
      {children}
    </button>
  )
}

const Input = ({ placeholder, value, onChange, className }) => {
  return (
    <input
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={`border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full ${className}`}
    />
  )
}

function WelcomePage() {
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const createPlayer = async () => {
    if (!name.trim()) return
    
    setLoading(true)
    try {
      const response = await fetch(`${API_BASE}/players`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      })
      const data = await response.json()
      localStorage.setItem('playerId', data._id)
      navigate('/grid')
    } catch (error) {
      console.error('Error creating player:', error)
      alert('Failed to create player. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && name.trim()) {
      createPlayer()
    }
  }

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
  )
}

function GridPage() {
  const [playerCount, setPlayerCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchPlayerCount = async () => {
      try {
        const res = await fetch(`${API_BASE}/players/online/count`)
        const data = await res.json()
        setPlayerCount(data.count)
      } catch (error) {
        console.error('Error fetching player count:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchPlayerCount()
    
    // Optional: Refresh player count periodically
    const interval = setInterval(fetchPlayerCount, 30000)
    return () => clearInterval(interval)
  }, [])

  const selectBoard = (gridId) => {
    localStorage.setItem('gridId', gridId)
    navigate('/game')
  }

  const grid = []
  for (let row of 'ABCDEFGHI') {
    for (let col = 1; col <= 9; col++) {
      grid.push(`${row}${col}`)
    }
  }

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
  )
}

// function GamePage() {
//   const [gameStatus, setGameStatus] = useState('connecting')
//   const [messages, setMessages] = useState([])
//   const [shotPosition, setShotPosition] = useState('B3')
//   const playerId = localStorage.getItem('playerId')
//   const gridId = localStorage.getItem('gridId')
//   const [socket, setSocket] = useState(null)

//   useEffect(() => {
//     // Initialize WebSocket connection
//     const newSocket = new WebSocket(`ws://localhost:8000/ws/${playerId}/${gridId}`)

//     newSocket.onopen = () => {
//       console.log('Connected to game server')
//       setGameStatus('connected')
//       setMessages(prev => [...prev, { type: 'system', text: 'Connected to game server' }])
//     }

//     newSocket.onmessage = (event) => {
//       try {
//         const data = JSON.parse(event.data)
//         setMessages(prev => [...prev, { type: 'received', data }])
//       } catch (error) {
//         console.error('Error parsing message:', error)
//       }
//     }

//     newSocket.onclose = (event) => {
//       console.log('Disconnected from game server:', event.code, event.reason)
//       setGameStatus('disconnected')
//       setMessages(prev => [...prev, { 
//         type: 'system', 
//         text: `Disconnected: ${event.reason || 'Connection closed'}` 
//       }])
//     }

//     newSocket.onerror = (error) => {
//       console.error('WebSocket error:', error)
//       setGameStatus('error')
//       setMessages(prev => [...prev, { type: 'error', text: 'Connection error' }])
//     }

//     setSocket(newSocket)

//     return () => {
//       if (newSocket) {
//         newSocket.close()
//       }
//     }
//   }, [playerId, gridId])

//   const sendShot = () => {
//     if (socket && gameStatus === 'connected') {
//       const message = JSON.stringify({ type: 'shot', position: shotPosition })
//       socket.send(message)
//       setMessages(prev => [...prev, { 
//         type: 'sent', 
//         text: `Fired shot at ${shotPosition}` 
//       }])
//     }
//   }

//   // Create grid positions for shot selection
//   const gridPositions = []
//   for (let row of 'ABCDEFGHI') {
//     for (let col = 1; col <= 9; col++) {
//       gridPositions.push(`${row}${col}`)
//     }
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 p-6">
//       <div className="max-w-4xl mx-auto">
//         <header className="mb-6 text-center">
//           <h2 className="text-3xl font-bold text-blue-800">Battle Station</h2>
//           <div className="mt-2">
//             <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium
//               ${gameStatus === 'connected' ? 'bg-green-100 text-green-800' : 
//                 gameStatus === 'connecting' ? 'bg-yellow-100 text-yellow-800' : 
//                 'bg-red-100 text-red-800'}`}>
//               <span className={`w-2 h-2 mr-2 rounded-full 
//                 ${gameStatus === 'connected' ? 'bg-green-500' : 
//                   gameStatus === 'connecting' ? 'bg-yellow-500 animate-pulse' : 
//                   'bg-red-500'}`}></span>
//               {gameStatus === 'connected' ? 'Connected' : 
//                 gameStatus === 'connecting' ? 'Connecting...' : 
//                 'Disconnected'}
//             </span>
//           </div>
//           <p className="text-gray-600 text-sm mt-2">
//             Grid Position: {gridId}
//           </p>
//         </header>

//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//           <div className="md:col-span-2 bg-white rounded-xl shadow-lg p-6">
//             <h3 className="font-bold text-lg mb-4 text-gray-700">Your Fleet</h3>
//             <div className="grid grid-cols-9 gap-1">
//               {gridPositions.map((pos) => (
//                 <div
//                   key={pos}
//                   className={`aspect-square flex items-center justify-center rounded border ${
//                     pos === gridId 
//                       ? 'bg-blue-500 text-white border-blue-600' 
//                       : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
//                   } text-xs font-medium`}
//                 >
//                   {pos}
//                 </div>
//               ))}
//             </div>
//           </div>

//           <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col">
//             <h3 className="font-bold text-lg mb-4 text-gray-700">Fire Control</h3>
            
//             <div className="mb-4">
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Target Position
//               </label>
//               <select 
//                 value={shotPosition}
//                 onChange={(e) => setShotPosition(e.target.value)}
//                 className="w-full p-2 border border-gray-300 rounded-md"
//               >
//                 {gridPositions.map(pos => (
//                   <option key={pos} value={pos}>{pos}</option>
//                 ))}
//               </select>
//             </div>

//             <Button 
//               onClick={sendShot}
//               disabled={gameStatus !== 'connected'}
//               className="bg-red-600 hover:bg-red-700 mb-4"
//             >
//               Fire!
//             </Button>

//             <div className="mt-auto">
//               <h4 className="font-medium text-sm text-gray-700 mb-2">Battle Log</h4>
//               <div className="bg-gray-100 rounded-md p-3 h-32 overflow-y-auto text-sm">
//                 {messages.length === 0 ? (
//                   <p className="text-gray-500 italic">No messages yet</p>
//                 ) : (
//                   messages.map((msg, index) => (
//                     <div key={index} className={`mb-1 ${
//                       msg.type === 'system' ? 'text-gray-500 italic' :
//                       msg.type === 'sent' ? 'text-blue-600' :
//                       msg.type === 'error' ? 'text-red-600' :
//                       'text-green-600'
//                     }`}>
//                       {msg.text || JSON.stringify(msg.data)}
//                     </div>
//                   ))
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// const Button = ({ onClick, className, children, disabled = false }) => {
//   return (
//     <button
//       onClick={onClick}
//       disabled={disabled}
//       className={`px-4 py-2 rounded-md font-medium transition-colors ${
//         disabled
//           ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
//           : 'bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg active:scale-95'
//       } ${className}`}
//     >
//       {children}
//     </button>
//   );
// };

// const Input = ({ placeholder, value, onChange, className }) => {
//   return (
//     <input
//       type="text"
//       placeholder={placeholder}
//       value={value}
//       onChange={onChange}
//       className={`border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full ${className}`}
//     />
//   );
// };

function GamePage() {
  const [gameStatus, setGameStatus] = useState('connecting');
  const [messages, setMessages] = useState([]);
  const [shotPosition, setShotPosition] = useState('B3');
  const playerId = localStorage.getItem('playerId');
  const gridId = localStorage.getItem('gridId');
  const [socket, setSocket] = useState(null);
  const [gameData, setGameData] = useState(null);

  useEffect(() => {
    // Initialize WebSocket connection
    const newSocket = new WebSocket(`ws://localhost:8000/ws/${playerId}/${gridId}`);

    newSocket.onopen = () => {
      console.log('Connected to game server');
      setGameStatus('connected');
      setMessages(prev => [...prev, { type: 'system', text: 'Connected to game server' }]);
    };

    newSocket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        setMessages(prev => [...prev, { type: 'received', data }]);
        if (data.type === 'game_started') {
          setGameData(data.game);
        }
      } catch (error) {
        console.error('Error parsing message:', error);
      }
    };

    newSocket.onclose = (event) => {
      console.log('Disconnected from game server:', event.code, event.reason);
      setGameStatus('disconnected');
      setMessages(prev => [...prev, { 
        type: 'system', 
        text: `Disconnected: ${event.reason || 'Connection closed'}` 
      }]);
    };

    newSocket.onerror = (error) => {
      console.error('WebSocket error:', error);
      setGameStatus('error');
      setMessages(prev => [...prev, { type: 'error', text: 'Connection error' }]);
    };

    setSocket(newSocket);

    return () => {
      if (newSocket) {
        newSocket.close();
      }
    };
  }, [playerId, gridId]);

  const sendShot = () => {
    if (socket && gameStatus === 'connected') {
      const message = JSON.stringify({ type: 'shot', position: shotPosition });
      socket.send(message);
      setMessages(prev => [...prev, { 
        type: 'sent', 
        text: `Fired shot at ${shotPosition}` 
      }]);
    }
  };

  const renderBoard = (board, isEnemy = false) => {
    return (
      <div className="grid grid-cols-9 gap-1">
        {board.map((row, rowIndex) => (
          <React.Fragment key={rowIndex}>
            {row.map((cell, cellIndex) => (
              <div
                key={cellIndex}
                className={`aspect-square flex items-center justify-center rounded border ${
                  cell === 'sea' ? 'bg-blue-500' :
                  cell.startsWith('Q') ? 'bg-red-500' :
                  cell.startsWith('P') ? 'bg-blue-700' :
                  'bg-gray-700'
                } text-white font-medium`}
              >
                {isEnemy && !cell.endsWith('1') ? '' : cell}
              </div>
            ))}
          </React.Fragment>
        ))}
      </div>
    );
  };

  if (!gameData) {
    return <div>Loading game data...</div>;
  }

  const playerBoard = gameData.boards[playerId].cells;
  const enemyId = gameData.players.find(id => id !== playerId);
  const enemyBoard = gameData.boards[enemyId].cells;

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 p-6">
      <div className="max-w-4xl mx-auto">
        <header className="mb-6 text-center">
          <h2 className="text-3xl font-bold text-blue-800">Battle Station</h2>
          <div className="mt-2">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium
              ${gameStatus === 'connected' ? 'bg-green-100 text-green-800' : 
                gameStatus === 'connecting' ? 'bg-yellow-100 text-yellow-800' : 
                'bg-red-100 text-red-800'}`}>
              <span className={`w-2 h-2 mr-2 rounded-full 
                ${gameStatus === 'connected' ? 'bg-green-500' : 
                  gameStatus === 'connecting' ? 'bg-yellow-500 animate-pulse' : 
                  'bg-red-500'}`}></span>
              {gameStatus === 'connected' ? 'Connected' : 
                gameStatus === 'connecting' ? 'Connecting...' : 
                'Disconnected'}
            </span>
          </div>
          <p className="text-gray-600 text-sm mt-2">
            Grid Position: {gridId}
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 bg-white rounded-xl shadow-lg p-6">
            <h3 className="font-bold text-lg mb-4 text-gray-700">Your Fleet</h3>
            {renderBoard(playerBoard)}
            <p className="mt-4">Missile Count: {gameData.boards[playerId].missile_count}</p>
          </div>

          <div className="md:col-span-2 bg-white rounded-xl shadow-lg p-6">
            <h3 className="font-bold text-lg mb-4 text-gray-700">Enemy Fleet</h3>
            {renderBoard(enemyBoard, true)}
            <p className="mt-4">Missile Count: {gameData.boards[enemyId].missile_count}</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col">
            <h3 className="font-bold text-lg mb-4 text-gray-700">Fire Control</h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Target Position
              </label>
              <select 
                value={shotPosition}
                onChange={(e) => setShotPosition(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                {playerBoard.flat().map((pos, index) => (
                  <option key={index} value={pos}>{pos}</option>
                ))}
              </select>
            </div>

            <Button 
              onClick={sendShot}
              disabled={gameStatus !== 'connected' || gameData.current_turn !== playerId}
              className="bg-red-600 hover:bg-red-700 mb-4"
            >
              Fire!
            </Button>

            <div className="mt-auto">
              <h4 className="font-medium text-sm text-gray-700 mb-2">Battle Log</h4>
              <div className="bg-gray-100 rounded-md p-3 h-32 overflow-y-auto text-sm">
                {messages.length === 0 ? (
                  <p className="text-gray-500 italic">No messages yet</p>
                ) : (
                  messages.map((msg, index) => (
                    <div key={index} className={`mb-1 ${
                      msg.type === 'system' ? 'text-gray-500 italic' :
                      msg.type === 'sent' ? 'text-blue-600' :
                      msg.type === 'error' ? 'text-red-600' :
                      'text-green-600'
                    }`}>
                      {msg.text || JSON.stringify(msg.data)}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


export default function App() {
  return (
    <Router>
      <Routes>
        {/* <Route path="/" element={<BoardDemo />} /> */}
        <Route path="/" element={<WelcomePage />} />
        <Route path="/grid" element={<GridPage />} />
        <Route path="/game" element={<GamePage />} />
      </Routes>
    </Router>
  )
}