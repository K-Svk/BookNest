import React, { useState } from 'react';
import './Onboarding.css';

const genres = [
  'Literary Fiction',
  'Contemporary',
  'Fantasy',
  'Romance',
  'Mystery',
  'Thriller',
  'Science Fiction',
  'Historical Fiction',
  'Young Adult',
  'Horror',
  'Adventure',
  'Classics'
];

export default function GenreSelection({ onComplete }) {
  const [selectedGenres, setSelectedGenres] = useState([]);

  const toggleGenre = (genre) => {
    setSelectedGenres((current) => {
      if (current.includes(genre)) {
        return current.filter((item) => item !== genre);
      }

      if (current.length >= 5) {
        return current;
      }

      return [...current, genre];
    });
  };

  const handleContinue = () => {
    if (!selectedGenres.length) return;

    localStorage.setItem(
      'booknestGenres',
      JSON.stringify(selectedGenres)
    );

    onComplete(selectedGenres);
  };

  return (
    <div className="onboarding-page">

      <div className="genre-page">

        <div className="onboarding-brand">
          <span className="brand-mark">B</span>
          <span>BookNest</span>
        </div>

        <div className="genre-heading">

          <p className="onboarding-eyebrow">
            LET'S GET TO KNOW YOUR TASTE
          </p>

          <h1>
            What kind of stories
            <br />
            <em>pull you in?</em>
          </h1>

          <p>
            Choose up to 5 genres you find yourself
            reaching for again and again.
          </p>

        </div>

        <div className="genre-grid">

          {genres.map((genre) => {
            const selected = selectedGenres.includes(genre);

            return (
              <button
                key={genre}
                type="button"
                className={`genre-choice ${
                  selected ? 'selected' : ''
                }`}
                onClick={() => toggleGenre(genre)}
              >
                <span>{genre}</span>

                {selected && (
                  <span className="genre-check">
                    ✓
                  </span>
                )}
              </button>
            );
          })}

        </div>

        <div className="genre-bottom">

          <span>
            {selectedGenres.length}/5 selected
          </span>

          <button
            className="onboarding-primary-button"
            type="button"
            disabled={!selectedGenres.length}
            onClick={handleContinue}
          >
            Continue →
          </button>

        </div>

      </div>

    </div>
  );
}