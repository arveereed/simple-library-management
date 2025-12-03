import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addBook } from "../../services/bookService";
import type { BookType } from "../../types";

export const useAddBooks = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (newBook: BookType) => addBook(newBook),
    onSuccess: () => {
      // Refresh books list after adding
      queryClient.invalidateQueries({ queryKey: ["books"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
    onError: (err) => {
      console.error("Error adding book:", err);
      alert("Failed to add book");
    },
  });
};
