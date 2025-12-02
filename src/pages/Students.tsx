import { useState, useEffect } from "react";
import { Search, Plus, Edit, Trash2 } from "lucide-react";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { CardContent } from "../components/CardContent";
import StudentViewModal from "../components/StudentViewModal";
import { StudentModal } from "../components/StudentModal";
import type { Student, StudentType } from "../types";
import { useStudents } from "../hooks/students/useStudents";
import { useDeleteStudent } from "../hooks/students/useDeleteStudent";
import Swal from "sweetalert2";

// TEMPORARY DATA
/* const tempStudents = [
  {
    id: "1",
    name: "John Michael Cruz",
    studentId: "2023-00123",
    email: "john.cruz@example.com",
    phone: "09123456789",
    history: [],
  },
  {
    id: "2",
    name: "Angelica Santos",
    studentId: "2023-00456",
    email: "angelica.santos@example.com",
    phone: "09987654321",
    history: [
      { title: "As The Gods Will", due: "12/8/2025", status: "On time" },
      { title: "New World", due: "12/14/2025", status: "On time" },
      { title: "New World", due: "12/14/2025", status: "On time" },
      { title: "New World", due: "12/14/2025", status: "On time" },
    ],
  },
  {
    id: "3",
    name: "Mark Joseph Dela Rosa",
    studentId: "2022-00987",
    email: "mark.delarosa@example.com",
    phone: "09351234567",
    history: [
      { title: "As The Gods Will", due: "12/8/2025", status: "On time" },
      { title: "New World", due: "12/14/2025", status: "On time" },
    ],
  },
]; */

export default function Students() {
  const { data: studentsData, isLoading } = useStudents();
  const { mutate: deleteStudentMutate, isPending: isDeleting } =
    useDeleteStudent();

  const students: Student[] = studentsData ?? [];

  const [filteredStudents, setFilteredStudents] = useState(students);
  const [searchTerm, setSearchTerm] = useState("");

  const [selectedStudent, setSelectedStudent] = useState<StudentType | null>(
    null
  );
  const [isViewOpen, setIsViewOpen] = useState(false);

  // Add Modal
  const [isAddOpen, setIsAddOpen] = useState(false);

  // Edit Modal
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editStudent, setEditStudent] = useState<StudentType | null>(null);

  // 🔍 Filter students when search changes
  useEffect(() => {
    const lower = searchTerm.toLowerCase();

    const filtered = students.filter(
      (s) =>
        s.name.toLowerCase().includes(lower) ||
        s.studentId.toLowerCase().includes(lower) ||
        s.email.toLowerCase().includes(lower) ||
        s.phone.toLowerCase().includes(lower)
    );

    setFilteredStudents(filtered);
  }, [searchTerm, students]);

  // Open View Modal
  const openViewModal = (s: StudentType) => {
    setSelectedStudent(s);
    setIsViewOpen(true);
  };

  // Open Edit Modal
  const openEditModal = (s: StudentType) => {
    setEditStudent(s);
    setIsEditOpen(true);
  };

  // Open Add Modal
  const openAddModal = () => {
    setIsAddOpen(true);
  };

  const handleDeleteStudent = async (id: string) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      Swal.fire({
        title: "Deleting...",
        text: "Please wait",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });

      deleteStudentMutate(id, {
        onSuccess: () => {
          Swal.close(); // 🔥 CLOSE LOADING
          Swal.fire("Deleted!", "Student has been removed.", "success");
        },
        onError: () => {
          Swal.close();
          Swal.fire("Error", "Failed to delete the student.", "error");
        },
      });
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
                Student Borrowers
              </h1>
              <p className="text-xl mt-2 text-gray-500">
                Manage student accounts
              </p>
            </div>

            <Button className="gap-2 cursor-pointer" onClick={openAddModal}>
              <Plus className="w-4 h-4" /> Register Student
            </Button>
          </div>

          {/* Search */}
          <div className="mb-6 relative w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              placeholder="Search by name, student ID, or email..."
              className="pl-12 w-full h-12 rounded-xl border border-gray-300 focus:ring-2 focus:ring-gray-300 focus:outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Table */}
          <Card>
            <CardContent>
              <div className="overflow-x-auto">
                <div className="bg-white rounded-xl overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-100 text-black text-xl">
                      <tr>
                        <th className="text-left p-4 font-semibold">Name</th>
                        <th className="text-left p-4 font-semibold">
                          Student ID
                        </th>
                        <th className="text-left p-4 font-semibold">Email</th>
                        <th className="text-left p-4 font-semibold">Phone</th>
                        <th className="text-right p-4 font-semibold">
                          Actions
                        </th>
                      </tr>
                    </thead>

                    <tbody className="bg-white text-base">
                      {filteredStudents.length === 0 ? (
                        <tr>
                          <td
                            colSpan={5}
                            className="text-center py-8 text-gray-500"
                          >
                            No students found
                          </td>
                        </tr>
                      ) : (
                        filteredStudents.map((s) => (
                          <tr key={s.id} className="border-b border-gray-300">
                            <td className="p-4 font-medium">{s.name}</td>
                            <td className="p-4">{s.studentId}</td>
                            <td className="p-4">{s.email}</td>
                            <td className="p-4">{s.phone}</td>

                            <td className="p-4">
                              <div className="flex justify-end items-center gap-3">
                                {/* View */}
                                <button
                                  className="p-1 rounded hover:bg-gray-50 text-gray-700 cursor-pointer"
                                  onClick={() => openViewModal(s)}
                                >
                                  {" "}
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                  >
                                    {" "}
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                    />{" "}
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                    />{" "}
                                  </svg>{" "}
                                </button>

                                {/* Edit */}
                                <button
                                  onClick={() => openEditModal(s)}
                                  className="p-1 rounded hover:bg-gray-50 text-gray-700 cursor-pointer"
                                >
                                  <Edit className="w-4 h-4" />
                                </button>

                                {/* Delete */}
                                <button
                                  onClick={() => handleDeleteStudent(s.id)}
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

      {/* Add Student Modal */}
      {isAddOpen && (
        <StudentModal student={null} onClose={() => setIsAddOpen(false)} />
      )}

      {/* Edit Student Modal */}
      {isEditOpen && (
        <StudentModal
          student={editStudent}
          onClose={() => setIsEditOpen(false)}
        />
      )}

      {/* View Modal */}
      <StudentViewModal
        open={isViewOpen}
        onClose={() => setIsViewOpen(false)}
        student={selectedStudent}
      />
    </div>
  );
}
