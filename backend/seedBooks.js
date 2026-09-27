const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

const Book = require("./models/Book");

const booksFilePath = path.join(__dirname, "../src/data/books.js");

async function seedBooks() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected successfully!");

    // Read books.js
    let fileContent = fs.readFileSync(booksFilePath, "utf8");

    /*
      books.js contains multiple ES module exports:

      export const books = [...]
      export const genres = [...]

      We only need the books array.
    */

    const booksMatch = fileContent.match(
      /export\s+const\s+books\s*=\s*(\[[\s\S]*?\]);/
    );

    if (!booksMatch) {
      throw new Error("Could not find the books array in books.js");
    }

    // Convert the extracted array text into a JavaScript array
    const books = eval(booksMatch[1]);

    console.log(`Found ${books.length} books in books.js`);

    let added = 0;
    let updated = 0;

    for (const frontendBook of books) {
      const bookData = {
        title: frontendBook.title,
        author: frontendBook.author,

        coverImage:
          frontendBook.cover ||
          frontendBook.coverImage ||
          "",

        description:
          frontendBook.blurb ||
          frontendBook.description ||
          "",

        genres: frontendBook.genre
          ? Array.isArray(frontendBook.genre)
            ? frontendBook.genre
            : [frontendBook.genre]
          : frontendBook.genres || [],

        publishedYear:
          frontendBook.publishedYear ||
          frontendBook.year ||
          undefined,

        pages: frontendBook.pages || 0,

        quote: frontendBook.quote || "",

        averageRating:
          frontendBook.averageRating ||
          frontendBook.rating ||
          0,

        ratingCount:
          frontendBook.ratingCount || 0,
      };

      // Check whether this book already exists
      const existingBook = await Book.findOne({
        title: bookData.title,
        author: bookData.author,
      });

      if (existingBook) {
        await Book.updateOne(
          { _id: existingBook._id },
          bookData
        );

        updated++;
      } else {
        await Book.create(bookData);

        added++;
      }
    }

    console.log("================================");
    console.log("BookNest seeding completed!");
    console.log(`Books added: ${added}`);
    console.log(`Books updated: ${updated}`);
    console.log(`Total processed: ${books.length}`);
    console.log("================================");

    await mongoose.connection.close();

    process.exit(0);
  } catch (error) {
    console.error("Seeding failed:", error);

    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
    }

    process.exit(1);
  }
}

seedBooks();