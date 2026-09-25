import React from 'react';
import {
  X,
  Sun,
  Moon,
  Activity,
  ChevronRight,
  LogOut
} from 'lucide-react';
import { genres } from '../data/books';

export default function SettingsPanel({
  theme,
  setTheme,
  selectedGenres,
  setSelectedGenres,
  onClose,
  onLogout
}) {
  const toggle = (g) =>
    setSelectedGenres((s) =>
      s.includes(g)
        ? s.filter((x) => x !== g)
        : [...s, g]
    );

  return (
    <aside className="settings-panel">

      <div className="panel-head">
        <div>
          <p className="eyebrow">Preferences</p>
          <h2>Settings</h2>
        </div>

        <button
          className="close-modal"
          onClick={onClose}
        >
          <X size={19} />
        </button>
      </div>

      <div className="setting-block">
        <h3>Appearance</h3>

        <div className="theme-switch">
          <button
            className={theme === 'light' ? 'selected' : ''}
            onClick={() => setTheme('light')}
          >
            <Sun size={17} />
            Light
          </button>

          <button
            className={theme === 'dark' ? 'selected' : ''}
            onClick={() => setTheme('dark')}
          >
            <Moon size={17} />
            Dark
          </button>
        </div>
      </div>

      <div className="setting-block">
        <h3>Your genres</h3>

        <p className="muted">
          Tune your recommendations by choosing what you enjoy.
        </p>

        <div className="genre-list">
          {genres.map((g) => (
            <button
              key={g}
              className={
                selectedGenres.includes(g)
                  ? 'chosen'
                  : ''
              }
              onClick={() => toggle(g)}
            >
              {g}

              {selectedGenres.includes(g) && (
                <span>✓</span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="setting-row">
        <div>
          <Activity size={18} />

          <div>
            <strong>Account activity</strong>
            <span className="muted">
              Reading history & recent changes
            </span>
          </div>
        </div>

        <ChevronRight size={18} />
      </div>

      <button
        className="logout-button"
        onClick={onLogout}
      >
        <LogOut size={18} />
        Log out
      </button>

    </aside>
  );
}
