import { useState } from 'react'
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useNavigate,
} from 'react-router-dom'
// import { io } from 'socket.io-client'

const API_BASE = 'https://engaging-weevil-preferably.ngrok-free.app'

const Button = ({ onClick, className, children }) => {
  return (
    <button
      onClick={onClick}
      className={`bg-blue-500 text-white p-2 rounded ${className}`}
    >
      {children}
    </button>
  )
}

const Input = ({ placeholder, value, onChange }) => {
  return (
    <input
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="border p-2 rounded"
    />
  )
}

function WelcomePage() {
  const [name, setName] = useState('')
  const navigate = useNavigate()

  const createPlayer = async () => {
    const response = await fetch(`${API_BASE}/players`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    })
    const data = await response.json()
    localStorage.setItem('playerId', data._id)
    navigate('/grid')
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl mb-4">Welcome to Battleship</h1>
      <Input
        placeholder="Enter your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <Button onClick={createPlayer} className="mt-4">
        Create Player
      </Button>
    </div>
  )
}

function GridPage() {
  const [playerCount, setPlayerCount] = useState(0)
  const navigate = useNavigate()

  useState(() => {
    fetch(`${API_BASE}/players/online/count`)
      .then((res) => res.json())
      .then((data) => setPlayerCount(data.count))
  }, [])

  const selectGrid = (gridId) => {
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
    <div className="flex flex-col items-center p-4">
      <h2 className="text-xl mb-4">
        Select a Grid ({playerCount} Players Online)
      </h2>
      <div className="grid grid-cols-9 gap-2">
        {grid.map((cell) => (
          <Button key={cell} onClick={() => selectGrid(cell)}>
            {cell}
          </Button>
        ))}
      </div>
    </div>
  )
}

function GamePage() {
  const playerId = localStorage.getItem('playerId')
  const gridId = localStorage.getItem('gridId')
//   const socket = io(`ws://localhost:8000/ws/${playerId}/${gridId}`)

  const sendShot = () => {
    socket.send(JSON.stringify({ type: 'shot', position: 'B3' }))
  }

  const socket = new WebSocket(`ws://localhost:8000/ws/${playerId}/${gridId}`);

        socket.onopen = () => {
          console.log('Connected to game server');
        //   resolve();
        };

        socket.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            // _handleMessage(data);
          } catch (error) {
            console.error('Error parsing message:', error);
            // _triggerHandlers('error', error);
          }
        };

        socket.onclose = (event) => {
          console.log('Disconnected from game server:', event.code, event.reason);
        //   _triggerHandlers('error', new Error('Connection closed'));
        };

        socket.onerror = (error) => {
          console.error('WebSocket error:', error);
        //   reject(error);
        //   _triggerHandlers('error', error);
        };

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-xl">Game Started!</h2>
      <Button onClick={sendShot}>Fire Shot at B3</Button>
    </div>
  )
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/grid" element={<GridPage />} />
        <Route path="/game" element={<GamePage />} />
      </Routes>
    </Router>
  )
}
