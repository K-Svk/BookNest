const API_URL = "http://localhost:5000/api";

export const api = {
  // =========================================
  // BOOKS
  // =========================================

  getBooks: async () => {
    const response = await fetch(`${API_URL}/books`);

    if (!response.ok) {
      throw new Error("Failed to fetch books");
    }

    const books = await response.json();

    return books.map((book) => ({
      ...book,

      id: book._id,
      cover: book.coverImage || "",
      blurb: book.description || "",
      genre: book.genres || [],
      year: book.publishedYear,
      rating: book.averageRating || 0,
    }));
  },

  getBook: async (id) => {
    const response = await fetch(
      `${API_URL}/books/${id}`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch book");
    }

    const book = await response.json();

    return {
      ...book,

      id: book._id,
      cover: book.coverImage || "",
      blurb: book.description || "",
      genre: book.genres || [],
      year: book.publishedYear,
      rating: book.averageRating || 0,
    };
  },


  // =========================================
  // USER LIBRARY
  // =========================================

  getLibrary: async () => {
    const token = localStorage.getItem(
      "booknestToken"
    );

    const response = await fetch(
      `${API_URL}/library`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch library");
    }

    return response.json();
  },


  // =========================================
  // ADD BOOK TO LIBRARY
  // =========================================

  addToLibrary: async ({
    bookId,
    status = "tbr",
    currentPage = 0,
    rating = 0,
  }) => {
    const token = localStorage.getItem(
      "booknestToken"
    );

    const response = await fetch(
      `${API_URL}/library`,
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify({
          bookId,
          status,
          currentPage,
          rating,
        }),
      }
    );

    if (!response.ok) {
      const error = await response.json();

      throw new Error(
        error.message ||
          "Failed to add book to library"
      );
    }

    return response.json();
  },


  // =========================================
  // UPDATE LIBRARY ENTRY
  // =========================================

  updateLibraryEntry: async (
    id,
    updates
  ) => {
    const token = localStorage.getItem(
      "booknestToken"
    );

    const response = await fetch(
      `${API_URL}/library/${id}`,
      {
        method: "PUT",

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify(updates),
      }
    );

    if (!response.ok) {
      const error = await response.json();

      throw new Error(
        error.message ||
          "Failed to update library entry"
      );
    }

    return response.json();
  },


  // =========================================
  // REMOVE FROM LIBRARY
  // =========================================

  removeFromLibrary: async (id) => {
    const token = localStorage.getItem(
      "booknestToken"
    );

    const response = await fetch(
      `${API_URL}/library/${id}`,
      {
        method: "DELETE",

        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      const error = await response.json();

      throw new Error(
        error.message ||
          "Failed to remove book from library"
      );
    }

    return response.json();
  },
};