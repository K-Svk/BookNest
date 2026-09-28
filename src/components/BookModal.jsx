import React, { useEffect, useState } from "react";
import {
  X,
  ChevronLeft,
  ChevronRight,
  BookmarkPlus,
  MessageCircle,
  Heart,
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
  const [rating, setRating] = useState(book.userRating || 0);
  const [review, setReview] = useState("");
  const [savedReview, setSavedReview] = useState(null);
  const [allReviews, setAllReviews] = useState([]);
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewSaving, setReviewSaving] = useState(false);
  const [reviewLikeLoading, setReviewLikeLoading] = useState({});
  const [actionLoading, setActionLoading] = useState(false);
  const [progressSaving, setProgressSaving] = useState(false);
  const [actionMessage, setActionMessage] = useState("");
  const [localStatus, setLocalStatus] = useState(book.status || null);
  const [localLibraryEntryId, setLocalLibraryEntryId] = useState(
    book.libraryEntryId || null
  );
  const [currentPage, setCurrentPage] = useState(
    Number(book.currentPage) || 0
  );
  const [pageInput, setPageInput] = useState(
    String(Number(book.currentPage) || 0)
  );

  useEffect(() => {
    const savedPage = Number(book.currentPage) || 0;

    setRating(book.userRating || 0);
    setReview("");
    setSavedReview(null);
    setAllReviews([]);
    setReviewLikeLoading({});
    setLocalStatus(book.status || null);
    setLocalLibraryEntryId(book.libraryEntryId || null);
    setCurrentPage(savedPage);
    setPageInput(String(savedPage));
    setActionMessage("");
    setBlurb(false);
    setCommentsOpen(false);
  }, [book.id]);

  useEffect(() => {
    if (!commentsOpen || !book.id) {
      return;
    }

    const loadReviews = async () => {
      setReviewLoading(true);

      try {
        const [existingReview, bookReviews] = await Promise.all([
          api.getMyReviewForBook(book.id),
          api.getBookReviews(book.id),
        ]);

        if (existingReview) {
          setSavedReview(existingReview);
          setReview(existingReview.text || "");

          if (existingReview.rating) {
            setRating(Number(existingReview.rating));
          }
        } else {
          setSavedReview(null);
          setReview("");
        }

        setAllReviews(
          Array.isArray(bookReviews) ? bookReviews : []
        );
      } catch (error) {
        console.error("FAILED TO LOAD REVIEWS:", error);
      } finally {
        setReviewLoading(false);
      }
    };

    loadReviews();
  }, [commentsOpen, book.id]);

  const totalPages = Number(book.pages) || 0;

  const progressPercentage =
    totalPages > 0
      ? Math.min(
          100,
          Math.round((currentPage / totalPages) * 100)
        )
      : 0;

  const updateLibrary = async (status) => {
    if (actionLoading || !book.id) {
      return;
    }

    setActionLoading(true);
    setActionMessage("");

    try {
      let updatedEntry;

      if (localLibraryEntryId) {
        updatedEntry = await api.updateLibraryEntry(book.id, {
          status,
        });
      } else {
        updatedEntry = await api.addToLibrary({
          bookId: book.id,
          status,
        });
      }

      setLocalStatus(updatedEntry?.status || status);

      if (updatedEntry?._id) {
        setLocalLibraryEntryId(updatedEntry._id);
      }

      if (updatedEntry?.currentPage !== undefined) {
        const savedPage = Number(updatedEntry.currentPage) || 0;

        setCurrentPage(savedPage);
        setPageInput(String(savedPage));
      }

      if (onLibraryChange) {
        onLibraryChange(updatedEntry);
      }

      const messages = {
        tbr: "Added to your TBR",
        currently: "Now currently reading",
        read: "Marked as read",
      };

      setActionMessage(messages[status] || "Library updated");
    } catch (error) {
      console.error("LIBRARY UPDATE FAILED:", error);

      setActionMessage(
        error.message || "Something went wrong"
      );
    } finally {
      setActionLoading(false);
    }
  };

  const handleProgressSave = async () => {
    if (
      progressSaving ||
      actionLoading ||
      !book.id
    ) {
      return;
    }

    const enteredPage = Number(pageInput);

    if (!Number.isFinite(enteredPage)) {
      setActionMessage("Please enter a valid page number");
      return;
    }

    const clampedPage = Math.max(
      0,
      totalPages > 0
        ? Math.min(Math.floor(enteredPage), totalPages)
        : Math.floor(enteredPage)
    );

    setProgressSaving(true);
    setActionMessage("");

    try {
      let updatedEntry;

      if (localLibraryEntryId) {
        updatedEntry = await api.updateLibraryEntry(book.id, {
          currentPage: clampedPage,
        });
      } else {
        updatedEntry = await api.addToLibrary({
          bookId: book.id,
          status: "currently",
          currentPage: clampedPage,
        });

        setLocalStatus("currently");

        if (updatedEntry?._id) {
          setLocalLibraryEntryId(updatedEntry._id);
        }
      }

      const savedPage =
        Number(updatedEntry?.currentPage) || clampedPage;

      setCurrentPage(savedPage);
      setPageInput(String(savedPage));

      if (updatedEntry?.status) {
        setLocalStatus(updatedEntry.status);
      }

      if (onLibraryChange) {
        onLibraryChange(updatedEntry, null, true);
      }

      setActionMessage("Reading progress saved");
    } catch (error) {
      console.error(
        "READING PROGRESS UPDATE FAILED:",
        error
      );

      setActionMessage(
        error.message || "Could not save reading progress"
      );
    } finally {
      setProgressSaving(false);
    }
  };

  const handlePageInputKeyDown = (event) => {
    if (event.key === "Enter") {
      handleProgressSave();
    }
  };

  const handleRemove = async () => {
    if (
      !localLibraryEntryId ||
      actionLoading ||
      !book.id
    ) {
      return;
    }

    setActionLoading(true);
    setActionMessage("");

    try {
      await api.removeFromLibrary(book.id);

      setLocalStatus(null);
      setLocalLibraryEntryId(null);
      setCurrentPage(0);
      setPageInput("0");

      if (onLibraryChange) {
        onLibraryChange(null, book.id);
      }

      setActionMessage("Removed from your library");
    } catch (error) {
      console.error("REMOVE FAILED:", error);

      setActionMessage(
        error.message || "Could not remove this book"
      );
    } finally {
      setActionLoading(false);
    }
  };

  const handleRating = async (value) => {
    if (
      actionLoading ||
      progressSaving ||
      reviewSaving ||
      !book.id
    ) {
      return;
    }

    setRating(value);
    setActionMessage("");

    try {
      let updatedEntry;

      if (localLibraryEntryId) {
        updatedEntry = await api.updateLibraryEntry(book.id, {
          rating: value,
        });
      } else {
        updatedEntry = await api.addToLibrary({
          bookId: book.id,
          status: "tbr",
          rating: value,
        });

        setLocalStatus("tbr");

        if (updatedEntry?._id) {
          setLocalLibraryEntryId(updatedEntry._id);
        }
      }

      if (onLibraryChange) {
        onLibraryChange(updatedEntry, null, true);
      }
    } catch (error) {
      console.error("RATING FAILED:", error);

      setActionMessage(
        error.message || "Could not save rating"
      );
    }
  };

  const handleReview = async () => {
    const trimmedReview = review.trim();

    if (
      !trimmedReview ||
      rating === 0 ||
      reviewSaving ||
      !book.id
    ) {
      return;
    }

    setReviewSaving(true);
    setActionMessage("");

    try {
      const saved = await api.saveReview({
        bookId: book.id,
        rating,
        text: trimmedReview,
      });

      setSavedReview(saved);

      setReview(saved?.text || trimmedReview);

      if (saved?.rating) {
        setRating(Number(saved.rating));
      }

      if (saved?.rating && onLibraryChange) {
        if (localLibraryEntryId) {
          const updatedEntry =
            await api.updateLibraryEntry(book.id, {
              rating: Number(saved.rating),
            });

          onLibraryChange(updatedEntry, null, true);
        }
      }

      const updatedReviews =
        await api.getBookReviews(book.id);

      setAllReviews(
        Array.isArray(updatedReviews)
          ? updatedReviews
          : []
      );

      setActionMessage("Your review has been posted!");
    } catch (error) {
      console.error("REVIEW SAVE FAILED:", error);

      setActionMessage(
        error.message || "Could not post your review"
      );
    } finally {
      setReviewSaving(false);
    }
  };

  const handleReviewLike = async (reviewItem) => {
    if (
      !reviewItem?._id ||
      reviewLikeLoading[reviewItem._id]
    ) {
      return;
    }

    const reviewId = reviewItem._id;

    const isLiked = Boolean(reviewItem.likedByMe);

    setReviewLikeLoading((current) => ({
      ...current,
      [reviewId]: true,
    }));

    try {
      const result = isLiked
        ? await api.unlikeReview(reviewId)
        : await api.likeReview(reviewId);

      setAllReviews((currentReviews) =>
        currentReviews.map((item) =>
          String(item._id) === String(reviewId)
            ? {
                ...item,
                likedByMe: Boolean(result.liked),
                likes: Number(result.likes) || 0,
              }
            : item
        )
      );
    } catch (error) {
      console.error(
        "REVIEW LIKE FAILED:",
        error
      );

      setActionMessage(
        error.message || "Could not update review like"
      );
    } finally {
      setReviewLikeLoading((current) => ({
        ...current,
        [reviewId]: false,
      }));
    }
  };

  const isTbr = localStatus === "tbr";

  const isCurrentlyReading =
    localStatus === "currently";

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
        <button
          className="close-modal"
          onClick={onClose}
          aria-label="Close"
        >
          <X size={20} />
        </button>

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
              onClick={() =>
                setBlurb(true)
              }
            >
              Read the blurb
              <ChevronRight size={17} />
            </button>
          </div>
        </div>

        <div className="modal-page blurb-page">
          <div className="paper-fold"></div>

          <p className="eyebrow">
            A little about this book
          </p>

          <h2>{book.title}</h2>

          <p className="blurb">
            {book.blurb}
          </p>

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
          </div>

          <div className="library-actions">
            <button
              className={`library-action ${
                localStatus === "tbr"
                  ? "active"
                  : ""
              }`}
              onClick={() =>
                updateLibrary("tbr")
              }
              disabled={
                actionLoading ||
                progressSaving ||
                isTbr
              }
            >
              <BookmarkPlus size={16} />
              {isTbr ? "In TBR" : "TBR"}
            </button>

            <button
              className={`library-action ${
                localStatus === "currently"
                  ? "active"
                  : ""
              }`}
              onClick={() =>
                updateLibrary("currently")
              }
              disabled={
                actionLoading ||
                progressSaving
              }
            >
              <BookOpen size={16} />
              Reading
            </button>

            <button
              className={`library-action ${
                localStatus === "read"
                  ? "active"
                  : ""
              }`}
              onClick={() =>
                updateLibrary("read")
              }
              disabled={
                actionLoading ||
                progressSaving
              }
            >
              <Check size={16} />
              Read
            </button>
          </div>

          {isCurrentlyReading && (
            <div className="modal-reading-progress">
              <div className="modal-reading-progress-head">
                <span className="modal-reading-progress-label">
                  Reading progress
                </span>

                <span className="modal-reading-progress-percent">
                  {progressPercentage}%
                </span>
              </div>

              <div className="modal-reading-progress-track">
                <div
                  className="modal-reading-progress-fill"
                  style={{
                    width: `${progressPercentage}%`,
                  }}
                ></div>
              </div>

              <div className="modal-reading-progress-meta">
                <span>
                  {currentPage}{" "}
                  {totalPages > 0
                    ? `of ${totalPages} pages`
                    : "pages read"}
                </span>
              </div>

              <div className="modal-reading-progress-controls">
                <input
                  className="modal-reading-progress-page"
                  type="number"
                  min="0"
                  max={
                    totalPages > 0
                      ? totalPages
                      : undefined
                  }
                  value={pageInput}
                  onChange={(event) =>
                    setPageInput(
                      event.target.value
                    )
                  }
                  onKeyDown={
                    handlePageInputKeyDown
                  }
                  aria-label="Current page"
                />

                <button
                  className="modal-reading-progress-save"
                  onClick={
                    handleProgressSave
                  }
                  disabled={
                    progressSaving ||
                    actionLoading
                  }
                >
                  {progressSaving
                    ? "Saving..."
                    : "Save"}
                </button>
              </div>
            </div>
          )}

          {actionMessage && (
            <p className="library-message">
              {actionMessage}
            </p>
          )}

          {localLibraryEntryId && (
            <button
              className="remove-library-btn"
              onClick={handleRemove}
              disabled={
                actionLoading ||
                progressSaving
              }
            >
              <Trash2 size={15} />
              Remove from library
            </button>
          )}

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
              disabled={
                actionLoading ||
                progressSaving ||
                isTbr
              }
            >
              <BookmarkPlus size={16} />
              {isTbr
                ? "In my TBR"
                : "Add to TBR"}
            </button>
          </div>
        </div>

        <div className="modal-dots">
          <span
            className={!blurb ? "on" : ""}
          ></span>

          <span
            className={blurb ? "on" : ""}
          ></span>
        </div>

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
                        disabled={
                          reviewSaving
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
                  disabled={
                    reviewLoading ||
                    reviewSaving
                  }
                />

                <button
                  className="primary-btn"
                  onClick={handleReview}
                  disabled={
                    reviewLoading ||
                    reviewSaving ||
                    !review.trim() ||
                    rating === 0
                  }
                >
                  {reviewSaving
                    ? "Posting..."
                    : savedReview
                    ? "Update review"
                    : "Post review"}
                </button>
              </div>

              {actionMessage && (
                <p className="library-message">
                  {actionMessage}
                </p>
              )}

              <div className="existing-reviews">
                {reviewLoading ? (
                  <div className="review">
                    <p>
                      Loading reviews...
                    </p>
                  </div>
                ) : allReviews.length > 0 ? (
                  allReviews.map(
                    (item) => {
                      const username =
                        item.user?.username ||
                        "BookNest reader";

                      const reviewRating =
                        Number(
                          item.rating
                        ) || 0;

                      const isOwnReview =
                        savedReview &&
                        String(
                          savedReview._id
                        ) ===
                          String(
                            item._id
                          );

                      const likeCount =
                        Number(
                          item.likes
                        ) || 0;

                      const liked =
                        Boolean(
                          item.likedByMe
                        );

                      const likeLoading =
                        Boolean(
                          reviewLikeLoading[
                            item._id
                          ]
                        );

                      return (
                        <div
                          className={`review ${
                            isOwnReview
                              ? "own-review"
                              : ""
                          }`}
                          key={item._id}
                        >
                          <div className="review-top">
                            <strong>
                              {isOwnReview
                                ? "You"
                                : username}
                            </strong>

                            <div className="mini-stars">
                              {[1, 2, 3, 4, 5].map(
                                (star) => (
                                  <Star
                                    key={
                                      star
                                    }
                                    size={
                                      12
                                    }
                                    fill={
                                      star <=
                                      reviewRating
                                        ? "currentColor"
                                        : "none"
                                    }
                                  />
                                )
                              )}
                            </div>
                          </div>

                          <p>
                            {item.text}
                          </p>

                          {!isOwnReview && (
                            <button
                              className={`community-btn review-like-btn ${
                                liked
                                  ? "liked"
                                  : ""
                              }`}
                              onClick={() =>
                                handleReviewLike(
                                  item
                                )
                              }
                              disabled={
                                likeLoading
                              }
                              aria-label={
                                liked
                                  ? "Unlike review"
                                  : "Like review"
                              }
                            >
                              <Heart
                                size={15}
                                fill={
                                  liked
                                    ? "currentColor"
                                    : "none"
                                }
                              />

                              {likeCount}
                            </button>
                          )}

                          {isOwnReview &&
                            likeCount > 0 && (
                              <span className="review-like-count">
                                <Heart
                                  size={14}
                                  fill="currentColor"
                                />
                                {likeCount}
                              </span>
                            )}
                        </div>
                      );
                    }
                  )
                ) : (
                  <div className="review">
                    <p>
                      No reviews yet. Be the first to review this book!
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}