import type { Timestamp } from "firebase/firestore";

export type UserDataSignUpType = {
  user_id: string;
  fullname: string;
  email: string;
};

export type UserType = {
  id: string;
  createdAt: object;
  fullname: string;
  email: string;
  user_id: string;
};

export type FireStoreUserType = UserType & {
  id: string;
};

export type BookType = {
  id: string;
  title: string;
  author: string;
  isbn: string;
  location: string;
  status: "Available" | "Checked Out" | "Overdue";
};

export interface Student {
  id: string;
  name: string;
  studentId: string;
  email: string;
  phone: string;
  history: {
    title: string;
    due: string;
    status: string;
    createdAt: Timestamp;
  }[];
}

export interface StudentType {
  id: string;
  name: string;
  studentId: string;
  email: string;
  phone: string;
}

export interface TransactionType {
  id: string;
  bookId: string;
  bookTitle: string;
  studentName: string;
  checkoutDate: string;
  dueDate: string;
  student_user_id: string;
}
