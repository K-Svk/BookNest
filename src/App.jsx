import React, { useMemo, useState } from 'react';
import { books } from './data/books';
import Topbar from './components/Topbar';
import BookCard from './components/BookCard';
import BookModal from './components/BookModal';
import SettingsPanel from './components/SettingsPanel';

function Shelf({ title, subtitle, items, onOpen, reverse = false }) {
  /*
    Two identical copies create the seamless infinite loop.
    When the first copy moves completely out of view,
    the second copy is already in exactly the same position.
  */
  const carouselItems = [...items, ...items];

  return (
    <section className="shelf-section">
      <div className="section-heading">
        <div>
          <p className="eyebrow">{subtitle}</p>
          <h2>{title}</h2>
        </div>

        <span className="count">{items.length} books</span>
      </div>

      <div className="shelf-viewport">
        <div
          className={`shelf-row ${reverse ? 'carousel-reverse' : ''}`}
        >
          {carouselItems.map((book, index) => (
            <BookCard
              key={`${book.id}-${index}`}
              book={book}
              onOpen={onOpen}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function CurrentlyReading({ reading }) {
  if (!reading) return null;

  const { book, page } = reading;

  const totalPages = book.pages || 300;
  const progress = Math.min(
    100,
    Math.max(1, Math.round((page / totalPages) * 100))
  );

  return (
    <div className="currently-reading">
      <div className="reading-label">
        <span>currently reading</span>

        <span>
          page {page} / {totalPages}
        </span>
      </div>

      <div className="reading-content">
        <div className="reading-cover-wrap">
          <div className="reading-cover">
            <img
              src={book.cover}
              alt={book.title}
            />

            <div className="reading-bookmark"></div>
          </div>

          <div className="reading-progress">
            <div
              className="reading-progress-fill"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="reading-progress-meta">
            <span>{progress}% through</span>
            <span>{totalPages - page} pages left</span>
          </div>
        </div>

        <div className="reading-info">
          <p className="reading-quote">
            “{book.quote}”
          </p>

          <div className="reading-book">
            <strong>{book.title}</strong>
            <span>{book.author}</span>
          </div>

          <div className="reading-status">
            <span className="status-dot"></span>
            <span>left off at page {page}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [query, setQuery] = useState('');
  const [section, setSection] = useState('home');
  const [modal, setModal] = useState(null);
  const [settings, setSettings] = useState(false);
  const [theme, setTheme] = useState('light');

  const [selectedGenres, setSelectedGenres] = useState([
    'Literary Fiction',
    'Contemporary',
    'Fantasy'
  ]);

  /*
    Currently-reading books have their own status,
    so they can never appear in TBR or Already Read.
  */
  const [currentlyReading] = useState(() => {
    const pool = books.filter(
      (book) => book.status === 'currently'
    );

    if (!pool.length) return null;

    const book =
      pool[Math.floor(Math.random() * pool.length)];

    const totalPages = book.pages || 300;

    const page =
      Math.floor(
        Math.random() * (totalPages - 40)
      ) + 30;

    return {
      book,
      page
    };
  });

  const filtered = useMemo(
    () =>
      books.filter((b) =>
        `${b.title} ${b.author} ${b.genre}`
          .toLowerCase()
          .includes(query.toLowerCase())
      ),
    [query]
  );

  const tbr = filtered.filter(
    (b) => b.status === 'tbr'
  );

  const read = filtered.filter(
    (b) => b.status === 'read'
  );

  const totalBooks = books.filter(
    (book) => book.status !== 'currently'
  ).length;

  const handleSection = (s) => {
    setSection(s);
    setSettings(false);
  };

  return (
    <div className={`app ${theme}`}>
      <Topbar
        query={query}
        setQuery={setQuery}
        onSection={handleSection}
        section={section}
        onRecommended={() => {
          setQuery('');
          setSection('home');
        }}
        onSettings={() => setSettings(true)}
      />

      <main>
        {section === 'profile' ? (
          <div className="simple-page">
            <p className="eyebrow">Your account</p>

            <h1>Ayvarhs</h1>

            <p className="muted">
              A quiet corner for your reading life.
            </p>

            <div className="stat-grid">
              <div>
                <strong>{totalBooks}</strong>
                <span>Books tracked</span>
              </div>

              <div>
                <strong>
                  {books.filter(
                    (b) => b.status === 'tbr'
                  ).length}
                </strong>
                <span>On TBR</span>
              </div>

              <div>
                <strong>
                  {books.filter(
                    (b) => b.status === 'read'
                  ).length}
                </strong>
                <span>Read</span>
              </div>
            </div>
          </div>
        ) : section === 'read' ? (
          <Shelf
            title="Books I've read"
            subtitle="Your finished shelf"
            items={read}
            onOpen={setModal}
          />
        ) : section === 'tbr' ? (
          <Shelf
            title="My TBR"
            subtitle="Waiting patiently"
            items={tbr}
            onOpen={setModal}
          />
        ) : (
          <>
            <div className="hero">
              <div className="hero-copy">
                <p className="eyebrow">
                  Your reading space
                </p>

                <h1>
                  A shelf for every story
                  <br />
                  <em>you haven't met yet.</em>
                </h1>

                <p>
                  Keep your TBR close, remember what
                  you've loved, and find your next
                  favourite book.
                </p>

                <div className="hero-stats">
                  <div>
                    <strong>{totalBooks}</strong>
                    <span>books in your library</span>
                  </div>

                  <div>
                    <strong>{tbr.length}</strong>
                    <span>waiting to be read</span>
                  </div>

                  <div>
                    <strong>
                      {books.filter(
                        (b) => b.status === 'read'
                      ).length}
                    </strong>
                    <span>stories finished</span>
                  </div>
                </div>
              </div>

              <CurrentlyReading
                reading={currentlyReading}
              />
            </div>

            <Shelf
              title="To be read"
              subtitle="The pile keeps growing"
              items={tbr}
              onOpen={setModal}
            />

            <Shelf
              title="Already read"
              subtitle="Stories that stayed"
              items={read}
              onOpen={setModal}
              reverse
            />
          </>
        )}
      </main>

      {modal && (
        <BookModal
          book={modal}
          onClose={() => setModal(null)}
        />
      )}

      {settings && (
        <>
          <div
            className="panel-overlay"
            onClick={() => setSettings(false)}
          />

          <SettingsPanel
            theme={theme}
            setTheme={setTheme}
            selectedGenres={selectedGenres}
            setSelectedGenres={setSelectedGenres}
            onClose={() => setSettings(false)}
          />
        </>
      )}
    </div>
  );
}