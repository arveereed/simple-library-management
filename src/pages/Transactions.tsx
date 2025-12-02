import React, { useState } from "react";

type Book = {
  id: string;
  title: string;
  author: string;
};

const books: Book[] = [
  {
    id: "to-kill-a-mockingbird",
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
  },
  { id: "1984", title: "1984", author: "George Orwell" },
  {
    id: "the-great-gatsby",
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
  },
];

type BorrowRecord = {
  studentId: string;
  studentName: string;
  bookTitle: string;
  author: string;
  dueDate: string;
};

const Transactions: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [selectedBookId, setSelectedBookId] = useState<string>("");
  const [studentId, setStudentId] = useState<string>("");
  const [studentName, setStudentName] = useState<string>("");

  const [dueWeeks, setDueWeeks] = useState<string>("");
  const [dueDate, setDueDate] = useState<string>("");

  const [records, setRecords] = useState<BorrowRecord[]>([]);

  const selectedBook = books.find((b) => b.id === selectedBookId);

  const handleOpenModal = () => setIsModalOpen(true);

  const resetForm = () => {
    setSelectedBookId("");
    setStudentId("");
    setStudentName("");
    setDueWeeks("");
    setDueDate("");
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    resetForm();
  };

  const handleDueWeeksChange = (value: string) => {
    setDueWeeks(value);

    const weeks = parseInt(value, 10);
    if (!weeks || Number.isNaN(weeks)) {
      setDueDate("");
      return;
    }

    const today = new Date();
    const due = new Date(today);
    due.setDate(today.getDate() + weeks * 7);

    setDueDate(due.toISOString().split("T")[0]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedBook || !dueDate) return;

    const newRecord: BorrowRecord = {
      studentId,
      studentName,
      bookTitle: selectedBook.title,
      author: selectedBook.author,
      dueDate,
    };

    setRecords((prev) => [...prev, newRecord]);

    handleCloseModal();
  };

  return (
    <div className="p-8 w-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-4xl font-bold mb-2">Transactions</h1>
          <p className="text-xl text-gray-500">Manage checkouts and returns</p>
        </div>

        <button
          onClick={handleOpenModal}
          className="bg-black text-white font-bold px-4 py-2 rounded-xl flex items-center gap-2 text-sm"
        >
          <span className="text-xl font-semibold">+</span>
          Checkout Book
        </button>
      </div>

      <div className="border rounded-lg p-4 min-h-[150px]">
        <h2 className="font-semibold text-2xl">Active Borrowing Records</h2>
        <p className="text-md text-gray-500 mb-4">
          Currently checked out books
        </p>

        {records.length > 0 ? (
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b text-left">
                <th className="p-3">Student ID</th>
                <th className="p-3">Student Name</th>
                <th className="p-3">Book Title</th>
                <th className="p-3">Author</th>
                <th className="p-3">Due Date</th>
              </tr>
            </thead>
            <tbody>
              {records.map((rec, index) => (
                <tr key={index} className="border-b -10 hover:bg-gray-50">
                  <td className="p-4">{rec.studentId}</td>
                  <td className="p-4">{rec.studentName}</td>
                  <td className="p-4">{rec.bookTitle}</td>
                  <td className="p-4">{rec.author}</td>
                  <td className="p-4">
                    {new Date(rec.dueDate).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="flex justify-center items-center text-gray-400 text-sm h-20">
            No active borrowing records
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-xl p-6 relative">
            <button
              onClick={handleCloseModal}
              className="absolute top-4 right-4 text-gray-500 hover:text-black text-3xl"
              aria-label="Close"
            >
              ×
            </button>

            <h2 className="text-3xl font-bold mb-4">Checkout Book</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-1">
                  Book <span className="text-red-500">*</span>
                </label>
                <select
                  value={selectedBookId}
                  onChange={(e) => setSelectedBookId(e.target.value)}
                  className="w-full border border-gray-300 rounded-xl px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black/70"
                  required
                >
                  <option value="">Select a book</option>
                  {books.map((book) => (
                    <option key={book.id} value={book.id}>
                      {book.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-md font-semibold mb-1">
                  Author <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={selectedBook ? selectedBook.author : ""}
                  readOnly
                  className="w-full border-gray-300 border rounded-xl px-3 py-3 text-sm bg-gray-100 cursor-not-allowed"
                  placeholder="Author will appear here"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">
                  Student ID <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  className="w-full border border-gray-300 rounded-xl px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black/70"
                  placeholder="e.g., STU-001"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">
                  Student Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  className="w-full border border-gray-300 rounded-xl px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black/70"
                  placeholder="Student name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">
                  Due Date <span className="text-red-500">*</span>
                </label>
                <select
                  value={dueWeeks}
                  onChange={(e) => handleDueWeeksChange(e.target.value)}
                  className="w-full border border-gray-300 rounded-xl px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black/70"
                  required
                >
                  <option value="">Select due date</option>
                  <option value="1">1 week</option>
                  <option value="2">2 weeks</option>
                  <option value="3">3 weeks</option>
                  <option value="4">4 weeks</option>
                </select>
                {dueDate && (
                  <p className="text-xs text-gray-500 mt-1">
                    Due on: {new Date(dueDate).toLocaleDateString()}
                  </p>
                )}
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-5 py-2 rounded-xl font-semibold border border-gray-300 text-sm bg-gray-100 hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-7 py-3 rounded-xl font-semibold bg-black text-white text-sm hover:bg-black/90"
                >
                  Checkout Book
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Transactions;
