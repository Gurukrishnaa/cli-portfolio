'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Theme } from '../utils/themes';

interface SnakeGameProps {
  theme: Theme;
  onExit: () => void;
}

type Point = { x: number; y: number };

const GRID_SIZE = 20;
const SPEED = 100;

const SnakeGame: React.FC<SnakeGameProps> = ({ theme, onExit }) => {
  const [snake, setSnake] = useState<Point[]>([{ x: 10, y: 10 }]);
  const [food, setFood] = useState<Point>({ x: 15, y: 10 });
  const [direction, setDirection] = useState<Point>({ x: 1, y: 0 }); // Moving right
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Refs for freshness in event listeners/intervals
  const directionRef = useRef(direction);
  const snakeRef = useRef(snake);
  const gameOverRef = useRef(gameOver);
  const isPausedRef = useRef(isPaused);

  useEffect(() => {
    directionRef.current = direction;
    snakeRef.current = snake;
    gameOverRef.current = gameOver;
    isPausedRef.current = isPaused;
  }, [direction, snake, gameOver, isPaused]);

  // Generate random food position not on snake
  const generateFood = useCallback((): Point => {
    let newFood: Point;
    let isOnSnake = true;
    while (isOnSnake) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE)
      };
      // eslint-disable-next-line no-loop-func
      isOnSnake = snakeRef.current.some(segment => segment.x === newFood.x && segment.y === newFood.y);
      if (!isOnSnake) return newFood;
    }
    return { x: 0, y: 0 }; // Fallback
  }, []);

  const resetGame = () => {
    setSnake([{ x: 10, y: 10 }]);
    setFood(generateFood());
    setDirection({ x: 1, y: 0 });
    setGameOver(false);
    setScore(0);
    setIsPaused(false);
  };

  // Game Loop
  useEffect(() => {
    const gameLoop = setInterval(() => {
      if (gameOverRef.current || isPausedRef.current) return;

      const currentSnake = snakeRef.current;
      const head = currentSnake[0];
      const currentDir = directionRef.current;

      const newHead = {
        x: head.x + currentDir.x,
        y: head.y + currentDir.y
      };

      // Check collisions
      if (
        newHead.x < 0 || 
        newHead.x >= GRID_SIZE || 
        newHead.y < 0 || 
        newHead.y >= GRID_SIZE ||
        currentSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)
      ) {
        setGameOver(true);
        if (score > highScore) setHighScore(score);
        return;
      }

      const newSnake = [newHead, ...currentSnake];
      
      // Check food
      if (newHead.x === food.x && newHead.y === food.y) {
        setScore(s => s + 10);
        setFood(generateFood());
        // Snake grows (don't pop tail)
      } else {
        newSnake.pop(); // Move tail
      }

      setSnake(newSnake);

    }, SPEED);

    return () => clearInterval(gameLoop);
  }, [food, generateFood, highScore, score]);

  // Controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onExit();
      }
      
      if (e.key === ' ') {
          if (gameOverRef.current) {
              resetGame();
          } else {
              setIsPaused(prev => !prev);
          }
      }

      if (gameOverRef.current || isPausedRef.current) return;

      switch (e.key) {
        case 'ArrowUp':
          if (directionRef.current.y !== 1) setDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
          if (directionRef.current.y !== -1) setDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
          if (directionRef.current.x !== 1) setDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
          if (directionRef.current.x !== -1) setDirection({ x: 1, y: 0 });
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onExit]);

  return (
    <div className={`w-full h-full flex flex-col items-center justify-center ${theme.text} p-4`}>
      <div className="flex justify-between w-full max-w-[400px] mb-4 font-mono font-bold">
        <span>SCORE: {score}</span>
        <span>HIGH SCORE: {highScore}</span>
      </div>

      <div 
        className={`relative bg-black/50 border-2 ${theme.border}`}
        style={{
            width: 'min(80vw, 400px)',
            height: 'min(80vw, 400px)',
            display: 'grid',
            gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
            gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`
        }}
      >
        {/* Render Grid Cells purely for logic or map collision? 
            Actually mapped rendering is cleaner. 
            We create an array of size GRID_SIZE * GRID_SIZE? 
            Or just render Snake and Food absolutely? 
            Grid/Flex is heavy for 400 divs? No, 400 divs is fine in React.
        */}
        {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => {
            const x = i % GRID_SIZE;
            const y = Math.floor(i / GRID_SIZE);
            const isSnake = snake.some(s => s.x === x && s.y === y);
            const isFood = food.x === x && food.y === y;
            const isHead = snake[0].x === x && snake[0].y === y;

            return (
                <div 
                    key={i} 
                    className={`
                        ${isSnake ? theme.bg : ''} 
                        ${isFood ? 'bg-red-500 animate-pulse' : ''}
                        ${isHead ? 'opacity-100' : 'opacity-80'}
                    `}
                    style={{ borderRadius: isFood ? '50%' : isSnake ? '2px' : '0' }}
                />
            );
        })}
        
        {/* Game Over Overlay */}
        {gameOver && (
            <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center text-center backdrop-blur-sm">
                <h2 className="text-3xl font-bold mb-2">GAME OVER</h2>
                <p className="mb-4">Final Score: {score}</p>
                <div className="flex gap-4 text-sm animate-pulse">
                    <span>[SPACE] Restart</span>
                    <span>[ESC] Exit</span>
                </div>
            </div>
        )}
        
        {isPaused && !gameOver && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                 <h2 className="text-2xl font-bold animate-pulse">PAUSED</h2>
            </div>
        )}
      </div>

      <div className="mt-4 text-xs opacity-70 font-mono">
        Use Arrow Keys to Move • Space to Pause/Restart • Esc to Quit
      </div>
    </div>
  );
};

export default SnakeGame;
