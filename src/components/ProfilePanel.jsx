import React from 'react';
import {
  Pencil,
  MapPin,
  CalendarDays,
  BookOpen,
  Heart,
  MessageCircle,
  Bookmark,
  Star
} from 'lucide-react';

import './ProfilePanel.css';

const favoriteGenres = [
  'Literary Fiction',
  'Contemporary',
  'Fantasy',
  'Romance',
  'Mystery'
];

const recentReviews = [
  {
    title: 'The Midnight Library',
    author: 'Matt Haig',
    rating: 4,
    review:
      'A quietly beautiful reminder that the lives we imagine are rarely as simple as they seem.'
  },
  {
    title: "A Good Girl's Guide to Murder",
    author: 'Holly Jackson',
    rating: 5,
    review:
      'Fast, clever and impossible to put down. The kind of mystery that makes you want to keep guessing.'
  },
  {
    title: 'The Seven Husbands of Evelyn Hugo',
    author: 'Taylor Jenkins Reid',
    rating: 4,
    review:
      'Messy, glamorous and unexpectedly emotional. Evelyn Hugo is a character that stays with you.'
  }
];

const hypedBooks = [
  {
    title: 'The Housemaid',
    author: 'Freida McFadden',
    cover: 'https://covers.openlibrary.org/b/isbn/9781460760685-M.jpg'
  },
  {
    title: 'Divine Rivals',
    author: 'Rebecca Ross',
    cover: 'https://covers.openlibrary.org/b/isbn/9781250857430-M.jpg'
  },
  {
    title: 'Six of Crows',
    author: 'Leigh Bardugo',
    cover: 'https://covers.openlibrary.org/b/isbn/9781250076960-M.jpg'
  }
];

function Rating({ rating }) {
  return (
    <div className="profile-rating">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={14}
          fill={star <= rating ? 'currentColor' : 'none'}
        />
      ))}
    </div>
  );
}

export default function ProfilePanel() {
  return (
    <section className="profile-page">

      {/* PROFILE HEADER */}
      <div className="profile-hero">

        <div className="profile-avatar-wrap">
          <img
            className="profile-avatar"
            src="https://i.pinimg.com/736x/91/4c/5b/914c5b3ef2b9fbd0e9dc1c12b7b9c1a2.jpg"
            alt="Ayvarhs profile"
          />

          <button
            className="profile-edit-avatar"
            type="button"
            aria-label="Edit profile picture"
            title="Edit profile picture"
          >
            <Pencil size={15} />
          </button>
        </div>

        <div className="profile-intro">

          <div className="profile-name-row">

            <div>
              <p className="profile-eyebrow">
                BOOKNEST MEMBER
              </p>

              <h1>Ayvarhs</h1>
            </div>

            <button
              className="profile-edit-button"
              type="button"
            >
              <Pencil size={15} />
              Edit profile
            </button>

          </div>

          <p className="profile-bio">
            Probably reading when I should be doing something else.
            <br />
            Currently collecting fictional people and questionable decisions.
          </p>

          <div className="profile-meta">

            <span>
              <MapPin size={15} />
              Bangalore, India
            </span>

            <span>
              <CalendarDays size={15} />
              Joined 2026
            </span>

          </div>

        </div>
      </div>


      {/* PROFILE STATS */}
      <div className="profile-stats">

        <div className="profile-stat">
          <BookOpen size={19} />

          <div>
            <strong>37</strong>
            <span>Books read</span>
          </div>
        </div>

        <div className="profile-stat">
          <Bookmark size={19} />

          <div>
            <strong>24</strong>
            <span>On TBR</span>
          </div>
        </div>

        <div className="profile-stat">
          <Heart size={19} />

          <div>
            <strong>18</strong>
            <span>Favourites</span>
          </div>
        </div>

        <div className="profile-stat">
          <MessageCircle size={19} />

          <div>
            <strong>12</strong>
            <span>Reviews</span>
          </div>
        </div>

      </div>


      {/* PROFILE CONTENT */}
      <div className="profile-content">

        {/* LEFT COLUMN */}
        <div className="profile-main-column">

          {/* FAVORITE GENRES */}
          <section className="profile-section">

            <div className="profile-section-heading">

              <div>
                <p className="profile-section-kicker">
                  MY READING TASTE
                </p>

                <h2>Favorite genres</h2>
              </div>

              <span className="profile-section-note">
                what I keep coming back to
              </span>

            </div>

            <div className="genre-list">

              {favoriteGenres.map((genre) => (
                <span
                  className="genre-pill"
                  key={genre}
                >
                  {genre}
                </span>
              ))}

            </div>

          </section>


          {/* RECENT REVIEWS */}
          <section className="profile-section">

            <div className="profile-section-heading">

              <div>
                <p className="profile-section-kicker">
                  FROM THE READING JOURNAL
                </p>

                <h2>Recent reviews</h2>
              </div>

              <button
                className="profile-text-button"
                type="button"
              >
                View all
              </button>

            </div>

            <div className="review-list">

              {recentReviews.map((book) => (
                <article
                  className="review-card"
                  key={book.title}
                >

                  <div className="review-card-top">

                    <div>
                      <h3>{book.title}</h3>
                      <p>{book.author}</p>
                    </div>

                    <Rating rating={book.rating} />

                  </div>

                  <p className="review-text">
                    “{book.review}”
                  </p>

                  <div className="review-footer">
                    <span>Reviewed recently</span>
                    <MessageCircle size={14} />
                  </div>

                </article>
              ))}

            </div>

          </section>

        </div>


        {/* RIGHT COLUMN */}
        <aside className="profile-side-column">

          {/* CURRENTLY READING */}
          <section className="profile-mini-card">

            <p className="profile-section-kicker">
              RIGHT NOW
            </p>

            <h2>Currently reading</h2>

            <div className="currently-reading-profile">

              <div className="mini-book-cover">

                <div className="mini-book-spine"></div>

                <div className="mini-book-title">
                  The
                  <br />
                  Midnight
                  <br />
                  Library
                </div>

              </div>

              <div>
                <h3>The Midnight Library</h3>
                <p>Matt Haig</p>

                <span className="reading-progress-profile">
                  63% read
                </span>
              </div>

            </div>

          </section>


          {/* HYPED BOOKS */}
          <section className="profile-mini-card">

            <div className="profile-section-heading compact">

              <div>
                <p className="profile-section-kicker">
                  ON MY RADAR
                </p>

                <h2>Hyped books</h2>
              </div>

            </div>

            <div className="hyped-books">

              {hypedBooks.map((book) => (
                <div
                  className="hyped-book"
                  key={book.title}
                >

                  <img
                    src={book.cover}
                    alt={book.title}
                  />

                  <div>
                    <h3>{book.title}</h3>
                    <p>{book.author}</p>
                  </div>

                </div>
              ))}

            </div>

          </section>


          {/* QUOTE */}
          <section className="profile-note-card">

            <div className="note-decoration">
              “
            </div>

            <p>
              A room without books is like a body without a soul.
            </p>

            <span>
              — Cicero
            </span>

          </section>

        </aside>

      </div>

    </section>
  );
}