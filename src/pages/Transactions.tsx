import { useState } from "react";
import {
  Plus,
  ChevronDown,
  ChevronUp,
  BookOpen,
  ArrowRightLeft,
} from "lucide-react";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import type { BookType, Student, TransactionType } from "../types";
import { useStudents } from "../hooks/students/useStudents";
import { useAddTransaction } from "../hooks/transactions/useAddTransaction";
import { useTransactions } from "../hooks/transactions/useTransactions";
import { useRemovetransaction } from "../hooks/transactions/useRemoveTransaction";
import { useAvailableBooks } from "../hooks/books/useAvailableBooks";
import { useUserContext } from "../contexts/UserContext";

export default function TransactionsPage() {
  const { user } = useUserContext();

  const { data: booksData } = useAvailableBooks();
  const { data: studentsData } = useStudents();
  const { data: activeRecordsData, isLoading } = useTransactions();

  const books: BookType[] = booksData ?? [];
  const students: Student[] = studentsData ?? [];
  const activeRecords: TransactionType[] = activeRecordsData ?? [];

  const [selectedBook, setSelectedBook] = useState("");
  const [selectedStudent, setSelectedStudent] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [openRecord, setOpenRecord] = useState<string | null>(null);

  const { mutate: addTransactionMutate, isPending: isAdding } =
    useAddTransaction();
  const { mutate: removeTransactionMutate, isPending: isRemoving } =
    useRemovetransaction();

  const toggleRecord = (id: string) => {
    setOpenRecord((prev) => (prev === id ? null : id));
  };

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
        Date.now() + 14 * 24 * 60 * 60 * 1000,
      ).toLocaleDateString(),
      student_user_id: student.id,
    };

    addTransactionMutate(newRecord, {
      onSuccess: () => {
        setSelectedBook("");
        setSelectedStudent("");
        setIsOpen(false);
      },
    });
  };

  const handleReturn = (id: string, transaction: TransactionType) => {
    removeTransactionMutate({ id, transaction });
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
                  <ArrowRightLeft className="h-5 w-5" />
                </div>

                <div className="min-w-0">
                  <h1 className="truncate text-2xl font-bold text-gray-900 sm:text-3xl">
                    Transactions
                  </h1>
                  <p className="mt-1 text-sm text-gray-500 sm:text-base">
                    Manage checkouts and returns
                  </p>
                </div>
              </div>
            </div>

            {user && (
              <Button
                onClick={() => setIsOpen((prev) => !prev)}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 cursor-pointer sm:w-auto"
              >
                <Plus className="h-4 w-4" />
                {isOpen ? "Close Checkout" : "Checkout Book"}
              </Button>
            )}
          </div>

          {/* Checkout panel */}
          {isOpen && (
            <Card className="mb-6 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:mb-8 sm:p-6">
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  New Checkout
                </h2>
                <p className="mt-1 text-sm text-gray-500 sm:text-base">
                  Process a book checkout transaction
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-900">
                    Select Book *
                  </label>
                  <select
                    className="h-12 w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm outline-none transition focus:ring-2 focus:ring-gray-200 sm:text-base cursor-pointer"
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

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-900">
                    Select Student *
                  </label>
                  <select
                    className="h-12 w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm outline-none transition focus:ring-2 focus:ring-gray-200 sm:text-base cursor-pointer"
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
              </div>

              <div className="mt-5">
                <Button
                  weight="normal"
                  onClick={handleCheckout}
                  disabled={isAdding}
                  className="w-full rounded-xl py-3 cursor-pointer items-center justify-center disabled:bg-neutral-400 md:w-auto md:px-6"
                >
                  {isAdding ? "Checking out..." : "Process Checkout"}
                </Button>
              </div>
            </Card>
          )}

          {/* Active Borrowing Records */}
          <Card className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            <div className="border-b border-gray-200 px-5 py-5 sm:px-6">
              <h2 className="text-xl font-semibold text-gray-900">
                Active Borrowing Records
              </h2>
              <p className="mt-1 text-sm text-gray-500 sm:text-base">
                Currently checked out books
              </p>
            </div>

            <div>
              {isLoading ? (
                <div className="space-y-4 p-5 sm:p-6">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div
                      key={i}
                      className="rounded-2xl border border-gray-200 p-4 animate-pulse"
                    >
                      <div className="mb-3 flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="mb-2 h-5 w-1/2 rounded bg-gray-300" />
                          <div className="mb-2 h-4 w-1/3 rounded bg-gray-200" />
                          <div className="h-4 w-2/3 rounded bg-gray-200" />
                        </div>
                        <div className="h-8 w-8 rounded-xl bg-gray-200" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : activeRecords.length === 0 ? (
                <div className="px-4 py-16 text-center">
                  <div className="mx-auto flex max-w-sm flex-col items-center">
                    <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
                      <BookOpen className="h-6 w-6 text-gray-400" />
                    </div>
                    <p className="text-base font-medium text-gray-900">
                      No active borrowing records
                    </p>
                    <p className="mt-1 text-sm text-gray-500">
                      Checked out books will appear here.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {activeRecords.map((record) => (
                    <div
                      key={record.id}
                      className="transition hover:bg-gray-50/70"
                    >
                      <button
                        type="button"
                        className="flex w-full items-start justify-between gap-4 px-4 py-4 text-left sm:px-6"
                        onClick={() => toggleRecord(record.id)}
                      >
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-base font-semibold text-gray-900 sm:text-lg">
                            {record.bookTitle}
                          </p>
                          <p className="mt-1 text-sm text-gray-700 sm:text-base">
                            Student: {record.studentName}
                          </p>

                          <div className="mt-2 flex flex-col gap-1 text-sm text-gray-500 sm:flex-row sm:flex-wrap sm:items-center sm:gap-3">
                            <span>Checkout: {record.checkoutDate}</span>
                            <span className="hidden sm:inline text-gray-300">
                              •
                            </span>
                            <span className="font-medium text-green-600">
                              Due: {record.dueDate}
                            </span>
                          </div>
                        </div>

                        <div className="mt-1 shrink-0 rounded-xl border border-gray-200 p-2 text-gray-600">
                          {openRecord === record.id ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </div>
                      </button>

                      {openRecord === record.id && (
                        <div className="bg-gray-50 px-4 pb-4 pt-1 sm:px-6 sm:pb-5">
                          {user ? (
                            <Button
                              disabled={isRemoving}
                              onClick={() => handleReturn(record.id, record)}
                              className="w-full rounded-xl py-3 cursor-pointer items-center justify-center disabled:bg-neutral-400 sm:w-auto sm:px-6"
                            >
                              {isRemoving
                                ? "Returning Book..."
                                : "✓ Check In / Return Book"}
                            </Button>
                          ) : (
                            <div className="rounded-xl border border-dashed border-gray-300 bg-white px-4 py-4 text-center text-sm font-medium text-gray-500">
                              Login first
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}
