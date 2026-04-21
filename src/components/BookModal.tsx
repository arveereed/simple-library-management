import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "./Button";
import type { BookType } from "../types";
import { useAddBooks } from "../hooks/books/useAddBooks";
import { useBooks } from "../hooks/books/useBooks";

interface BookModalProps {
  book?: BookType | null;
  onClose: () => void;
}

const normalizeIsbn = (value: string) => value.replace(/-/g, "").toUpperCase();

const isValidIsbn10 = (isbn: string) => {
  if (!/^\d{9}[\dX]$/.test(isbn)) return false;

  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += (i + 1) * Number(isbn[i]);
  }

  const lastChar = isbn[9];
  sum += lastChar === "X" ? 100 : 10 * Number(lastChar);

  return sum % 11 === 0;
};

const isValidIsbn13 = (isbn: string) => {
  if (!/^\d{13}$/.test(isbn)) return false;

  let sum = 0;
  for (let i = 0; i < 12; i++) {
    sum += Number(isbn[i]) * (i % 2 === 0 ? 1 : 3);
  }

  const checkDigit = (10 - (sum % 10)) % 10;
  return checkDigit === Number(isbn[12]);
};

const isValidIsbn = (value: string) => {
  const normalized = normalizeIsbn(value);
  return isValidIsbn10(normalized) || isValidIsbn13(normalized);
};

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
  const { data: booksData = [] } = useBooks();
  const books: BookType[] = booksData;

  const handleIsbnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const cleanedValue = e.target.value.replace(/[^0-9xX-]/g, "").toUpperCase();

    setIsbn(cleanedValue);

    if (errors.isbn) {
      setErrors((prev) => ({ ...prev, isbn: "" }));
    }
  };

  const validate = () => {
    const trimmedTitle = title.trim();
    const trimmedAuthor = author.trim();
    const trimmedIsbn = isbn.trim();
    const trimmedLocation = location.trim();

    const normalizedIsbn = normalizeIsbn(trimmedIsbn);

    const isbnExists = books.some((existingBook) => {
      const existingNormalizedIsbn = normalizeIsbn(existingBook.isbn ?? "");

      return (
        existingNormalizedIsbn === normalizedIsbn &&
        existingBook.id !== book?.id
      );
    });

    const newErrors = {
      title: trimmedTitle ? "" : "Title is required",
      author: trimmedAuthor ? "" : "Author is required",
      isbn: !trimmedIsbn
        ? "ISBN is required"
        : !isValidIsbn(trimmedIsbn)
          ? "Enter a valid ISBN-10 or ISBN-13"
          : isbnExists
            ? "ISBN already exists"
            : "",
      location: trimmedLocation ? "" : "Location is required",
    };

    setErrors(newErrors);
    return !Object.values(newErrors).some((err) => err);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    const bookData: BookType = {
      id: book ? book.id : Date.now().toString(),
      title: title.trim(),
      author: author.trim(),
      isbn: isbn.trim(),
      location: location.trim(),
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
          <div className="flex flex-col">
            <label className="text-sm font-semibold mb-1">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={inputClass("title")}
              placeholder="e.g. Clean Code"
            />
            {errors.title && (
              <span className="text-red-500 text-sm mt-1">{errors.title}</span>
            )}
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-semibold mb-1">
              Author <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className={inputClass("author")}
              placeholder="e.g. Robert C. Martin"
            />
            {errors.author && (
              <span className="text-red-500 text-sm mt-1">{errors.author}</span>
            )}
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-semibold mb-1">
              ISBN{" "}
              <span className="text-gray-500">(e.g. 978-3-16-148410-0)</span>{" "}
              <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={isbn}
              onChange={handleIsbnChange}
              className={inputClass("isbn")}
              placeholder="e.g. 978-3-16-148410-0"
            />
            {errors.isbn && (
              <span className="text-red-500 text-sm mt-1">{errors.isbn}</span>
            )}
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-semibold mb-1">
              Location <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className={inputClass("location")}
              placeholder="e.g. Shelf A - Row 2"
            />
            {errors.location && (
              <span className="text-red-500 text-sm mt-1">
                {errors.location}
              </span>
            )}
          </div>

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
              disabled={isAdding}
              className="h-11 px-6 cursor-pointer rounded-xl disabled:bg-gray-500 disabled:animate-pulse"
            >
              {book ? "Update Book" : isAdding ? "Adding..." : "Add Book"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
