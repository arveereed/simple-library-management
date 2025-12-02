import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addStudent } from "../../services/studentsService";
import type { StudentType } from "../../types";

export const useAddStudents = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (newStudent: StudentType) => addStudent(newStudent),
    onSuccess: () => {
      // Refresh students list after adding
      queryClient.invalidateQueries({ queryKey: ["students"] });
    },
    onError: (err) => {
      console.error("Error adding student:", err);
      alert("Failed to add student");
    },
  });
};
