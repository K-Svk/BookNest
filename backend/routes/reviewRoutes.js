const express = require("express");
const Review = require("../models/Review");
const LibraryEntry = require("../models/LibraryEntry");
const Notification = require("../models/Notification");
const { authenticateToken } = require("./authRoutes");

const router = express.Router();

router.get("/me", authenticateToken, async (req, res) => {
  try {
    const reviews = await Review.find({
      user: req.userId,
    })
      .populate("book")
      .populate("user", "username")
      .sort({ updatedAt: -1 });

    const formattedReviews = reviews.map((review) => ({
      ...review.toObject(),
      likes: review.likes?.length || 0,
      likedByMe: review.likes?.some(
        (userId) =>
          String(userId) === String(req.userId)
      ),
    }));

    res.status(200).json(formattedReviews);
  } catch (error) {
    console.error("GET REVIEWS ERROR:", error);

    res.status(500).json({
      message: "Failed to fetch reviews",
      error: error.message,
    });
  }
});

router.get(
  "/book/:bookId/all",
  authenticateToken,
  async (req, res) => {
    try {
      const reviews = await Review.find({
        book: req.params.bookId,
      })
        .populate("user", "username")
        .sort({ createdAt: -1 });

      const formattedReviews = reviews.map((review) => ({
        ...review.toObject(),
        likes: review.likes?.length || 0,
        likedByMe: review.likes?.some(
          (userId) =>
            String(userId) === String(req.userId)
        ),
      }));

      res.status(200).json(formattedReviews);
    } catch (error) {
      console.error(
        "GET ALL BOOK REVIEWS ERROR:",
        error
      );

      res.status(500).json({
        message: "Failed to fetch book reviews",
        error: error.message,
      });
    }
  }
);

router.get(
  "/book/:bookId",
  authenticateToken,
  async (req, res) => {
    try {
      const review = await Review.findOne({
        user: req.userId,
        book: req.params.bookId,
      })
        .populate("book")
        .populate("user", "username");

      if (!review) {
        return res.status(200).json(null);
      }

      res.status(200).json({
        ...review.toObject(),
        likes: review.likes?.length || 0,
        likedByMe: review.likes?.some(
          (userId) =>
            String(userId) === String(req.userId)
        ),
      });
    } catch (error) {
      console.error(
        "GET BOOK REVIEW ERROR:",
        error
      );

      res.status(500).json({
        message: "Failed to fetch review",
        error: error.message,
      });
    }
  }
);

router.post("/", authenticateToken, async (req, res) => {
  try {
    const {
      bookId,
      rating,
      text,
    } = req.body;

    const trimmedText =
      typeof text === "string"
        ? text.trim()
        : "";

    const numericRating = Number(rating);

    if (!bookId) {
      return res.status(400).json({
        message: "Book ID is required",
      });
    }

    if (
      !Number.isFinite(numericRating) ||
      numericRating < 1 ||
      numericRating > 5
    ) {
      return res.status(400).json({
        message: "Rating must be between 1 and 5",
      });
    }

    if (!trimmedText) {
      return res.status(400).json({
        message: "Review cannot be empty",
      });
    }

    const review = await Review.findOneAndUpdate(
      {
        user: req.userId,
        book: bookId,
      },
      {
        user: req.userId,
        book: bookId,
        rating: numericRating,
        text: trimmedText,
      },
      {
        new: true,
        upsert: true,
        runValidators: true,
        setDefaultsOnInsert: true,
      }
    )
      .populate("book")
      .populate("user", "username");

    await LibraryEntry.findOneAndUpdate(
      {
        user: req.userId,
        book: bookId,
      },
      {
        user: req.userId,
        book: bookId,
        rating: numericRating,
        $setOnInsert: {
          status: "tbr",
          currentPage: 0,
        },
      },
      {
        upsert: true,
        new: true,
        runValidators: true,
        setDefaultsOnInsert: true,
      }
    );

    res.status(200).json({
      ...review.toObject(),
      likes: review.likes?.length || 0,
      likedByMe: true,
    });
  } catch (error) {
    console.error("SAVE REVIEW ERROR:", error);

    res.status(500).json({
      message: "Failed to save review",
      error: error.message,
    });
  }
});

router.post(
  "/:reviewId/like",
  authenticateToken,
  async (req, res) => {
    try {
      const review = await Review.findById(
        req.params.reviewId
      ).populate("book");

      if (!review) {
        return res.status(404).json({
          message: "Review not found",
        });
      }

      if (
        String(review.user) ===
        String(req.userId)
      ) {
        return res.status(400).json({
          message: "You cannot like your own review",
        });
      }

      const alreadyLiked =
        review.likes?.some(
          (userId) =>
            String(userId) ===
            String(req.userId)
        );

      if (!alreadyLiked) {
        review.likes.push(req.userId);
        await review.save();

        await Notification.findOneAndUpdate(
          {
            recipient: review.user,
            actor: req.userId,
            review: review._id,
          },
          {
            recipient: review.user,
            actor: req.userId,
            review: review._id,
            book: review.book._id,
            type: "review_like",
          },
          {
            upsert: true,
            new: true,
            setDefaultsOnInsert: true,
          }
        );
      }

      const updatedReview =
        await Review.findById(
          review._id
        );

      res.status(200).json({
        liked: true,
        likes:
          updatedReview?.likes?.length || 0,
      });
    } catch (error) {
      console.error(
        "LIKE REVIEW ERROR:",
        error
      );

      res.status(500).json({
        message: "Failed to like review",
        error: error.message,
      });
    }
  }
);

router.delete(
  "/:reviewId/like",
  authenticateToken,
  async (req, res) => {
    try {
      const review = await Review.findById(
        req.params.reviewId
      );

      if (!review) {
        return res.status(404).json({
          message: "Review not found",
        });
      }

      await Review.findByIdAndUpdate(
        review._id,
        {
          $pull: {
            likes: req.userId,
          },
        }
      );

      await Notification.findOneAndDelete({
        recipient: review.user,
        actor: req.userId,
        review: review._id,
        type: "review_like",
      });

      const updatedReview =
        await Review.findById(
          review._id
        );

      res.status(200).json({
        liked: false,
        likes:
          updatedReview?.likes?.length || 0,
      });
    } catch (error) {
      console.error(
        "UNLIKE REVIEW ERROR:",
        error
      );

      res.status(500).json({
        message: "Failed to unlike review",
        error: error.message,
      });
    }
  }
);

module.exports = router;