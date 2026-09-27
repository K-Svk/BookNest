const express = require("express");
const jwt = require("jsonwebtoken");
const LibraryEntry = require("../models/LibraryEntry");

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET;

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  console.log("\n--- JWT DEBUG ---");
  console.log("Authorization header:", authHeader ? "Present" : "Missing");

  if (!authHeader) {
    console.log("JWT ERROR: No Authorization header");

    return res.status(401).json({
      message: "Access token required",
    });
  }

  if (!authHeader.startsWith("Bearer ")) {
    console.log(
      "JWT ERROR: Authorization header does not start with Bearer"
    );

    return res.status(401).json({
      message: "Invalid authorization format",
    });
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    console.log("JWT ERROR: Token missing after Bearer");

    return res.status(401).json({
      message: "Access token required",
    });
  }

  if (!JWT_SECRET) {
    console.log(
      "JWT ERROR: JWT_SECRET is missing from environment variables"
    );

    return res.status(500).json({
      message: "Server authentication configuration error",
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    console.log("JWT VERIFIED SUCCESSFULLY");
    console.log("Decoded token:", decoded);

    req.userId = decoded.userId;

    if (!req.userId) {
      console.log("JWT ERROR: Token does not contain userId");

      return res.status(401).json({
        message: "Invalid token payload",
      });
    }

    next();
  } catch (error) {
    console.log("JWT VERIFICATION ERROR:", error.message);

    return res.status(401).json({
      message: "Invalid or expired token",
      error: error.message,
    });
  }
};

router.get("/", authenticateToken, async (req, res) => {
  try {
    const entries = await LibraryEntry.find({
      user: req.userId,
    }).populate("book");

    res.status(200).json(entries);
  } catch (error) {
    console.error("GET LIBRARY ERROR:", error);

    res.status(500).json({
      message: "Failed to fetch library",
      error: error.message,
    });
  }
});

router.post("/", authenticateToken, async (req, res) => {
  try {
    const {
      bookId,
      status,
      currentPage = 0,
      rating = 0,
    } = req.body;

    if (!bookId || !status) {
      return res.status(400).json({
        message: "bookId and status are required",
      });
    }

    const validStatuses = ["tbr", "currently", "read"];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid library status",
      });
    }

    if (status === "currently") {
      await LibraryEntry.updateMany(
        {
          user: req.userId,
          status: "currently",
          book: { $ne: bookId },
        },
        {
          $set: {
            status: "read",
          },
        }
      );
    }

    const existingEntry = await LibraryEntry.findOne({
      user: req.userId,
      book: bookId,
    });

    if (existingEntry) {
      existingEntry.status = status;
      existingEntry.currentPage = currentPage;
      existingEntry.rating = rating;

      await existingEntry.save();

      const updatedEntry = await LibraryEntry.findById(
        existingEntry._id
      ).populate("book");

      return res.status(200).json(updatedEntry);
    }

    const newEntry = new LibraryEntry({
      user: req.userId,
      book: bookId,
      status,
      currentPage,
      rating,
    });

    await newEntry.save();

    const populatedEntry = await LibraryEntry.findById(
      newEntry._id
    ).populate("book");

    res.status(201).json(populatedEntry);
  } catch (error) {
    console.error("ADD LIBRARY ENTRY ERROR:", error);

    res.status(500).json({
      message: "Failed to add book to library",
      error: error.message,
    });
  }
});

router.put("/:bookId", authenticateToken, async (req, res) => {
  try {
    const { bookId } = req.params;
    const {
      status,
      currentPage,
      rating,
    } = req.body;

    const validStatuses = ["tbr", "currently", "read"];

    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid library status",
      });
    }

    const entry = await LibraryEntry.findOne({
      user: req.userId,
      book: bookId,
    });

    if (!entry) {
      return res.status(404).json({
        message: "Book not found in your library",
      });
    }

    if (status === "currently") {
      await LibraryEntry.updateMany(
        {
          user: req.userId,
          status: "currently",
          book: { $ne: bookId },
        },
        {
          $set: {
            status: "read",
          },
        }
      );
    }

    if (status !== undefined) {
      entry.status = status;
    }

    if (currentPage !== undefined) {
      entry.currentPage = currentPage;
    }

    if (rating !== undefined) {
      entry.rating = rating;
    }

    await entry.save();

    const updatedEntry = await LibraryEntry.findById(
      entry._id
    ).populate("book");

    res.status(200).json(updatedEntry);
  } catch (error) {
    console.error("UPDATE LIBRARY ENTRY ERROR:", error);

    res.status(500).json({
      message: "Failed to update library entry",
      error: error.message,
    });
  }
});

router.delete("/:bookId", authenticateToken, async (req, res) => {
  try {
    const { bookId } = req.params;

    const entry = await LibraryEntry.findOneAndDelete({
      user: req.userId,
      book: bookId,
    });

    if (!entry) {
      return res.status(404).json({
        message: "Book not found in your library",
      });
    }

    res.status(200).json({
      message: "Book removed from library",
    });
  } catch (error) {
    console.error("DELETE LIBRARY ENTRY ERROR:", error);

    res.status(500).json({
      message: "Failed to remove book from library",
      error: error.message,
    });
  }
});

module.exports = router;