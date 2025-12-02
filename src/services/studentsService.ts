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
import { db } from "../config/firebase";
import type { StudentType } from "../types";

export const addStudent = async (student: StudentType) => {
  try {
    const usersCollection = collection(db, "students");

    await addDoc(usersCollection, {
      ...student,
      history: [],
      createdAt: Timestamp.now(),
    });
  } catch (error) {
    console.error("Error adding student: ", error);
  }
};

export const getStudents = async () => {
  try {
    const studentsCollection = collection(db, "students");
    const q = query(studentsCollection, orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      return querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: data.id,
          name: data.name,
          studentId: data.studentId,
          email: data.email,
          phone: data.phone,
          history: data.history,
        };
      });
    }

    console.warn(`No students found`);
    return null;
  } catch (error) {
    console.error("Error fetching all students:", error);
    return null;
  }
};

export const updateStudentByField = async (
  updatedStudent: StudentType
): Promise<void> => {
  try {
    const q = query(
      collection(db, "students"),
      where("id", "==", updatedStudent.id)
    );
    const snapshot = await getDocs(q);

    if (snapshot.empty) throw new Error("Student not found");

    const updates = snapshot.docs.map((d) =>
      updateDoc(doc(db, "students", d.id), { ...updatedStudent })
    );
    await Promise.all(updates);
  } catch (error) {
    console.error("Error updating book:", error);
  }
};

export const deleteStudentByField = async (id: string) => {
  try {
    const q = query(collection(db, "students"), where("id", "==", id));
    const snapshot = await getDocs(q);

    if (snapshot.empty) throw new Error("student not found");

    const deletes = snapshot.docs.map((d) =>
      deleteDoc(doc(db, "students", d.id))
    );
    await Promise.all(deletes);

    return true;
  } catch (error) {
    console.error("Error student book:", error);
    return null;
  }
};
