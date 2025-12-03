import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteBookByField } from "../../services/bookService";

export const useDeleteBook = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteBookByField(id), // should return a promise
    onSuccess: () => {
      // Refresh the books list after deletion
      queryClient.invalidateQueries({ queryKey: ["books"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
};
