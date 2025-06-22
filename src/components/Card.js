import React from 'react';

const Card = ({ card, onCardClick, cardBackImage }) => {
  const handleClick = () => {
    // A card can only be clicked if it's not already flipped or matched.
    if (!card.isFlipped && !card.isMatched) {
      onCardClick(card);
    }
  };

  // Determine the CSS classes for the card based on its state.
  // - A card is 'flipped' if it has been clicked over (isFlipped) or is already matched.
  // - A card is 'matched' if it's part of a successful pair.
  const isFlipped = card.isFlipped || card.isMatched;
  const classNames = [
    'card',
    isFlipped ? 'flipped' : '',
    card.isMatched ? 'matched' : ''
  ].join(' ').trim();

  return (
    <div className="card-container" onClick={handleClick}>
      <div className={classNames}>
        <div className="card-face card-back">
          <img src={cardBackImage} alt="Card back" />
        </div>
        <div className="card-face card-front">
          <img src={card.image} alt="Card front" />
        </div>
      </div>
    </div>
  );
};

export default Card;