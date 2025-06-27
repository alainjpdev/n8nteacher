import React, { useEffect, useRef, useState } from 'react';
import { Timer, Trophy, ArrowUp, ArrowDown } from 'lucide-react';

interface PingPongGameProps {
  onComplete: () => void;
  language: 'es' | 'en';
}

const PingPongGame: React.FC<PingPongGameProps> = ({ onComplete, language }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [timeLeft, setTimeLeft] = useState(20);
  const [score, setScore] = useState(0);
  const gameStateRef = useRef({
    ball: { x: 400, y: 200, dx: 5, dy: 3, radius: 10 },
    leftPaddle: { x: 10, y: 150, width: 10, height: 100, dy: 0 },
    rightPaddle: { x: 780, y: 150, width: 10, height: 100, dy: 0 },
    keys: { up: false, down: false },
    canvasWidth: 800,
    canvasHeight: 400
  });

  const content = {
    es: {
      title: '¡Tu Juego Ping Pong AI!',
      points: 'puntos',
      touchInstructions: 'Toca los botones ↑ ↓ para mover tu paleta',
      keyboardInstructions: 'Usa las flechas ↑ ↓ para mover tu paleta'
    },
    en: {
      title: 'Your AI Ping Pong Game!',
      points: 'points',
      touchInstructions: 'Touch the ↑ ↓ buttons to move your paddle',
      keyboardInstructions: 'Use the ↑ ↓ arrows to move your paddle'
    }
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          onComplete();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [onComplete]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const gameState = gameStateRef.current;

    // Responsive canvas sizing
    const updateCanvasSize = () => {
      const container = canvas.parentElement;
      if (container) {
        const containerWidth = container.clientWidth - 32; // Account for padding
        const aspectRatio = 2; // 2:1 aspect ratio
        
        if (containerWidth < 800) {
          gameState.canvasWidth = containerWidth;
          gameState.canvasHeight = containerWidth / aspectRatio;
        } else {
          gameState.canvasWidth = 800;
          gameState.canvasHeight = 400;
        }
        
        canvas.width = gameState.canvasWidth;
        canvas.height = gameState.canvasHeight;
        
        // Adjust game elements to new size
        gameState.ball.x = gameState.canvasWidth / 2;
        gameState.ball.y = gameState.canvasHeight / 2;
        gameState.leftPaddle.y = gameState.canvasHeight / 2 - 50;
        gameState.rightPaddle.x = gameState.canvasWidth - 20;
        gameState.rightPaddle.y = gameState.canvasHeight / 2 - 50;
      }
    };

    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp') gameState.keys.up = true;
      if (e.key === 'ArrowDown') gameState.keys.down = true;
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp') gameState.keys.up = false;
      if (e.key === 'ArrowDown') gameState.keys.down = false;
    };

    const updateGame = () => {
      // Update paddles
      if (gameState.keys.up && gameState.leftPaddle.y > 0) {
        gameState.leftPaddle.y -= 8;
      }
      if (gameState.keys.down && gameState.leftPaddle.y < gameState.canvasHeight - gameState.leftPaddle.height) {
        gameState.leftPaddle.y += 8;
      }

      // AI for right paddle
      const paddleCenter = gameState.rightPaddle.y + gameState.rightPaddle.height / 2;
      if (paddleCenter < gameState.ball.y - 35) {
        gameState.rightPaddle.y += 4;
      } else if (paddleCenter > gameState.ball.y + 35) {
        gameState.rightPaddle.y -= 4;
      }

      // Keep right paddle in bounds
      if (gameState.rightPaddle.y < 0) gameState.rightPaddle.y = 0;
      if (gameState.rightPaddle.y > gameState.canvasHeight - gameState.rightPaddle.height) {
        gameState.rightPaddle.y = gameState.canvasHeight - gameState.rightPaddle.height;
      }

      // Update ball
      gameState.ball.x += gameState.ball.dx;
      gameState.ball.y += gameState.ball.dy;

      // Ball collision with top/bottom
      if (gameState.ball.y <= gameState.ball.radius || gameState.ball.y >= gameState.canvasHeight - gameState.ball.radius) {
        gameState.ball.dy = -gameState.ball.dy;
      }

      // Ball collision with left paddle
      if (
        gameState.ball.x - gameState.ball.radius <= gameState.leftPaddle.x + gameState.leftPaddle.width &&
        gameState.ball.x + gameState.ball.radius >= gameState.leftPaddle.x &&
        gameState.ball.y >= gameState.leftPaddle.y &&
        gameState.ball.y <= gameState.leftPaddle.y + gameState.leftPaddle.height &&
        gameState.ball.dx < 0
      ) {
        gameState.ball.dx = -gameState.ball.dx;
        setScore(prev => prev + 1);
      }

      // Ball collision with right paddle
      if (
        gameState.ball.x + gameState.ball.radius >= gameState.rightPaddle.x &&
        gameState.ball.x - gameState.ball.radius <= gameState.rightPaddle.x + gameState.rightPaddle.width &&
        gameState.ball.y >= gameState.rightPaddle.y &&
        gameState.ball.y <= gameState.rightPaddle.y + gameState.rightPaddle.height &&
        gameState.ball.dx > 0
      ) {
        gameState.ball.dx = -gameState.ball.dx;
      }

      // Reset ball if it goes out of bounds
      if (gameState.ball.x < -gameState.ball.radius || gameState.ball.x > gameState.canvasWidth + gameState.ball.radius) {
        gameState.ball.x = gameState.canvasWidth / 2;
        gameState.ball.y = gameState.canvasHeight / 2;
        gameState.ball.dx = gameState.ball.dx > 0 ? -Math.abs(gameState.ball.dx) : Math.abs(gameState.ball.dx);
      }
    };

    const draw = () => {
      // Clear canvas
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, gameState.canvasWidth, gameState.canvasHeight);

      // Draw center line
      ctx.setLineDash([5, 15]);
      ctx.beginPath();
      ctx.moveTo(gameState.canvasWidth / 2, 0);
      ctx.lineTo(gameState.canvasWidth / 2, gameState.canvasHeight);
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.setLineDash([]);

      // Draw paddles
      ctx.fillStyle = '#00ff00';
      ctx.fillRect(gameState.leftPaddle.x, gameState.leftPaddle.y, gameState.leftPaddle.width, gameState.leftPaddle.height);
      ctx.fillRect(gameState.rightPaddle.x, gameState.rightPaddle.y, gameState.rightPaddle.width, gameState.rightPaddle.height);

      // Draw ball
      ctx.beginPath();
      ctx.arc(gameState.ball.x, gameState.ball.y, gameState.ball.radius, 0, Math.PI * 2);
      ctx.fillStyle = '#00ff00';
      ctx.fill();
    };

    const gameLoop = () => {
      updateGame();
      draw();
      requestAnimationFrame(gameLoop);
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);

    gameLoop();

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('resize', updateCanvasSize);
    };
  }, []);

  const handleTouchUp = () => {
    gameStateRef.current.keys.up = true;
    setTimeout(() => {
      gameStateRef.current.keys.up = false;
    }, 100);
  };

  const handleTouchDown = () => {
    gameStateRef.current.keys.down = true;
    setTimeout(() => {
      gameStateRef.current.keys.down = false;
    }, 100);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="max-w-6xl mx-auto text-center w-full">
        <div className="mb-6">
          <div className="flex items-center justify-center mb-4">
            <Trophy className="text-yellow-400 w-8 h-8 md:w-12 md:h-12 mr-3" />
            <h1 className="text-xl md:text-4xl font-bold text-white">
              {content[language].title}
            </h1>
          </div>
          
          <div className="flex items-center justify-center space-x-4 md:space-x-8 mb-4">
            <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-full px-3 py-2 md:px-4 md:py-2">
              <Timer className="text-blue-400 w-4 h-4 md:w-5 md:h-5 mr-2" />
              <span className="text-white font-bold text-sm md:text-base">
                {timeLeft}s
              </span>
            </div>
            <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-full px-3 py-2 md:px-4 md:py-2">
              <Trophy className="text-yellow-400 w-4 h-4 md:w-5 md:h-5 mr-2" />
              <span className="text-white font-bold text-sm md:text-base">
                {score} {content[language].points}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-gray-900 rounded-2xl p-4 shadow-2xl border border-gray-700 mb-6">
          <canvas
            ref={canvasRef}
            className="border border-gray-600 rounded-lg w-full"
            style={{ imageRendering: 'pixelated', maxWidth: '100%', height: 'auto' }}
          />
        </div>

        {/* Mobile Touch Controls */}
        <div className="flex justify-center space-x-8 md:hidden mb-4">
          <button
            onTouchStart={handleTouchUp}
            onMouseDown={handleTouchUp}
            className="bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold py-4 px-6 rounded-full transition-all duration-150 transform active:scale-95 shadow-lg"
          >
            <ArrowUp className="w-8 h-8" />
          </button>
          <button
            onTouchStart={handleTouchDown}
            onMouseDown={handleTouchDown}
            className="bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold py-4 px-6 rounded-full transition-all duration-150 transform active:scale-95 shadow-lg"
          >
            <ArrowDown className="w-8 h-8" />
          </button>
        </div>

        {/* Instructions */}
        <div className="text-center">
          <p className="text-gray-300 text-sm md:text-base">
            <span className="md:hidden">{content[language].touchInstructions}</span>
            <span className="hidden md:inline">{content[language].keyboardInstructions}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default PingPongGame;