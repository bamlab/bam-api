declare type BookDBType = {
  id: string,
  name: string,
  author: string,
  bammerBorrowingId: string,
  currentlyBorrowedBy: ?string
};