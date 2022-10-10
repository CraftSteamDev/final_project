import React, { useState, useEffect } from 'react'
import Board, { playComputerMove } from './Board'
import { parseFen } from 'chessops/fen'
import { Chess } from 'chessops/chess'
import { Route, BrowserRouter, Routes } from 'react-router-dom'
import NavBar from './components/Navbar/NavBar'
import GameHistory from './pages/GameHistory'
import About from './pages/About'
import Stats from './pages/Stats'
import Container from 'react-bootstrap/Container'
import Home from './pages/Home'

function getWindowDimentions() {
  const { innerWidth: width, innerHeight: height } = window
  return {
    width,
    height,
  }
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
  const [playAs, setPlayAs] = useState('white')
  const [gameRunning, setGameRunning] = useState(false)
  const [windowDimensions, setWindowDimensions] = useState(
    getWindowDimentions()
  )

  useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimentions())
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  function beginGame(color) {
    setGame(Chess.default())
    setTurn('white')
    setPlayAs(color)
    setGameRunning(true)
    if (color === 'black') {
      playComputerMove(game, 'StockFish', 1000).then((chess) => {
        setGame(chess)
      })
    }
  }

  function endGame() {
    setGameRunning(false)
    setGame(Chess.default())
  }

  return (
    <>
      <BrowserRouter>
        <NavBar />
        <Container fluid>
          <Routes>
            <Route
              exact
              path="/"
              element={<Home begin={beginGame} gameRunning={gameRunning} />}
            />
            <Route path="/about" element={<About />} />
            <Route path="/stats" element={<Stats />} />
            <Route path="/gamehistory" element={<GameHistory />} />
            <Route
              path="/play"
              element={
                <div class="row">
                  <div class="w-50 mx-auto">
                    <Board
                      game={game}
                      flipTurn={() => setTurn(game.turn)}
                      playAs={playAs}
                      gameRunning={gameRunning}
                      endGame={endGame}
                      dimensions={windowDimensions}
                    />
                  </div>
                </div>
              }
            />
          </Routes>
        </Container>
      </BrowserRouter>
    </>
  )
}
