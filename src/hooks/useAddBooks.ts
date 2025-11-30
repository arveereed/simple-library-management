import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { BookType } from "../types";
import { addBook } from "../services/bookService";

export const useAddBooks = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (newBook: BookType) => addBook(newBook),
    onSuccess: () => {
      // Refresh books list after adding
      queryClient.invalidateQueries({ queryKey: ["books"] });
    },
    onError: (err) => {
      console.error("Error adding book:", err);
      alert("Failed to add book");
    },
  });
};
