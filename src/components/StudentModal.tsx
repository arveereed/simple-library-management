import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "./Button";
import type { StudentType } from "../types";
import { useAddStudents } from "../hooks/students/useAddStudents";
import { useUpdateStudent } from "../hooks/students/useUpdateStudent";

interface StudentModalProps {
  student?: StudentType | null;
  onClose: () => void;
}

export const StudentModal = ({ student, onClose }: StudentModalProps) => {
  const [name, setName] = useState("");
  const [studentId, setStudentId] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const [errors, setErrors] = useState({
    name: "",
    studentId: "",
    email: "",
    phone: "",
  });

  useEffect(() => {
    if (student) {
      setName(student.name);
      setStudentId(student.studentId);
      setEmail(student.email);
      setPhone(student.phone);
    }
  }, [student]);

  const { mutate: addBookMutate, isPending: isAdding } = useAddStudents();
  const { mutate: updateStudentMutate, isPending: isUpdating } =
    useUpdateStudent();

  const validate = () => {
    const newErrors = {
      name: name ? "" : "Full Name is required",
      studentId: studentId ? "" : "Student ID is required",
      email: email ? "" : "Email is required",
      phone: phone ? "" : "Phone is required",
    };
    setErrors(newErrors);
    return !Object.values(newErrors).some((err) => err);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    const studentData: StudentType = {
      id: student ? student.id : Date.now().toString(),
      name,
      studentId,
      email,
      phone,
    };

    if (student) {
      updateStudentMutate(
        { id: student.id, updatedStudent: studentData },
        { onSuccess: () => onClose() }
      );
    } else {
      addBookMutate(studentData, { onSuccess: () => onClose() });
    }
  };

  const inputClass = (field: string) =>
    `w-full h-12 px-4 border rounded-xl focus:outline-none ${
      errors[field as keyof typeof errors]
        ? "border-red-500"
        : "border-gray-300"
    }`;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-white w-full max-w-xl rounded-2xl p-8 shadow-xl relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-gray-600 hover:text-black cursor-pointer"
        >
          <X className="w-6 h-6" />
        </button>

        <h2 className="text-2xl font-bold mb-6">
          {student ? "Edit Student" : "Register New Student"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Full Name */}
          <div>
            <label className="text-sm font-semibold mb-1 block">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={inputClass("name")}
              type="text"
              placeholder="Student name"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name}</p>
            )}
          </div>

          {/* Student ID */}
          <div>
            <label className="text-sm font-semibold mb-1 block">
              Student ID <span className="text-red-500">*</span>
            </label>
            <input
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              className={inputClass("studentId")}
              type="text"
              placeholder="e.g., STU-001"
            />
            {errors.studentId && (
              <p className="text-red-500 text-sm mt-1">{errors.studentId}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="text-sm font-semibold mb-1 block">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClass("email")}
              type="email"
              placeholder="student@college.edu"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label className="text-sm font-semibold mb-1 block">
              Phone <span className="text-red-500">*</span>
            </label>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className={inputClass("phone")}
              type="text"
              placeholder="Phone number"
            />
            {errors.phone && (
              <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
            )}
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <Button
              weight="normal"
              onClick={onClose}
              variant="secondary"
              className="h-11 px-6 rounded-xl border border-gray-300 cursor-pointer"
            >
              Cancel
            </Button>

            <Button
              disabled={isAdding || isUpdating}
              weight="normal"
              className="h-11 px-6 rounded-xl bg-black text-white cursor-pointer disabled:bg-neutral-400"
            >
              {student
                ? isUpdating
                  ? "Updating..."
                  : "Update Student"
                : isAdding
                ? "Adding..."
                : "Add Student"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
