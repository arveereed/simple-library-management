import { X } from "lucide-react";
import { Button } from "./Button";

type BorrowHistory = {
  title: string;
  due: string;
  status: "On time" | "Late";
};

interface StudentViewModalProps {
  open: boolean;
  onClose: () => void;
  student: {
    id: string;
    name: string;
    studentId: string;
    email: string;
    phone: string;
    history?: BorrowHistory[];
  } | null;
}

export default function StudentViewModal({
  open,
  onClose,
  student,
}: StudentViewModalProps) {
  if (!open || !student) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white w-[650px] rounded-xl p-8 shadow-lg max-h-[85vh] overflow-y-auto relative">
        {/* X Button (same style as BookModal) */}
        <button
          className="absolute cursor-pointer top-5 right-5 text-gray-600 hover:text-black"
          onClick={onClose}
        >
          <X className="w-6 h-6" />
        </button>

        {/* Header */}
        <div className="mb-6 pr-10">
          <h2 className="text-3xl font-bold">{student.name}</h2>
          <p className="text-gray-500">ID: {student.studentId}</p>
        </div>

        {/* Contact Info */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <p className="text-gray-500">Email</p>
            <p className="text-lg">{student.email}</p>
          </div>

          <div>
            <p className="text-gray-500">Phone</p>
            <p className="text-lg">{student.phone}</p>
          </div>
        </div>

        {/* Borrow History */}
        <div>
          <p className="font-semibold text-xl mb-3">Borrowing History</p>

          <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
            {student.history?.length ? (
              student.history.map((item, index) => (
                <div
                  key={index}
                  className="p-4 bg-gray-100 rounded-lg flex justify-between items-center"
                >
                  <div>
                    <p className="font-semibold text-lg">{item.title}</p>
                    <p className="text-sm text-gray-500">Due: {item.due}</p>
                  </div>

                  <span className="text-sm text-gray-600">
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
          className="w-full cursor-pointer flex justify-center py-3"
          weight="normal"
          onClick={onClose}
        >
          Close
        </Button>
      </div>
    </div>
  );
}
