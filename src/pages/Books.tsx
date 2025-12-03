import { useState, useEffect } from "react";
import { Search, Plus, Edit, Trash2 } from "lucide-react";
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
  const { user, isLoading: isLoadingUser } = useUserContext();

  const { data: booksData = [], isLoading } = useBooks();
  const { mutate: deleteBookMutate, isPending: isDeleting } = useDeleteBook();

  const books: BookType[] = booksData ?? [];

  const [filteredBooks, setFilteredBooks] = useState<BookType[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<BookType | null>(null);

  // Filter whenever books or search changes
  useEffect(() => {
    const filtered = books.filter(
      (book) =>
        book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.isbn.toLowerCase().includes(searchTerm.toLowerCase())
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
          Swal.close(); // 🔥 CLOSE LOADING
          Swal.fire("Deleted!", "Book has been removed.", "success");
        },
        onError: () => {
          Swal.close();
          Swal.fire("Error", "Failed to delete the book.", "error");
        },
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Available":
        return "bg-green-100 text-green-800";
      case "Checked Out":
        return "bg-amber-100 text-amber-800";
      case "Overdue":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const { mutate: updateBookMutate, isPending: isUpdating } = useUpdateBook();

  const [editingRowId, setEditingRowId] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState<Partial<BookType>>({});

  const handleSave = () => {
    // call your updateStudent hook
    if (!editFormData) return;

    updateBookMutate(editFormData as any, {
      onSuccess: () => {
        setEditingRowId(null); // close edit mode
      },
      onError: () => {
        Swal.fire("Error", "Failed to update student", "error");
      },
    });
  };
  return (
    <div className="flex h-screen bg-background w-full">
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold text-foreground">
                Books Catalog
              </h1>
              <p className="text-xl mt-2 text-gray-500">
                Manage library inventory
              </p>
            </div>

            {user && (
              <Button
                onClick={() => {
                  setEditingBook(null);
                  setIsModalOpen(true);
                }}
                className="gap-2 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                Add New Book
              </Button>
            )}
          </div>

          {/* Search */}
          <div className="mb-6 relative w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              placeholder="Search by title, author, or ISBN..."
              className="pl-12 w-full h-12 rounded-xl border border-gray-300 focus:ring-2 focus:ring-gray-300 focus:outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Books Table */}
          <Card>
            <CardContent>
              <div className="overflow-x-auto">
                <div className="bg-white rounded-xl overflow-hidden ">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-100 text-black text-xl">
                      <tr>
                        <th className="text-left p-4 font-semibold">Title</th>
                        <th className="text-left p-4 font-semibold">Author</th>
                        <th className="text-left p-4 font-semibold">ISBN</th>
                        <th className="text-left p-4 font-semibold">
                          Location
                        </th>
                        <th className="text-left p-4 font-semibold">Status</th>
                        {user && (
                          <th className="text-right p-4 font-semibold">
                            Actions
                          </th>
                        )}
                      </tr>
                    </thead>

                    <tbody className="bg-white text-base">
                      {isLoading ? (
                        Array.from({ length: 5 }).map((_, i) => (
                          <tr
                            key={i}
                            className="border-b border-gray-300 animate-pulse"
                          >
                            {["w-40", "w-32", "w-28", "w-28", "w-20"].map(
                              (w, idx) => (
                                <td key={idx} className="p-4">
                                  <div
                                    className={`h-4 bg-gray-200 dark:bg-gray-300 rounded-md ${w}`}
                                  />
                                </td>
                              )
                            )}

                            <td className="p-4">
                              <div className="flex justify-end items-center gap-3">
                                <div className="h-6 w-6 bg-gray-200 rounded-md"></div>
                                <div className="h-6 w-6 bg-gray-200 rounded-md"></div>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : filteredBooks.length === 0 ? (
                        <tr>
                          <td
                            colSpan={6}
                            className="text-center py-8 text-gray-500"
                          >
                            No books found
                          </td>
                        </tr>
                      ) : (
                        filteredBooks.map((book) => {
                          const isEditing = book.id === editingRowId;
                          return (
                            <tr
                              key={book.id}
                              className="border-b border-gray-300"
                            >
                              <td className="p-4">
                                {isEditing ? (
                                  <input
                                    type="text"
                                    value={editFormData.title || ""}
                                    onChange={(e) =>
                                      setEditFormData({
                                        ...editFormData,
                                        title: e.target.value,
                                      })
                                    }
                                    className="w-full py-1 pl-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-gray-300 focus:outline-none"
                                  />
                                ) : (
                                  book.title
                                )}
                              </td>

                              <td className="p-4">
                                {isEditing ? (
                                  <input
                                    type="text"
                                    value={editFormData.author || ""}
                                    onChange={(e) =>
                                      setEditFormData({
                                        ...editFormData,
                                        author: e.target.value,
                                      })
                                    }
                                    className="w-full py-1 pl-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-gray-300 focus:outline-none"
                                  />
                                ) : (
                                  book.author
                                )}
                              </td>

                              <td className="p-4">
                                {isEditing ? (
                                  <input
                                    type="email"
                                    value={editFormData.isbn || ""}
                                    onChange={(e) =>
                                      setEditFormData({
                                        ...editFormData,
                                        isbn: e.target.value,
                                      })
                                    }
                                    className="w-full py-1 pl-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-gray-300 focus:outline-none"
                                  />
                                ) : (
                                  book.isbn
                                )}
                              </td>

                              <td className="p-4">
                                {isEditing ? (
                                  <input
                                    type="text"
                                    value={editFormData.location || ""}
                                    onChange={(e) =>
                                      setEditFormData({
                                        ...editFormData,
                                        location: e.target.value,
                                      })
                                    }
                                    className="w-full py-1 pl-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-gray-300 focus:outline-none"
                                  />
                                ) : (
                                  book.location
                                )}
                              </td>
                              <td className="p-4">
                                <span
                                  className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                    book.status
                                  )}`}
                                >
                                  {book.status}
                                </span>
                              </td>
                              {user && (
                                <td className="p-4">
                                  {isEditing ? (
                                    <div className="flex space-x-2">
                                      <Button
                                        className="px-2 py-1 rounded cursor-pointer"
                                        onClick={handleSave}
                                      >
                                        Save
                                      </Button>
                                      <Button
                                        variant="secondary"
                                        className="px-2 py-1 bg-gray-300 rounded cursor-pointer"
                                        onClick={() => setEditingRowId(null)}
                                      >
                                        Cancel
                                      </Button>
                                    </div>
                                  ) : (
                                    <div className="flex justify-end items-center gap-3">
                                      <button
                                        onClick={() => {
                                          // setEditingBook(book);
                                          setEditingRowId(book.id);
                                          setEditFormData(book);
                                          // setIsModalOpen(true);
                                        }}
                                        className="p-1 rounded hover:bg-gray-50 text-gray-700 cursor-pointer"
                                      >
                                        <Edit className="w-4 h-4" />
                                      </button>

                                      <button
                                        onClick={() =>
                                          handleDeleteBook(book.id)
                                        }
                                        className="p-1 rounded hover:bg-gray-50 text-red-600 cursor-pointer"
                                      >
                                        <Trash2 className="w-4 h-4" />
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
