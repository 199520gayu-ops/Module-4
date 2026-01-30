import { useEffect, useState } from "react";
import API from "../api";

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ Fetch tasks from backend
  const fetchTasks = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        window.location.href = "/";
        return;
      }

      const res = await API.get("/tasks", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(res.data);
    } catch (err) {
      console.error(err);
      localStorage.removeItem("token");
      window.location.href = "/";
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // ✅ Add a new task
  const addTask = async (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;
    try {
      const token = localStorage.getItem("token");
      await API.post(
        "/tasks",
        { title: newTask },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNewTask("");
      fetchTasks();
    } catch (err) {
      console.error(err);
      alert("Failed to add task");
    }
  };

  // ✅ Delete a task
  const deleteTask = async (id) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;
    try {
      const token = localStorage.getItem("token");
      await API.delete(`/tasks/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchTasks();
    } catch (err) {
      console.error(err);
      alert("Failed to delete task");
    }
  };

  // ✅ Toggle completion
  const toggleTask = async (task) => {
    try {
      const token = localStorage.getItem("token");
      await API.put(
        `/tasks/${task._id}`,
        { completed: !task.completed },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchTasks();
    } catch (err) {
      console.error(err);
      alert("Failed to update task");
    }
  };

  // ✅ Save edited task
  const saveEdit = async (id) => {
    if (!editText.trim()) return;
    try {
      const token = localStorage.getItem("token");
      await API.put(
        `/tasks/${id}`,
        { title: editText },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEditId(null);
      setEditText("");
      fetchTasks();
    } catch (err) {
      console.error(err);
      alert("Failed to update task");
    }
  };

  // ✅ Logout user
  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  return (
    <div className="page">
      <div className="card">
        <div className="header">
          <h1>📝 Todo Dashboard</h1>
          <button className="logout" onClick={logout}>
            Logout
          </button>
        </div>

        <form className="add-form" onSubmit={addTask}>
          <input
            placeholder="What needs to be done?"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
          />
          <button disabled={loading}>{loading ? "Loading..." : "Add"}</button>
        </form>

        <div className="task-list">
          {tasks.length === 0 && <p className="empty">No tasks yet 🚀</p>}

          {tasks.map((task) => (
            <div
              key={task._id}
              className={`task ${task.completed ? "done" : ""}`}
            >
              {editId === task._id ? (
                <>
                  <input
                    className="edit-input"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                  />
                  <button className="save" onClick={() => saveEdit(task._id)}>
                    Save
                  </button>
                  <button
                    className="delete"
                    onClick={() => setEditId(null)}
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <span onClick={() => toggleTask(task)}>{task.title}</span>
                  <div className="actions">
                    <button
                      className="edit"
                      onClick={() => {
                        setEditId(task._id);
                        setEditText(task.title);
                      }}
                    >
                      Edit
                    </button>
                    <button
                      className="delete"
                      onClick={() => deleteTask(task._id)}
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>

     {/* ===== CSS ===== */}
      <style>{`
        body {
          margin: 0;
          font-family: 'Segoe UI', sans-serif;
          background: linear-gradient(135deg, #667eea, #764ba2);
        }

        .page {
          min-height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .card {
        margin-left:29rem;
          width: 420px;
          background: white;
          padding: 25px;
          border-radius: 12px;
          box-shadow: 0 20px 40px rgba(0,0,0,0.2);
        }

        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        h1 {
          margin: 0;
        }

        .logout {
          background: #ff4d4f;
          border: none;
          color: white;
          padding: 6px 12px;
          border-radius: 6px;
          cursor: pointer;
        }

        .add-form {
          display: flex;
          gap: 10px;
          margin: 20px 0;
        }

        .add-form input {
          flex: 1;
          padding: 10px;
          border-radius: 6px;
          border: 1px solid #ccc;
        }

        .add-form button {
          background: #667eea;
          color: white;
          border: none;
          padding: 10px 16px;
          border-radius: 6px;
          cursor: pointer;
        }

        .task-list {
          margin-top: 10px;
        }

        .task {
          background: #f5f5f5;
          padding: 10px;
          margin-bottom: 10px;
          border-radius: 6px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .task span {
          cursor: pointer;
        }

        .task.done span {
          text-decoration: line-through;
          color: gray;
        }

        .actions button {
          margin-left: 5px;
          border: none;
          padding: 4px 8px;
          border-radius: 4px;
          cursor: pointer;
        }

        .edit {
          background: #ffa940;
          color: white;
        }

        .delete {
          background: #ff4d4f;
          color: white;
        }

        .save {
          background: #52c41a;
          color: white;
          border: none;
          padding: 6px 10px;
          border-radius: 4px;
        }

        .edit-input {
          flex: 1;
          padding: 6px;
          margin-right: 6px;
        }

        .empty {
          text-align: center;
          color: #777;
        }
      `}</style>
    </div>
  );
}


     




