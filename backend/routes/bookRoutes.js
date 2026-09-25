const express = require("express");
const Book = require("../models/Book");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const book = new Book(req.body);

    const savedBook = await book.save();

    res.status(201).json(savedBook);
  } catch (error) {
    res.status(500).json({
      message: "Failed to add book",
      error: error.message,
    });
  }
});

module.exports = router;