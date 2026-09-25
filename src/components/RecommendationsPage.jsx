import React, { useMemo } from 'react';
import { books } from '../data/books';
import './Onboarding.css';

export default function RecommendationsPage({
  genres,
  ratings,
  onFinish
}) {
  const recommendations = useMemo(() => {
    const ratedBookIds = Object.keys(ratings || {});

    const scoredBooks = books
      .filter(
        (book) =>
          book.status !== 'currently' &&
          !ratedBookIds.includes(String(book.id))
      )
      .map((book) => {
        let score = 0;

        if (genres.includes(book.genre)) {
          score += 5;
        }

        const matchingRating = Object.entries(
          ratings || {}
        ).find(([bookId]) => String(bookId) === String(book.id));

        if (matchingRating) {
          score += Number(matchingRating[1]);
        }

        return {
          book,
          score
        };
      });

    return scoredBooks
      .sort((a, b) => b.score - a.score)
      .slice(0, 8)
      .map((item) => item.book);
  }, [genres, ratings]);

  return (
    <div className="onboarding-page recommendation-page-wrapper">

      <div className="recommendation-page">

        <div className="onboarding-brand">
          <span className="brand-mark">B</span>
          <span>BookNest</span>
        </div>

        <div className="recommendation-heading">

          <p className="onboarding-eyebrow">
            MADE FOR YOUR SHELF
          </p>

          <h1>
            Stories you might
            <br />
            <em>fall into.</em>
          </h1>

          <p>
            Based on the genres you chose and the books
            you rated, here's where we think your reading
            journey could wander next.
          </p>

        </div>

        <div className="recommendation-grid">

          {recommendations.map((book) => (
            <article
              className="recommendation-card"
              key={book.id}
            >

              <div className="recommendation-cover-wrap">

                <img
                  src={book.cover}
                  alt={book.title}
                  className="recommendation-cover"
                />

              </div>

              <div className="recommendation-info">

                <h3>{book.title}</h3>

                <p>{book.author}</p>

                <span className="recommendation-genre">
                  {book.genre}
                </span>

              </div>

            </article>
          ))}

        </div>

        <div className="recommendation-bottom">

          <p>
            Your recommendations will evolve as your
            reading life does.
          </p>

          <button
            className="onboarding-primary-button"
            type="button"
            onClick={onFinish}
          >
            Enter my BookNest →
          </button>

        </div>

      </div>

    </div>
  );
}