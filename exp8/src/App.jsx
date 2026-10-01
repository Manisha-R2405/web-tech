
import { useState } from "react";
import "./App.css";
import Navbar from "./components/Navbar";
import StatCard from "./components/StatCard";

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [search, setSearch] = useState("");
  const [task, setTask] = useState("");

  const [tasks, setTasks] = useState([
    { id: 1, title: "Complete ReactJS lab record", done: false },
    { id: 2, title: "Revise database concepts", done: true },
    { id: 3, title: "Prepare for internal assessment", done: false },
  ]);

  const courses = [
    { name: "Web Technology", code: "CS201", progress: 80, icon: "🌐" },
    { name: "Database Management", code: "CS202", progress: 65, icon: "🗄️" },
    { name: "Machine Learning", code: "CS203", progress: 72, icon: "🤖" },
    { name: "Computer Networks", code: "CS204", progress: 55, icon: "🔗" },
  ];

  const filteredCourses = courses.filter((course) =>
    course.name.toLowerCase().includes(search.toLowerCase())
  );

  function addTask(event) {
    event.preventDefault();

    if (task.trim() === "") {
      return;
    }

    const newTask = {
      id: Date.now(),
      title: task.trim(),
      done: false,
    };

    setTasks([...tasks, newTask]);
    setTask("");
  }

  function toggleTask(id) {
    setTasks(
      tasks.map((item) =>
        item.id === id ? { ...item, done: !item.done } : item
      )
    );
  }

  function deleteTask(id) {
    setTasks(tasks.filter((item) => item.id !== id));
  }

  const completedTasks = tasks.filter((item) => item.done).length;

  const completionPercentage =
    tasks.length === 0
      ? 0
      : Math.round((completedTasks / tasks.length) * 100);

  return (
    <div className={darkMode ? "app dark" : "app"}>
      <Navbar
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        search={search}
        setSearch={setSearch}
      />

      <main className="dashboard">
        <section className="welcome-section" id="home">
          <div>
            <p className="eyebrow">STUDENT OVERVIEW</p>
            <h1>Welcome back, Manisha! 👋</h1>
            <p className="welcome-text">
              Keep learning, stay organized, and achieve your goals.
            </p>
          </div>

          <div className="date-card">
            <span className="date-icon">📅</span>
            <div>
              <strong>Academic Dashboard</strong>
              <p>Your progress at a glance</p>
            </div>
          </div>
        </section>

        <section className="stats-grid">
          <StatCard
            title="Total Courses"
            value="6"
            icon="📚"
            color="#e7e9ff"
          />

          <StatCard
            title="Assignments"
            value="12"
            icon="📝"
            color="#ffedd5"
          />

          <StatCard
            title="Attendance"
            value="92%"
            icon="📅"
            color="#dcfce7"
          />

          <StatCard
            title="Current CGPA"
            value="8.7"
            icon="🏆"
            color="#fce7f3"
          />
        </section>

        <section className="content-grid">
          <div className="panel courses-panel" id="courses">
            <div className="section-heading">
              <div>
                <p className="eyebrow">YOUR LEARNING</p>
                <h2>My Courses</h2>
              </div>

              <span className="count-badge">
                {filteredCourses.length} courses
              </span>
            </div>

            <div className="course-list">
              {filteredCourses.map((course) => (
                <div className="course-item" key={course.code}>
                  <div className="course-icon">{course.icon}</div>

                  <div className="course-info">
                    <h3>{course.name}</h3>
                    <p>{course.code}</p>

                    <div
                      className="progress-track"
                      role="progressbar"
                      aria-valuenow={course.progress}
                      aria-valuemin="0"
                      aria-valuemax="100"
                      aria-label={`${course.name} completion`}
                    >
                      <div
                        className="progress-fill"
                        style={{ width: `${course.progress}%` }}
                      ></div>
                    </div>

                    <span className="progress-label">
                      {course.progress}% completed
                    </span>
                  </div>
                </div>
              ))}

              {filteredCourses.length === 0 && (
                <p className="empty-message">No matching courses found.</p>
              )}
            </div>
          </div>

          <div className="panel tasks-panel" id="tasks">
            <div className="section-heading">
              <div>
                <p className="eyebrow">STAY ORGANIZED</p>
                <h2>My Tasks</h2>
              </div>

              <span className="count-badge">
                {completedTasks}/{tasks.length} done
              </span>
            </div>

            <form className="task-form" onSubmit={addTask}>
              <input
                type="text"
                placeholder="Enter a new task..."
                value={task}
                onChange={(event) => setTask(event.target.value)}
                aria-label="New task"
              />

              <button type="submit" className="add-btn">
                + Add
              </button>
            </form>

            <div className="task-list">
              {tasks.map((item) => (
                <div
                  className={`task-item ${item.done ? "completed" : ""}`}
                  key={item.id}
                >
                  <label className="task-label">
                    <input
                      type="checkbox"
                      checked={item.done}
                      onChange={() => toggleTask(item.id)}
                    />
                    <span>{item.title}</span>
                  </label>

                  <button
                    type="button"
                    className="delete-btn"
                    onClick={() => deleteTask(item.id)}
                    aria-label={`Delete ${item.title}`}
                    title="Delete task"
                  >
                    ×
                  </button>
                </div>
              ))}

              {tasks.length === 0 && (
                <p className="empty-message">
                  No tasks yet. Add your first task!
                </p>
              )}
            </div>

            <div className="task-summary">
              <span>Task completion</span>
              <strong>{completionPercentage}%</strong>
            </div>

            <div className="progress-track summary-track">
              <div
                className="progress-fill"
                style={{ width: `${completionPercentage}%` }}
              ></div>
            </div>
          </div>
        </section>

        <footer className="footer" id="profile">
          <p>© 2026 EduDashboard · Designed with ReactJS</p>
          <p>Learn today. Lead tomorrow. ✨</p>
        </footer>
      </main>
    </div>
  );
}

export default App;