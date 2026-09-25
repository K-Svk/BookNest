import React, { useState } from 'react';
import './Onboarding.css';

const ratingBooks = [
  // CLASSICS
  {
    id: 'rating-1',
    title: 'Pride and Prejudice',
    author: 'Jane Austen',
    genre: 'Classics',
    cover: 'https://covers.openlibrary.org/b/isbn/9780141439518-M.jpg'
  },
  {
    id: 'rating-2',
    title: 'Jane Eyre',
    author: 'Charlotte Brontë',
    genre: 'Classics',
    cover: 'https://covers.openlibrary.org/b/isbn/9780141441146-M.jpg'
  },
  {
    id: 'rating-3',
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    genre: 'Classics',
    cover: 'https://covers.openlibrary.org/b/isbn/9780141182636-M.jpg'
  },
  {
    id: 'rating-4',
    title: 'Little Women',
    author: 'Louisa May Alcott',
    genre: 'Classics',
    cover: 'https://covers.openlibrary.org/b/isbn/9780147514011-M.jpg'
  },

  // LITERARY FICTION
  {
    id: 'rating-5',
    title: 'The Midnight Library',
    author: 'Matt Haig',
    genre: 'Contemporary',
    cover: 'https://covers.openlibrary.org/b/isbn/9780525559474-M.jpg'
  },
  {
    id: 'rating-6',
    title: 'The Seven Husbands of Evelyn Hugo',
    author: 'Taylor Jenkins Reid',
    genre: 'Literary Fiction',
    cover: 'https://covers.openlibrary.org/b/isbn/9781501161933-M.jpg'
  },
  {
    id: 'rating-7',
    title: 'Normal People',
    author: 'Sally Rooney',
    genre: 'Contemporary',
    cover: 'https://covers.openlibrary.org/b/isbn/9781984822178-M.jpg'
  },
  {
    id: 'rating-8',
    title: 'The Book Thief',
    author: 'Markus Zusak',
    genre: 'Historical Fiction',
    cover: 'https://covers.openlibrary.org/b/isbn/9780375842207-M.jpg'
  },

  // FANTASY
  {
    id: 'rating-9',
    title: 'Harry Potter and the Philosopher’s Stone',
    author: 'J.K. Rowling',
    genre: 'Fantasy',
    cover: 'https://covers.openlibrary.org/b/isbn/9780747532699-M.jpg'
  },
  {
    id: 'rating-10',
    title: 'The Hobbit',
    author: 'J.R.R. Tolkien',
    genre: 'Fantasy',
    cover: 'https://covers.openlibrary.org/b/isbn/9780547928227-M.jpg'
  },
  {
    id: 'rating-11',
    title: 'Six of Crows',
    author: 'Leigh Bardugo',
    genre: 'Fantasy',
    cover: 'https://covers.openlibrary.org/b/isbn/9781250076960-M.jpg'
  },
  {
    id: 'rating-12',
    title: 'The Name of the Wind',
    author: 'Patrick Rothfuss',
    genre: 'Fantasy',
    cover: 'https://covers.openlibrary.org/b/isbn/9780756404741-M.jpg'
  },

  // MYSTERY / THRILLER
  {
    id: 'rating-13',
    title: 'And Then There Were None',
    author: 'Agatha Christie',
    genre: 'Mystery',
    cover: 'https://covers.openlibrary.org/b/isbn/9780062073488-M.jpg'
  },
  {
    id: 'rating-14',
    title: 'The Murder of Roger Ackroyd',
    author: 'Agatha Christie',
    genre: 'Mystery',
    cover: 'https://covers.openlibrary.org/b/isbn/9780062073567-M.jpg'
  },
  {
    id: 'rating-15',
    title: 'The Girl with the Dragon Tattoo',
    author: 'Stieg Larsson',
    genre: 'Mystery',
    cover: 'https://covers.openlibrary.org/b/isbn/9780307454546-M.jpg'
  },
  {
    id: 'rating-16',
    title: 'Gone Girl',
    author: 'Gillian Flynn',
    genre: 'Thriller',
    cover: 'https://covers.openlibrary.org/b/isbn/9780553418361-M.jpg'
  },

  // SCIENCE FICTION
  {
    id: 'rating-17',
    title: '1984',
    author: 'George Orwell',
    genre: 'Science Fiction',
    cover: 'https://covers.openlibrary.org/b/isbn/9780451524935-M.jpg'
  },
  {
    id: 'rating-18',
    title: 'Fahrenheit 451',
    author: 'Ray Bradbury',
    genre: 'Science Fiction',
    cover: 'https://covers.openlibrary.org/b/isbn/9781451678189-M.jpg'
  },
  {
    id: 'rating-19',
    title: 'The Martian',
    author: 'Andy Weir',
    genre: 'Science Fiction',
    cover: 'https://covers.openlibrary.org/b/isbn/9780804139021-M.jpg'
  },
  {
    id: 'rating-20',
    title: 'Dune',
    author: 'Frank Herbert',
    genre: 'Science Fiction',
    cover: 'https://covers.openlibrary.org/b/isbn/9780441172719-M.jpg'
  },

  // ROMANCE
  {
    id: 'rating-21',
    title: 'The Notebook',
    author: 'Nicholas Sparks',
    genre: 'Romance',
    cover: 'https://covers.openlibrary.org/b/isbn/9780446605236-M.jpg'
  },
  {
    id: 'rating-22',
    title: 'Me Before You',
    author: 'Jojo Moyes',
    genre: 'Romance',
    cover: 'https://covers.openlibrary.org/b/isbn/9780143130154-M.jpg'
  },
  {
    id: 'rating-23',
    title: 'The Fault in Our Stars',
    author: 'John Green',
    genre: 'Romance',
    cover: 'https://covers.openlibrary.org/b/isbn/9780525478812-M.jpg'
  },

  // BIOGRAPHIES / MEMOIRS
  {
    id: 'rating-24',
    title: 'Becoming',
    author: 'Michelle Obama',
    genre: 'Biography',
    cover: 'https://covers.openlibrary.org/b/isbn/9781524763138-M.jpg'
  },
  {
    id: 'rating-25',
    title: 'Educated',
    author: 'Tara Westover',
    genre: 'Memoir',
    cover: 'https://covers.openlibrary.org/b/isbn/9780399590504-M.jpg'
  },
  {
    id: 'rating-26',
    title: 'Steve Jobs',
    author: 'Walter Isaacson',
    genre: 'Biography',
    cover: 'https://covers.openlibrary.org/b/isbn/9781451648546-M.jpg'
  },
  {
    id: 'rating-27',
    title: 'I Am Malala',
    author: 'Malala Yousafzai',
    genre: 'Memoir',
    cover: 'https://covers.openlibrary.org/b/isbn/9780316322423-M.jpg'
  },

  // PHILOSOPHY / NON-FICTION
  {
    id: 'rating-28',
    title: 'Man’s Search for Meaning',
    author: 'Viktor E. Frankl',
    genre: 'Non-Fiction',
    cover: 'https://covers.openlibrary.org/b/isbn/9780807014295-M.jpg'
  },
  {
    id: 'rating-29',
    title: 'Sapiens',
    author: 'Yuval Noah Harari',
    genre: 'Non-Fiction',
    cover: 'https://covers.openlibrary.org/b/isbn/9780062316097-M.jpg'
  },
  {
    id: 'rating-30',
    title: 'The Diary of a Young Girl',
    author: 'Anne Frank',
    genre: 'Memoir',
    cover: 'https://covers.openlibrary.org/b/isbn/9780553296983-M.jpg'
  },

  // INDIAN LITERATURE
  {
    id: 'rating-31',
    title: 'The God of Small Things',
    author: 'Arundhati Roy',
    genre: 'Literary Fiction',
    cover: 'https://covers.openlibrary.org/b/isbn/9780812979657-M.jpg'
  },
  {
    id: 'rating-32',
    title: 'The Palace of Illusions',
    author: 'Chitra Banerjee Divakaruni',
    genre: 'Historical Fiction',
    cover: 'https://covers.openlibrary.org/b/isbn/9780385523295-M.jpg'
  },
  {
    id: 'rating-33',
    title: 'A Suitable Boy',
    author: 'Vikram Seth',
    genre: 'Literary Fiction',
    cover: 'https://covers.openlibrary.org/b/isbn/9780060786523-M.jpg'
  },
  {
    id: 'rating-34',
    title: 'The Namesake',
    author: 'Jhumpa Lahiri',
    genre: 'Literary Fiction',
    cover: 'https://covers.openlibrary.org/b/isbn/0618485228-M.jpg'
  },

  // YOUNG ADULT
  {
    id: 'rating-35',
    title: 'The Hunger Games',
    author: 'Suzanne Collins',
    genre: 'Young Adult',
    cover: 'https://covers.openlibrary.org/b/isbn/9780439023481-M.jpg'
  },
  {
    id: 'rating-36',
    title: 'The Perks of Being a Wallflower',
    author: 'Stephen Chbosky',
    genre: 'Young Adult',
    cover: 'https://covers.openlibrary.org/b/isbn/9781451696196-M.jpg'
  }
];

