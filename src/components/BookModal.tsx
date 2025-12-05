import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "./Button";
import type { BookType } from "../types";
import { useAddBooks } from "../hooks/books/useAddBooks";

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

  const [errors, setErrors] = useState({
    title: "",
    author: "",
    isbn: "",
    location: "",
  });

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

  const validate = () => {
    const newErrors = {
      title: title ? "" : "Title is required",
      author: author ? "" : "Author is required",
      isbn: isbn ? "" : "ISBN is required",
      location: location ? "" : "Location is required",
    };
    setErrors(newErrors);
    return !Object.values(newErrors).some((err) => err);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    const bookData: BookType = {
      id: book ? book.id : Date.now().toString(),
      title,
      author,
      isbn,
      location,
      status,
    };

    if (book) {
      // updateBookMutate(
      //   { id: book.id, updatedBook: bookData },
      //   { onSuccess: () => onClose() }
      // );
    } else {
      addBookMutate(bookData, { onSuccess: () => onClose() });
    }
  };

  const inputClass = (field: string) =>
    `w-full h-12 px-4 border rounded-xl focus:outline-none ${
      errors[field as keyof typeof errors]
        ? "border-red-500"
        : "border-gray-300"
    }`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white w-full max-w-xl rounded-2xl p-8 shadow-xl relative">
        <button
          className="absolute cursor-pointer top-5 right-5 text-gray-600 hover:text-black"
          onClick={onClose}
        >
          <X className="w-6 h-6" />
        </button>

        <h2 className="text-2xl font-bold mb-6">
          {book ? "Edit Book" : "Add New Book"}
        </h2>

        <form className="space-y-5" onSubmit={handleSubmit}>
          {/** Title */}
          <div className="flex flex-col">
            <label className="text-sm font-semibold mb-1">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={inputClass("title")}
            />
            {errors.title && (
              <span className="text-red-500 text-sm mt-1">{errors.title}</span>
            )}
          </div>

          {/** Author */}
          <div className="flex flex-col">
            <label className="text-sm font-semibold mb-1">
              Author <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className={inputClass("author")}
            />
            {errors.author && (
              <span className="text-red-500 text-sm mt-1">{errors.author}</span>
            )}
          </div>

          {/** ISBN */}
          <div className="flex flex-col">
            <label className="text-sm font-semibold mb-1">
              ISBN <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={isbn}
              onChange={(e) => setIsbn(e.target.value)}
              className={inputClass("isbn")}
            />
            {errors.isbn && (
              <span className="text-red-500 text-sm mt-1">{errors.isbn}</span>
            )}
          </div>

          {/** Location */}
          <div className="flex flex-col">
            <label className="text-sm font-semibold mb-1">
              Location <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className={inputClass("location")}
            />
            {errors.location && (
              <span className="text-red-500 text-sm mt-1">
                {errors.location}
              </span>
            )}
          </div>

          {/** Status */}
          {/* <div className="flex flex-col">
            <label className="text-sm font-semibold mb-1">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as BookType["status"])}
              className="w-full h-12 px-4 border rounded-xl focus:outline-none border-gray-300"
            >
              <option value="Available">Available</option>
              <option value="Checked Out">Checked Out</option>
              <option value="Overdue">Overdue</option>
            </select>
          </div> */}

          {/** Buttons */}
          <div className="flex justify-end mt-8 gap-3">
            <Button
              variant="secondary"
              type="button"
              onClick={onClose}
              className="h-11 px-6 cursor-pointer rounded-xl"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isAdding /* || isUpdating */}
              className="h-11 px-6 cursor-pointer rounded-xl disabled:bg-gray-500 disabled:animate-pulse"
            >
              {book
                ? /* isUpdating
                  ? "Updating..."
                  : "Update Book" */ "sampleee"
                : isAdding
                ? "Adding..."
                : "Add Book"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
