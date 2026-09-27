import ProfilePanel from "./components/ProfilePanel";
import { api } from "./services/api";
import React, { useEffect, useMemo, useState } from "react";
import Topbar from "./components/Topbar";
import BookCard from "./components/BookCard";
import BookModal from "./components/BookModal";
import SettingsPanel from "./components/SettingsPanel";
import LoginPage from "./components/LoginPage";
import GenreSelection from "./components/GenreSelection";
import BookRatingPage from "./components/BookRatingPage";
import RecommendationsPage from "./components/RecommendationsPage";

function Shelf({
  title,
  subtitle,
  items,
  onOpen,
  reverse = false,
}) {
  return (
    <section className="shelf-section">
      <div className="section-heading">
        <div>
          <p className="eyebrow">{subtitle}</p>
          <h2>{title}</h2>
        </div>

        <span className="count">
          {items.length} books
        </span>
      </div>

      {items.length === 0 ? (
        <div className="empty-shelf">
          <p>No books here yet.</p>
        </div>
      ) : (
        <div className="shelf-viewport">
          <div
            className={`shelf-row ${
              reverse ? "carousel-reverse" : ""
            }`}
          >
            {items.map((book) => (
              <BookCard
                key={book.id}
                book={book}
                onOpen={onOpen}
              />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

function CurrentlyReading({ reading }) {
  if (!reading) return null;

  const { book, page } = reading;
  const totalPages = book.pages || 300;

  const progress = Math.min(
    100,
    Math.max(
      1,
      Math.round((page / totalPages) * 100)
    )
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
              style={{
                width: `${progress}%`,
              }}
            />
          </div>

          <div className="reading-progress-meta">
            <span>{progress}% through</span>

            <span>
              {Math.max(
                0,
                totalPages - page
              )}{" "}
              pages left
            </span>
          </div>
        </div>

        <div className="reading-info">
          <p className="reading-quote">
            {book.quote
              ? `“${book.quote}”`
              : "A story currently waiting to be finished."}
          </p>

          <div className="reading-book">
            <strong>{book.title}</strong>
            <span>{book.author}</span>
          </div>

          <div className="reading-status">
            <span className="status-dot"></span>

            <span>
              left off at page {page}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [mongoBooks, setMongoBooks] = useState([]);
  const [booksLoading, setBooksLoading] = useState(true);

  const [userLibrary, setUserLibrary] = useState([]);
  const [libraryLoading, setLibraryLoading] = useState(true);

  const existingUser =
    localStorage.getItem("booknestUser");

  const savedGenres =
    localStorage.getItem("booknestGenres");

  const savedRatings =
    localStorage.getItem("booknestRatings");

  const [onboardingStep, setOnboardingStep] =
    useState(() => {
      if (!existingUser) {
        return "login";
      }

      if (!savedGenres) {
        return "genres";
      }

      if (!savedRatings) {
        return "ratings";
      }

      return "complete";
    });

  const [onboardingGenres, setOnboardingGenres] =
    useState(() => {
      if (!savedGenres) return [];

      try {
        return JSON.parse(savedGenres);
      } catch {
        return [];
      }
    });

  const [onboardingRatings, setOnboardingRatings] =
    useState(() => {
      if (!savedRatings) return {};

      try {
        return JSON.parse(savedRatings);
      } catch {
        return {};
      }
    });

  const [query, setQuery] = useState("");
  const [section, setSection] = useState("home");
  const [modal, setModal] = useState(null);
  const [settings, setSettings] = useState(false);
  const [theme, setTheme] = useState("light");

  const [selectedGenres, setSelectedGenres] =
    useState([
      "Literary Fiction",
      "Contemporary",
      "Fantasy",
    ]);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const data = await api.getBooks();

        console.log(
          "BOOKS FROM MONGODB:",
          data
        );

        setMongoBooks(data);
      } catch (error) {
        console.error(
          "FAILED TO FETCH BOOKS:",
          error
        );
      } finally {
        setBooksLoading(false);
      }
    };

    fetchBooks();
  }, []);

  const fetchUserLibrary = async () => {
    const token =
      localStorage.getItem("booknestToken");

    if (!token) {
      setUserLibrary([]);
      setLibraryLoading(false);
      return;
    }

    try {
      setLibraryLoading(true);

      const data = await api.getLibrary();

      console.log(
        "USER LIBRARY:",
        data
      );

      setUserLibrary(
        Array.isArray(data) ? data : []
      );
    } catch (error) {
      console.error(
        "FAILED TO FETCH USER LIBRARY:",
        error
      );

      setUserLibrary([]);
    } finally {
      setLibraryLoading(false);
    }
  };

  useEffect(() => {
    if (onboardingStep !== "complete") {
      setUserLibrary([]);
      setLibraryLoading(false);
      return;
    }

    fetchUserLibrary();
  }, [onboardingStep]);

  const library = useMemo(() => {
    const libraryMap = new Map();

    userLibrary.forEach((entry) => {
      const bookId =
        entry?.book?._id ||
        entry?.book?.id;

      if (bookId) {
        libraryMap.set(
          String(bookId),
          entry
        );
      }
    });

    return mongoBooks.map((book) => {
      const bookId =
        book.id || book._id;

      const normalizedBookId =
        String(bookId);

      const entry =
        libraryMap.get(
          normalizedBookId
        );

      return {
        ...book,

        id: bookId,

        cover:
          book.cover ||
          book.coverImage ||
          "",

        blurb:
          book.blurb ||
          book.description ||
          "",

        description:
          book.description ||
          book.blurb ||
          "",

        genre:
          book.genre ||
          book.genres ||
          [],

        genres:
          book.genres ||
          book.genre ||
          [],

        year:
          book.year ||
          book.publishedYear,

        publishedYear:
          book.publishedYear ||
          book.year,

        pages:
          book.pages || 0,

        quote:
          book.quote || "",

        rating:
          book.rating ||
          book.averageRating ||
          0,

        status:
          entry?.status || null,

        libraryEntryId:
          entry?._id || null,

        currentPage:
          entry?.currentPage || 0,

        userRating:
          entry?.rating || 0,
      };
    });
  }, [mongoBooks, userLibrary]);

  const filtered = useMemo(() => {
    const normalizedQuery =
      query.trim().toLowerCase();

    if (!normalizedQuery) {
      return library;
    }

    return library.filter((book) => {
      const title =
        book.title || "";

      const author =
        book.author || "";

      const genres =
        Array.isArray(book.genre)
          ? book.genre.join(" ")
          : book.genre || "";

      const description =
        book.description ||
        book.blurb ||
        "";

      const searchableText =
        `${title} ${author} ${genres} ${description}`.toLowerCase();

      return searchableText.includes(
        normalizedQuery
      );
    });
  }, [library, query]);

  const tbr = useMemo(() => {
    return filtered.filter(
      (book) =>
        book.status === "tbr"
    );
  }, [filtered]);

  const read = useMemo(() => {
    return filtered.filter(
      (book) =>
        book.status === "read"
    );
  }, [filtered]);

  const currentlyReadingBooks =
    useMemo(() => {
      return library.filter(
        (book) =>
          book.status === "currently"
      );
    }, [library]);

  const currentlyReading =
    useMemo(() => {
      if (
        currentlyReadingBooks.length === 0
      ) {
        return null;
      }

      const book =
        currentlyReadingBooks[0];

      return {
        book,
        page:
          book.currentPage || 1,
      };
    }, [currentlyReadingBooks]);

  const handleLoginComplete = () => {
    setUserLibrary([]);
    setSection("home");
    setQuery("");
    setModal(null);
    setSettings(false);

    setOnboardingStep("genres");
  };

  const handleLogout = () => {
    localStorage.removeItem(
      "booknestUser"
    );

    localStorage.removeItem(
      "booknestToken"
    );

    localStorage.removeItem(
      "booknestGenres"
    );

    localStorage.removeItem(
      "booknestRatings"
    );

    setUserLibrary([]);
    setSettings(false);
    setModal(null);
    setSection("home");
    setQuery("");
    setOnboardingGenres([]);
    setOnboardingRatings({});
    setOnboardingStep("login");
  };

  const handleGenresComplete = (
    genres
  ) => {
    setOnboardingGenres(genres);

    localStorage.setItem(
      "booknestGenres",
      JSON.stringify(genres)
    );

    setOnboardingStep("ratings");
  };

  const handleRatingsComplete = (
    ratings
  ) => {
    setOnboardingRatings(ratings);

    localStorage.setItem(
      "booknestRatings",
      JSON.stringify(ratings)
    );

    setOnboardingStep(
      "recommendations"
    );
  };

  const finishOnboarding = () => {
    setOnboardingStep("complete");
  };

  const handleLibraryChange = (
    updatedEntry,
    removedBookId,
    keepModalOpen = false
  ) => {
    if (removedBookId) {
      setUserLibrary((current) => {
        return current.filter(
          (entry) => {
            const entryBookId =
              entry?.book?._id ||
              entry?.book?.id;

            return (
              String(entryBookId) !==
              String(removedBookId)
            );
          }
        );
      });

      setModal(null);

      return;
    }

    if (!updatedEntry) {
      return;
    }

    const updatedBookId =
      updatedEntry?.book?._id ||
      updatedEntry?.book?.id;

    setUserLibrary((current) => {
      const existingIndex =
        current.findIndex(
          (entry) => {
            const entryBookId =
              entry?.book?._id ||
              entry?.book?.id;

            return (
              String(entryBookId) ===
              String(updatedBookId)
            );
          }
        );

      if (existingIndex === -1) {
        return [
          ...current,
          updatedEntry,
        ];
      }

      const updated = [
        ...current,
      ];

      updated[existingIndex] =
        updatedEntry;

      return updated;
    });

    if (
      updatedEntry.status ===
      "currently"
    ) {
      setUserLibrary((current) => {
        return current.map(
          (entry) => {
            const entryBookId =
              entry?.book?._id ||
              entry?.book?.id;

            if (
              String(entryBookId) ===
              String(updatedBookId)
            ) {
              return entry;
            }

            if (
              entry.status ===
              "currently"
            ) {
              return {
                ...entry,
                status: "read",
              };
            }

            return entry;
          }
        );
      });
    }

    if (!keepModalOpen) {
      setModal(null);
    }
  };

  const totalBooks =
    userLibrary.length;

  const tbrCount =
    userLibrary.filter(
      (entry) =>
        entry.status === "tbr"
    ).length;

  const finishedBooks =
    userLibrary.filter(
      (entry) =>
        entry.status === "read"
    ).length;

  const handleSection = (s) => {
    setSection(s);
    setSettings(false);
    setQuery("");
  };

  if (
    onboardingStep === "login"
  ) {
    return (
      <LoginPage
        onComplete={
          handleLoginComplete
        }
      />
    );
  }

  if (
    onboardingStep === "genres"
  ) {
    return (
      <GenreSelection
        onComplete={
          handleGenresComplete
        }
      />
    );
  }

  if (
    onboardingStep === "ratings"
  ) {
    return (
      <BookRatingPage
        onComplete={
          handleRatingsComplete
        }
      />
    );
  }

  if (
    onboardingStep ===
    "recommendations"
  ) {
    return (
      <RecommendationsPage
        genres={
          onboardingGenres
        }
        ratings={
          onboardingRatings
        }
        onFinish={
          finishOnboarding
        }
      />
    );
  }

  const isSearching =
    query.trim().length > 0;

  return (
    <div
      className={`app ${theme}`}
    >
      <Topbar
        query={query}
        setQuery={setQuery}
        onSection={
          handleSection
        }
        section={section}
        onRecommended={() => {
          setQuery("");
          setSection("home");
        }}
        onSettings={() =>
          setSettings(true)
        }
      />

      <main>
        {section === "profile" ? (
          <ProfilePanel />
        ) : section === "read" ? (
          <Shelf
            title="Books I've read"
            subtitle="Your finished shelf"
            items={read}
            onOpen={setModal}
          />
        ) : section === "tbr" ? (
          <Shelf
            title="My TBR"
            subtitle="Waiting patiently"
            items={tbr}
            onOpen={setModal}
          />
        ) : isSearching ? (
          <Shelf
            title="Search results"
            subtitle={`Books matching “${query.trim()}”`}
            items={filtered}
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
                  <em>
                    you haven't met yet.
                  </em>
                </h1>

                <p>
                  Keep your TBR close,
                  remember what you've
                  loved, and find your
                  next favourite book.
                </p>

                <div className="hero-stats">
                  <div>
                    <strong>
                      {totalBooks}
                    </strong>

                    <span>
                      books in your library
                    </span>
                  </div>

                  <div>
                    <strong>
                      {tbrCount}
                    </strong>

                    <span>
                      waiting to be read
                    </span>
                  </div>

                  <div>
                    <strong>
                      {finishedBooks}
                    </strong>

                    <span>
                      stories finished
                    </span>
                  </div>
                </div>
              </div>

              <CurrentlyReading
                reading={
                  currentlyReading
                }
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
          onClose={() =>
            setModal(null)
          }
          onLibraryChange={
            handleLibraryChange
          }
        />
      )}

      {settings && (
        <>
          <div
            className="panel-overlay"
            onClick={() =>
              setSettings(false)
            }
          />

          <SettingsPanel
            theme={theme}
            setTheme={setTheme}
            selectedGenres={
              selectedGenres
            }
            setSelectedGenres={
              setSelectedGenres
            }
            onClose={() =>
              setSettings(false)
            }
            onLogout={
              handleLogout
            }
          />
        </>
      )}
    </div>
  );
}