import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { TransactionType } from "../../types";
import { addTransaction } from "../../services/transactionService";

export const useAddTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (newTransaction: TransactionType) =>
      addTransaction(newTransaction),
    onSuccess: () => {
      // Refresh books list after adding
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["booksAvailable"] });
    },
    onError: (err) => {
      console.error("Error adding transaction:", err);
      alert("Failed to add transaction");
    },
  });
};
