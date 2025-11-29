"use client";

import { useState, useEffect } from "react";
import { Search, Plus, Edit, Trash2 } from "lucide-react";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { CardContent } from "../components/CardContent";
import { BookModal } from "../components/BookModal";

// Temporary book type
type Book = {
  id: string;
  title: string;
  author: string;
  isbn: string;
  location: string;
  status: "Available" | "Checked Out" | "Overdue";
};

// Temporary books data
const TEMP_BOOKS: Book[] = [
  {
    id: "1",
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    isbn: "9780743273565",
    location: "Shelf A1",
    status: "Available",
  },
  {
    id: "2",
    title: "1984",
    author: "George Orwell",
    isbn: "9780451524935",
    location: "Shelf B3",
    status: "Checked Out",
  },
  {
    id: "3",
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    isbn: "9780061120084",
    location: "Shelf C2",
    status: "Overdue",
  },
];

export default function BooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);

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

  const handleAddBook = (bookData: Book) => {
    setBooks((prev) => [...prev, { ...bookData, id: Date.now().toString() }]);
    setIsModalOpen(false);
  };

  const handleUpdateBook = (bookData: Book) => {
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
    <div className="flex h-screen bg-background">
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                Books Catalog
              </h1>
              <p className="text-muted-foreground mt-2">
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
          <div className="mb-6 relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
            <input
              placeholder="Search by title, author, or ISBN..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Books Table */}
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="border-b bg-muted">
                    <tr>
                      <th className="text-left p-4 font-semibold">Title</th>
                      <th className="text-left p-4 font-semibold">Author</th>
                      <th className="text-left p-4 font-semibold">ISBN</th>
                      <th className="text-left p-4 font-semibold">Location</th>
                      <th className="text-left p-4 font-semibold">Status</th>
                      <th className="text-right p-4 font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBooks.length === 0 ? (
                      <tr>
                        <td
                          colSpan={6}
                          className="text-center py-8 text-muted-foreground"
                        >
                          No books found
                        </td>
                      </tr>
                    ) : (
                      filteredBooks.map((book) => (
                        <tr
                          key={book.id}
                          className="border-b hover:bg-muted/50"
                        >
                          <td className="p-4 font-medium">{book.title}</td>
                          <td className="p-4">{book.author}</td>
                          <td className="p-4">{book.isbn}</td>
                          <td className="p-4">{book.location}</td>
                          <td className="p-4">
                            <span
                              className={`inline-block px-2 py-1 rounded text-xs font-medium ${getStatusColor(
                                book.status
                              )}`}
                            >
                              {book.status}
                            </span>
                          </td>
                          <td className="p-4 text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                className="cursor-pointer"
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setEditingBook(book);
                                  setIsModalOpen(true);
                                }}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteBook(book.id)}
                                className="text-destructive cursor-pointer"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))
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
            setEditingBook(null);
          }}
          onSave={editingBook ? handleUpdateBook : handleAddBook}
        />
      )}
    </div>
  );
}
