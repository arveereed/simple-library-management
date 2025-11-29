import { addDoc, collection, Timestamp } from "firebase/firestore";
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
