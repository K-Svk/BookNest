import React, { useState } from "react";
import {
  X,
  ChevronLeft,
  ChevronRight,
  BookmarkPlus,
  MessageCircle,
  Flame,
  Star,
} from "lucide-react";

export default function BookModal({ book, onClose }) {
  const [blurb, setBlurb] = useState(false);
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [hyped, setHyped] = useState(false);
  const [hypeCount, setHypeCount] = useState(24);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");

  const handleHype = () => {
    if (hyped) {
      setHyped(false);
      setHypeCount((count) => count - 1);
    } else {
      setHyped(true);
      setHypeCount((count) => count + 1);
    }
  };

  const handleReview = () => {
    if (!review.trim() || rating === 0) return;

    alert("Your review has been posted!");
    setReview("");
    setRating(0);
    setCommentsOpen(false);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <section
        className={`book-modal ${blurb ? "show-blurb" : ""}`}
        onClick={(event) => event.stopPropagation()}
      >
        {/* Close button */}
        <button
          className="close-modal"
          onClick={onClose}
          aria-label="Close"
        >
          <X size={20} />
        </button>

        {/* COVER PAGE */}
        <div className="modal-page cover-page">
          <img src={book.cover} alt={book.title} />

          <div className="cover-page-copy">
            <p className="eyebrow">{book.genre}</p>

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

        {/* BLURB PAGE */}
        <div className="modal-page blurb-page">
          <div className="paper-fold"></div>

          <p className="eyebrow">A little about this book</p>

          <h2>{book.title}</h2>

          <p className="blurb">{book.blurb}</p>

          {/* Community actions */}
          <div className="community-actions">
            <button
              className="community-btn"
              onClick={() => setCommentsOpen(true)}
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

          {/* Bottom actions */}
          <div className="page-actions">
            <button
              className="ghost-btn"
              onClick={() => setBlurb(false)}
            >
              <ChevronLeft size={16} />
              Cover
            </button>

            <button className="primary-btn">
              <BookmarkPlus size={16} />
              Add to TBR
            </button>
          </div>
        </div>

        {/* Page indicators */}
        <div className="modal-dots">
          <span className={!blurb ? "on" : ""}></span>
          <span className={blurb ? "on" : ""}></span>
        </div>

        {/* COMMENTS / REVIEWS PANEL */}
        {commentsOpen && (
          <div
            className="comments-overlay"
            onClick={() => setCommentsOpen(false)}
          >
            <div
              className="comments-panel"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="comments-header">
                <div>
                  <p className="eyebrow">Community</p>
                  <h3>Reviews & ratings</h3>
                </div>

                <button
                  className="comments-close"
                  onClick={() => setCommentsOpen(false)}
                  aria-label="Close reviews"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Rating */}
              <div className="rating-section">
                <span className="rating-label">
                  Rate this book
                </span>

                <div className="star-row">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      className={`star-button ${
                        star <= rating ? "selected" : ""
                      }`}
                      onClick={() => setRating(star)}
                      aria-label={`Rate ${star} out of 5`}
                    >
                      <Star
                        size={21}
                        fill={star <= rating ? "currentColor" : "none"}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Review input */}
              <div className="review-form">
                <textarea
                  value={review}
                  onChange={(event) => setReview(event.target.value)}
                  placeholder="What did you think about this book?"
                  rows={4}
                />

                <button
                  className="primary-btn"
                  onClick={handleReview}
                  disabled={!review.trim() || rating === 0}
                >
                  Post review
                </button>
              </div>

              {/* Existing reviews */}
              <div className="existing-reviews">
                <div className="review">
                  <div className="review-top">
                    <strong>Aditi</strong>

                    <div className="mini-stars">
                      <Star size={12} fill="currentColor" />
                      <Star size={12} fill="currentColor" />
                      <Star size={12} fill="currentColor" />
                      <Star size={12} fill="currentColor" />
                      <Star size={12} fill="currentColor" />
                    </div>
                  </div>

                  <p>
                    One of those books that stays in your head long
                    after you finish it.
                  </p>
                </div>

                <div className="review">
                  <div className="review-top">
                    <strong>Rhea</strong>

                    <div className="mini-stars">
                      <Star size={12} fill="currentColor" />
                      <Star size={12} fill="currentColor" />
                      <Star size={12} fill="currentColor" />
                      <Star size={12} fill="currentColor" />
                    </div>
                  </div>

                  <p>
                    Loved the atmosphere and the way the story
                    unfolds.
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