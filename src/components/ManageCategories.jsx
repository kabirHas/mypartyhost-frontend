import React, { useEffect, useState } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";

const ManageCategories = () => {
  const [categories, setCategories] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editIcon, setEditIcon] = useState("");
  const navigate = useNavigate();

  const iconOptions = [
    { id: "ri-book-2-line", label: "Book" },
    { id: "ri-paint-line", label: "Paint" },
    { id: "ri-music-line", label: "Music" },
    { id: "ri-gamepad-line", label: "Gamepad" },
    { id: "ri-rocket-line", label: "Rocket" },
    { id: "ri-settings-3-line", label: "Settings" },
    { id: "ri-lightbulb-line", label: "Lightbulb" },
  ];

  // Fetch categories on mount
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await API.get("/categories");
      setCategories(res.data);
    } catch (error) {
      console.error("Failed to fetch categories", error);
    }
  };

  const startEdit = (cat) => {
    setEditId(cat._id);
    setEditName(cat.name);
    setEditDescription(cat.description || "");
    setEditIcon(cat.icon);
  };

  const cancelEdit = () => {
    setEditId(null);
    setEditName("");
    setEditDescription("");
    setEditIcon("");
  };

  const handleUpdate = async () => {
    try {
      await API.put(`/categories/${editId}`, {
        name: editName,
        description: editDescription,
        icon: editIcon,
      });
      cancelEdit();
      fetchCategories();
    } catch (error) {
      console.error("Failed to update category", error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category?")) return;

    try {
      await API.delete(`/categories/${id}`);
      fetchCategories();
    } catch (error) {
      console.error("Failed to delete category", error);
    }
  };

  return (
    <div>
      <h2>Manage Categories</h2>

      {categories.length === 0 && <p>No categories found.</p>}

      <ul style={{ listStyle: "none", padding: 0 }}>
        {categories.map((cat) => (
          <li
            key={cat._id}
            style={{
              border: "1px solid #ccc",
              marginBottom: "10px",
              padding: "10px",
              borderRadius: "6px",
            }}
          >
            {editId === cat._id ? (
              <div>
                <input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="Category Name"
                  required
                  style={{ marginBottom: "6px", width: "100%" }}
                />
                <textarea
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  placeholder="Description"
                  style={{ marginBottom: "6px", width: "100%" }}
                />
                <div style={{ display: "flex", gap: "10px", marginBottom: "6px" }}>
                  {iconOptions.map(({ id, label }) => (
                    <div
                      key={id}
                      onClick={() => setEditIcon(id)}
                      style={{
                        cursor: "pointer",
                        padding: "8px",
                        border: editIcon === id ? "2px solid blue" : "1px solid gray",
                        borderRadius: "4px",
                        textAlign: "center",
                        userSelect: "none",
                      }}
                      title={label}
                    >
                      <i className={id} style={{ fontSize: "20px" }}></i>
                      <div style={{ fontSize: "11px", marginTop: "3px" }}>{label}</div>
                    </div>
                  ))}
                </div>

                <button onClick={handleUpdate} style={{ marginRight: "10px" }}>
                  Save
                </button>
                <button onClick={cancelEdit}>Cancel</button>
              </div>
            ) : (
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div>
                  <i className={cat.icon} style={{ fontSize: "24px", marginRight: "10px" }}></i>
                  <strong>{cat.name}</strong>
                  <p style={{ margin: 0 }}>{cat.description}</p>
                </div>

                <div>
                  <button onClick={() => startEdit(cat)} style={{ marginRight: "10px" }}>
                    Edit
                  </button>
                  <button onClick={() => handleDelete(cat._id)} style={{ color: "red" }}>
                    Delete
                  </button>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ManageCategories;
