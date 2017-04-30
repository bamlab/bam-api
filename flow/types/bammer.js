declare type BAMMER_ROLE = 'DEV' | 'SALE' | 'GROWTH' | 'ADMIN';

declare type Bammer = {
  id: String,
  role: BAMMER_ROLE,
  name: String,
  firstName: String,
  lastName: String,
  booksCurrentlyBorrowed: Array<Book>
};
