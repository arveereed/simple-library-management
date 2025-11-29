import { useQuery } from "@tanstack/react-query";
import { getUserById } from "../services/userService";

export const useFirestoreUser = (userId?: string) => {
  return useQuery({
    queryKey: ["firestoreUser", userId],
    queryFn: () => getUserById(userId!),
    enabled: !!userId, // only fetch when userId exists
    staleTime: 1000 * 60 * 5, // 5 minutes cache
  });
};
