import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { getAvailableBooks, getBooks } from "./bookService";
import { db } from "../config/firebase";
import type { BookType } from "../types";
import { getStudents } from "./studentsService";

const getCheckoutBooks = async () => {
  try {
    const booksCollection = collection(db, "books");
    const q = query(
      booksCollection,
      where("status", "==", "Checked Out"),
      orderBy("createdAt", "desc")
    );

    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      return querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: data.id,
          title: data.title,
          author: data.author,
          isbn: data.isbn,
          location: data.location,
          status: data.status,
        };
      }) as BookType[];
    }

    console.warn(`No books found`);
    return null;
  } catch (error) {
    console.error("Error fetching checkout books:", error);
    return null;
  }
};

const getOverdueBooks = async () => {
  try {
    const booksCollection = collection(db, "books");
    const q = query(
      booksCollection,
      where("status", "==", "Overdue"),
      orderBy("createdAt", "desc")
    );

    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      return querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: data.id,
          title: data.title,
          author: data.author,
          isbn: data.isbn,
          location: data.location,
          status: data.status,
        };
      }) as BookType[];
    }

    console.warn(`No books found`);
    return null;
  } catch (error) {
    console.error("Error fetching Overdue books:", error);
    return null;
  }
};

export const getDashboard = async () => {
  const books = await getBooks();
  const availableBooks = await getAvailableBooks();
  const checkoutBooks = await getCheckoutBooks();
  const borrowers = await getStudents();
  const overdue = await getOverdueBooks();

  return {
    books,
    availableBooks,
    checkoutBooks,
    borrowers,
    overdue,
  };
};
