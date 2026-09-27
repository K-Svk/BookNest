import React, { useEffect, useState } from "react";
import {
  X,
  ChevronLeft,
  ChevronRight,
  BookmarkPlus,
  MessageCircle,
  Flame,
  Star,
  BookOpen,
  Check,
  Trash2,
} from "lucide-react";

import { api } from "../services/api";

export default function BookModal({
  book,
  onClose,
  onLibraryChange,
}) {
  const [blurb, setBlurb] = useState(false);
  const [commentsOpen, setCommentsOpen] = useState(false);

  const [hyped, setHyped] = useState(false);
  const [hypeCount, setHypeCount] = useState(24);

  const [rating, setRating] = useState(
    book.userRating || 0
  );

  const [review, setReview] = useState("");

  const [actionLoading, setActionLoading] =
    useState(false);

  const [actionMessage, setActionMessage] =
    useState("");

  const currentStatus = book.status || null;
  const libraryEntryId =
    book.libraryEntryId || null;

  useEffect(() => {
    setRating(book.userRating || 0);
    setActionMessage("");
  }, [book]);

  const handleHype = () => {
    if (hyped) {
      setHyped(false);
      setHypeCount((count) => count - 1);
    } else {
      setHyped(true);
      setHypeCount((count) => count + 1);
    }
  };

  // =========================================
  // ADD / UPDATE LIBRARY
  // =========================================

  const updateLibrary = async (status) => {
    if (actionLoading) return;

    setActionLoading(true);
    setActionMessage("");

    try {
      let updatedEntry;

      // If book is already in the user's library,
      // simply change its status.
      if (libraryEntryId) {
        updatedEntry =
          await api.updateLibraryEntry(
            libraryEntryId,
            {
              status,
            }
          );
      } else {
        // Otherwise create a new library entry.
        updatedEntry =
          await api.addToLibrary({
            bookId: book.id,
            status,
          });
      }

      if (onLibraryChange) {
        onLibraryChange(updatedEntry);
      }

      const messages = {
        tbr: "Added to your TBR",
        currently: "Now currently reading",
        read: "Marked as read",
      };

      setActionMessage(
        messages[status] || "Library updated"
      );

    } catch (error) {
      console.error(
        "LIBRARY UPDATE FAILED:",
        error
      );

      setActionMessage(
        error.message ||
          "Something went wrong"
      );
    } finally {
      setActionLoading(false);
    }
  };

  // =========================================
  // REMOVE FROM LIBRARY
  // =========================================

  const handleRemove = async () => {
    if (!libraryEntryId || actionLoading) {
      return;
    }

    setActionLoading(true);
    setActionMessage("");

    try {
      await api.removeFromLibrary(
        libraryEntryId
      );

      if (onLibraryChange) {
        onLibraryChange(null, book.id);
      }

      setActionMessage(
        "Removed from your library"
      );

    } catch (error) {
      console.error(
        "REMOVE FAILED:",
        error
      );

      setActionMessage(
        error.message ||
          "Could not remove this book"
      );
    } finally {
      setActionLoading(false);
    }
  };

  // =========================================
  // RATING
  // =========================================

  const handleRating = async (value) => {
    setRating(value);

    try {
      let updatedEntry;

      if (libraryEntryId) {
        updatedEntry =
          await api.updateLibraryEntry(
            libraryEntryId,
            {
              rating: value,
            }
          );
      } else {
        // Rating a book also puts it in TBR
        // if it isn't already in the library.
        updatedEntry =
          await api.addToLibrary({
            bookId: book.id,
            status: "tbr",
            rating: value,
          });
      }

      if (onLibraryChange) {
        onLibraryChange(updatedEntry);
      }

    } catch (error) {
      console.error(
        "RATING FAILED:",
        error
      );
    }
  };

  const handleReview = () => {
    if (!review.trim() || rating === 0) {
      return;
    }

    alert("Your review has been posted!");

    setReview("");
    setRating(0);
    setCommentsOpen(false);
  };

  return (
    <div
      className="modal-backdrop"
      onClick={onClose}
    >
      <section
        className={`book-modal ${
          blurb ? "show-blurb" : ""
        }`}
        onClick={(event) =>
          event.stopPropagation()
        }
      >
        {/* CLOSE */}
        <button
          className="close-modal"
          onClick={onClose}
          aria-label="Close"
        >
          <X size={20} />
        </button>

        {/* =========================================
            COVER PAGE
        ========================================= */}

        <div className="modal-page cover-page">
          <img
            src={book.cover}
            alt={book.title}
          />

          <div className="cover-page-copy">
            <p className="eyebrow">
              {Array.isArray(book.genre)
                ? book.genre.join(" · ")
                : book.genre}
            </p>

            <h2>{book.title}</h2>

            <p>{book.author}</p>

            <button
              className="primary-btn"
              onClick={() => setBlurb(true)}
            >
              Read the blurb
              <ChevronRight size={17} />
            </button>
          </div>
        </div>

        {/* =========================================
            BLURB PAGE
        ========================================= */}

        <div className="modal-page blurb-page">
          <div className="paper-fold"></div>

          <p className="eyebrow">
            A little about this book
          </p>

          <h2>{book.title}</h2>

          <p className="blurb">
            {book.blurb}
          </p>

          {/* COMMUNITY ACTIONS */}

          <div className="community-actions">
            <button
              className="community-btn"
              onClick={() =>
                setCommentsOpen(true)
              }
            >
              <MessageCircle size={17} />
              Comments
            </button>

            <button
              className={`community-btn hype-btn ${
                hyped ? "hyped" : ""
              }`}
              onClick={handleHype}
            >
              <Flame size={17} />

              {hyped ? "Hyped" : "Hype"}

              <span>{hypeCount}</span>
            </button>
          </div>

          {/* =========================================
              LIBRARY STATUS
          ========================================= */}

          <div className="library-actions">
            <button
              className={`library-action ${
                currentStatus === "tbr"
                  ? "active"
                  : ""
              }`}
              onClick={() =>
                updateLibrary("tbr")
              }
              disabled={actionLoading}
            >
              <BookmarkPlus size={16} />
              TBR
            </button>

            <button
              className={`library-action ${
                currentStatus === "currently"
                  ? "active"
                  : ""
              }`}
              onClick={() =>
                updateLibrary("currently")
              }
              disabled={actionLoading}
            >
              <BookOpen size={16} />
              Reading
            </button>

            <button
              className={`library-action ${
                currentStatus === "read"
                  ? "active"
                  : ""
              }`}
              onClick={() =>
                updateLibrary("read")
              }
              disabled={actionLoading}
            >
              <Check size={16} />
              Read
            </button>
          </div>

          {/* STATUS MESSAGE */}

          {actionMessage && (
            <p className="library-message">
              {actionMessage}
            </p>
          )}

          {/* REMOVE */}

          {libraryEntryId && (
            <button
              className="remove-library-btn"
              onClick={handleRemove}
              disabled={actionLoading}
            >
              <Trash2 size={15} />
              Remove from library
            </button>
          )}

          {/* BOTTOM ACTIONS */}

          <div className="page-actions">
            <button
              className="ghost-btn"
              onClick={() =>
                setBlurb(false)
              }
            >
              <ChevronLeft size={16} />
              Cover
            </button>

            <button
              className="primary-btn"
              onClick={() =>
                updateLibrary("tbr")
              }
              disabled={actionLoading}
            >
              <BookmarkPlus size={16} />

              {currentStatus === "tbr"
                ? "In my TBR"
                : "Add to TBR"}
            </button>
          </div>
        </div>

        {/* PAGE INDICATORS */}

        <div className="modal-dots">
          <span
            className={!blurb ? "on" : ""}
          ></span>

          <span
            className={blurb ? "on" : ""}
          ></span>
        </div>

        {/* =========================================
            COMMENTS / REVIEWS
        ========================================= */}

        {commentsOpen && (
          <div
            className="comments-overlay"
            onClick={() =>
              setCommentsOpen(false)
            }
          >
            <div
              className="comments-panel"
              onClick={(event) =>
                event.stopPropagation()
              }
            >
              <div className="comments-header">
                <div>
                  <p className="eyebrow">
                    Community
                  </p>

                  <h3>
                    Reviews & ratings
                  </h3>
                </div>

                <button
                  className="comments-close"
                  onClick={() =>
                    setCommentsOpen(false)
                  }
                  aria-label="Close reviews"
                >
                  <X size={18} />
                </button>
              </div>

              {/* RATING */}

              <div className="rating-section">
                <span className="rating-label">
                  Rate this book
                </span>

                <div className="star-row">
                  {[1, 2, 3, 4, 5].map(
                    (star) => (
                      <button
                        key={star}
                        className={`star-button ${
                          star <= rating
                            ? "selected"
                            : ""
                        }`}
                        onClick={() =>
                          handleRating(star)
                        }
                        aria-label={`Rate ${star} out of 5`}
                      >
                        <Star
                          size={21}
                          fill={
                            star <= rating
                              ? "currentColor"
                              : "none"
                          }
                        />
                      </button>
                    )
                  )}
                </div>
              </div>

              {/* REVIEW INPUT */}

              <div className="review-form">
                <textarea
                  value={review}
                  onChange={(event) =>
                    setReview(
                      event.target.value
                    )
                  }
                  placeholder="What did you think about this book?"
                  rows={4}
                />

                <button
                  className="primary-btn"
                  onClick={handleReview}
                  disabled={
                    !review.trim() ||
                    rating === 0
                  }
                >
                  Post review
                </button>
              </div>

              {/* EXISTING REVIEWS */}

              <div className="existing-reviews">
                <div className="review">
                  <div className="review-top">
                    <strong>Aditi</strong>

                    <div className="mini-stars">
                      <Star
                        size={12}
                        fill="currentColor"
                      />
                      <Star
                        size={12}
                        fill="currentColor"
                      />
                      <Star
                        size={12}
                        fill="currentColor"
                      />
                      <Star
                        size={12}
                        fill="currentColor"
                      />
                      <Star
                        size={12}
                        fill="currentColor"
                      />
                    </div>
                  </div>

                  <p>
                    One of those books that
                    stays in your head long
                    after you finish it.
                  </p>
                </div>

                <div className="review">
                  <div className="review-top">
                    <strong>Rhea</strong>

                    <div className="mini-stars">
                      <Star
                        size={12}
                        fill="currentColor"
                      />
                      <Star
                        size={12}
                        fill="currentColor"
                      />
                      <Star
                        size={12}
                        fill="currentColor"
                      />
                      <Star
                        size={12}
                        fill="currentColor"
                      />
                    </div>
                  </div>

                  <p>
                    Loved the atmosphere and
                    the way the story unfolds.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}