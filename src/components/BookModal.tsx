import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "./Button";
import type { BookType } from "../types";
import { useAddBooks } from "../hooks/books/useAddBooks";
import { useUpdateBook } from "../hooks/books/useUpdateBook";

interface BookModalProps {
  book?: BookType | null;
  onClose: () => void;
}

export const BookModal = ({ book, onClose }: BookModalProps) => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [isbn, setIsbn] = useState("");
  const [location, setLocation] = useState("");
  const [status, setStatus] = useState<BookType["status"]>("Available");

  // 📌 initialize fields when editing
  useEffect(() => {
    if (book) {
      setTitle(book.title);
      setAuthor(book.author);
      setIsbn(book.isbn);
      setLocation(book.location);
      setStatus(book.status);
    }
  }, [book]);

  const { mutate: addBookMutate, isPending: isAdding } = useAddBooks();
  const { mutate: updateBookMutate, isPending: isUpdating } = useUpdateBook();

  const handleSubmit = () => {
    if (!title || !author || !isbn || !location) {
      alert("Please fill all fields");
      return;
    }

    // 🔵 UPDATE FLOW
    if (book) {
      const updatedData = {
        id: book.id,
        title,
        author,
        isbn,
        location,
        status,
      };

      updateBookMutate(
        { id: book.id, updatedBook: updatedData },
        {
          onSuccess: () => onClose(),
        }
      );
      return;
    }

    // 🟢 ADD FLOW
    const newBook: BookType = {
      id: Date.now().toString(),
      title,
      author,
      isbn,
      location,
      status,
    };

    addBookMutate(newBook, {
      onSuccess: () => onClose(),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white w-full max-w-md rounded-xl shadow-lg p-6 relative">
        <button
          className="absolute cursor-pointer top-3 right-3 text-gray-500 hover:text-gray-700"
          onClick={onClose}
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-xl font-bold mb-4">
          {book ? "Edit Book" : "Add New Book"}
        </h2>

        <div className="space-y-3">
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border rounded-md"
          />

          <input
            type="text"
            placeholder="Author"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            className="w-full p-2 border rounded-md"
          />

          <input
            type="text"
            placeholder="ISBN"
            value={isbn}
            onChange={(e) => setIsbn(e.target.value)}
            className="w-full p-2 border rounded-md"
          />

          <input
            type="text"
            placeholder="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full p-2 border rounded-md"
          />

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as BookType["status"])}
            className="w-full p-2 border rounded-md"
          >
            <option value="Available">Available</option>
            <option value="Checked Out">Checked Out</option>
            <option value="Overdue">Overdue</option>
          </select>
        </div>

        <div className="flex justify-end mt-6 gap-2">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>

          <Button
            onClick={handleSubmit}
            disabled={isAdding || isUpdating}
            className="cursor-pointer disabled:bg-slate-600 disabled:animate-pulse"
          >
            {book
              ? isUpdating
                ? "Updating..."
                : "Update Book"
              : isAdding
              ? "Adding..."
              : "Add Book"}
          </Button>
        </div>
      </div>
    </div>
  );
};
