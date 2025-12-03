import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteStudentByField } from "../../services/studentsService";

export const useDeleteStudent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteStudentByField(id), // should return a promise
    onSuccess: () => {
      // Refresh the books list after deletion
      queryClient.invalidateQueries({ queryKey: ["students"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
};
