import { useState, useEffect } from "react";
import { Search, Plus, Edit, Trash2 } from "lucide-react";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { CardContent } from "../components/CardContent";
import { BookModal } from "../components/BookModal";
import type { BookType } from "../types";

// Temporary books data, act as a db
const TEMP_BOOKS: BookType[] = [];

export default function BooksPage() {
  const [books, setBooks] = useState<BookType[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<BookType[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<BookType | null>(null);

  // Load temporary books on mount
  useEffect(() => {
    setBooks(TEMP_BOOKS);
  }, []);

  // Filter books when searchTerm or books changes
  useEffect(() => {
    const filtered = books.filter(
      (book) =>
        book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.isbn.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredBooks(filtered);
  }, [searchTerm, books]);

  const handleAddBook = (bookData: BookType) => {
    setBooks((prev) => [
      ...prev,
      {
        ...bookData,
        id:
          books.length == 0 ? "1" : `${Number(books[books.length - 1].id) + 1}`,
      },
    ]);

    setIsModalOpen(false);
  };

  const handleUpdateBook = (bookData: BookType) => {
    if (editingBook) {
      setBooks((prev) =>
        prev.map((b) =>
          b.id === editingBook.id ? { ...bookData, id: b.id } : b
        )
      );
      setEditingBook(null);
      setIsModalOpen(false);
    }
  };

  const handleDeleteBook = (id: string) => {
    if (confirm("Are you sure you want to delete this book?")) {
      setBooks((prev) => prev.filter((b) => b.id !== id));
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

          {/* Books Table - improved styling to match screenshot */}
          <Card>
            <CardContent>
              <div className="overflow-x-auto">
                <div className="bg-white rounded-xl overflow-hidden ">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-100 text-black text-xl">
                      <tr>
                        <th className="text-left p-4 font-semibold first:rounded-tl-xl last:rounded-tr-xl">
                          Title
                        </th>
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
                      {filteredBooks.length === 0 ? (
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
                            className={`border-b border-gray-300 ${
                              idx === filteredBooks.length - 1 ? "" : ""
                            }`}
                          >
                            <td className="p-4 font-medium">{book.title}</td>
                            <td className="p-4">{book.author}</td>
                            <td className="p-4">{book.isbn}</td>
                            <td className="p-4">{book.location}</td>

                            {/* Status badge */}
                            <td className="p-4">
                              <span
                                className={`
                        inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          book.status
                        )}`}
                              >
                                {book.status}
                              </span>
                            </td>

                            {/* Actions */}
                            <td className="p-4">
                              <div className="flex justify-end items-center gap-3">
                                <button
                                  onClick={() => {
                                    setEditingBook(book);
                                    setIsModalOpen(true);
                                  }}
                                  className="p-1 rounded hover:bg-gray-50 text-gray-700 cursor-pointer"
                                  aria-label="edit"
                                >
                                  <Edit className="w-4 h-4" />
                                </button>

                                <button
                                  onClick={() => handleDeleteBook(book.id)}
                                  className="p-1 rounded hover:bg-gray-50 text-red-600 cursor-pointer"
                                  aria-label="delete"
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
          books={books}
        />
      )}
    </div>
  );
}
