import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Head from 'next/head';
import Image from 'next/image';

function GridBackground() {
  useEffect(() => {
    const CELL_SIZE = 12; // Smaller cells
    const SPEED = 100; // Faster updates

    // Calculate grid dimensions
    const cols = Math.ceil(window.innerWidth / CELL_SIZE);
    const rows = Math.ceil(window.innerHeight / CELL_SIZE);

    // Create grid container
    const container = document.querySelector('.grid-container') as HTMLDivElement;
    if (!container) return;

    container.innerHTML = '';
    container.style.gridTemplateColumns = `repeat(${cols}, ${CELL_SIZE}px)`;
    container.style.gridTemplateRows = `repeat(${rows}, ${CELL_SIZE}px)`;

    // Create grid cells and initial state
    const cells: HTMLDivElement[] = [];
    const state = new Array(rows * cols).fill(0);
    
    for (let i = 0; i < rows * cols; i++) {
      const cell = document.createElement('div');
      cell.className = 'cell';
      container.appendChild(cell);
      cells.push(cell);
      
      // Random initial state (5% chance of being active)
      if (Math.random() < 0.05) {
        state[i] = 1;
      }
    }

    const getNeighbors = (x: number, y: number) => {
      let count = 0;
      for (let dx = -1; dx <= 1; dx++) {
        for (let dy = -1; dy <= 1; dy++) {
          if (dx === 0 && dy === 0) continue;
          
          const nx = (x + dx + cols) % cols;
          const ny = (y + dy + rows) % rows;
          count += state[ny * cols + nx] > 0 ? 1 : 0;
        }
      }
      return count;
    };

    // Custom rules for our abstract cellular automata
    const updateCell = (x: number, y: number) => {
      const idx = y * cols + x;
      const neighbors = getNeighbors(x, y);
      const currentState = state[idx];

      // Complex rules for more interesting patterns
      if (currentState > 0) {
        // Active cell rules
        if (neighbors < 2 || neighbors > 4) {
          return currentState > 1 ? 0 : -1; // Die or start dying
        } else if (neighbors === 3) {
          return 2; // Strengthen
        }
        return currentState;
      } else if (currentState < 0) {
        // Dying cell rules
        return 0; // Complete death
      } else {
        // Dead cell rules
        if (neighbors === 3 || (neighbors === 2 && Math.random() < 0.2)) {
          return 1; // Become active
        }
        return 0;
      }
    };

    // Animation loop
    const animate = () => {
      const newState = [...state];
      
      // Update all cells
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          newState[y * cols + x] = updateCell(x, y);
        }
      }

      // Apply updates and update visuals
      for (let i = 0; i < state.length; i++) {
        state[i] = newState[i];
        
        if (state[i] === 2) {
          cells[i].className = 'cell active';
        } else if (state[i] === 1) {
          cells[i].className = 'cell emerging';
        } else if (state[i] === -1) {
          cells[i].className = 'cell dying';
        } else {
          cells[i].className = 'cell';
        }
      }

      // Randomly seed new cells (0.1% chance per empty cell)
      if (Math.random() < 0.1) {
        const emptyIndex = Math.floor(Math.random() * state.length);
        if (state[emptyIndex] === 0) {
          state[emptyIndex] = 1;
        }
      }
    };

    const intervalId = setInterval(animate, SPEED);
    return () => clearInterval(intervalId);
  }, []);

  return <div className="grid-container" />;
}

export default function Home() {
  const [mintAddress, setMintAddress] = useState('');
  const [result, setResult] = useState<{
    message: string;
    isApe: boolean;
  } | null>(null);
  const [loading, setLoading] = useState(false);

  const checkVolume = async () => {
    if (!mintAddress.trim()) return;
    
    setLoading(true);
    setResult(null);
    
    try {
      const response = await axios.get(`https://api.dexscreener.com/latest/dex/tokens/${mintAddress}`);
      
      const totalVolume = response.data.pairs.reduce((acc: number, pair: any) => {
        return acc + (parseFloat(pair.volume.h24) || 0);
      }, 0);

      const mainPair = response.data.pairs[0];
      if (!mainPair) {
        throw new Error('No trading pairs found');
      }

      const marketCap = parseFloat(mainPair.fdv || '0');
      const isApe = totalVolume > 500000 && marketCap > 50000;
      
      setTimeout(() => {
        setResult({
          message: isApe ? 'APE' : 'FADE',
          isApe
        });
      }, 300);
    } catch (error) {
      setTimeout(() => {
        setResult({
          message: 'Error: Invalid token address',
          isApe: false
        });
      }, 300);
    }
    setLoading(false);
  };

  const resetForm = () => {
    setMintAddress('');
    setResult(null);
  };

  return (
    <>
      <Head>
        <title>AiPE - Check if you should APE or FADE</title>
        <link rel="icon" type="image/png" href="/icon.png" />
        <link rel="shortcut icon" type="image/png" href="/icon.png" />
        <link rel="apple-touch-icon" href="/icon.png" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-metallic-darker via-metallic-dark to-metallic-darker">
        <GridBackground />
        
        <div className="absolute inset-0 bg-metallic-darker/30 backdrop-blur-[2px]" />

        <main className="content-wrapper min-h-screen flex items-center justify-center px-4">
          <div className="w-full max-w-md animate-fade-up">
            <div className="text-center mb-12 animate-fade-up">
              <h1 className="text-6xl font-bold mb-3 bg-gradient-to-r from-metallic-highlight via-white to-metallic-highlight bg-clip-text text-transparent">
                AiPE
              </h1>
              <p className="glow-text">
                Check if you should APE or FADE
              </p>
            </div>

            <div className="space-y-6">
              <div className="animate-fade-up">
                <input
                  type="text"
                  value={mintAddress}
                  onChange={(e) => setMintAddress(e.target.value)}
                  placeholder="Enter CA"
                  className="metallic-input"
                  onKeyDown={(e) => e.key === 'Enter' && checkVolume()}
                />
              </div>
              
              <div className="animate-fade-up">
                <button
                  onClick={checkVolume}
                  disabled={loading}
                  className="metallic-button w-full"
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Scanning...
                    </span>
                  ) : 'Scan'}
                </button>
              </div>

              {result && (
                <>
                  <div className={`result-card ${
                    result.isApe 
                      ? 'bg-metallic-success/10 border-metallic-success/30 success' 
                      : 'bg-metallic-error/10 border-metallic-error/30 error'
                  }`}>
                    <div className="text-center">
                      <span className={`result-text ${
                        result.isApe ? 'text-metallic-success' : 'text-metallic-error'
                      }`}>
                        {result.message}
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-center mt-4">
                    <button 
                      onClick={resetForm}
                      className="clear-button"
                    >
                      Clear
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </main>

        <footer className="relative z-10 p-6 text-center">
          <p className="text-metallic-accent text-sm">
            2025 AiPE Labs
          </p>
        </footer>
      </div>
    </>
  );
}
