import React, { useEffect, useState } from 'react';
import { Brain, Code, Zap, MessageSquare } from 'lucide-react';

interface AISimulationProps {
  choice: 'game' | 'landing';
  onComplete: () => void;
  language: 'es' | 'en';
}

const AISimulation: React.FC<AISimulationProps> = ({ choice, onComplete, language }) => {
  const [displayedPrompt, setDisplayedPrompt] = useState('');
  const [displayedCode, setDisplayedCode] = useState('');
  const [currentPromptIndex, setCurrentPromptIndex] = useState(0);
  const [currentCodeIndex, setCurrentCodeIndex] = useState(0);
  const [showCode, setShowCode] = useState(false);

  const content = {
    es: {
      title: '🤖 AI Trabajando su Magia...',
      creating: 'Creando tu',
      game: 'videojuego',
      landing: 'landing page',
      realTime: 'en tiempo real',
      processing: 'Procesando prompt...',
      generating: 'AI Generando código...'
    },
    en: {
      title: '🤖 AI Working its Magic...',
      creating: 'Creating your',
      game: 'video game',
      landing: 'landing page',
      realTime: 'in real time',
      processing: 'Processing prompt...',
      generating: 'AI Generating code...'
    }
  };

  const prompts = {
    es: {
      game: `Crea un juego de Ping Pong interactivo usando HTML5 Canvas y JavaScript. El juego debe tener:

- Una pelota que rebote por la pantalla
- Dos paletas: una controlada por el jugador y otra por IA
- Controles con las flechas del teclado
- Sistema de puntuación
- Animaciones fluidas a 60 FPS
- Diseño retro con colores neón verdes
- Responsive para dispositivos móviles
- Controles táctiles para móviles

Haz que sea divertido y adictivo. ¡Que se vea profesional!`,
      landing: `Diseña una landing page moderna y atractiva con las siguientes características:

- Hero section impactante con gradientes llamativos
- Título principal que capture la atención
- Botón de call-to-action prominente
- Sección de características con iconos
- Diseño responsive para todos los dispositivos
- Animaciones CSS suaves y micro-interacciones
- Colores vibrantes: púrpuras, azules, rosas
- Tipografía moderna y legible
- Efectos hover en botones y elementos
- Optimizada para conversión

¡Que se vea como una página de una startup exitosa!`
    },
    en: {
      game: `Create an interactive Ping Pong game using HTML5 Canvas and JavaScript. The game should have:

- A ball that bounces around the screen
- Two paddles: one controlled by the player and another by AI
- Keyboard arrow controls
- Scoring system
- Smooth animations at 60 FPS
- Retro design with neon green colors
- Responsive for mobile devices
- Touch controls for mobile

Make it fun and addictive. Make it look professional!`,
      landing: `Design a modern and attractive landing page with the following features:

- Impactful hero section with striking gradients
- Main title that captures attention
- Prominent call-to-action button
- Features section with icons
- Responsive design for all devices
- Smooth CSS animations and micro-interactions
- Vibrant colors: purples, blues, pinks
- Modern and readable typography
- Hover effects on buttons and elements
- Optimized for conversion

Make it look like a successful startup page!`
    }
  };

  const gameCode = `// Creating Ping Pong with AI
const canvas = document.createElement('canvas');
canvas.width = 800;
canvas.height = 400;
document.body.appendChild(canvas);

const ctx = canvas.getContext('2d');

class Ball {
  constructor() {
    this.x = canvas.width / 2;
    this.y = canvas.height / 2;
    this.dx = 5;
    this.dy = 3;
    this.radius = 10;
  }
  
  update() {
    this.x += this.dx;
    this.y += this.dy;
    
    // Collision with top and bottom edges
    if (this.y <= this.radius || this.y >= canvas.height - this.radius) {
      this.dy = -this.dy;
    }
  }
  
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = '#00ff00';
    ctx.fill();
    ctx.shadowColor = '#00ff00';
    ctx.shadowBlur = 10;
  }
}

class Paddle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 10;
    this.height = 100;
    this.speed = 8;
  }
  
  draw() {
    ctx.fillStyle = '#00ff00';
    ctx.fillRect(this.x, this.y, this.width, this.height);
    ctx.shadowColor = '#00ff00';
    ctx.shadowBlur = 5;
  }
  
  moveUp() {
    if (this.y > 0) this.y -= this.speed;
  }
  
  moveDown() {
    if (this.y < canvas.height - this.height) this.y += this.speed;
  }
}

const ball = new Ball();
const leftPaddle = new Paddle(10, canvas.height/2 - 50);
const rightPaddle = new Paddle(canvas.width - 20, canvas.height/2 - 50);

let score = 0;
const keys = {};

// Event listeners for controls
document.addEventListener('keydown', (e) => {
  keys[e.key] = true;
});

document.addEventListener('keyup', (e) => {
  keys[e.key] = false;
});

// AI for right paddle
function updateAI() {
  const paddleCenter = rightPaddle.y + rightPaddle.height / 2;
  if (paddleCenter < ball.y - 35) {
    rightPaddle.moveDown();
  } else if (paddleCenter > ball.y + 35) {
    rightPaddle.moveUp();
  }
}

// Collision detection
function checkCollisions() {
  // Collision with left paddle
  if (ball.x - ball.radius <= leftPaddle.x + leftPaddle.width &&
      ball.y >= leftPaddle.y &&
      ball.y <= leftPaddle.y + leftPaddle.height &&
      ball.dx < 0) {
    ball.dx = -ball.dx;
    score++;
  }
  
  // Collision with right paddle
  if (ball.x + ball.radius >= rightPaddle.x &&
      ball.y >= rightPaddle.y &&
      ball.y <= rightPaddle.y + rightPaddle.height &&
      ball.dx > 0) {
    ball.dx = -ball.dx;
  }
  
  // Reset if ball goes out of bounds
  if (ball.x < 0 || ball.x > canvas.width) {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.dx = -ball.dx;
  }
}

// Main game loop
function gameLoop() {
  // Clear canvas
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Center line
  ctx.setLineDash([5, 15]);
  ctx.beginPath();
  ctx.moveTo(canvas.width / 2, 0);
  ctx.lineTo(canvas.width / 2, canvas.height);
  ctx.strokeStyle = '#fff';
  ctx.stroke();
  ctx.setLineDash([]);
  
  // Player controls
  if (keys['ArrowUp']) leftPaddle.moveUp();
  if (keys['ArrowDown']) leftPaddle.moveDown();
  
  // Update elements
  ball.update();
  updateAI();
  checkCollisions();
  
  // Draw elements
  ball.draw();
  leftPaddle.draw();
  rightPaddle.draw();
  
  // Show score
  ctx.fillStyle = '#fff';
  ctx.font = '24px Arial';
  ctx.fillText('Score: ' + score, 20, 30);
  
  requestAnimationFrame(gameLoop);
}

// Start the game
gameLoop();

// Touch controls for mobile
const upButton = document.createElement('button');
upButton.textContent = '↑';
upButton.style.cssText = 'position:fixed;bottom:100px;left:50px;width:60px;height:60px;font-size:24px;';
upButton.addEventListener('touchstart', () => keys['ArrowUp'] = true);
upButton.addEventListener('touchend', () => keys['ArrowUp'] = false);

const downButton = document.createElement('button');
downButton.textContent = '↓';
downButton.style.cssText = 'position:fixed;bottom:30px;left:50px;width:60px;height:60px;font-size:24px;';
downButton.addEventListener('touchstart', () => keys['ArrowDown'] = true);
downButton.addEventListener('touchend', () => keys['ArrowDown'] = false);

document.body.appendChild(upButton);
document.body.appendChild(downButton);`;

  const landingCode = `<!-- Creating Landing Page with AI -->
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Digital Future - Created with AI</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            overflow-x: hidden;
        }
        
        .hero {
            height: 100vh;
            background: linear-gradient(135deg, 
                #667eea 0%, 
                #764ba2 25%, 
                #f093fb 50%, 
                #f5576c 75%, 
                #4facfe 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            text-align: center;
            color: white;
            position: relative;
            overflow: hidden;
        }
        
        .hero::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.3);
            z-index: 1;
        }
        
        .hero-content {
            position: relative;
            z-index: 2;
            max-width: 800px;
            padding: 0 20px;
        }
        
        .hero h1 {
            font-size: clamp(2.5rem, 8vw, 6rem);
            font-weight: 900;
            margin-bottom: 1rem;
            animation: fadeInUp 1s ease-out;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
        }
        
        .hero .subtitle {
            font-size: clamp(1rem, 3vw, 1.5rem);
            margin-bottom: 2rem;
            animation: fadeInUp 1s ease-out 0.3s both;
            opacity: 0.9;
        }
        
        .cta-button {
            background: linear-gradient(45deg, #ff6b6b, #ee5a24);
            color: white;
            padding: 18px 40px;
            border: none;
            border-radius: 50px;
            font-size: 1.3rem;
            font-weight: bold;
            cursor: pointer;
            transition: all 0.3s ease;
            animation: fadeInUp 1s ease-out 0.6s both;
            box-shadow: 0 10px 30px rgba(255, 107, 107, 0.4);
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        
        .cta-button:hover {
            transform: translateY(-3px) scale(1.05);
            box-shadow: 0 15px 40px rgba(255, 107, 107, 0.6);
        }
        
        .features {
            padding: 100px 20px;
            background: linear-gradient(180deg, #f8f9fa 0%, #e9ecef 100%);
        }
        
        .features-container {
            max-width: 1200px;
            margin: 0 auto;
        }
        
        .features h2 {
            text-align: center;
            font-size: clamp(2rem, 5vw, 3.5rem);
            margin-bottom: 60px;
            color: #2c3e50;
            font-weight: 800;
        }
        
        .features-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 40px;
        }
        
        .feature-card {
            background: white;
            padding: 40px 30px;
            border-radius: 20px;
            text-align: center;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
            transition: all 0.3s ease;
            border: 1px solid #e9ecef;
        }
        
        .feature-card:hover {
            transform: translateY(-10px);
            box-shadow: 0 20px 50px rgba(0,0,0,0.15);
        }
        
        .feature-icon {
            width: 80px;
            height: 80px;
            background: linear-gradient(45deg, #667eea, #764ba2);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 20px;
            font-size: 2rem;
        }
        
        .feature-card h3 {
            font-size: 1.5rem;
            margin-bottom: 15px;
            color: #2c3e50;
            font-weight: 700;
        }
        
        .feature-card p {
            color: #6c757d;
            line-height: 1.6;
        }
        
        .cta-section {
            padding: 100px 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            text-align: center;
            color: white;
        }
        
        .cta-section h2 {
            font-size: clamp(2rem, 5vw, 3rem);
            margin-bottom: 20px;
            font-weight: 800;
        }
        
        .cta-section p {
            font-size: 1.2rem;
            margin-bottom: 40px;
            opacity: 0.9;
            max-width: 600px;
            margin-left: auto;
            margin-right: auto;
        }
        
        .cta-secondary {
            background: rgba(255,255,255,0.2);
            color: white;
            padding: 15px 35px;
            border: 2px solid rgba(255,255,255,0.3);
            border-radius: 50px;
            font-size: 1.1rem;
            font-weight: bold;
            cursor: pointer;
            transition: all 0.3s ease;
            backdrop-filter: blur(10px);
        }
        
        .cta-secondary:hover {
            background: rgba(255,255,255,0.3);
            transform: translateY(-2px);
        }
        
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        @media (max-width: 768px) {
            .hero {
                padding: 20px;
            }
            
            .features {
                padding: 60px 20px;
            }
            
            .cta-section {
                padding: 60px 20px;
            }
        }
    </style>
</head>
<body>
    <section class="hero">
        <div class="hero-content">
            <h1>Welcome to the<br><span style="background: linear-gradient(45deg, #f093fb, #f5576c); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">Digital Future</span></h1>
            <p class="subtitle">An incredible experience created with Artificial Intelligence in real time</p>
            <button class="cta-button" onclick="handleCTA()">Start Now!</button>
        </div>
    </section>

    <section class="features">
        <div class="features-container">
            <h2>Why choose our platform?</h2>
            <div class="features-grid">
                <div class="feature-card">
                    <div class="feature-icon">⚡</div>
                    <h3>Super Fast</h3>
                    <p>Create incredible projects in seconds with the power of the most advanced Artificial Intelligence</p>
                </div>
                <div class="feature-card">
                    <div class="feature-icon">⭐</div>
                    <h3>Premium Quality</h3>
                    <p>Professional results that exceed expectations and rival designs made by experts</p>
                </div>
                <div class="feature-card">
                    <div class="feature-icon">👥</div>
                    <h3>Easy to Use</h3>
                    <p>Intuitive interface designed for all levels, from beginners to professionals</p>
                </div>
            </div>
        </div>
    </section>

    <section class="cta-section">
        <h2>Don't wait any longer!</h2>
        <p>Join thousands of users who are already creating incredible content with our AI platform</p>
        <button class="cta-secondary" onclick="handleSecondCTA()">Start Free</button>
    </section>

    <script>
        function handleCTA() {
            alert('Great! You have registered to start your AI adventure');
        }
        
        function handleSecondCTA() {
            alert('Welcome! Your free account is ready');
        }
        
        // Additional animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animation = 'fadeInUp 0.8s ease-out forwards';
                }
            });
        }, observerOptions);
        
        document.querySelectorAll('.feature-card').forEach(card => {
            observer.observe(card);
        });
    </script>
</body>
</html>`;

  const promptToDisplay = prompts[language][choice];
  const codeToDisplay = choice === 'game' ? gameCode : landingCode;

  // Animate prompt first
  useEffect(() => {
    const timer = setInterval(() => {
      if (currentPromptIndex < promptToDisplay.length) {
        setDisplayedPrompt(prev => prev + promptToDisplay[currentPromptIndex]);
        setCurrentPromptIndex(prev => prev + 1);
      } else if (!showCode) {
        // Start showing code after prompt is complete
        setTimeout(() => setShowCode(true), 1000);
      }
    }, 20);

    return () => clearInterval(timer);
  }, [currentPromptIndex, promptToDisplay, showCode]);

  // Animate code after prompt
  useEffect(() => {
    if (!showCode) return;

    const timer = setInterval(() => {
      if (currentCodeIndex < codeToDisplay.length) {
        setDisplayedCode(prev => prev + codeToDisplay[currentCodeIndex]);
        setCurrentCodeIndex(prev => prev + 1);
      }
    }, 15);

    return () => clearInterval(timer);
  }, [currentCodeIndex, codeToDisplay, showCode]);

  useEffect(() => {
    const completeTimer = setTimeout(() => {
      onComplete();
    }, 12000);

    return () => clearTimeout(completeTimer);
  }, [onComplete]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-6xl mx-auto text-center">
        <div className="mb-8">
          <div className="flex items-center justify-center mb-6">
            <Brain className="text-purple-400 w-16 h-16 md:w-20 md:h-20 animate-pulse" />
          </div>
          
          <h1 className="text-2xl md:text-4xl font-bold text-white mb-4">
            {content[language].title}
          </h1>
          
          <div className="flex items-center justify-center mb-8">
            <Zap className="text-yellow-400 w-6 h-6 md:w-8 md:h-8 mr-3 animate-bounce" />
            <p className="text-base md:text-xl text-gray-300">
              {content[language].creating} {content[language][choice]} {content[language].realTime}
            </p>
            <Zap className="text-yellow-400 w-6 h-6 md:w-8 md:h-8 ml-3 animate-bounce" />
          </div>
        </div>

        {/* Prompt Section */}
        <div className="bg-gradient-to-r from-blue-900/50 to-purple-900/50 backdrop-blur-sm rounded-2xl p-4 md:p-6 shadow-2xl border border-blue-500/30 mb-6">
          <div className="flex items-center mb-4">
            <div className="flex space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
            <div className="flex items-center ml-4">
              <MessageSquare className="text-blue-400 w-4 h-4 md:w-5 md:h-5 mr-2" />
              <span className="text-gray-400 text-xs md:text-sm">
                prompt.txt
              </span>
            </div>
          </div>
          
          <div className="text-left font-mono text-xs md:text-sm text-blue-300 h-32 md:h-40 overflow-auto bg-black/50 rounded p-3 md:p-4">
            <pre className="whitespace-pre-wrap">{displayedPrompt}</pre>
            {!showCode && <span className="animate-ping text-blue-400">|</span>}
          </div>
        </div>

        {/* Code Section */}
        {showCode && (
          <div className="bg-gray-900 rounded-2xl p-4 md:p-6 shadow-2xl border border-gray-700">
            <div className="flex items-center mb-4">
              <div className="flex space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
              <div className="flex items-center ml-4">
                <Code className="text-green-400 w-4 h-4 md:w-5 md:h-5 mr-2" />
                <span className="text-gray-400 text-xs md:text-sm">
                  {choice === 'game' ? 'ping-pong-game.js' : 'landing-page.html'}
                </span>
              </div>
            </div>
            
            <div className="text-left font-mono text-xs md:text-sm text-green-400 h-64 md:h-80 overflow-auto bg-black rounded p-3 md:p-4">
              <pre className="whitespace-pre-wrap">{displayedCode}</pre>
              <span className="animate-ping text-green-400">|</span>
            </div>
          </div>
        )}

        <div className="mt-8">
          <div className="inline-flex items-center bg-white/10 backdrop-blur-sm rounded-full px-4 py-3 md:px-6 md:py-3">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse mr-3"></div>
            <span className="text-white font-semibold text-sm md:text-base">
              {!showCode ? content[language].processing : content[language].generating}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AISimulation;