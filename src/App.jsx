import ProfilePanel from "./components/ProfilePanel";
import { api } from "./services/api";
import React, {
  useEffect,
  useMemo,
  useState,
} from "react";
import { books } from "./data/books";
import Topbar from "./components/Topbar";
import BookCard from "./components/BookCard";
import BookModal from "./components/BookModal";
import SettingsPanel from "./components/SettingsPanel";

import LoginPage from "./components/LoginPage";
import GenreSelection from "./components/GenreSelection";
import BookRatingPage from "./components/BookRatingPage";
import RecommendationsPage from "./components/RecommendationsPage";


// =====================================================
// SHELF
// =====================================================

function Shelf({
  title,
  subtitle,
  items,
  onOpen,
  reverse = false,
}) {
  const carouselItems = [...items, ...items];

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

      <div className="shelf-viewport">
        <div
          className={`shelf-row ${
            reverse ? "carousel-reverse" : ""
          }`}
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


// =====================================================
// CURRENTLY READING
// =====================================================

function CurrentlyReading({ reading }) {
  if (!reading) return null;

  const { book, page } = reading;

  const totalPages = book.pages || 300;

  const progress = Math.min(
    100,
    Math.max(
      1,
      Math.round(
        (page / totalPages) * 100
      )
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
            <span>
              {progress}% through
            </span>

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


// =====================================================
// APP
// =====================================================

export default function App() {

  // ===================================================
  // BOOK CATALOGUE
  // ===================================================

  const [mongoBooks, setMongoBooks] =
    useState([]);

  const [booksLoading, setBooksLoading] =
    useState(true);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const data =
          await api.getBooks();

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


  // ===================================================
  // USER LIBRARY
  // ===================================================

  const [userLibrary, setUserLibrary] =
    useState([]);

  const [libraryLoading, setLibraryLoading] =
    useState(true);


  // ===================================================
  // ONBOARDING STORAGE
  // ===================================================

  const existingUser =
    localStorage.getItem(
      "booknestUser"
    );

  const savedGenres =
    localStorage.getItem(
      "booknestGenres"
    );

  const savedRatings =
    localStorage.getItem(
      "booknestRatings"
    );


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
        return JSON.parse(
          savedGenres
        );
      } catch {
        return [];
      }
    });


  const [onboardingRatings, setOnboardingRatings] =
    useState(() => {
      if (!savedRatings) return {};

      try {
        return JSON.parse(
          savedRatings
        );
      } catch {
        return {};
      }
    });


  // ===================================================
  // FETCH USER LIBRARY
  // ===================================================

  useEffect(() => {
    const token =
      localStorage.getItem(
        "booknestToken"
      );

    // No token = no authenticated library
    if (!token) {
      setLibraryLoading(false);
      return;
    }

    const fetchLibrary = async () => {
      try {
        const data =
          await api.getLibrary();

        console.log(
          "USER LIBRARY:",
          data
        );

        setUserLibrary(data);

      } catch (error) {
        console.error(
          "FAILED TO FETCH USER LIBRARY:",
          error
        );

      } finally {
        setLibraryLoading(false);
      }
    };

    /*
      We fetch once the user reaches the
      actual application.

      This ensures the token has already
      been created by LoginPage.
    */
    if (onboardingStep === "complete") {
      fetchLibrary();
    }

  }, [onboardingStep]);


  // ===================================================
  // BUILD BOOK LIBRARY
  // ===================================================

  const library = useMemo(() => {

    /*
      MongoDB is now the main catalogue.

      If it isn't available yet, use the
      original frontend library as a fallback.
    */

    const sourceBooks =
      mongoBooks.length
        ? mongoBooks
        : books;


    /*
      Create a quick lookup of the user's
      LibraryEntries.

      book._id → LibraryEntry
    */

    const libraryMap =
      new Map();

    userLibrary.forEach(
      (entry) => {
        if (entry.book?._id) {
          libraryMap.set(
            entry.book._id,
            entry
          );
        }
      }
    );


    return sourceBooks.map(
      (remoteBook) => {

        const matchingLocalBook =
          books.find(
            (localBook) =>
              localBook.title ===
                remoteBook.title &&
              localBook.author ===
                remoteBook.author
          );


        const entry =
          libraryMap.get(
            remoteBook.id ||
              remoteBook._id
          );


        /*
          LibraryEntry status is the
          persistent user status.

          Until a user has library entries,
          we retain the old local status as
          a temporary fallback so your existing
          demo shelves don't suddenly disappear.
        */

        const status =
          entry?.status ??
          matchingLocalBook?.status ??
          null;


        return {
          ...matchingLocalBook,
          ...remoteBook,

          id:
            remoteBook.id ||
            remoteBook._id ||
            matchingLocalBook?.id,

          cover:
            remoteBook.cover ||
            remoteBook.coverImage ||
            matchingLocalBook?.cover ||
            "",

          blurb:
            remoteBook.blurb ||
            remoteBook.description ||
            matchingLocalBook?.blurb ||
            "",

          description:
            remoteBook.description ||
            matchingLocalBook?.description ||
            "",

          genre:
            remoteBook.genre ||
            remoteBook.genres ||
            matchingLocalBook?.genre ||
            [],

          genres:
            remoteBook.genres ||
            matchingLocalBook?.genres ||
            [],

          year:
            remoteBook.year ||
            remoteBook.publishedYear ||
            matchingLocalBook?.year,

          publishedYear:
            remoteBook.publishedYear ||
            matchingLocalBook?.publishedYear,

          pages:
            remoteBook.pages ||
            matchingLocalBook?.pages ||
            0,

          quote:
            remoteBook.quote ||
            matchingLocalBook?.quote ||
            "",

          rating:
            remoteBook.rating ||
            remoteBook.averageRating ||
            matchingLocalBook?.rating ||
            0,

          /*
            USER-SPECIFIC DATA
          */

          status,

          libraryEntryId:
            entry?._id || null,

          currentPage:
            entry?.currentPage || 0,

          userRating:
            entry?.rating || 0,
        };
      }
    );

  }, [
    mongoBooks,
    userLibrary,
  ]);


  // ===================================================
  // SEARCH
  // ===================================================

  const [query, setQuery] =
    useState("");


  const filtered = useMemo(
    () =>
      library.filter(
        (book) =>
          `${book.title} ${
            book.author
          } ${
            Array.isArray(book.genre)
              ? book.genre.join(" ")
              : book.genre || ""
          }`
            .toLowerCase()
            .includes(
              query.toLowerCase()
            )
      ),
    [library, query]
  );


  // ===================================================
  // PERSONAL SHELVES
  // ===================================================

  const tbr =
    filtered.filter(
      (book) =>
        book.status === "tbr"
    );


  const read =
    filtered.filter(
      (book) =>
        book.status === "read"
    );


  const currentlyReadingBooks =
    library.filter(
      (book) =>
        book.status === "currently"
    );


  // ===================================================
  // CURRENTLY READING BOOK
  // ===================================================

  const [randomReadingBook] =
    useState(() => null);


  const currentlyReading =
    useMemo(() => {

      if (
        currentlyReadingBooks.length
      ) {
        const book =
          currentlyReadingBooks[0];

        return {
          book,
          page:
            book.currentPage || 1,
        };
      }


      /*
        Temporary fallback to the old
        frontend data if the user hasn't
        created a MongoDB Currently Reading
        entry yet.
      */

      const localPool =
        books.filter(
          (book) =>
            book.status ===
            "currently"
        );


      if (!localPool.length) {
        return null;
      }


      const book =
        randomReadingBook ||
        localPool[
          Math.floor(
            Math.random() *
              localPool.length
          )
        ];


      const totalPages =
        book.pages || 300;


      const page =
        Math.floor(
          Math.random() *
            Math.max(
              1,
              totalPages - 40
            )
        ) + 30;


      return {
        book,
        page,
      };

    }, [
      currentlyReadingBooks,
      randomReadingBook,
    ]);


  // ===================================================
  // UI STATE
  // ===================================================

  const [section, setSection] =
    useState("home");

  const [modal, setModal] =
    useState(null);

  const [settings, setSettings] =
    useState(false);

  const [theme, setTheme] =
    useState("light");


  const [
    selectedGenres,
    setSelectedGenres,
  ] = useState([
    "Literary Fiction",
    "Contemporary",
    "Fantasy",
  ]);


  // ===================================================
  // ONBOARDING HANDLERS
  // ===================================================

  const handleLoginComplete =
    (user) => {
      setOnboardingStep(
        "genres"
      );
    };


  const handleLogout = () => {
    localStorage.removeItem(
      "booknestUser"
    );

    localStorage.removeItem(
      "booknestToken"
    );

    setUserLibrary([]);

    setSettings(false);

    setOnboardingStep(
      "login"
    );
  };


  const handleGenresComplete =
    (genres) => {
      setOnboardingGenres(
        genres
      );

      localStorage.setItem(
        "booknestGenres",
        JSON.stringify(genres)
      );

      setOnboardingStep(
        "ratings"
      );
    };


  const handleRatingsComplete =
    (ratings) => {
      setOnboardingRatings(
        ratings
      );

      localStorage.setItem(
        "booknestRatings",
        JSON.stringify(ratings)
      );

      setOnboardingStep(
        "recommendations"
      );
    };


  const finishOnboarding = () => {
    setOnboardingStep(
      "complete"
    );
  };


  // ===================================================
  // LIBRARY CHANGE HANDLER
  // ===================================================

  const handleLibraryChange = (
    updatedEntry,
    removedBookId
  ) => {

    /*
      BOOK REMOVED
    */

    if (removedBookId) {

      setUserLibrary(
        (current) =>
          current.filter(
            (entry) =>
              entry.book?._id !==
              removedBookId
          )
      );

      setModal(null);

      return;
    }


    /*
      BOOK ADDED OR UPDATED
    */

    if (updatedEntry) {

      setUserLibrary(
        (current) => {

          const existingIndex =
            current.findIndex(
              (entry) =>
                entry._id ===
                updatedEntry._id
            );


          /*
            Existing entry:
            replace it.
          */

          if (
            existingIndex !== -1
          ) {
            const updated =
              [...current];

            updated[
              existingIndex
            ] = updatedEntry;

            return updated;
          }


          /*
            New entry:
            add it.
          */

          return [
            ...current,
            updatedEntry,
          ];
        }
      );


      /*
        Update the currently open
        modal immediately so its
        buttons reflect the new status.
      */

      if (modal) {

        const updatedBook =
          library.find(
            (book) =>
              book.id ===
              (
                updatedEntry.book?._id ||
                updatedEntry.book?.id
              )
          );


        if (updatedBook) {

          setModal({
            ...updatedBook,

            status:
              updatedEntry.status,

            libraryEntryId:
              updatedEntry._id,

            currentPage:
              updatedEntry.currentPage ||
              0,

            userRating:
              updatedEntry.rating ||
              0,
          });
        }
      }
    }
  };


  // ===================================================
  // COUNTS
  // ===================================================

  const totalBooks =
    library.filter(
      (book) =>
        book.status !==
        "currently"
    ).length;


  const finishedBooks =
    library.filter(
      (book) =>
        book.status === "read"
    ).length;


  // ===================================================
  // NAVIGATION
  // ===================================================

  const handleSection = (s) => {
    setSection(s);
    setSettings(false);
  };


  // ===================================================
  // ONBOARDING SCREENS
  // ===================================================

  if (
    onboardingStep ===
    "login"
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
    onboardingStep ===
    "genres"
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
    onboardingStep ===
    "ratings"
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


  // ===================================================
  // MAIN APP
  // ===================================================

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

        {/* PROFILE */}

        {section ===
        "profile" ? (

          <ProfilePanel />

        ) : section ===
          "read" ? (

          <Shelf
            title="Books I've read"
            subtitle="Your finished shelf"
            items={read}
            onOpen={setModal}
          />

        ) : section ===
          "tbr" ? (

          <Shelf
            title="My TBR"
            subtitle="Waiting patiently"
            items={tbr}
            onOpen={setModal}
          />

        ) : (

          <>
            {/* HERO */}

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
                  loved, and find your next
                  favourite book.
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
                      {tbr.length}
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


            {/* TBR */}

            <Shelf
              title="To be read"
              subtitle="The pile keeps growing"
              items={tbr}
              onOpen={setModal}
            />


            {/* READ */}

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


      {/* BOOK MODAL */}

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


      {/* SETTINGS */}

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
