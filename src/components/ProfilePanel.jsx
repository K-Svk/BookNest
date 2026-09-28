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
  X,
  Check,
} from "lucide-react";

import "./ProfilePanel.css";

const API_URL = "http://localhost:5000/api";

const DEFAULT_PROFILE_PICTURE =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'%3E%3Crect width='200' height='200' fill='%23eee5d8'/%3E%3Cellipse cx='100' cy='108' rx='65' ry='58' fill='%23c49b7a'/%3E%3Cpath d='M45 75 L42 30 L78 55 Q100 47 122 55 L158 30 L155 75' fill='%23c49b7a'/%3E%3Cellipse cx='76' cy='102' rx='7' ry='9' fill='%23302b27'/%3E%3Cellipse cx='124' cy='102' rx='7' ry='9' fill='%23302b27'/%3E%3Cpath d='M94 119 Q100 124 106 119' fill='none' stroke='%23302b27' stroke-width='4' stroke-linecap='round'/%3E%3Cpath d='M62 120 L25 114 M62 128 L24 133 M138 120 L175 114 M138 128 L176 133' stroke='%23302b27' stroke-width='3' stroke-linecap='round'/%3E%3C/svg%3E";

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
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const [editingProfile, setEditingProfile] = useState(false);
  const [editUsername, setEditUsername] = useState("");
  const [editBio, setEditBio] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileMessage, setProfileMessage] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("booknestToken");

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        const headers = {
          Authorization: `Bearer ${token}`,
        };

        const [
          profileResponse,
          libraryResponse,
          reviewsResponse,
        ] = await Promise.all([
          fetch(`${API_URL}/auth/me`, {
            method: "GET",
            headers,
          }),
          fetch(`${API_URL}/library`, {
            method: "GET",
            headers,
          }),
          fetch(`${API_URL}/reviews/me`, {
            method: "GET",
            headers,
          }),
        ]);

        if (!profileResponse.ok) {
          throw new Error("Failed to fetch profile");
        }

        if (!libraryResponse.ok) {
          throw new Error("Failed to fetch library");
        }

        if (!reviewsResponse.ok) {
          throw new Error("Failed to fetch reviews");
        }

        const profileData = await profileResponse.json();
        const libraryData = await libraryResponse.json();
        const reviewsData = await reviewsResponse.json();

        setUser(profileData);
        setLibrary(
          Array.isArray(libraryData) ? libraryData : []
        );
        setReviews(
          Array.isArray(reviewsData) ? reviewsData : []
        );
      } catch (error) {
        console.error("FAILED TO LOAD PROFILE:", error);
        setUser(null);
        setLibrary([]);
        setReviews([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const readBooks = useMemo(
    () => library.filter((entry) => entry.status === "read"),
    [library]
  );

  const tbrBooks = useMemo(
    () => library.filter((entry) => entry.status === "tbr"),
    [library]
  );

  const currentlyReading = useMemo(
    () => library.find((entry) => entry.status === "currently"),
    [library]
  );

  const ratedBooks = useMemo(
    () =>
      readBooks
        .filter((entry) => Number(entry.rating) > 0)
        .sort((a, b) => {
          const dateA = new Date(a.updatedAt || a.createdAt || 0);
          const dateB = new Date(b.updatedAt || b.createdAt || 0);
          return dateB - dateA;
        }),
    [readBooks]
  );

  const recentReviews = useMemo(
    () =>
      [...reviews].sort((a, b) => {
        const dateA = new Date(
          a.updatedAt || a.createdAt || 0
        );
        const dateB = new Date(
          b.updatedAt || b.createdAt || 0
        );

        return dateB - dateA;
      }),
    [reviews]
  );

  const joinedYear = user?.createdAt
    ? new Date(user.createdAt).getFullYear()
    : "";

  const favoriteGenres =
    user?.favoriteGenres?.length > 0
      ? user.favoriteGenres
      : ["No genres selected yet"];

  const profilePicture =
    user?.profilePicture || DEFAULT_PROFILE_PICTURE;

  const openEditProfile = () => {
    setEditUsername(user?.username || "");
    setEditBio(user?.bio || "");
    setProfileMessage("");
    setEditingProfile(true);
  };

  const closeEditProfile = () => {
    if (savingProfile) {
      return;
    }

    setEditingProfile(false);
    setProfileMessage("");
  };

  const saveProfile = async () => {
    const token = localStorage.getItem("booknestToken");

    if (!token) {
      setProfileMessage("Please log in again.");
      return;
    }

    if (!editUsername.trim()) {
      setProfileMessage("Name cannot be empty.");
      return;
    }

    setSavingProfile(true);
    setProfileMessage("");

    try {
      const response = await fetch(`${API_URL}/auth/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          username: editUsername.trim(),
          bio: editBio.trim(),
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to update profile"
        );
      }

      setUser(data.user);

      const storedUser = localStorage.getItem("booknestUser");

      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);

          localStorage.setItem(
            "booknestUser",
            JSON.stringify({
              ...parsedUser,
              username: data.user.username,
              bio: data.user.bio,
              profilePicture: data.user.profilePicture,
              favoriteGenres: data.user.favoriteGenres,
            })
          );
        } catch {
          localStorage.setItem(
            "booknestUser",
            JSON.stringify(data.user)
          );
        }
      }

      setEditingProfile(false);
      setProfileMessage("Profile updated successfully.");
    } catch (error) {
      console.error("PROFILE UPDATE FAILED:", error);
      setProfileMessage(
        error.message || "Could not update profile."
      );
    } finally {
      setSavingProfile(false);
    }
  };

  if (loading) {
    return (
      <section className="profile-page">
        <div className="profile-hero">
          <div className="profile-intro">
            <p className="profile-eyebrow">BOOKNEST MEMBER</p>
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
            <p className="profile-eyebrow">BOOKNEST MEMBER</p>
            <h1>Profile unavailable</h1>
            <p className="profile-bio">
              Please log in to view your BookNest profile.
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
            alt="Profile"
            onError={(event) => {
              event.currentTarget.src = DEFAULT_PROFILE_PICTURE;
            }}
          />

          <button
            className="profile-edit-avatar"
            type="button"
            aria-label="Edit profile"
            title="Edit profile"
            onClick={openEditProfile}
          >
            <Pencil size={15} />
          </button>
        </div>

        <div className="profile-intro">
          <div className="profile-name-row">
            <div>
              <p className="profile-eyebrow">BOOKNEST MEMBER</p>
              <h1>{user.username}</h1>
            </div>

            <button
              className="profile-edit-button"
              type="button"
              onClick={openEditProfile}
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

      {profileMessage && (
        <div className="profile-message">{profileMessage}</div>
      )}

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
                <span className="genre-pill" key={genre}>
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
              {recentReviews.length > 0 ? (
                recentReviews.slice(0, 3).map((review) => (
                  <article
                    className="review-card"
                    key={review._id}
                  >
                    <div className="review-card-top">
                      <div>
                        <h3>
                          {review.book?.title ||
                            "Untitled book"}
                        </h3>

                        <p>
                          {review.book?.author ||
                            "Unknown author"}
                        </p>
                      </div>

                      <Rating rating={review.rating} />
                    </div>

                    <p className="review-text">
                      {review.text}
                    </p>

                    <div className="review-footer">
                      <span>
                        Reviewed on BookNest
                      </span>

                      <MessageCircle size={14} />
                    </div>
                  </article>
                ))
              ) : (
                <article className="review-card">
                  <div className="review-card-top">
                    <div>
                      <h3>No reviews yet</h3>
                      <p>
                        Your reading journal is waiting.
                      </p>
                    </div>
                  </div>

                  <p className="review-text">
                    Write a review for a book and it
                    will appear here.
                  </p>
                </article>
              )}
            </div>
          </section>
        </div>

        <aside className="profile-side-column">
          <section className="profile-mini-card">
            <p className="profile-section-kicker">RIGHT NOW</p>
            <h2>Currently reading</h2>

            {currentlyReading?.book ? (
              <div className="currently-reading-profile">
                <div className="mini-book-cover">
                  {currentlyReading.book.coverImage ? (
                    <img
                      src={currentlyReading.book.coverImage}
                      alt={currentlyReading.book.title}
                    />
                  ) : (
                    <>
                      <div className="mini-book-spine"></div>
                      <div className="mini-book-title">
                        {currentlyReading.book.title}
                      </div>
                    </>
                  )}
                </div>

                <div>
                  <h3>{currentlyReading.book.title}</h3>
                  <p>{currentlyReading.book.author}</p>

                  <span className="reading-progress-profile">
                    {currentlyReading.book.pages
                      ? `${Math.round(
                          (currentlyReading.currentPage /
                            currentlyReading.book.pages) *
                            100
                        )}% read`
                      : `${currentlyReading.currentPage || 0} pages read`}
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
                tbrBooks.slice(0, 3).map((entry) => (
                  <div
                    className="hyped-book"
                    key={entry._id}
                  >
                    {entry.book?.coverImage ? (
                      <img
                        src={entry.book.coverImage}
                        alt={entry.book.title}
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
                      <h3>{entry.book?.title}</h3>
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
            <div className="note-decoration">“</div>

            <p>
              A room without books is like a body without a soul.
            </p>

            <span>— Cicero</span>
          </section>
        </aside>
      </div>

      {editingProfile && (
        <div
          className="profile-edit-overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeEditProfile();
            }
          }}
        >
          <div className="profile-edit-modal">
            <div className="profile-edit-header">
              <div>
                <p className="profile-section-kicker">
                  YOUR PROFILE
                </p>

                <h2>Edit profile</h2>
              </div>

              <button
                className="profile-edit-close"
                type="button"
                onClick={closeEditProfile}
                disabled={savingProfile}
                aria-label="Close edit profile"
              >
                <X size={19} />
              </button>
            </div>

            <div className="profile-edit-avatar-preview">
              <img
                src={profilePicture}
                alt="Profile preview"
              />
            </div>

            <label className="profile-edit-field">
              <span>Name</span>

              <input
                type="text"
                value={editUsername}
                onChange={(event) =>
                  setEditUsername(event.target.value)
                }
                maxLength={40}
                placeholder="Your name"
              />
            </label>

            <label className="profile-edit-field">
              <span>Bio</span>

              <textarea
                value={editBio}
                onChange={(event) =>
                  setEditBio(event.target.value)
                }
                maxLength={180}
                rows={5}
                placeholder="Tell us a little about yourself..."
              />
            </label>

            {profileMessage && (
              <p className="profile-edit-message">
                {profileMessage}
              </p>
            )}

            <div className="profile-edit-actions">
              <button
                className="profile-edit-cancel"
                type="button"
                onClick={closeEditProfile}
                disabled={savingProfile}
              >
                Cancel
              </button>

              <button
                className="profile-edit-save"
                type="button"
                onClick={saveProfile}
                disabled={savingProfile}
              >
                <Check size={16} />
                {savingProfile
                  ? "Saving..."
                  : "Save changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}