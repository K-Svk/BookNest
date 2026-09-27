import React, { useEffect, useMemo, useState } from "react";
import {
  Pencil,
  MapPin,
  CalendarDays,
  BookOpen,
  Heart,
  MessageCircle,
  Bookmark,
  Star,
} from "lucide-react";

import "./ProfilePanel.css";

const API_URL = "http://localhost:5000/api";

const DEFAULT_PROFILE_PICTURE =
  "https://i.pinimg.com/736x/91/4c/5b/914c5b3ef2b9fbd0e9dc1c12b7b9c1a2.jpg";

function Rating({ rating }) {
  return (
    <div className="profile-rating">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={14}
          fill={star <= Number(rating) ? "currentColor" : "none"}
        />
      ))}
    </div>
  );
}

export default function ProfilePanel() {
  const [user, setUser] = useState(null);
  const [library, setLibrary] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("booknestToken");

      if (!token) {
        console.log("PROFILE: No BookNest token found.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        const profileResponse = await fetch(
          `${API_URL}/auth/me`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!profileResponse.ok) {
          const errorData = await profileResponse.json().catch(() => ({}));

          console.error(
            "PROFILE REQUEST FAILED:",
            profileResponse.status,
            errorData
          );

          throw new Error(
            errorData.message || "Failed to fetch profile"
          );
        }

        const profileData = await profileResponse.json();

        const libraryResponse = await fetch(
          `${API_URL}/library`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!libraryResponse.ok) {
          const errorData = await libraryResponse.json().catch(() => ({}));

          console.error(
            "LIBRARY REQUEST FAILED:",
            libraryResponse.status,
            errorData
          );

          throw new Error(
            errorData.message || "Failed to fetch library"
          );
        }

        const libraryData = await libraryResponse.json();

        console.log("BOOKNEST PROFILE:", profileData);
        console.log("BOOKNEST LIBRARY:", libraryData);

        setUser(profileData);
        setLibrary(Array.isArray(libraryData) ? libraryData : []);
      } catch (error) {
        console.error("FAILED TO LOAD PROFILE:", error);
        setUser(null);
        setLibrary([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const readBooks = useMemo(
    () =>
      library.filter(
        (entry) => entry.status === "read"
      ),
    [library]
  );

  const tbrBooks = useMemo(
    () =>
      library.filter(
        (entry) => entry.status === "tbr"
      ),
    [library]
  );

  const currentlyReading = useMemo(
    () =>
      library.find(
        (entry) => entry.status === "currently"
      ),
    [library]
  );

  const ratedBooks = useMemo(
    () =>
      readBooks
        .filter(
          (entry) =>
            Number(entry.rating) > 0
        )
        .sort((a, b) => {
          const dateA = new Date(
            a.updatedAt ||
              a.createdAt ||
              0
          );

          const dateB = new Date(
            b.updatedAt ||
              b.createdAt ||
              0
          );

          return dateB - dateA;
        }),
    [readBooks]
  );

  const joinedYear = user?.createdAt
    ? new Date(user.createdAt).getFullYear()
    : "";

  const favoriteGenres =
    user?.favoriteGenres?.length > 0
      ? user.favoriteGenres
      : ["No genres selected yet"];

  const profilePicture =
    user?.profilePicture ||
    DEFAULT_PROFILE_PICTURE;

  if (loading) {
    return (
      <section className="profile-page">
        <div className="profile-hero">
          <div className="profile-intro">
            <p className="profile-eyebrow">
              BOOKNEST MEMBER
            </p>

            <h1>Loading profile...</h1>
          </div>
        </div>
      </section>
    );
  }

  if (!user) {
    return (
      <section className="profile-page">
        <div className="profile-hero">
          <div className="profile-intro">
            <p className="profile-eyebrow">
              BOOKNEST MEMBER
            </p>

            <h1>Profile unavailable</h1>

            <p className="profile-bio">
              Please log in to view your BookNest
              profile.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="profile-page">
      <div className="profile-hero">
        <div className="profile-avatar-wrap">
          <img
            className="profile-avatar"
            src={profilePicture}
            alt={`${user.username}'s profile`}
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

              <h1>{user.username}</h1>
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
            {user.bio ||
              "Probably reading when I should be doing something else."}
          </p>

          <div className="profile-meta">
            <span>
              <MapPin size={15} />
              Bangalore, India
            </span>

            <span>
              <CalendarDays size={15} />
              Joined {joinedYear || "recently"}
            </span>
          </div>
        </div>
      </div>

      <div className="profile-stats">
        <div className="profile-stat">
          <BookOpen size={19} />

          <div>
            <strong>{readBooks.length}</strong>
            <span>Books read</span>
          </div>
        </div>

        <div className="profile-stat">
          <Bookmark size={19} />

          <div>
            <strong>{tbrBooks.length}</strong>
            <span>On TBR</span>
          </div>
        </div>

        <div className="profile-stat">
          <Heart size={19} />

          <div>
            <strong>0</strong>
            <span>Favourites</span>
          </div>
        </div>

        <div className="profile-stat">
          <MessageCircle size={19} />

          <div>
            <strong>{ratedBooks.length}</strong>
            <span>Rated books</span>
          </div>
        </div>
      </div>

      <div className="profile-content">
        <div className="profile-main-column">
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
              {ratedBooks.length > 0 ? (
                ratedBooks
                  .slice(0, 3)
                  .map((entry) => (
                    <article
                      className="review-card"
                      key={entry._id}
                    >
                      <div className="review-card-top">
                        <div>
                          <h3>
                            {entry.book?.title ||
                              "Untitled book"}
                          </h3>

                          <p>
                            {entry.book?.author ||
                              "Unknown author"}
                          </p>
                        </div>

                        <Rating
                          rating={entry.rating}
                        />
                      </div>

                      <p className="review-text">
                        You rated this book{" "}
                        {entry.rating} out of 5.
                      </p>

                      <div className="review-footer">
                        <span>
                          Rated on BookNest
                        </span>

                        <MessageCircle size={14} />
                      </div>
                    </article>
                  ))
              ) : (
                <article className="review-card">
                  <div className="review-card-top">
                    <div>
                      <h3>No ratings yet</h3>

                      <p>
                        Your reading journal is
                        waiting.
                      </p>
                    </div>
                  </div>

                  <p className="review-text">
                    Rate books you've read and
                    they'll appear here.
                  </p>
                </article>
              )}
            </div>
          </section>
        </div>

        <aside className="profile-side-column">
          <section className="profile-mini-card">
            <p className="profile-section-kicker">
              RIGHT NOW
            </p>

            <h2>Currently reading</h2>

            {currentlyReading?.book ? (
              <div className="currently-reading-profile">
                <div className="mini-book-cover">
                  {currentlyReading.book
                    .coverImage ? (
                    <img
                      src={
                        currentlyReading.book
                          .coverImage
                      }
                      alt={
                        currentlyReading.book
                          .title
                      }
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    <>
                      <div className="mini-book-spine"></div>

                      <div className="mini-book-title">
                        {
                          currentlyReading.book
                            .title
                        }
                      </div>
                    </>
                  )}
                </div>

                <div>
                  <h3>
                    {
                      currentlyReading.book
                        .title
                    }
                  </h3>

                  <p>
                    {
                      currentlyReading.book
                        .author
                    }
                  </p>

                  <span className="reading-progress-profile">
                    {currentlyReading.book
                      .pages
                      ? `${Math.round(
                          (currentlyReading.currentPage /
                            currentlyReading
                              .book
                              .pages) *
                            100
                        )}% read`
                      : `${
                          currentlyReading.currentPage ||
                          0
                        } pages read`}
                  </span>
                </div>
              </div>
            ) : (
              <p className="profile-bio">
                Nothing currently reading.
              </p>
            )}
          </section>

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
              {tbrBooks.length > 0 ? (
                tbrBooks
                  .slice(0, 3)
                  .map((entry) => (
                    <div
                      className="hyped-book"
                      key={entry._id}
                    >
                      {entry.book?.coverImage ? (
                        <img
                          src={
                            entry.book.coverImage
                          }
                          alt={
                            entry.book.title
                          }
                        />
                      ) : (
                        <div className="mini-book-cover">
                          <div className="mini-book-spine"></div>

                          <div className="mini-book-title">
                            {entry.book?.title}
                          </div>
                        </div>
                      )}

                      <div>
                        <h3>
                          {entry.book?.title}
                        </h3>

                        <p>
                          {entry.book?.author ||
                            "Unknown author"}
                        </p>
                      </div>
                    </div>
                  ))
              ) : (
                <p className="profile-bio">
                  Your TBR is empty.
                </p>
              )}
            </div>
          </section>

          <section className="profile-note-card">
            <div className="note-decoration">
              “
            </div>

            <p>
              A room without books is like a
              body without a soul.
            </p>

            <span>— Cicero</span>
          </section>
        </aside>
      </div>
    </section>
  );
}