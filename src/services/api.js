const API_URL = "http://localhost:5000/api";

const getToken = () => {
  return localStorage.getItem("booknestToken");
};

const getAuthHeaders = () => {
  const token = getToken();

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

const normalizeBook = (book) => {
  if (!book) return null;

  return {
    ...book,
    id: book._id || book.id,
    cover: book.coverImage || book.cover || "",
    blurb: book.description || book.blurb || "",
    genre: book.genres || book.genre || [],
    year: book.publishedYear || book.year,
    rating: book.averageRating || book.rating || 0,
  };
};

export const api = {
  getBooks: async () => {
    const response = await fetch(`${API_URL}/books`);

    if (!response.ok) {
      throw new Error("Failed to fetch books");
    }

    const books = await response.json();

    return books.map(normalizeBook);
  },

  getBook: async (id) => {
    const response = await fetch(`${API_URL}/books/${id}`);

    if (!response.ok) {
      throw new Error("Failed to fetch book");
    }

    const book = await response.json();

    return normalizeBook(book);
  },

  getLibrary: async () => {
    const token = getToken();

    if (!token) {
      throw new Error("You are not logged in");
    }

    const response = await fetch(`${API_URL}/library`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      let errorMessage = "Failed to fetch library";

      try {
        const error = await response.json();

        if (error.message) {
          errorMessage = error.message;
        }
      } catch {
        // Ignore JSON parsing errors
      }

      throw new Error(errorMessage);
    }

    return response.json();
  },

  addToLibrary: async ({
    bookId,
    status = "tbr",
    currentPage = 0,
    rating = 0,
  }) => {
    const token = getToken();

    if (!token) {
      throw new Error("You are not logged in");
    }

    if (!bookId) {
      throw new Error("Book ID is required");
    }

    const response = await fetch(`${API_URL}/library`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({
        bookId,
        status,
        currentPage,
        rating,
      }),
    });

    if (!response.ok) {
      let errorMessage = "Failed to add book to library";

      try {
        const error = await response.json();

        if (error.message) {
          errorMessage = error.message;
        }
      } catch {
        // Ignore JSON parsing errors
      }

      throw new Error(errorMessage);
    }

    return response.json();
  },

  updateLibraryEntry: async (bookId, updates) => {
    const token = getToken();

    if (!token) {
      throw new Error("You are not logged in");
    }

    if (!bookId) {
      throw new Error("Book ID is required");
    }

    const response = await fetch(`${API_URL}/library/${bookId}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(updates),
    });

    if (!response.ok) {
      let errorMessage = "Failed to update library entry";

      try {
        const error = await response.json();

        if (error.message) {
          errorMessage = error.message;
        }
      } catch {
        // Ignore JSON parsing errors
      }

      throw new Error(errorMessage);
    }

    return response.json();
  },

  removeFromLibrary: async (bookId) => {
    const token = getToken();

    if (!token) {
      throw new Error("You are not logged in");
    }

    if (!bookId) {
      throw new Error("Book ID is required");
    }

    const response = await fetch(`${API_URL}/library/${bookId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      let errorMessage = "Failed to remove book from library";

      try {
        const error = await response.json();

        if (error.message) {
          errorMessage = error.message;
        }
      } catch {
        // Ignore JSON parsing errors
      }

      throw new Error(errorMessage);
    }

    return response.json();
  },
};