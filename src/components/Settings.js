import React from 'react';

const Settings = ({ level, onLevelChange, theme, onThemeChange, onStartGame, gameStarted }) => {
  if (gameStarted) return null; // Don't show settings if game is active

  return (
    <div className="settings-container">
      <h2>Game Settings</h2>
      <div className="settings-group">
        <label htmlFor="level">Level:</label>
        <select id="level" value={level} onChange={onLevelChange}>
          <option value="beginner">Beginner (4 pairs)</option>
          <option value="advanced">Advanced (8 pairs)</option>
        </select>
      </div>
      <div className="settings-group">
        <label htmlFor="theme">Image Theme:</label>
        <select id="theme" value={theme} onChange={onThemeChange}>
          <option value="animals">Animals</option>
          <option value="space">Space</option>
        </select>
      </div>
      <div className="settings-group">
        <button onClick={onStartGame}>Start Game</button>
      </div>
    </div>
  );
};

export default Settings;