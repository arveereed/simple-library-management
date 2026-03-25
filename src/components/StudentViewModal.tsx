import { X } from "lucide-react";
import { Button } from "./Button";
import type { Student } from "../types";

interface StudentViewModalProps {
  open: boolean;
  onClose: () => void;
  student: Student | null;
}

export default function StudentViewModal({
  open,
  onClose,
  student,
}: StudentViewModalProps) {
  if (!open || !student) return null;

  const sortedHistory = [...student.history].sort(
    (a, b) =>
      new Date(b.createdAt.toDate()).getTime() -
      new Date(a.createdAt.toDate()).getTime(),
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 sm:p-6">
      <div className="relative w-full max-w-2xl rounded-xl bg-white p-4 sm:p-6 md:p-8 shadow-lg max-h-[90vh] overflow-y-auto">
        {/* X Button */}
        <button
          className="absolute top-4 right-4 sm:top-5 sm:right-5 cursor-pointer text-gray-600 hover:text-black"
          onClick={onClose}
          aria-label="Close modal"
        >
          <X className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        {/* Header */}
        <div className="mb-6 pr-10">
          <h2 className="text-2xl sm:text-3xl font-bold break-words">
            {student.name}
          </h2>
          <p className="text-sm sm:text-base text-gray-500">
            ID: {student.studentId}
          </p>
        </div>

        {/* Contact Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div>
            <p className="text-gray-500 text-sm sm:text-base">Email</p>
            <p className="text-base sm:text-lg break-all">{student.email}</p>
          </div>

          <div>
            <p className="text-gray-500 text-sm sm:text-base">Phone</p>
            <p className="text-base sm:text-lg break-words">{student.phone}</p>
          </div>
        </div>

        {/* Borrow History */}
        <div>
          <p className="font-semibold text-lg sm:text-xl mb-3">
            Borrowing History
          </p>

          <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
            {sortedHistory.length ? (
              sortedHistory.map((item, index) => (
                <div
                  key={index}
                  className="rounded-lg bg-gray-100 p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2"
                >
                  <div className="min-w-0">
                    <p className="font-semibold text-base sm:text-lg break-words">
                      {item.title}
                    </p>
                    <p className="text-sm text-gray-500 break-words">
                      Due: {item.due}
                    </p>
                  </div>

                  <span className="text-sm text-gray-600 shrink-0">
                    {item.status === "On time" ? "✓ On time" : "⚠ Late"}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">
                No borrowing history
              </p>
            )}
          </div>
        </div>

        {/* Close Button */}
        <Button
          className="mt-4 flex w-full justify-center py-3 cursor-pointer"
          weight="normal"
          onClick={onClose}
        >
          Close
        </Button>
      </div>
    </div>
  );
}
