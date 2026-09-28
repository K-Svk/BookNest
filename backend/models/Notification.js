const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    actor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    review: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Review",
      required: true,
    },

    book: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
      required: true,
    },

    type: {
      type: String,
      enum: ["review_like"],
      default: "review_like",
    },
  },
  {
    timestamps: true,
  }
);

notificationSchema.index(
  {
    recipient: 1,
    actor: 1,
    review: 1,
  },
  {
    unique: true,
  }
);

module.exports = mongoose.model(
  "Notification",
  notificationSchema
);