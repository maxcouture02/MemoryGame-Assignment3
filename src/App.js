import React, { useState, useEffect, useCallback } from 'react';
import './App.css';
import GameBoard from './components/GameBoard';
import Settings from './components/Settings';

// --- Image Data ---
// In a real app, you might fetch this or have a more complex structure
const ALL_IMAGES = {
  animals: [
    './images/animals/elephant.png', './images/animals/koala.png',
    './images/animals/lion.png', './images/animals/monkey.png',
    './images/animals/octopus.png', './images/animals/parrot.png',
    './images/animals/turtle.png', './images/animals/whale.png',
  ],
  space: [
    './images/space/astronaut.png', './images/space/meteor.png',
    './images/space/planet.png', './images/space/planet(1).png',
    './images/space/satelite.png', './images/space/space-station.png',
    './images/space/spaceship.png', './images/space/ufo.png',
  ],
};
const CARD_BACK_IMAGE = './images/card-back.png'; // Define your card back image path

// --- Helper Functions ---
const shuffleArray = (array) => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

function App() {
  const [level, setLevel] = useState('beginner'); // 'beginner', 'advanced'
  const [imageTheme, setImageTheme] = useState('space'); // 'animals', 'nature'
  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedPairs, setMatchedPairs] = useState(0);
  const [moves, setMoves] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [canFlip, setCanFlip] = useState(true);

  const numPairs = level === 'beginner' ? 4 : 8;

  // --- Game Setup ---
  const initializeGame = useCallback(() => {
    setGameWon(false);
    setMatchedPairs(0);
    setMoves(0);
    setFlippedCards([]);
    setCanFlip(true);

    const themeImages = ALL_IMAGES[imageTheme].slice(0, numPairs);
    const gameCards = themeImages.flatMap((image, index) => [
      { id: `card-${index}-a`, image, type: image, isFlipped: false, isMatched: false },
      { id: `card-${index}-b`, image, type: image, isFlipped: false, isMatched: false },
    ]);
    setCards(shuffleArray(gameCards));
    setGameStarted(true);
  }, [imageTheme, numPairs]);


  // --- Handle Card Click ---
  const handleCardClick = (clickedCard) => {
    if (!canFlip || clickedCard.isFlipped || clickedCard.isMatched || flippedCards.length >= 2) {
      return;
    }

    const newCards = cards.map(card =>
      card.id === clickedCard.id ? { ...card, isFlipped: true } : card
    );
    setCards(newCards);
    setFlippedCards([...flippedCards, clickedCard]);
  };

  // --- Check for Match ---
  useEffect(() => {
    if (flippedCards.length === 2) {
      setCanFlip(false); // Prevent more flips while checking
      setMoves(prevMoves => prevMoves + 1);
      const [firstCard, secondCard] = flippedCards;

      if (firstCard.type === secondCard.type) {
        // Match!
        setCards(prevCards =>
          prevCards.map(card =>
            card.type === firstCard.type 
              ? { ...card, isMatched: true, isFlipped: true } // Keep isFlipped true
              : card
          )
        );
        setMatchedPairs(prev => prev + 1);
        setFlippedCards([]);
        setCanFlip(true);
      } else {
        // No match - flip back after a delay
        setTimeout(() => {
          setCards(prevCards =>
            prevCards.map(card =>
              (card.id === firstCard.id || card.id === secondCard.id)
                ? { ...card, isFlipped: false }
                : card
            )
          );
          setFlippedCards([]);
          setCanFlip(true);
        }, 1200); // 1.2 second delay
      }
    }
  }, [flippedCards, cards]);


  // --- Check for Win Condition ---
  useEffect(() => {
    if (gameStarted && cards.length > 0 && matchedPairs === numPairs) {
      setGameWon(true);
      setCanFlip(false); // Game over
    }
  }, [matchedPairs, numPairs, cards.length, gameStarted]);

  // --- Theme change effect for body ---
  useEffect(() => {
    document.body.className = `theme-${imageTheme}`; // Add class to body
    return () => {
      document.body.className = ''; // Cleanup on unmount or theme change
    };
  }, [imageTheme]);

  const handleStartGame = () => {
    initializeGame();
  };

  const handlePlayAgain = () => {
    setGameStarted(false); // Go back to settings
    setGameWon(false);
  }

  return (
    <div className={`App`}>
      <h1>Memory Game</h1>
      <p>Please select your theme and difficulty</p>
      <Settings
        level={level}
        onLevelChange={(e) => setLevel(e.target.value)}
        theme={imageTheme}
        onThemeChange={(e) => setImageTheme(e.target.value)}
        onStartGame={handleStartGame}
        gameStarted={gameStarted}
      />

      {gameStarted && !gameWon && (
        <>
          <div className="status-area">
            <p>Moves: {moves}</p>
            <p>Matches: {matchedPairs} / {numPairs}</p>
          </div>
          <GameBoard
            cards={cards}
            onCardClick={handleCardClick}
            level={level}
            cardBackImage={CARD_BACK_IMAGE}
          />
        </>
      )}

      {gameWon && (
        <div className="win-message">
          <h2>Congratulations! You won!</h2>
          <p>You completed the game in {moves} moves.</p>
          <button onClick={handlePlayAgain}>Play Again</button>
        </div>
      )}
    </div>
  );
}

export default App;