function Stars({ rating, onRate }) {
  return (
    <div className="rating-stars">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          className={`rating-star ${
            star <= rating ? 'active' : ''
          }`}
          onClick={() => onRate(star)}
          aria-label={`Rate ${star} stars`}
        >
          ★
        </button>
      ))}
    </div>
  );
}

export default function BookRatingPage({ onComplete }) {
  const [ratings, setRatings] = useState({});

  const handleRating = (bookId, rating) => {
    setRatings((current) => ({
      ...current,
      [bookId]: rating
    }));
  };

  const handleContinue = () => {
    localStorage.setItem(
      'booknestRatings',
      JSON.stringify(ratings)
    );

    onComplete(ratings);
  };

  return (
    <div className="onboarding-page rating-page-wrapper">

      <div className="rating-page">

        <div className="onboarding-brand">
          <span className="brand-mark">B</span>
          <span>BookNest</span>
        </div>

        <div className="rating-heading">

          <p className="onboarding-eyebrow">
            ONE LAST THING
          </p>

          <h1>
            Tell us what you've
            <br />
            <em>already loved.</em>
          </h1>

          <p>
            Rate any books you've read.
            You don't have to rate them all —
            even a few will help us understand your taste.
          </p>

        </div>

        <div className="rating-book-grid">

          {ratingBooks.map((book) => (
            <article
              className="rating-book-card"
              key={book.id}
            >

              <div className="rating-cover-wrap">

                <img
                  src={book.cover}
                  alt={book.title}
                  className="rating-book-cover"
                />

              </div>

              <div className="rating-book-info">

                <h3>{book.title}</h3>

                <p>{book.author}</p>

                <Stars
                  rating={ratings[book.id] || 0}
                  onRate={(rating) =>
                    handleRating(book.id, rating)
                  }
                />

              </div>

            </article>
          ))}

        </div>

        <div className="rating-bottom">

          <span>
            {Object.keys(ratings).length} books rated
          </span>

          <button
            className="onboarding-primary-button"
            type="button"
            onClick={handleContinue}
          >
            Show me my recommendations →
          </button>

        </div>

      </div>

    </div>
  );
}

