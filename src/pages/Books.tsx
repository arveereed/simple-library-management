import { useState, useEffect } from "react";
import { Search, Plus, Edit, Trash2, BookOpen } from "lucide-react";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { CardContent } from "../components/CardContent";
import { BookModal } from "../components/BookModal";
import type { BookType } from "../types";
import { useBooks } from "../hooks/books/useBooks";
import { useDeleteBook } from "../hooks/books/useDeleteBook";
import Swal from "sweetalert2";
import { useUserContext } from "../contexts/UserContext";
import { useUpdateBook } from "../hooks/books/useUpdateBook";

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

const createEmptyErrors = () => ({
  title: "",
  author: "",
  isbn: "",
  location: "",
});

export default function BooksPage() {
  const { user } = useUserContext();

  const { data: booksData, isLoading } = useBooks();
  const { mutate: deleteBookMutate } = useDeleteBook();
  const { mutate: updateBookMutate, isPending } = useUpdateBook();

  const books: BookType[] = booksData ?? [];

  const [filteredBooks, setFilteredBooks] = useState<BookType[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<BookType | null>(null);

  const [editingRowId, setEditingRowId] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState<Partial<BookType>>({});
  const [editErrors, setEditErrors] = useState(createEmptyErrors());

  useEffect(() => {
    const filtered = books.filter(
      (book) =>
        book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.isbn.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    setFilteredBooks(filtered);
  }, [searchTerm, books]);

  const handleDeleteBook = async (id: string) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      Swal.fire({
        title: "Deleting...",
        text: "Please wait",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });

      deleteBookMutate(id, {
        onSuccess: () => {
          Swal.close();
          Swal.fire("Deleted!", "Book has been removed.", "success");
        },
        onError: () => {
          Swal.close();
          Swal.fire("Error", "Failed to delete the book.", "error");
        },
      });
    }
  };

  const startEditing = (book: BookType) => {
    setEditingRowId(book.id);
    setEditFormData({ ...book });
    setEditErrors(createEmptyErrors());
  };

  const cancelEditing = () => {
    setEditingRowId(null);
    setEditFormData({});
    setEditErrors(createEmptyErrors());
  };

  const handleEditTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditFormData({
      ...editFormData,
      title: e.target.value,
    });

    if (editErrors.title) {
      setEditErrors((prev) => ({ ...prev, title: "" }));
    }
  };

  const handleEditAuthorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditFormData({
      ...editFormData,
      author: e.target.value,
    });

    if (editErrors.author) {
      setEditErrors((prev) => ({ ...prev, author: "" }));
    }
  };

  const handleEditIsbnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const cleanedValue = e.target.value.replace(/[^0-9xX-]/g, "").toUpperCase();

    setEditFormData({
      ...editFormData,
      isbn: cleanedValue,
    });

    if (editErrors.isbn) {
      setEditErrors((prev) => ({ ...prev, isbn: "" }));
    }
  };

  const handleEditLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditFormData({
      ...editFormData,
      location: e.target.value,
    });

    if (editErrors.location) {
      setEditErrors((prev) => ({ ...prev, location: "" }));
    }
  };

  const validateEditForm = () => {
    const trimmedTitle = editFormData.title?.trim() ?? "";
    const trimmedAuthor = editFormData.author?.trim() ?? "";
    const trimmedIsbn = editFormData.isbn?.trim() ?? "";
    const trimmedLocation = editFormData.location?.trim() ?? "";

    const newErrors = {
      title: trimmedTitle ? "" : "Title is required",
      author: trimmedAuthor ? "" : "Author is required",
      isbn: !trimmedIsbn
        ? "ISBN is required"
        : !isValidIsbn(trimmedIsbn)
          ? "Enter a valid ISBN-10 or ISBN-13"
          : "",
      location: trimmedLocation ? "" : "Location is required",
    };

    setEditErrors(newErrors);
    return !Object.values(newErrors).some((err) => err);
  };

  const handleSave = (book: BookType) => {
    if (!validateEditForm()) return;

    const updatedBook: BookType = {
      id: book.id,
      title: editFormData.title?.trim() ?? "",
      author: editFormData.author?.trim() ?? "",
      isbn: editFormData.isbn?.trim() ?? "",
      location: editFormData.location?.trim() ?? "",
      status: (editFormData.status as BookType["status"]) ?? book.status,
    };

    updateBookMutate(updatedBook as any, {
      onSuccess: () => {
        setEditingRowId(null);
        setEditFormData({});
        setEditErrors(createEmptyErrors());
      },
      onError: () => {
        Swal.fire("Error", "Failed to update book", "error");
      },
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Available":
        return "bg-green-100 text-green-700 border border-green-200";
      case "Checked Out":
        return "bg-amber-100 text-amber-700 border border-amber-200";
      case "Overdue":
        return "bg-red-100 text-red-700 border border-red-200";
      default:
        return "bg-gray-100 text-gray-700 border border-gray-200";
    }
  };

  const editInputClass = (field: keyof typeof editErrors) =>
    `w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 focus:ring-gray-200 ${
      editErrors[field] ? "border-red-500" : "border-gray-300"
    }`;

  return (
    <div className="min-h-screen w-full bg-gray-50">
      <main className="w-full">
        <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 sm:py-6 lg:px-8">
          <div className="mb-6 flex flex-col gap-4 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-200 sm:mb-8 sm:flex-row sm:items-center sm:justify-between sm:p-6">
            <div className="min-w-0">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-black text-white">
                  <BookOpen className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <h1 className="truncate text-2xl font-bold text-gray-900 sm:text-3xl">
                    Books Catalog
                  </h1>
                  <p className="mt-1 text-sm text-gray-500 sm:text-base">
                    Manage library inventory
                  </p>
                </div>
              </div>
            </div>

            {user && (
              <Button
                onClick={() => {
                  setEditingBook(null);
                  setIsModalOpen(true);
                }}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 cursor-pointer sm:w-auto"
              >
                <Plus className="h-4 w-4" />
                Add New Book
              </Button>
            )}
          </div>

          <div className="mb-5 sm:mb-6">
            <div className="relative">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <input
                placeholder="Search by title, author, or ISBN..."
                className="h-12 w-full rounded-2xl border border-gray-200 bg-white pl-12 pr-4 text-sm shadow-sm outline-none transition focus:border-gray-300 focus:ring-2 focus:ring-gray-200 sm:h-13 sm:text-base"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <Card className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="min-w-[760px] w-full text-sm">
                  <thead className="bg-gray-50 text-gray-700">
                    <tr className="border-b border-gray-200">
                      <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wide sm:px-6">
                        Title
                      </th>
                      <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wide sm:px-6">
                        Author
                      </th>
                      <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wide sm:px-6">
                        ISBN
                      </th>
                      <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wide sm:px-6">
                        Location
                      </th>
                      <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wide sm:px-6">
                        Status
                      </th>
                      {user && (
                        <th className="px-4 py-4 text-right text-xs font-semibold uppercase tracking-wide sm:px-6">
                          Actions
                        </th>
                      )}
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-200 bg-white text-sm text-gray-700">
                    {isLoading ? (
                      Array.from({ length: 5 }).map((_, i) => (
                        <tr key={i} className="animate-pulse">
                          {["w-40", "w-32", "w-28", "w-28", "w-24"].map(
                            (w, idx) => (
                              <td key={idx} className="px-4 py-4 sm:px-6">
                                <div
                                  className={`h-4 rounded-md bg-gray-200 ${w}`}
                                />
                              </td>
                            ),
                          )}

                          {user && (
                            <td className="px-4 py-4 sm:px-6">
                              <div className="flex justify-end gap-2">
                                <div className="h-8 w-8 rounded-lg bg-gray-200" />
                                <div className="h-8 w-8 rounded-lg bg-gray-200" />
                              </div>
                            </td>
                          )}
                        </tr>
                      ))
                    ) : filteredBooks.length === 0 ? (
                      <tr>
                        <td
                          colSpan={user ? 6 : 5}
                          className="px-4 py-16 text-center sm:px-6"
                        >
                          <div className="mx-auto flex max-w-sm flex-col items-center">
                            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
                              <BookOpen className="h-6 w-6 text-gray-400" />
                            </div>
                            <p className="text-base font-medium text-gray-900">
                              No books found
                            </p>
                            <p className="mt-1 text-sm text-gray-500">
                              Try adjusting your search or add a new book.
                            </p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      filteredBooks.map((book) => {
                        const isEditing = book.id === editingRowId;

                        return (
                          <tr
                            key={book.id}
                            className="transition hover:bg-gray-50/80"
                          >
                            <td className="px-4 py-4 align-middle sm:px-6">
                              {isEditing ? (
                                isPending ? (
                                  <div className="h-5 w-1/2 animate-pulse rounded bg-gray-300" />
                                ) : (
                                  <div>
                                    <input
                                      type="text"
                                      value={editFormData.title || ""}
                                      onChange={handleEditTitleChange}
                                      className={editInputClass("title")}
                                      placeholder="e.g. Clean Code"
                                    />
                                    {editErrors.title && (
                                      <p className="mt-1 text-xs text-red-500">
                                        {editErrors.title}
                                      </p>
                                    )}
                                  </div>
                                )
                              ) : (
                                <span className="font-medium text-gray-900">
                                  {book.title}
                                </span>
                              )}
                            </td>

                            <td className="px-4 py-4 align-middle sm:px-6">
                              {isEditing ? (
                                isPending ? (
                                  <div className="h-5 w-1/2 animate-pulse rounded bg-gray-300" />
                                ) : (
                                  <div>
                                    <input
                                      type="text"
                                      value={editFormData.author || ""}
                                      onChange={handleEditAuthorChange}
                                      className={editInputClass("author")}
                                      placeholder="e.g. Robert C. Martin"
                                    />
                                    {editErrors.author && (
                                      <p className="mt-1 text-xs text-red-500">
                                        {editErrors.author}
                                      </p>
                                    )}
                                  </div>
                                )
                              ) : (
                                book.author
                              )}
                            </td>

                            <td className="px-4 py-4 align-middle sm:px-6">
                              {isEditing ? (
                                isPending ? (
                                  <div className="h-5 w-1/2 animate-pulse rounded bg-gray-300" />
                                ) : (
                                  <div>
                                    <input
                                      type="text"
                                      value={editFormData.isbn || ""}
                                      onChange={handleEditIsbnChange}
                                      className={editInputClass("isbn")}
                                      placeholder="e.g. 978-3-16-148410-0"
                                    />
                                    {editErrors.isbn && (
                                      <p className="mt-1 text-xs text-red-500">
                                        {editErrors.isbn}
                                      </p>
                                    )}
                                  </div>
                                )
                              ) : (
                                book.isbn
                              )}
                            </td>

                            <td className="px-4 py-4 align-middle sm:px-6">
                              {isEditing ? (
                                isPending ? (
                                  <div className="h-5 w-1/2 animate-pulse rounded bg-gray-300" />
                                ) : (
                                  <div>
                                    <input
                                      type="text"
                                      value={editFormData.location || ""}
                                      onChange={handleEditLocationChange}
                                      className={editInputClass("location")}
                                      placeholder="e.g. Shelf A - Row 2"
                                    />
                                    {editErrors.location && (
                                      <p className="mt-1 text-xs text-red-500">
                                        {editErrors.location}
                                      </p>
                                    )}
                                  </div>
                                )
                              ) : (
                                book.location
                              )}
                            </td>

                            <td className="px-4 py-4 align-middle sm:px-6">
                              <span
                                className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStatusColor(
                                  book.status,
                                )}`}
                              >
                                {book.status}
                              </span>
                            </td>

                            {user && (
                              <td className="px-4 py-4 align-middle sm:px-6">
                                {isEditing ? (
                                  <div className="flex flex-col justify-end gap-2 sm:flex-row">
                                    <Button
                                      className="rounded-xl px-3 py-2 cursor-pointer"
                                      onClick={() => handleSave(book)}
                                    >
                                      Save
                                    </Button>
                                    <Button
                                      variant="secondary"
                                      className="rounded-xl bg-gray-200 px-3 py-2 text-gray-800 cursor-pointer hover:bg-gray-300"
                                      onClick={cancelEditing}
                                    >
                                      Cancel
                                    </Button>
                                  </div>
                                ) : (
                                  <div className="flex justify-end gap-2">
                                    <button
                                      onClick={() => startEditing(book)}
                                      className="flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 text-gray-700 transition hover:bg-gray-100 cursor-pointer"
                                      aria-label={`Edit ${book.title}`}
                                    >
                                      <Edit className="h-4 w-4" />
                                    </button>

                                    <button
                                      onClick={() => handleDeleteBook(book.id)}
                                      className="flex h-9 w-9 items-center justify-center rounded-xl border border-red-200 text-red-600 transition hover:bg-red-50 cursor-pointer"
                                      aria-label={`Delete ${book.title}`}
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </button>
                                  </div>
                                )}
                              </td>
                            )}
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      {isModalOpen && (
        <BookModal
          book={editingBook}
          onClose={() => {
            setIsModalOpen(false);
          }}
        />
      )}
    </div>
  );
}
