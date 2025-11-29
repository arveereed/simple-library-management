import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "./Button";

type BookType = {
  id: string;
  title: string;
  author: string;
  isbn: string;
  location: string;
  status: "Available" | "Checked Out" | "Overdue";
};

interface BookModalProps {
  book?: BookType | null;
  onClose: () => void;
  onSave: (bookData: BookType) => void;
}

export const BookModal = ({ book, onClose, onSave }: BookModalProps) => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [isbn, setIsbn] = useState("");
  const [location, setLocation] = useState("");
  const [status, setStatus] = useState<BookType["status"]>("Available");

  useEffect(() => {
    if (book) {
      setTitle(book.title);
      setAuthor(book.author);
      setIsbn(book.isbn);
      setLocation(book.location);
      setStatus(book.status);
    } else {
      setTitle("");
      setAuthor("");
      setIsbn("");
      setLocation("");
      setStatus("Available");
    }
  }, [book]);

  const handleSubmit = () => {
    if (!title || !author || !isbn || !location) {
      alert("Please fill all fields");
      return;
    }

    const bookData: BookType = {
      id: book?.id || Date.now().toString(),
      title,
      author,
      isbn,
      location,
      status,
    };

    onSave(bookData);
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
          <Button
            className="cursor-pointer"
            variant="secondary"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button className="cursor-pointer" onClick={handleSubmit}>
            {book ? "Update" : "Add"}
          </Button>
        </div>
      </div>
    </div>
  );
};
