declare type BAMMER_ROLE_Type = 'DEV' | 'SALE' | 'GROWTH' | 'ADMIN';

declare type BammerType = {
  id: string,
  role: BAMMER_ROLE_Type,
  name: string,
  firstName: string,
  lastName: string,
  email: string,
  booksCurrentlyBorrowed: Array<BookType>
};
