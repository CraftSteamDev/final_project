import { Chess } from 'chessops/chess'
import { parseFen } from 'chessops/fen'
import { useState } from 'react'
import Container from 'react-bootstrap/Container'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Board, { playComputerMove } from './Board'
import NavBar from './components/Navbar/NavBar'
import './css/style.css'
import GameViewer from './GameViewer'
import About from './pages/About'
import GameHistory from './pages/GameHistory'
import Home from './pages/Home'
import Stats from './pages/Stats'

async function getStats() {
  const response = await fetch('/userstats?', {
    headers: {
      'Content-Type': 'application/json',
    },
  })
  const json = await response.json()
  console.log(json)
  return json
}

export default function App(props) {
  const [game, setGame] = useState(
    Chess.fromSetup(
      parseFen(
        'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'
      ).unwrap()
    ).unwrap()
  )
  const [turn, setTurn] = useState(game.turn)
  const [history, setHistory] = useState([])
  const [engine, setEngine] = useState('StockFish')
  const [level, setLevel] = useState(1)
  const [playAs, setPlayAs] = useState('white')
  const [gameRunning, setGameRunning] = useState(false)
  const [gameOver, setGameOver] = useState(false)

  function beginGame() {
    setGame(
      Chess.fromSetup(
        parseFen(
          'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'
        ).unwrap()
      ).unwrap()
    )
    setHistory([])
    setTurn('white')
    setGameRunning(true)
    setGameOver(false)
    if (playAs === 'black') {
      playComputerMove(game, engine, 1000, level).then((res) => {
        console.log(res)
        setGame(res[0])
      })
    }
  }

  function endGame() {
    setGameRunning(false)
    setGame(Chess.default())
  }

  return (
    <BrowserRouter>
      <Container fluid id="appContainer">
        <NavBar />
        <Routes>
          <Route
            exact
            path="/"
            element={
              <Home
                begin={beginGame}
                gameRunning={gameRunning}
                setLevel={setLevel}
                setEngine={setEngine}
                setPlayAs={setPlayAs}
              />
            }
          />
          <Route path="/about" element={<About />} />
          <Route path="/stats" element={<Stats />} />
          <Route path="/gamehistory" element={<GameHistory />} />
          <Route
            path="/play"
            element={
              <>
                <Board
                  game={game}
                  flipTurn={() => setTurn(game.turn)}
                  playAs={playAs}
                  gameRunning={gameRunning}
                  endGame={endGame}
                  engine={engine}
                  level={level}
                  gameOver={gameOver}
                  setGameOver={setGameOver}
                  history={history}
                  setHistory={setHistory}
                />
                <GameViewer history={history} />
              </>
            }
          />
        </Routes>
      </Container>
    </BrowserRouter>
  )
}
