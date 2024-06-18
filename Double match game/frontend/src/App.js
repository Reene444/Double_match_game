// App.js
import React, { useEffect, useState } from 'react';
import './App.css';

const App = () => {
  const [board, setBoard] = useState(Array(16).fill(0));
  const [score, setScore] = useState(0);

  useEffect(() => {
    const handleKeyPress = (event) => {
      switch (event.key) {
        case 'ArrowUp':
          moveTiles('up');
          break;
        case 'ArrowDown':
          moveTiles('down');
          break;
        case 'ArrowLeft':
          moveTiles('left');
          break;
        case 'ArrowRight':
          moveTiles('right');
          break;
        default:
          break;
      }
    };

    document.addEventListener('keydown', handleKeyPress);

    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [board, score]);

  useEffect(() => {
    newGame();
  }, []);

  const createBoard = () => {
    let newBoard = Array(16).fill(0);
    newBoard = generateRandomTile(newBoard);
    newBoard = generateRandomTile(newBoard);
    setBoard(newBoard);
  };

  const generateRandomTile = (currentBoard) => {
    const emptyTiles = [];
    currentBoard.forEach((tile, index) => {
      if (tile === 0) emptyTiles.push(index);
    });
    const randomTile = emptyTiles[Math.floor(Math.random() * emptyTiles.length)];
    currentBoard[randomTile] = Math.random() < 0.9 ? 2 : 4;
    return currentBoard;
  };

  const updateBoard = (newBoard) => {
    setBoard(newBoard);
  };

  const moveTiles = (direction) => {
    const originalBoard = board.slice();
    let newBoard = board.slice();
    if (direction === 'up' || direction === 'down') {
      for (let i = 0; i < 4; i++) {
        const column = [board[i], board[i + 4], board[i + 8], board[i + 12]];
        const newColumn = mergeTiles(column, direction === 'down');
        for (let j = 0; j < 4; j++) {
          newBoard[i + j * 4] = newColumn[j];
        }
      }
    } else {
      for (let i = 0; i < 4; i++) {
        const row = board.slice(i * 4, i * 4 + 4);
        const newRow = mergeTiles(row, direction === 'right');
        for (let j = 0; j < 4; j++) {
          newBoard[i * 4 + j] = newRow[j];
        }
      }
    }
    if (JSON.stringify(newBoard) !== JSON.stringify(originalBoard)) {
      newBoard = generateRandomTile(newBoard);
    }
    updateBoard(newBoard);
  };

  const mergeTiles = (tiles, reverse = false) => {
    if (reverse) tiles.reverse();
    const merged = tiles.filter(tile => tile !== 0);
    for (let i = 0; i < merged.length - 1; i++) {
      if (merged[i] === merged[i + 1]) {
        merged[i] *= 2;
        merged[i + 1] = 0;
        setScore(prevScore => prevScore + merged[i]);
      }
    }
    const newTiles = merged.filter(tile => tile !== 0);
    while (newTiles.length < 4) {
      newTiles.push(0);
    }
    if (reverse) newTiles.reverse();
    return newTiles;
  };

  const newGame = () => {
    setBoard(Array(16).fill(0));
    setScore(0);
    createBoard();
  };

  return (
      <div className="game-container">
        <div className="header">
          <h1>2048 Game</h1>
          <div className="score">Score: {score}</div>
          <button onClick={newGame}>New Game</button>
        </div>
        <div className="game-board" id="game-board">
          {board.map((tile, index) => (
              <div key={index} className={`tile tile-${tile}`}>{tile !== 0 ? tile : ''}</div>
          ))}
        </div>
      </div>
  );
}

export default App;