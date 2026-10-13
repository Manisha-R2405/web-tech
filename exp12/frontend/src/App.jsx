
import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

const API = "http://localhost:5000/students";

function App() {
  const [students, setStudents] = useState([]);
  const [editId, setEditId] = useState(null);
  const [message, setMessage] = useState("");

  const [formData, setFormData] = useState({
    regNo: "",
    name: "",
    department: "",
    email: "",
    cgpa: ""
  });

  const fetchStudents = async () => {
    try {
      const response = await axios.get(API);
      setStudents(response.data);
    } catch (error) {
      setMessage("Unable to load students. Check the backend.");
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const studentData = {
        ...formData,
        cgpa: formData.cgpa === "" ? undefined : Number(formData.cgpa)
      };

      if (editId) {
        await axios.put(`${API}/${editId}`, studentData);
        setMessage("Student updated successfully!");
      } else {
        await axios.post(API, studentData);
        setMessage("Student added successfully!");
      }

      setFormData({
        regNo: "",
        name: "",
        department: "",
        email: "",
        cgpa: ""
      });

      setEditId(null);
      await fetchStudents();
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Operation failed."
      );
    }
  };

  const handleEdit = (student) => {
    setFormData({
      regNo: student.regNo,
      name: student.name,
      department: student.department,
      email: student.email || "",
      cgpa: student.cgpa ?? ""
    });

    setEditId(student._id);
    setMessage("Edit the details and click Update Student.");
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this student?")) {
      return;
    }

    try {
      await axios.delete(`${API}/${id}`);
      setMessage("Student deleted successfully!");
      await fetchStudents();
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Unable to delete student."
      );
    }
  };

  const cancelEdit = () => {
    setEditId(null);
    setFormData({
      regNo: "",
      name: "",
      department: "",
      email: "",
      cgpa: ""
    });
    setMessage("");
  };

  return (
    <main className="container">
      <header className="page-header">
        <p className="subtitle">FULL STACK WEB DEVELOPMENT LAB</p>
        <h1>Student Management System</h1>
        <p>Manage student records using React, Node.js and MongoDB.</p>
      </header>

      <section className="form-card">
        <h2>{editId ? "Update Student" : "Add New Student"}</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <input
              name="regNo"
              placeholder="Register Number"
              value={formData.regNo}
              onChange={handleChange}
              required
            />

            <input
              name="name"
              placeholder="Student Name"
              value={formData.name}
              onChange={handleChange}
              required
            />

            <input
              name="department"
              placeholder="Department (e.g. CSE)"
              value={formData.department}
              onChange={handleChange}
              required
            />

            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
            />

            <input
              type="number"
              name="cgpa"
              placeholder="CGPA"
              min="0"
              max="10"
              step="0.01"
              value={formData.cgpa}
              onChange={handleChange}
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="primary-btn">
              {editId ? "Update Student" : "Add Student"}
            </button>

            {editId && (
              <button
                type="button"
                className="cancel-btn"
                onClick={cancelEdit}
              >
                Cancel
              </button>
            )}
          </div>
        </form>

        {message && <p className="message">{message}</p>}
      </section>

      <section className="table-card">
        <div className="table-heading">
          <h2>Student List</h2>
          <span>{students.length} student(s)</span>
        </div>

        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Register No.</th>
                <th>Name</th>
                <th>Department</th>
                <th>Email</th>
                <th>CGPA</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {students.length === 0 ? (
                <tr>
                  <td colSpan="6" className="empty-state">
                    No student records yet. Add your first student above.
                  </td>
                </tr>
              ) : (
                students.map((student) => (
                  <tr key={student._id}>
                    <td>{student.regNo}</td>
                    <td>{student.name}</td>
                    <td>{student.department}</td>
                    <td>{student.email || "-"}</td>
                    <td>{student.cgpa ?? "-"}</td>
                    <td className="action-cell">
                      <button
                        className="edit-btn"
                        onClick={() => handleEdit(student)}
                      >
                        Edit
                      </button>

                      <button
                        className="delete-btn"
                        onClick={() => handleDelete(student._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      <footer>
        ReactJS · ExpressJS · Node.js · MongoDB
      </footer>
    </main>
  );
}

export default App;
