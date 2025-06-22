import React from 'react';
import Card from './Card';

const GameBoard = ({ cards, onCardClick, level, cardBackImage }) => {
  return (
    <div className={`game-board ${level}`}>
      {cards.map((card) => (
        <Card
          key={card.id}
          card={card}
          onCardClick={onCardClick}
          cardBackImage={cardBackImage}
        />
      ))}
    </div>
  );
};

export default GameBoard;