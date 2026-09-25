import React, { useState } from 'react';
import {
  Search,
  Sparkles,
  BookOpen,
  Bookmark,
  UserRound,
  SlidersHorizontal,
  Heart
} from 'lucide-react';

const likedBy = [
  {
    name: 'Ananya',
    text: 'liked your review of The Midnight Library'
  },
  {
    name: 'Rhea',
    text: 'liked your review of Piranesi'
  },
  {
    name: 'Nisha',
    text: 'liked your review of A Man Called Ove'
  },
  {
    name: 'Aditi',
    text: 'liked your review of The Book Thief'
  }
];

export default function Topbar({
  query,
  setQuery,
  onSection,
  section,
  onRecommended,
  onSettings
}) {
  const [likesOpen, setLikesOpen] =
    useState(false);

  return (
    <header className="topbar">
      <button
        className="wordmark"
        onClick={() => onSection('home')}
      >
        <span className="wordmark-mark">
          b
        </span>

        booknest
      </button>

      <button
        className="recommend"
        onClick={onRecommended}
      >
        <Sparkles size={16} />
        Recommended for you
      </button>

      <div className="search-wrap">
        <Search size={19} />

        <input
          value={query}
          onChange={(e) =>
            setQuery(e.target.value)
          }
          placeholder="Search books, authors, genres..."
          aria-label="Search books"
        />
      </div>

      <div className="nav-actions">
        <button
          className={`icon-button ${
            section === 'read' ? 'active' : ''
          }`}
          onClick={() => onSection('read')}
          aria-label="Read books"
        >
          <BookOpen size={22} />
        </button>

        <button
          className={`icon-button ${
            section === 'tbr' ? 'active' : ''
          }`}
          onClick={() => onSection('tbr')}
          aria-label="TBR"
        >
          <Bookmark size={21} />
        </button>

        <div className="likes-wrap">
          <button
            className={`icon-button ${
              likesOpen ? 'active' : ''
            }`}
            onClick={() =>
              setLikesOpen((current) => !current)
            }
            aria-label="People who liked your reviews"
          >
            <Heart
              size={21}
              fill={
                likesOpen
                  ? 'currentColor'
                  : 'none'
              }
            />

            <span className="likes-count">
              {likedBy.length}
            </span>
          </button>

          {likesOpen && (
            <div className="likes-popover">
              <div className="likes-popover-head">
                <div>
                  <p className="eyebrow">
                    Your reviews
                  </p>

                  <strong>
                    People who liked them
                  </strong>
                </div>

                <span>
                  {likedBy.length}
                </span>
              </div>

              <div className="likes-list">
                {likedBy.map((person) => (
                  <div
                    className="like-person"
                    key={person.name}
                  >
                    <div className="like-avatar">
                      {person.name
                        .charAt(0)
                        .toUpperCase()}
                    </div>

                    <div>
                      <strong>
                        {person.name}
                      </strong>

                      <span>
                        {person.text}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <button
          className={`icon-button ${
            section === 'profile' ? 'active' : ''
          }`}
          onClick={() => onSection('profile')}
          aria-label="Profile"
        >
          <UserRound size={22} />
        </button>

        <button
          className="icon-button"
          onClick={onSettings}
          aria-label="Settings"
        >
          <SlidersHorizontal size={22} />
        </button>
      </div>
    </header>
  );
}