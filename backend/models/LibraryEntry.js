const mongoose = require("mongoose");

const libraryEntrySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    book: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
      required: true,
    },

    status: {
      type: String,
      enum: ["tbr", "currently", "read"],
      required: true,
      default: "tbr",
    },

    currentPage: {
      type: Number,
      default: 0,
    },

    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// A user should only have one library entry for a particular book
libraryEntrySchema.index(
  { user: 1, book: 1 },
  { unique: true }
);

module.exports = mongoose.model(
  "LibraryEntry",
  libraryEntrySchema
);