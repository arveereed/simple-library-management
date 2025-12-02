// hooks/useUpdateUser.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { StudentType } from "../../types";
import { updateStudentByField } from "../../services/studentsService";

export function useUpdateStudent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      updatedStudent,
    }: {
      id: string;
      updatedStudent: StudentType;
    }) => updateStudentByField(id, updatedStudent),

    // optional: automatically refetch the books list
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
    },
  });
}
