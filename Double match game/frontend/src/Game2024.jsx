import React, { useEffect, useState } from 'react';
import './Game2024.css';

const Game2024 = () => {
    const [board, setBoard] = useState(Array(16).fill(0));
    const [score, setScore] = useState(0);

    useEffect(() => {
        startNewGame();
        window.addEventListener('keydown', handleKeyPress);
        return () => {
            window.removeEventListener('keydown', handleKeyPress);
        };
    }, []);
    useEffect(() => {
      console.log("board now:",board);
    }, [board]);

    const startNewGame = () => {
        setBoard(Array(16).fill(0));
        addRandomTile(board);
        setScore(0);
        console.log("start2:",board);
    };

    const addRandomTile = (board) => {
        const emptyTiles = [];
        board.forEach((tile, index) => {
            if (tile === 0) emptyTiles.push(index);
        });
        if (emptyTiles.length > 0) {
            const randomIndex = emptyTiles[Math.floor(Math.random() * emptyTiles.length)];
            board[randomIndex] = Math.random() < 0.9 ? 2 : 4;
        }
    };

    const moveTiles = (direction) => {
        console.log("dir:",direction);
        const newBoard = [...board];
        console.log("test1:",newBoard);
        if (direction === 'up' || direction === 'down') {
            for (let i = 0; i < 4; i++) {
                let col = [board[i], board[i + 4], board[i + 8], board[i + 12]];
                col = direction === 'up' ? slideTiles(col) : slideTiles(col.reverse()).reverse();
                for (let j = 0; j < 4; j++) {
                    newBoard[i + j * 4] = col[j];
                }
                console.log("back:",col,newBoard);
            }
            console.log(newBoard);
        } else if (direction === 'left' || direction === 'right') {
            for (let i = 0; i < 4; i++) {
                let row = board.slice(i * 4, i * 4 + 4);
                row = direction === 'left' ? slideTiles(row) : slideTiles(row.reverse()).reverse();
                for (let j = 0; j < 4; j++) {
                    newBoard[i * 4 + j] = row[j];
                }
            }
        }
        console.log("after:",newBoard);
        setBoard(newBoard);

        console.log("bug:",newBoard,board);
    };

    const slideTiles = (tiles) => {
        let newTiles = tiles.filter(tile => tile !== 0);
        for (let i = 0; i < newTiles.length - 1; i++) {
            if (newTiles[i] === newTiles[i + 1]) {
                newTiles[i] *= 2;
                newTiles[i + 1] = 0;
               console.log("this is :",newTiles[i],newTiles);
               setScore(prevScore => prevScore + newTiles[i]);
            }
        }
        newTiles = newTiles.filter(tile => tile !== 0);
        while (newTiles.length < 4) {
            newTiles.push(0);
        }
        console.log("new tiles:",tiles,newTiles);
        return newTiles;
    };

    const handleKeyPress = (event) => {
        console.log(event.key);
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

    return (
        <div className="game-container">
            <h1>2048 Game</h1>
            <div id="game-board" className="game-board">
                {board.map((tile, index) => (
                    <div key={index} className={`tile tile-${tile}`}>
                        {tile !== 0 ? tile : ''}
                    </div>
                ))}
            </div>
            <div id="score" className="score">
                Score: {score}
            </div>
            <button id="new-game" className="new-game-button" onClick={startNewGame}>
                New Game
            </button>
        </div>
    );
};

export default Game2024;