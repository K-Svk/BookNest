// Frontend-only API layer. Replace these mock functions with Axios calls when the Express/MongoDB backend is added.
import {books} from '../data/books';
export const api = { getBooks: async () => books, getBook: async id => books.find(b=>b.id===Number(id)) };
