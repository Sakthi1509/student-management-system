import { useEffect, useState } from "react";
import axios from "axios";

export default function App() {
  const API_URL = "https://student-management-system-backend-production.up.railway.app/api/students";

  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    name: "",
    course: "",
    age: "",
  });

  const [editingId, setEditingId] = useState(null);

  // FETCH STUDENTS
  const fetchStudents = async () => {
    try {
      const response = await axios.get(API_URL);
      setStudents(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // INPUT CHANGE
  const handleChange = (e: any) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ADD / UPDATE
  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      if (editingId) {
        await axios.put(`${API_URL}/${editingId}`, formData);
        alert("Student Updated");
      } else {
        await axios.post(API_URL, formData);
        alert("Student Added");
      }

      setFormData({
        name: "",
        course: "",
        age: "",
      });

      setEditingId(null);

      fetchStudents();
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    }
  };

  // DELETE
  const deleteStudent = async (id: number) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete?"
    );

    if (!confirmDelete) return;

    try {
      await axios.delete(`${API_URL}/${id}`);

      fetchStudents();
    } catch (error) {
      console.error(error);
    }
  };

  // EDIT
  const editStudent = (student: any) => {
    setFormData({
      name: student.name,
      course: student.course,
      age: student.age,
    });

    setEditingId(student.id);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 p-6">

      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="bg-white/10 backdrop-blur-lg border border-white/10 rounded-3xl p-8 mb-8 shadow-2xl">

          <h1 className="text-5xl font-bold text-white mb-3">
            🎓 Student Management
          </h1>

          <p className="text-gray-300 text-lg">
            Laravel REST API + React Frontend Dashboard
          </p>

        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* FORM */}
          <div className="bg-white/10 backdrop-blur-lg border border-white/10 rounded-3xl p-8 shadow-2xl h-fit">

            <div className="flex items-center justify-between mb-6">

              <h2 className="text-3xl font-bold text-white">
                {editingId ? "✏️ Edit Student" : "➕ Add Student"}
              </h2>

              {editingId && (
                <button
                  onClick={() => {
                    setEditingId(null);

                    setFormData({
                      name: "",
                      course: "",
                      age: "",
                    });
                  }}
                  className="text-sm bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl transition-all"
                >
                  Cancel
                </button>
              )}

            </div>

            <form onSubmit={handleSubmit} className="space-y-5">

              <input
                type="text"
                name="name"
                placeholder="Student Name"
                value={formData.name}
                onChange={handleChange}
                className="w-full bg-white/10 border border-white/20 text-white placeholder-gray-400 rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-blue-500"
                required
              />

              <input
                type="text"
                name="course"
                placeholder="Course"
                value={formData.course}
                onChange={handleChange}
                className="w-full bg-white/10 border border-white/20 text-white placeholder-gray-400 rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-blue-500"
                required
              />

              <input
                type="number"
                name="age"
                placeholder="Age"
                value={formData.age}
                onChange={handleChange}
                className="w-full bg-white/10 border border-white/20 text-white placeholder-gray-400 rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-blue-500"
                required
              />

              <button
                type="submit"
                className={`w-full py-4 rounded-2xl font-bold text-lg transition-all duration-300 ${editingId
                  ? "bg-blue-500 hover:bg-blue-600"
                  : "bg-green-500 hover:bg-green-600"
                  } text-white hover:scale-[1.02]`}
              >
                {editingId ? "Update Student ✨" : "Add Student 🚀"}
              </button>

            </form>

          </div>

          {/* TABLE */}
          <div className="lg:col-span-2 bg-white/10 backdrop-blur-lg border border-white/10 rounded-3xl p-8 shadow-2xl overflow-hidden">

            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">

              <div>
                <h2 className="text-3xl font-bold text-white">
                  📚 Students
                </h2>

                <p className="text-gray-400 mt-1">
                  Manage all student records
                </p>
              </div>

              <div className="bg-white/10 px-5 py-3 rounded-2xl text-white text-lg font-semibold">
                Total: {students.length}
              </div>

            </div>

            {loading ? (

              <div className="text-center py-20 text-white text-xl">
                Loading students...
              </div>

            ) : students.length === 0 ? (

              <div className="text-center py-20">

                <h3 className="text-3xl mb-3">📭</h3>

                <p className="text-gray-400 text-lg">
                  No students found
                </p>

              </div>

            ) : (

              <div className="overflow-x-auto">

                <table className="w-full">

                  <thead>
                    <tr className="bg-white/10 text-gray-300">
                      <th className="p-5 text-left rounded-l-2xl">ID</th>
                      <th className="p-5 text-left">Name</th>
                      <th className="p-5 text-left">Course</th>
                      <th className="p-5 text-left">Age</th>
                      <th className="p-5 text-center rounded-r-2xl">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody>

                    {students.map((student) => (

                      <tr
                        key={student.id}
                        className="border-b border-white/10 hover:bg-white/5 transition-all duration-300"
                      >

                        <td className="p-5 text-white font-semibold">
                          #{student.id}
                        </td>

                        <td className="p-5 text-white">
                          {student.name}
                        </td>

                        <td className="p-5 text-gray-300">
                          {student.course}
                        </td>

                        <td className="p-5 text-gray-300">
                          {student.age}
                        </td>

                        <td className="p-5">

                          <div className="flex justify-center gap-3">

                            <button
                              onClick={() => editStudent(student)}
                              className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-xl transition-all hover:scale-105"
                            >
                              Edit
                            </button>

                            <button
                              onClick={() => deleteStudent(student.id)}
                              className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-xl transition-all hover:scale-105"
                            >
                              Delete
                            </button>

                          </div>

                        </td>

                      </tr>

                    ))}

                  </tbody>

                </table>

              </div>

            )}

          </div>

        </div>

      </div>

    </div>
  );
}