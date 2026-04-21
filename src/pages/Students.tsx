import { useState, useEffect, useMemo } from "react";
import { Search, Plus, Edit, Trash2, Users, Eye } from "lucide-react";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { CardContent } from "../components/CardContent";
import StudentViewModal from "../components/StudentViewModal";
import { StudentModal } from "../components/StudentModal";
import type { Student, StudentType } from "../types";
import { useStudents } from "../hooks/students/useStudents";
import { useDeleteStudent } from "../hooks/students/useDeleteStudent";
import Swal from "sweetalert2";
import { useUserContext } from "../contexts/UserContext";
import { useUpdateStudent } from "../hooks/students/useUpdateStudent";

const SkeletonCell = ({ width = "w-full" }: { width?: string }) => (
  <div
    className={`relative h-5 overflow-hidden rounded-md bg-gray-200 ${width}`}
  >
    <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200" />
  </div>
);

export default function Students() {
  const { user } = useUserContext();

  const { data: studentsData, isLoading } = useStudents();
  const { mutate: deleteStudentMutate } = useDeleteStudent();
  const { mutate: updateStudentMutate, isPending } = useUpdateStudent();

  const students = useMemo<Student[]>(() => studentsData ?? [], [studentsData]);

  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);

  const [editingRowId, setEditingRowId] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState<Partial<StudentType>>({});

  useEffect(() => {
    const lower = searchTerm.toLowerCase();

    const filtered = students.filter(
      (s) =>
        s.name.toLowerCase().includes(lower) ||
        s.studentId.toLowerCase().includes(lower) ||
        s.email.toLowerCase().includes(lower) ||
        s.phone.toLowerCase().includes(lower),
    );

    setFilteredStudents(filtered);
  }, [searchTerm, students]);

  const openViewModal = (s: Student) => {
    setSelectedStudent(s);
    setIsViewOpen(true);
  };

  const openAddModal = () => {
    setIsAddOpen(true);
    setEditingRowId(null);
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
          Swal.close();
          Swal.fire("Deleted!", "Student has been removed.", "success");
        },
        onError: () => {
          Swal.close();
          Swal.fire("Error", "Failed to delete the student.", "error");
        },
      });
    }
  };

  const handleSave = () => {
    if (!editFormData) return;

    updateStudentMutate(editFormData as StudentType, {
      onSuccess: () => setEditingRowId(null),
      onError: () => Swal.fire("Error", "Failed to update student", "error"),
    });
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
                  <Users className="h-5 w-5" />
                </div>

                <div className="min-w-0">
                  <h1 className="truncate text-2xl font-bold text-gray-900 sm:text-3xl">
                    Student Borrowers
                  </h1>
                  <p className="mt-1 text-sm text-gray-500 sm:text-base">
                    Manage student accounts
                  </p>
                </div>
              </div>
            </div>

            {user && (
              <Button
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 cursor-pointer sm:w-auto"
                onClick={openAddModal}
              >
                <Plus className="h-4 w-4" />
                Register Student
              </Button>
            )}
          </div>

          {/* Search */}
          <div className="mb-5 sm:mb-6">
            <div className="relative">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <input
                placeholder="Search by name, student ID, email, or phone..."
                className="h-12 w-full rounded-2xl border border-gray-200 bg-white pl-12 pr-4 text-sm shadow-sm outline-none transition focus:border-gray-300 focus:ring-2 focus:ring-gray-200 sm:text-base"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Table */}
          <Card className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="min-w-[700px] w-full text-sm">
                  <thead className="bg-gray-50 text-gray-700">
                    <tr className="border-b border-gray-200">
                      <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wide sm:px-6">
                        Name
                      </th>
                      <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wide sm:px-6">
                        Student ID
                      </th>
                      <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wide sm:px-6">
                        Email
                      </th>
                      <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wide sm:px-6">
                        Phone
                      </th>
                      {user && (
                        <th className="px-4 py-4 text-right text-xs font-semibold uppercase tracking-wide sm:px-6">
                          Actions
                        </th>
                      )}
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-200 bg-white text-sm text-gray-700">
                    {isLoading ? (
                      Array.from({ length: 6 }).map((_, i) => (
                        <tr key={i}>
                          <td className="px-4 py-4 sm:px-6">
                            <SkeletonCell width="w-3/4" />
                          </td>
                          <td className="px-4 py-4 sm:px-6">
                            <SkeletonCell width="w-1/2" />
                          </td>
                          <td className="px-4 py-4 sm:px-6">
                            <SkeletonCell width="w-2/3" />
                          </td>
                          <td className="px-4 py-4 sm:px-6">
                            <SkeletonCell width="w-1/2" />
                          </td>

                          {user && (
                            <td className="px-4 py-4 sm:px-6">
                              <div className="flex justify-end gap-2">
                                <div className="relative h-9 w-9 overflow-hidden rounded-xl bg-gray-200">
                                  <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200" />
                                </div>
                                <div className="relative h-9 w-9 overflow-hidden rounded-xl bg-gray-200">
                                  <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200" />
                                </div>
                                <div className="relative h-9 w-9 overflow-hidden rounded-xl bg-gray-200">
                                  <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200" />
                                </div>
                              </div>
                            </td>
                          )}
                        </tr>
                      ))
                    ) : filteredStudents.length === 0 ? (
                      <tr>
                        <td
                          colSpan={user ? 5 : 4}
                          className="px-4 py-16 text-center sm:px-6"
                        >
                          <div className="mx-auto flex max-w-sm flex-col items-center">
                            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
                              <Users className="h-6 w-6 text-gray-400" />
                            </div>
                            <p className="text-base font-medium text-gray-900">
                              No students found
                            </p>
                            <p className="mt-1 text-sm text-gray-500">
                              Try adjusting your search or register a new
                              student.
                            </p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      filteredStudents.map((s) => {
                        const isEditing = s.id === editingRowId;
                        const skeleton = <SkeletonCell width="w-1/2" />;

                        return (
                          <tr
                            key={s.id}
                            className="transition hover:bg-gray-50/80"
                          >
                            <td className="px-4 py-4 align-middle sm:px-6">
                              {isEditing ? (
                                isPending ? (
                                  skeleton
                                ) : (
                                  <input
                                    value={editFormData.name || ""}
                                    onChange={(e) =>
                                      setEditFormData({
                                        ...editFormData,
                                        name: e.target.value,
                                      })
                                    }
                                    className="w-full rounded-xl border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-gray-200"
                                  />
                                )
                              ) : (
                                <span className="font-medium text-gray-900">
                                  {s.name}
                                </span>
                              )}
                            </td>

                            <td className="px-4 py-4 align-middle sm:px-6">
                              {isEditing ? (
                                isPending ? (
                                  skeleton
                                ) : (
                                  <input
                                    value={editFormData.studentId || ""}
                                    onChange={(e) =>
                                      setEditFormData({
                                        ...editFormData,
                                        studentId: e.target.value,
                                      })
                                    }
                                    className="w-full rounded-xl border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-gray-200"
                                  />
                                )
                              ) : (
                                s.studentId
                              )}
                            </td>

                            <td className="px-4 py-4 align-middle sm:px-6">
                              {isEditing ? (
                                isPending ? (
                                  skeleton
                                ) : (
                                  <input
                                    type="email"
                                    value={editFormData.email || ""}
                                    onChange={(e) =>
                                      setEditFormData({
                                        ...editFormData,
                                        email: e.target.value,
                                      })
                                    }
                                    className="w-full rounded-xl border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-gray-200"
                                  />
                                )
                              ) : (
                                s.email
                              )}
                            </td>

                            <td className="px-4 py-4 align-middle sm:px-6">
                              {isEditing ? (
                                isPending ? (
                                  skeleton
                                ) : (
                                  <input
                                    value={editFormData.phone || ""}
                                    onChange={(e) =>
                                      setEditFormData({
                                        ...editFormData,
                                        phone: e.target.value,
                                      })
                                    }
                                    className="w-full rounded-xl border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-gray-200"
                                  />
                                )
                              ) : (
                                s.phone
                              )}
                            </td>

                            {user && (
                              <td className="px-4 py-4 align-middle sm:px-6">
                                {isEditing ? (
                                  <div className="flex flex-col justify-end gap-2 sm:flex-row">
                                    <Button
                                      disabled={isPending}
                                      className="rounded-xl px-3 py-2 cursor-pointer"
                                      onClick={handleSave}
                                    >
                                      Save
                                    </Button>
                                    <Button
                                      disabled={isPending}
                                      variant="secondary"
                                      className="rounded-xl bg-gray-200 px-3 py-2 text-gray-800 cursor-pointer hover:bg-gray-300"
                                      onClick={() => setEditingRowId(null)}
                                    >
                                      Cancel
                                    </Button>
                                  </div>
                                ) : (
                                  <div className="flex justify-end gap-2">
                                    <button
                                      className="flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 text-gray-700 transition hover:bg-gray-100 cursor-pointer"
                                      onClick={() => openViewModal(s)}
                                      aria-label={`View ${s.name}`}
                                    >
                                      <Eye className="h-4 w-4" />
                                    </button>

                                    <button
                                      onClick={() => {
                                        setEditingRowId(s.id);
                                        setEditFormData(s);
                                      }}
                                      className="flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 text-gray-700 transition hover:bg-gray-100 cursor-pointer"
                                      aria-label={`Edit ${s.name}`}
                                    >
                                      <Edit className="h-4 w-4" />
                                    </button>

                                    <button
                                      onClick={() => handleDeleteStudent(s.id)}
                                      className="flex h-9 w-9 items-center justify-center rounded-xl border border-red-200 text-red-600 transition hover:bg-red-50 cursor-pointer"
                                      aria-label={`Delete ${s.name}`}
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </button>
                                  </div>
                                )}
                              </td>
                            )}
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      {isAddOpen && (
        <StudentModal student={null} onClose={() => setIsAddOpen(false)} />
      )}

      <StudentViewModal
        open={isViewOpen}
        onClose={() => setIsViewOpen(false)}
        student={selectedStudent}
      />
    </div>
  );
}
