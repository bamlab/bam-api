declare type BookType = {
  id: string,
  name: string,
  author: string,
  bammerBorrowingId: string,
  currentlyBorrowedBy: ?BammerType
};
