import { useMutation, useQueryClient } from "@tanstack/react-query";
import { removeTransactionByField } from "../../services/transactionService";
import type { TransactionType } from "../../types";

export const useRemovetransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      transaction,
    }: {
      id: string;
      transaction: TransactionType;
    }) => removeTransactionByField(id, transaction), // should return a promise
    onSuccess: () => {
      // Refresh the transactions list after deletion
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
  });
};
