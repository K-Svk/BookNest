const express = require("express");
const Notification = require("../models/Notification");
const { authenticateToken } = require("./authRoutes");

const router = express.Router();

router.get(
  "/",
  authenticateToken,
  async (req, res) => {
    try {
      const notifications =
        await Notification.find({
          recipient: req.userId,
          type: "review_like",
        })
          .populate("actor", "username")
          .populate("book", "title")
          .sort({ createdAt: -1 });

      const formattedNotifications =
        notifications.map(
          (notification) => ({
            _id: notification._id,
            type: notification.type,
            actor: notification.actor,
            book: notification.book,
            createdAt:
              notification.createdAt,
          })
        );

      res.status(200).json(
        formattedNotifications
      );
    } catch (error) {
      console.error(
        "GET NOTIFICATIONS ERROR:",
        error
      );

      res.status(500).json({
        message:
          "Failed to fetch notifications",
        error: error.message,
      });
    }
  }
);

module.exports = router;