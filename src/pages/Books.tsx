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

export default function BooksPage() {
  const { user } = useUserContext();

  const { data: booksData = [], isLoading } = useBooks();
  const { mutate: deleteBookMutate } = useDeleteBook();
  const { mutate: updateBookMutate, isPending } = useUpdateBook();

  const books: BookType[] = booksData ?? [];

  const [filteredBooks, setFilteredBooks] = useState<BookType[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<BookType | null>(null);

  const [editingRowId, setEditingRowId] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState<Partial<BookType>>({});

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

  const handleSave = () => {
    if (!editFormData) return;

    updateBookMutate(editFormData as any, {
      onSuccess: () => {
        setEditingRowId(null);
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

  return (
    <div className="min-h-screen w-full bg-gray-50">
      <main className="w-full">
        <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 sm:py-6 lg:px-8">
          {/* Header */}
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

          {/* Search */}
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

          {/* Table Card */}
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
                                  <input
                                    type="text"
                                    value={editFormData.title || ""}
                                    onChange={(e) =>
                                      setEditFormData({
                                        ...editFormData,
                                        title: e.target.value,
                                      })
                                    }
                                    className="w-full rounded-xl border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-gray-200"
                                  />
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
                                  <input
                                    type="text"
                                    value={editFormData.author || ""}
                                    onChange={(e) =>
                                      setEditFormData({
                                        ...editFormData,
                                        author: e.target.value,
                                      })
                                    }
                                    className="w-full rounded-xl border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-gray-200"
                                  />
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
                                  <input
                                    type="text"
                                    value={editFormData.isbn || ""}
                                    onChange={(e) =>
                                      setEditFormData({
                                        ...editFormData,
                                        isbn: e.target.value,
                                      })
                                    }
                                    className="w-full rounded-xl border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-gray-200"
                                  />
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
                                  <input
                                    type="text"
                                    value={editFormData.location || ""}
                                    onChange={(e) =>
                                      setEditFormData({
                                        ...editFormData,
                                        location: e.target.value,
                                      })
                                    }
                                    className="w-full rounded-xl border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-gray-200"
                                  />
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
                                      onClick={handleSave}
                                    >
                                      Save
                                    </Button>
                                    <Button
                                      variant="secondary"
                                      className="rounded-xl bg-gray-200 px-3 py-2 text-gray-800 cursor-pointer hover:bg-gray-300"
                                      onClick={() => setEditingRowId(null)}
                                    >
                                      Cancel
                                    </Button>
                                  </div>
                                ) : (
                                  <div className="flex justify-end gap-2">
                                    <button
                                      onClick={() => {
                                        setEditingRowId(book.id);
                                        setEditFormData(book);
                                      }}
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
