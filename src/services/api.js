const API_URL = 'http://localhost:5000/api';

export const api = {

  getBooks: async () => {
    const response = await fetch(
      `${API_URL}/books`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch books');
    }

    return response.json();
  },

  getBook: async (id) => {
    const response = await fetch(
      `${API_URL}/books/${id}`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch book');
    }

    return response.json();
  }

};
