import { useQuery } from "@tanstack/react-query";
import { getBooks } from "../../services/bookService";

export const useBooks = () => {
  return useQuery({
    queryKey: ["books"],
    queryFn: getBooks,
  });
};
