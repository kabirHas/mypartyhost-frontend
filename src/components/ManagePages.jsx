import React, { useEffect, useState } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";
import ManageCategories from "./ManageCategories";

const ManagePages = () => {
  const [pages, setPages] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    API.get("/pages").then((res) => setPages(res.data));
  }, []);

  const handleUpdate = (id) => {
    navigate(`/update-page/${id}`);
  };

  const handleDelete = async (id) => {
    // if (window.confirm('Are you sure you want to delete this page?')) {
    try {
      await API.delete(`/pages/${id}`);
      setPages((prevPages) => prevPages.filter((p) => p._id !== id));
    } catch (error) {
      console.error("Delete failed:", error);
      alert("Failed to delete page.");
    }
    // }
  };

  return (
    <div>
      <div className="dashboard-conatiner d-flex">
        <div className="content-area">
          <h2>Dashboard</h2>
          <button onClick={() => navigate("/dashboard/all-pages/create-page")}>Create Page</button>
          {/* <button onClick={() => navigate("/create-category")}>
            Create Category
          </button>
          <button onClick={() => navigate("/create-faq")}>Create FAQs</button> */}

          <ul>
            {pages.map((p) => (
              <li key={p._id}>
                <strong>{p.title}</strong> -{" "}
                <a
                  href={p.slug === "home" ? "/" : `/${p.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {p.slug}
                </a>
                <div>
                  <button onClick={() => handleUpdate(p._id)}>Update</button>
                  <button onClick={() => handleDelete(p._id)}>Delete</button>
                </div>
              </li>
            ))}
          </ul>
          {/* <ManageCategories /> */}
        </div>
      </div>
    </div>
  );
};

export default ManagePages;
