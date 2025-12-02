import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  Timestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import type { BookType } from "../types";
import { db } from "../config/firebase";

export const addBook = async (book: BookType) => {
  try {
    const booksCollection = collection(db, "books");

    await addDoc(booksCollection, {
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

export const updateBookByField = async (id: string, updatedBook: BookType) => {
  try {
    const q = query(collection(db, "books"), where("id", "==", id));
    const snapshot = await getDocs(q);

    if (snapshot.empty) throw new Error("Book not found");

    const updates = snapshot.docs.map((d) =>
      updateDoc(doc(db, "books", d.id), updatedBook)
    );
    await Promise.all(updates);

    return true;
  } catch (error) {
    console.error("Error updating book:", error);
    return null;
  }
};

export const deleteBookByField = async (id: string) => {
  try {
    const q = query(collection(db, "books"), where("id", "==", id));
    const snapshot = await getDocs(q);

    if (snapshot.empty) throw new Error("Book not found");

    const deletes = snapshot.docs.map((d) => deleteDoc(doc(db, "books", d.id)));
    await Promise.all(deletes);

    return true;
  } catch (error) {
    console.error("Error deleting book:", error);
    return null;
  }
};
