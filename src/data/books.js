export const books = [
  // =========================
  // CURRENTLY READING
  // These NEVER appear in TBR / Read
  // =========================

  {
    id: 10,
    title: 'The Hobbit',
    author: 'J.R.R. Tolkien',
    genre: 'Fantasy',
    status: 'currently',
    pages: 310,
    cover: 'https://covers.openlibrary.org/b/isbn/9780261102217-L.jpg',
    quote: 'In a hole in the ground there lived a hobbit.',
    blurb:
      'Bilbo Baggins leaves his comfortable life in the Shire and joins a company of dwarves on an unexpected adventure involving dragons, treasure, and a journey far beyond home.'
  },

  {
    id: 11,
    title: 'Pride and Prejudice',
    author: 'Jane Austen',
    genre: 'Classic Fiction',
    status: 'currently',
    pages: 435,
    cover: 'https://covers.openlibrary.org/b/isbn/9780141439518-L.jpg',
    quote:
      'It is a truth universally acknowledged, that a single man in possession of a good fortune, must be in want of a wife.',
    blurb:
      'Elizabeth Bennet navigates family, society, first impressions, and an increasingly complicated relationship with the proud Mr. Darcy.'
  },

  {
    id: 12,
    title: 'Jane Eyre',
    author: 'Charlotte Brontë',
    genre: 'Classic Fiction',
    status: 'currently',
    pages: 532,
    cover: 'https://covers.openlibrary.org/b/isbn/9780141441146-L.jpg',
    quote:
      'I am no bird; and no net ensnares me: I am a free human being with an independent will.',
    blurb:
      'An orphaned young woman grows into an independent thinker and finds love, identity, and difficult choices while working at Thornfield Hall.'
  },

  // =========================
  // ORIGINAL TBR
  // =========================

  {
    id: 1,
    title: 'The Secret History',
    author: 'Donna Tartt',
    genre: 'Literary Fiction',
    status: 'tbr',
    cover: 'https://covers.openlibrary.org/b/isbn/1400031702-L.jpg',
    blurb:
      'A group of classics students at an elite college discover that the line between intellectual obsession and moral consequence can disappear quickly.'
  },

  {
    id: 2,
    title: 'Tomorrow, and Tomorrow, and Tomorrow',
    author: 'Gabrielle Zevin',
    genre: 'Contemporary',
    status: 'tbr',
    cover: 'https://covers.openlibrary.org/b/isbn/0593321200-L.jpg',
    blurb:
      'Two friends, collaborators, and game designers build worlds together while navigating ambition, love, loss, and the complicated ways people stay connected.'
  },

  {
    id: 3,
    title: 'Piranesi',
    author: 'Susanna Clarke',
    genre: 'Fantasy',
    status: 'tbr',
    cover: 'https://covers.openlibrary.org/b/isbn/1635577808-L.jpg',
    blurb:
      'In a mysterious house filled with statues and endless halls, Piranesi records the wonders around him while slowly questioning what he has been told about his world.'
  },

  {
    id: 7,
    title: 'The Book Thief',
    author: 'Markus Zusak',
    genre: 'Historical Fiction',
    status: 'tbr',
    cover: 'https://covers.openlibrary.org/b/isbn/0375842209-L.jpg',
    blurb:
      'Narrated by Death, this story follows Liesel, a young girl in Nazi Germany whose love for books becomes a quiet form of resistance and connection.'
  },

  {
    id: 8,
    title: 'Before the Coffee Gets Cold',
    author: 'Toshikazu Kawaguchi',
    genre: 'Magical Realism',
    status: 'tbr',
    cover: 'https://covers.openlibrary.org/b/isbn/1529029589-L.jpg',
    blurb:
      'At a small Japanese café, visitors can travel briefly into the past—but only under a few very particular rules.'
  },

  {
    id: 9,
    title: 'Circe',
    author: 'Madeline Miller',
    genre: 'Mythology',
    status: 'tbr',
    cover: 'https://covers.openlibrary.org/b/isbn/0316556343-L.jpg',
    blurb:
      'The witch Circe finds her own voice and power among gods, monsters, mortals, and the myths that have defined her.'
  },

  // =========================
  // HARRY POTTER
  // =========================

  {
    id: 20,
    title: "Harry Potter and the Philosopher's Stone",
    author: 'J.K. Rowling',
    genre: 'Fantasy',
    status: 'read',
    cover: 'https://covers.openlibrary.org/b/isbn/9780747532743-L.jpg',
    blurb:
      'Harry Potter discovers that he is a wizard and begins his first year at Hogwarts, where friendship, magic, and an old enemy await him.'
  },

  {
    id: 21,
    title: 'Harry Potter and the Chamber of Secrets',
    author: 'J.K. Rowling',
    genre: 'Fantasy',
    status: 'tbr',
    cover: 'https://covers.openlibrary.org/b/isbn/9780439064866-L.jpg',
    blurb:
      'Harry returns to Hogwarts for another year, only to find the school threatened by a mysterious chamber and a dangerous force from its past.'
  },

  {
    id: 22,
    title: 'Harry Potter and the Prisoner of Azkaban',
    author: 'J.K. Rowling',
    genre: 'Fantasy',
    status: 'tbr',
    cover: 'https://covers.openlibrary.org/b/isbn/9780439136365-L.jpg',
    blurb:
      'A dangerous prisoner escapes from Azkaban while Harry learns more about his parents and the complicated history surrounding their deaths.'
  },

  // =========================
  // PERCY JACKSON
  // =========================

  {
    id: 30,
    title: 'Percy Jackson and the Lightning Thief',
    author: 'Rick Riordan',
    genre: 'Fantasy',
    status: 'read',
    cover: 'https://covers.openlibrary.org/b/isbn/9780786856299-L.jpg',
    blurb:
      'Percy Jackson discovers that the myths of ancient Greece are real and that he may be at the centre of a conflict between the gods.'
  },

  {
    id: 31,
    title: 'The Sea of Monsters',
    author: 'Rick Riordan',
    genre: 'Fantasy',
    status: 'tbr',
    cover: 'https://covers.openlibrary.org/b/isbn/9780786856862-L.jpg',
    blurb:
      'Percy returns to Camp Half-Blood and embarks on a dangerous journey across the Sea of Monsters to save his friends and his home.'
  },

  {
    id: 32,
    title: 'The Titan’s Curse',
    author: 'Rick Riordan',
    genre: 'Fantasy',
    status: 'tbr',
    cover: 'https://covers.openlibrary.org/b/isbn/9781423101482-L.jpg',
    blurb:
      'Percy and his friends face a new prophecy and a growing threat from the Titans while searching for a missing goddess.'
  },

  // =========================
  // ROBERT LANGDON / DAN BROWN
  // =========================

  {
    id: 40,
    title: 'Angels & Demons',
    author: 'Dan Brown',
    genre: 'Mystery',
    status: 'read',
    cover: 'https://covers.openlibrary.org/b/isbn/9780743493468-L.jpg',
    blurb:
      'Robert Langdon is drawn into a race through Rome after an ancient secret society resurfaces with a dangerous plan.'
  },

  {
    id: 41,
    title: 'The Da Vinci Code',
    author: 'Dan Brown',
    genre: 'Mystery',
    status: 'tbr',
    cover: 'https://covers.openlibrary.org/b/isbn/9780307474278-L.jpg',
    blurb:
      'Robert Langdon investigates a murder in Paris that leads to a series of clues hidden inside art, history, and ancient symbols.'
  },

  {
    id: 42,
    title: 'The Lost Symbol',
    author: 'Dan Brown',
    genre: 'Mystery',
    status: 'tbr',
    cover: 'https://covers.openlibrary.org/b/isbn/9780385504225-L.jpg',
    blurb:
      'Langdon is pulled into a mystery involving Washington, secret societies, ancient symbols, and a race against time.'
  },

  {
    id: 43,
    title: 'Inferno',
    author: 'Dan Brown',
    genre: 'Mystery',
    status: 'read',
    cover: 'https://covers.openlibrary.org/b/isbn/9780552161260-L.jpg',
    blurb:
      'Robert Langdon awakens in Florence with no memory of the previous day and becomes involved in a mystery connected to Dante.'
  },

  {
    id: 44,
    title: 'Origin',
    author: 'Dan Brown',
    genre: 'Mystery',
    status: 'tbr',
    cover: 'https://covers.openlibrary.org/b/isbn/9780552174161-L.jpg',
    blurb:
      'Langdon travels to Spain after a startling discovery promises to challenge fundamental ideas about humanity and its future.'
  },

  // =========================
  // ANTHONY HOROWITZ
  // =========================

  {
    id: 50,
    title: 'The Word Is Murder',
    author: 'Anthony Horowitz',
    genre: 'Mystery',
    status: 'tbr',
    cover: 'https://covers.openlibrary.org/b/isbn/9780062676834-L.jpg',
    blurb:
      'A murder mystery unfolds as author Anthony Horowitz becomes an unlikely participant in a detective investigation.'
  },

  {
    id: 51,
    title: 'Magpie Murders',
    author: 'Anthony Horowitz',
    genre: 'Mystery',
    status: 'read',
    cover: 'https://covers.openlibrary.org/b/isbn/9780062641542-L.jpg',
    blurb:
      'A mystery writer dies after submitting his latest manuscript, leaving behind a puzzle that seems to contain clues to his own murder.'
  },

  {
    id: 52,
    title: 'Moonflower Murders',
    author: 'Anthony Horowitz',
    genre: 'Mystery',
    status: 'tbr',
    cover: 'https://covers.openlibrary.org/b/isbn/9780062641597-L.jpg',
    blurb:
      'A missing girl, an old mystery novel, and a retired editor come together in a puzzle where fiction may hold the key to reality.'
  },

  // =========================
  // SELF DEVELOPMENT
  // =========================

  {
    id: 60,
    title: 'Ikigai',
    author: 'Héctor García & Francesc Miralles',
    genre: 'Self Development',
    status: 'read',
    cover: 'https://covers.openlibrary.org/b/isbn/9780143130727-L.jpg',
    blurb:
      'A gentle exploration of the Japanese concept of ikigai and the habits, relationships, and perspectives that can contribute to a meaningful life.'
  },

  {
    id: 61,
    title: 'Atomic Habits',
    author: 'James Clear',
    genre: 'Self Development',
    status: 'tbr',
    cover: 'https://covers.openlibrary.org/b/isbn/9780735211292-L.jpg',
    blurb:
      'A practical guide to building better habits through small, consistent changes and designing an environment that supports them.'
  },

  // =========================
  // LORD OF THE RINGS
  // =========================

  {
    id: 70,
    title: 'The Fellowship of the Ring',
    author: 'J.R.R. Tolkien',
    genre: 'Fantasy',
    status: 'tbr',
    cover: 'https://covers.openlibrary.org/b/isbn/9780261103573-L.jpg',
    blurb:
      'Frodo Baggins inherits a dangerous ring and leaves the Shire with a fellowship determined to prevent it from falling into the wrong hands.'
  },

  {
    id: 71,
    title: 'The Two Towers',
    author: 'J.R.R. Tolkien',
    genre: 'Fantasy',
    status: 'tbr',
    cover: 'https://covers.openlibrary.org/b/isbn/9780261102361-L.jpg',
    blurb:
      'The members of the fellowship face separate battles as the forces of Middle-earth prepare for a growing war.'
  },

  {
    id: 72,
    title: 'The Return of the King',
    author: 'J.R.R. Tolkien',
    genre: 'Fantasy',
    status: 'tbr',
    cover: 'https://covers.openlibrary.org/b/isbn/9780261102378-L.jpg',
    blurb:
      'The final struggle for Middle-earth approaches as Frodo and Sam continue toward Mordor while the remaining fellowship fights for their world.'
  },

  // =========================
  // ORIGINAL READ
  // =========================

  {
    id: 4,
    title: 'The Midnight Library',
    author: 'Matt Haig',
    genre: 'Fiction',
    status: 'read',
    cover: 'https://covers.openlibrary.org/b/isbn/0525559477-L.jpg',
    blurb:
      'Between life and death there is a library, and within that library, the chance to try out the lives one might have lived.'
  },

  {
    id: 5,
    title: 'Klara and the Sun',
    author: 'Kazuo Ishiguro',
    genre: 'Science Fiction',
    status: 'read',
    cover: 'https://covers.openlibrary.org/b/isbn/0593396565-L.jpg',
    blurb:
      'Klara is an Artificial Friend who watches the world from a shop window. When she is chosen by a young girl, she learns how uncertain human love can be.'
  },

  {
    id: 6,
    title: 'A Man Called Ove',
    author: 'Fredrik Backman',
    genre: 'Contemporary',
    status: 'read',
    cover: 'https://covers.openlibrary.org/b/isbn/1476738025-L.jpg',
    blurb:
      'A grumpy widower with strict routines finds his carefully ordered life disrupted by new neighbours, unexpected friendships, and a little community chaos.'
  }
];

export const genres = [
  'Literary Fiction',
  'Contemporary',
  'Fantasy',
  'Fiction',
  'Science Fiction',
  'Historical Fiction',
  'Magical Realism',
  'Mythology',
  'Classic Fiction',
  'Mystery',
  'Self Development'
];