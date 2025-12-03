import { useQuery } from "@tanstack/react-query";
import { getAvailableBooks } from "../../services/bookService";

export const useAvailableBooks = () => {
  return useQuery({
    queryKey: ["booksAvailable"],
    queryFn: getAvailableBooks,
  });
};
