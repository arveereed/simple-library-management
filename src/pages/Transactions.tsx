import { useState } from "react";
import { Button } from "../components/Button";
import { Plus, ChevronDown, ChevronUp } from "lucide-react";
import { Card } from "../components/Card";
import type { BookType, Student, TransactionType } from "../types";
import { useStudents } from "../hooks/students/useStudents";
import { useAddTransaction } from "../hooks/transactions/useAddTransaction";
import { useTransactions } from "../hooks/transactions/useTransactions";
import { useRemovetransaction } from "../hooks/transactions/useRemoveTransaction";
import { useAvailableBooks } from "../hooks/books/useAvailableBooks";
import { useUserContext } from "../contexts/UserContext";

export default function TransactionsPage() {
  const { user, isLoading: isLoadingUser } = useUserContext();

  const { data: booksData = [], isLoading: isLoadingBooks } =
    useAvailableBooks();
  const { data: studentsData, isLoading: isLoadingStudents } = useStudents();
  const { data: activeRecordsData, isLoading: isLoadingActiveRecords } =
    useTransactions();

  const books: BookType[] = booksData ?? [];
  const students: Student[] = studentsData ?? [];
  const activeRecords: TransactionType[] = activeRecordsData ?? [];

  const [selectedBook, setSelectedBook] = useState("");
  const [selectedStudent, setSelectedStudent] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [openRecord, setOpenRecord] = useState<string | null>(null);

  const toggleRecord = (id: string) => {
    setOpenRecord((prev) => (prev === id ? null : id));
  };

  const { mutate: addTransactionMutate, isPending: isAdding } =
    useAddTransaction();
  const { mutate: removeTransactionMutate, isPending: isRemoving } =
    useRemovetransaction();

  // ====== PROCESS CHECKOUT ======
  const handleCheckout = () => {
    if (!selectedBook || !selectedStudent) {
      alert("Please select both a book and a student.");
      return;
    }

    const book = books.find((b) => b.id === selectedBook);
    const student = students.find((s) => s.id === selectedStudent);

    if (!book || !student) return;

    const newRecord: TransactionType = {
      id: Date.now().toString(),
      bookId: book.id,
      bookTitle: book.title,
      studentName: student.name,
      checkoutDate: new Date().toLocaleDateString(),
      dueDate: new Date(
        Date.now() + 14 * 24 * 60 * 60 * 1000
      ).toLocaleDateString(), // 14 days
      student_user_id: student.id,
    };

    addTransactionMutate(newRecord, {
      onSuccess: () => {
        // Reset fields
        setSelectedBook("");
        setSelectedStudent("");

        // Close the card
        setIsOpen(false);
      },
    });
  };

  // ====== RETURN BOOK ======
  const handleReturn = (id: string, transaction: TransactionType) => {
    removeTransactionMutate({ id, transaction });
  };

  return (
    <div className="flex h-screen bg-background w-full">
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold">Transactions</h1>
              <p className="text-xl mt-2 text-gray-500">
                Manage checkouts and returns
              </p>
            </div>

            {user && (
              <Button
                onClick={() => setIsOpen((prev) => !prev)}
                className="gap-2 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                Checkout Book
              </Button>
            )}
          </div>

          {/* Checkout panel */}
          {isOpen && (
            <Card className="p-6 mb-10">
              <h2 className="text-xl font-semibold mb-1">New Checkout</h2>
              <p className="text-gray-500 mb-6">
                Process a book checkout transaction
              </p>

              <div className="space-y-4">
                {/* Book */}
                <div>
                  <label className="block font-medium mb-1">
                    Select Book *
                  </label>
                  <select
                    className="w-full h-12 rounded-xl border border-gray-300 focus:ring-2 focus:ring-gray-300 focus:outline-none px-3 py-2 text-lg cursor-pointer"
                    value={selectedBook}
                    onChange={(e) => setSelectedBook(e.target.value)}
                  >
                    <option value="">Choose a book...</option>
                    {books.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.title}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Student */}
                <div>
                  <label className="block font-medium mb-1">
                    Select Student *
                  </label>
                  <select
                    className="w-full h-12 rounded-xl border border-gray-300 focus:ring-2 focus:ring-gray-300 focus:outline-none px-3 py-2 text-lg cursor-pointer"
                    value={selectedStudent}
                    onChange={(e) => setSelectedStudent(e.target.value)}
                  >
                    <option value="">Choose a student...</option>
                    {students.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.studentId})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Checkout */}
                <Button
                  weight="normal"
                  onClick={handleCheckout}
                  disabled={isAdding}
                  className="w-full py-3 hover:bg-neutral-300 cursor-pointer items-center justify-center disabled:bg-neutral-400"
                >
                  {isAdding ? "Checking out..." : "Process Checkout"}
                </Button>
              </div>
            </Card>
          )}

          {/* Active Borrowing Records */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-1">
              Active Borrowing Records
            </h2>
            <p className="text-gray-600 mb-6">Currently checked out books</p>

            {activeRecords.length === 0 ? (
              <div className="text-center text-gray-500 py-8 text-lg">
                No active borrowing records
              </div>
            ) : (
              activeRecords.map((record) => (
                <div key={record.id} className="border-b border-gray-300">
                  <div
                    className="flex justify-between p-4 cursor-pointer"
                    onClick={() => toggleRecord(record.id)}
                  >
                    <div>
                      <p className="font-semibold text-xl">
                        {record.bookTitle}
                      </p>
                      <p className="text-base">Student: {record.studentName}</p>
                      <p className="text-sm text-gray-600">
                        Checkout: {record.checkoutDate}
                        <span className="ml-3 text-green-600">
                          Due: {record.dueDate}
                        </span>
                      </p>
                    </div>

                    {openRecord === record.id ? (
                      <ChevronUp className="h-5 w-5" />
                    ) : (
                      <ChevronDown className="h-5 w-5" />
                    )}
                  </div>

                  {openRecord === record.id && (
                    <div className="p-4 bg-gray-50">
                      {user ? (
                        <Button
                          disabled={isRemoving}
                          onClick={() => handleReturn(record.id, record)}
                          className="w-full py-3 cursor-pointer items-center justify-center disabled:bg-neutral-400"
                        >
                          {isRemoving
                            ? "Returning Book..."
                            : "✓ Check In / Return Book"}
                        </Button>
                      ) : (
                        <div className="text-xl text-center font-medium text-gray-500">
                          Login first
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))
            )}
          </Card>
        </div>
      </main>
    </div>
  );
}
