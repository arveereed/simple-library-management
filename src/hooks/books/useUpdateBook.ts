// hooks/useUpdateUser.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateBookByField } from "../../services/bookService";
import type { BookType } from "../../types";

export function useUpdateBook() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updatedBook }: { id: string; updatedBook: BookType }) =>
      updateBookByField(id, updatedBook),

    // optional: automatically refetch the books list
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["books"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
}
