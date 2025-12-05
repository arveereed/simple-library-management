// hooks/useUpdateUser.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { StudentType } from "../../types";
import { updateStudentByField } from "../../services/studentsService";

export function useUpdateStudent() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, StudentType>({
    mutationFn: (studentData) => updateStudentByField(studentData),

    // optional: automatically refetch the books list
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
}
