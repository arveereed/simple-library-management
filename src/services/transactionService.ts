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
import type { Student, TransactionType } from "../types";
import { db } from "../config/firebase";

export const addTransaction = async (transaction: TransactionType) => {
  try {
    const q = query(
      collection(db, "books"),
      where("id", "==", transaction.bookId)
    );
    const snapshot = await getDocs(q);

    if (snapshot.empty) throw new Error("Book not found");

    const updates = snapshot.docs.map((docSnap) =>
      updateDoc(doc(db, "books", docSnap.id), { status: "Checked Out" })
    );
    await Promise.all(updates);

    const transactionCollection = collection(db, "transactions");

    await addDoc(transactionCollection, {
      ...transaction,
      createdAt: Timestamp.now(),
    });
  } catch (error) {
    console.error("Error adding transaction: ", error);
  }
};

export const getTransactions = async (): Promise<TransactionType[]> => {
  try {
    const transactionCollection = collection(db, "transactions");
    const q = query(transactionCollection, orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      return querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: data.id,
          bookId: data.bookId,
          bookTitle: data.bookTitle,
          studentName: data.studentName,
          checkoutDate: data.checkoutDate,
          dueDate: data.dueDate,
          student_user_id: data.student_user_id,
        };
      });
    }

    console.warn(`No books found`);
    return [];
  } catch (error) {
    console.error("Error fetching all books:", error);
    return [];
  }
};

export const removeTransactionByField = async (
  id: string,
  transaction: TransactionType
) => {
  try {
    const bookQuery = query(
      collection(db, "books"),
      where("id", "==", transaction.bookId)
    );
    const bookSnapshot = await getDocs(bookQuery);

    if (bookSnapshot.empty) throw new Error("Book not found");

    const updates = bookSnapshot.docs.map((docSnap) =>
      updateDoc(doc(db, "books", docSnap.id), { status: "Available" })
    );
    await Promise.all(updates);

    const studQuery = query(
      collection(db, "students"),
      where("id", "==", transaction.student_user_id)
    );
    const studSnapshot = await getDocs(studQuery);

    if (studSnapshot.empty) {
      console.warn("Student not found");
      return;
    }
    const studentDoc = studSnapshot.docs[0];
    const studentRef = studentDoc.ref;

    // Get current history array or initialize empty array
    const currentData = studentDoc.data() as Student;
    const existingHistory = currentData.history || [];

    // Build new history entry
    const newHistoryEntry = {
      title: transaction.bookTitle,
      due: transaction.dueDate,
      status: "On time", // TODO: make this dynamic
      createdAt: Timestamp.now(),
    };

    // Merge new entry
    const updatedHistory = [...existingHistory, newHistoryEntry];

    // Update Firestore
    await updateDoc(studentRef, {
      history: updatedHistory,
    });

    const q = query(collection(db, "transactions"), where("id", "==", id));
    const snapshot = await getDocs(q);

    if (snapshot.empty) throw new Error("Transaction not found");

    const deletes = snapshot.docs.map((d) =>
      deleteDoc(doc(db, "transactions", d.id))
    );
    await Promise.all(deletes);

    return true;
  } catch (error) {
    console.error("Error deleting transaction:", error);
    return null;
  }
};
