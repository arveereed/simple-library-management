import {
  addDoc,
  collection,
  getDocs,
  orderBy,
  query,
  Timestamp,
} from "firebase/firestore";
import type { BookType } from "../types";
import { db } from "../config/firebase";

export const addBook = async (book: BookType) => {
  try {
    const usersCollection = collection(db, "books");

    await addDoc(usersCollection, {
      ...book,
      createdAt: Timestamp.now(),
    });
  } catch (error) {
    console.error("Error adding user: ", error);
  }
};

export const getBooks = async () => {
  try {
    const booksCollection = collection(db, "books");
    const q = query(booksCollection, orderBy("createdAt", "desc"));
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
      });
    }

    console.warn(`No books found`);
    return null;
  } catch (error) {
    console.error("Error fetching all books:", error);
    return null;
  }
};
