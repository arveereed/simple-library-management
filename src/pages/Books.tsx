import { useState, useEffect } from "react";
import { Search, Plus, Edit, Trash2 } from "lucide-react";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { CardContent } from "../components/CardContent";
import { BookModal } from "../components/BookModal";
import type { BookType } from "../types";
import { useBooks } from "../hooks/useBooks";

export default function BooksPage() {
  const { data: booksData, isLoading } = useBooks();
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

  const handleAddBook = () => {
    // React Query handles updates via invalidateQueries in your mutation hook
  };

  const handleUpdateBook = () => {
    setEditingBook(null);
    setIsModalOpen(false);
  };

  const handleDeleteBook = (id: string) => {
    if (confirm("Are you sure you want to delete this book?")) {
      // TODO: add delete mutation here
      console.log("DELETE: ", id);
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
                        <th className="text-right p-4 font-semibold">
                          Actions
                        </th>
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
                        filteredBooks.map((book, idx) => (
                          <tr
                            key={book.id}
                            className="border-b border-gray-300"
                          >
                            <td className="p-4 font-medium">{book.title}</td>
                            <td className="p-4">{book.author}</td>
                            <td className="p-4">{book.isbn}</td>
                            <td className="p-4">{book.location}</td>
                            <td className="p-4">
                              <span
                                className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                  book.status
                                )}`}
                              >
                                {book.status}
                              </span>
                            </td>
                            <td className="p-4">
                              <div className="flex justify-end items-center gap-3">
                                <button
                                  onClick={() => {
                                    setEditingBook(book);
                                    setIsModalOpen(true);
                                  }}
                                  className="p-1 rounded hover:bg-gray-50 text-gray-700 cursor-pointer"
                                >
                                  <Edit className="w-4 h-4" />
                                </button>

                                <button
                                  onClick={() => handleDeleteBook(book.id)}
                                  className="p-1 rounded hover:bg-gray-50 text-red-600 cursor-pointer"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
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
            setEditingBook(null);
          }}
          onSave={editingBook ? handleUpdateBook : handleAddBook}
          books={books} // still needed for validation inside modal
        />
      )}
    </div>
  );
}
