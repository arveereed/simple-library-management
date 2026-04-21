import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "./Button";
import type { StudentType } from "../types";
import { useAddStudents } from "../hooks/students/useAddStudents";
import { useStudents } from "../hooks/students/useStudents";

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
      setPhone(student.phone.replace(/\D/g, "").slice(0, 11));
    }
  }, [student]);

  const { mutate: addBookMutate, isPending: isAdding } = useAddStudents();
  const { data: studentsData = [] } = useStudents();
  const students: StudentType[] = studentsData;

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const cleanedValue = e.target.value
      .replace(/[^\p{L}\s.'-]/gu, "")
      .replace(/\s{2,}/g, " ")
      .replace(/^\s/, "");

    setName(cleanedValue);

    if (errors.name) {
      setErrors((prev) => ({ ...prev, name: "" }));
    }
  };

  const handleStudentIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setStudentId(value);

    if (errors.studentId) {
      setErrors((prev) => ({ ...prev, studentId: "" }));
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digitsOnly = e.target.value.replace(/\D/g, "").slice(0, 11);
    setPhone(digitsOnly);

    if (errors.phone) {
      setErrors((prev) => ({ ...prev, phone: "" }));
    }
  };

  const validate = () => {
    const trimmedName = name.trim();
    const trimmedStudentId = studentId.trim();
    const normalizedStudentId = trimmedStudentId.toLowerCase();

    const fullNameRegex =
      /^\p{L}+(?:[.'-]?\p{L}+)*(?:\s+\p{L}+(?:[.'-]?\p{L}+)*)+$/u;
    const phoneRegex = /^09\d{9}$/;

    const studentIdExists = students.some((existingStudent) => {
      const existingId = existingStudent.studentId?.trim().toLowerCase();

      return (
        existingId === normalizedStudentId && existingStudent.id !== student?.id
      );
    });

    const newErrors = {
      name: !trimmedName
        ? "Full Name is required"
        : !fullNameRegex.test(trimmedName)
          ? "Enter a valid full name (first and last name only)"
          : "",
      studentId: !trimmedStudentId
        ? "Student ID is required"
        : studentIdExists
          ? "Student ID already exists"
          : "",
      email: email.trim() ? "" : "Email is required",
      phone: !phone
        ? "Phone is required"
        : !phoneRegex.test(phone)
          ? "Phone must be 11 digits, numbers only, and start with 09"
          : "",
    };

    setErrors(newErrors);
    return !Object.values(newErrors).some((err) => err);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    const studentData: StudentType = {
      id: student ? student.id : Date.now().toString(),
      name: name.trim(),
      studentId: studentId.trim(),
      email,
      phone,
    };

    if (student) {
      // updateStudentMutate(studentData, { onSuccess: () => onClose() });
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
          <div>
            <label className="text-sm font-semibold mb-1 block">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              value={name}
              onChange={handleNameChange}
              className={inputClass("name")}
              type="text"
              placeholder="e.g. Juan Dela Cruz"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name}</p>
            )}
          </div>

          <div>
            <label className="text-sm font-semibold mb-1 block">
              Student ID <span className="text-red-500">*</span>
            </label>
            <input
              value={studentId}
              onChange={handleStudentIdChange}
              className={inputClass("studentId")}
              type="text"
              placeholder="e.g., STU-001"
            />
            {errors.studentId && (
              <p className="text-red-500 text-sm mt-1">{errors.studentId}</p>
            )}
          </div>

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

          <div>
            <label className="text-sm font-semibold mb-1 block">
              Phone <span className="text-red-500">*</span>
            </label>
            <input
              value={phone}
              onChange={handlePhoneChange}
              className={inputClass("phone")}
              type="text"
              inputMode="numeric"
              maxLength={11}
              placeholder="e.g. 09469294692"
            />
            {errors.phone && (
              <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
            )}
          </div>

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
              disabled={isAdding}
              weight="normal"
              className="h-11 px-6 rounded-xl bg-black text-white cursor-pointer disabled:bg-neutral-400"
            >
              {student ? "" : isAdding ? "Adding..." : "Add Student"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
