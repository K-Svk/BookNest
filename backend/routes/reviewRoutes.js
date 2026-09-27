const express = require("express");
const Review = require("../models/Review");
const LibraryEntry = require("../models/LibraryEntry");
const { authenticateToken } = require("./authRoutes");

const router = express.Router();

router.get("/me", authenticateToken, async (req, res) => {
  try {
    const reviews = await Review.find({
      user: req.userId,
    })
      .populate("book")
      .sort({ updatedAt: -1 });

    res.status(200).json(reviews);
  } catch (error) {
    console.error("GET REVIEWS ERROR:", error);

    res.status(500).json({
      message: "Failed to fetch reviews",
      error: error.message,
    });
  }
});

router.get(
  "/book/:bookId",
  authenticateToken,
  async (req, res) => {
    try {
      const review = await Review.findOne({
        user: req.userId,
        book: req.params.bookId,
      }).populate("book");

      res.status(200).json(review || null);
    } catch (error) {
      console.error("GET BOOK REVIEW ERROR:", error);

      res.status(500).json({
        message: "Failed to fetch book review",
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
    ).populate("book");

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

    res.status(200).json(review);
  } catch (error) {
    console.error("SAVE REVIEW ERROR:", error);

    res.status(500).json({
      message: "Failed to save review",
      error: error.message,
    });
  }
});

module.exports = router;