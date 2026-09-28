import React, { useEffect, useState } from "react";
import {
  Search,
  Sparkles,
  BookOpen,
  Bookmark,
  UserRound,
  SlidersHorizontal,
  Heart,
} from "lucide-react";
import { api } from "../services/api";

export default function Topbar({
  query,
  setQuery,
  onSection,
  section,
  onRecommended,
  onSettings,
}) {
  const [likesOpen, setLikesOpen] =
    useState(false);
  const [notifications, setNotifications] =
    useState([]);
  const [
    notificationsLoading,
    setNotificationsLoading,
  ] = useState(false);

  const loadNotifications = async () => {
    try {
      setNotificationsLoading(true);

      const data =
        await api.getNotifications();

      setNotifications(
        Array.isArray(data)
          ? data
          : []
      );
    } catch (error) {
      console.error(
        "FAILED TO LOAD NOTIFICATIONS:",
        error
      );

      setNotifications([]);
    } finally {
      setNotificationsLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();

    const interval = setInterval(
      loadNotifications,
      15000
    );

    return () =>
      clearInterval(interval);
  }, []);

  useEffect(() => {
    if (likesOpen) {
      loadNotifications();
    }
  }, [likesOpen]);

  return (
    <header className="topbar">
      <button
        className="wordmark"
        onClick={() =>
          onSection("home")
        }
      >
        <span className="wordmark-mark">
          b
        </span>

        booknest
      </button>

      <button
        className="recommend"
        onClick={onRecommended}
      >
        <Sparkles size={16} />
        Recommended for you
      </button>

      <div className="search-wrap">
        <Search size={19} />

        <input
          value={query}
          onChange={(e) =>
            setQuery(e.target.value)
          }
          placeholder="Search books, authors, genres..."
          aria-label="Search books"
        />
      </div>

      <div className="nav-actions">
        <button
          className={`icon-button ${
            section === "read"
              ? "active"
              : ""
          }`}
          onClick={() =>
            onSection("read")
          }
          aria-label="Read books"
        >
          <BookOpen size={22} />
        </button>

        <button
          className={`icon-button ${
            section === "tbr"
              ? "active"
              : ""
          }`}
          onClick={() =>
            onSection("tbr")
          }
          aria-label="TBR"
        >
          <Bookmark size={21} />
        </button>

        <div className="likes-wrap">
          <button
            className={`icon-button ${
              likesOpen
                ? "active"
                : ""
            }`}
            onClick={() =>
              setLikesOpen(
                (current) => !current
              )
            }
            aria-label="People who liked your reviews"
          >
            <Heart
              size={21}
              fill={
                likesOpen
                  ? "currentColor"
                  : "none"
              }
            />

            <span className="likes-count">
              {notifications.length}
            </span>
          </button>

          {likesOpen && (
            <div className="likes-popover">
              <div className="likes-popover-head">
                <div>
                  <p className="eyebrow">
                    Your reviews
                  </p>

                  <strong>
                    People who liked them
                  </strong>
                </div>

                <span>
                  {notifications.length}
                </span>
              </div>

              <div className="likes-list">
                {notificationsLoading ? (
                  <div className="like-person">
                    <div>
                      <span>
                        Loading notifications...
                      </span>
                    </div>
                  </div>
                ) : notifications.length >
                  0 ? (
                  notifications.map(
                    (notification) => {
                      const name =
                        notification
                          .actor
                          ?.username ||
                        "BookNest reader";

                      const bookTitle =
                        notification
                          .book
                          ?.title ||
                        "your book";

                      return (
                        <div
                          className="like-person"
                          key={
                            notification._id
                          }
                        >
                          <div className="like-avatar">
                            {name
                              .charAt(
                                0
                              )
                              .toUpperCase()}
                          </div>

                          <div>
                            <strong>
                              {name}
                            </strong>

                            <span>
                              liked your review of{" "}
                              {bookTitle}
                            </span>
                          </div>
                        </div>
                      );
                    }
                  )
                ) : (
                  <div className="like-person">
                    <div>
                      <span>
                        No one has liked your reviews yet.
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <button
          className={`icon-button ${
            section === "profile"
              ? "active"
              : ""
          }`}
          onClick={() =>
            onSection("profile")
          }
          aria-label="Profile"
        >
          <UserRound size={22} />
        </button>

        <button
          className="icon-button"
          onClick={onSettings}
          aria-label="Settings"
        >
          <SlidersHorizontal
            size={22}
          />
        </button>
      </div>
    </header>
  );
}