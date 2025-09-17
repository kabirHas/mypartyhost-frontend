import React, { useEffect, useState } from "react";
import { FaStar } from "react-icons/fa";
import "../asset/css/Staff.css";
import BASE_URLS from "../config";
import { Link } from "react-router-dom";

const SearchStaff = () => {
  const [staff, setStaff] = useState([]);
  const [availableNow, setAvailableNow] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit, setLimit] = useState(6);

  const handleToggle = () => setAvailableNow(!availableNow);

  const handleLimitChange = (e) => {
    setLimit(Number(e.target.value));
    setPage(1); // Reset to first page when limit changes
  };

  useEffect(() => {
    fetch(`${BASE_URLS.API}/staff?page=${page}&limit=${limit}`)
      .then((res) => res.json())
      .then((data) => {
        setStaff(data.data);
        setTotalPages(data.totalPages);
      })
      .catch((err) => console.error(err));
  }, [page, limit]);

  const goToPage = (pageNum) => {
    if (pageNum >= 1 && pageNum <= totalPages) {
      setPage(pageNum);
    }
  };

  const renderPageNumbers = () => {
    const pages = [];
  
    // Always show page 1
    pages.push(
      <button
        key={1}
        className={page === 1 ? "active-page" : ""}
        onClick={() => goToPage(1)}
      >
        1
      </button>
    );
  
    // Add dots if there’s a gap between page 1 and the start of the loop
    if (page > 3) {
      pages.push(<span key="startDots">...</span>);
    }
  
    // Loop for pages around the current page, excluding page 1 and totalPages
    for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) {
      pages.push(
        <button
          key={i}
          className={i === page ? "active-page" : ""}
          onClick={() => goToPage(i)}
        >
          {i}
        </button>
      );
    }
  
    // Add dots if there’s a gap between the loop and the last page
    if (page < totalPages - 2) {
      pages.push(<span key="endDots">...</span>);
    }
  
    // Always show the last page if totalPages > 1
    if (totalPages > 1) {
      pages.push(
        <button
          key={totalPages}
          className={page === totalPages ? "active-page" : ""}
          onClick={() => goToPage(totalPages)}
        >
          {totalPages}
        </button>
      );
    }
  
    return pages;
  };

  return (
    <div className="filters">
      <div className="filter-div d-flex">
        <h2 className="filter-head">Search Event Staff</h2>
        <div className="filter-bar">
          <div className="toggle-container">
            <div className="tooltip-wrapper">
              <span className="info-icon">
                <i className="fa-solid fa-info"></i>
              </span>
              <div className="tooltip-text">
                Event staff available now can be ready and available to start work in their city within 1 hour
              </div>
            </div>
            <span>Available Now</span>
            <label className="switch">
              <input type="checkbox" checked={availableNow} onChange={handleToggle} />
              <span className="slider"></span>
            </label>
          </div>

          <select className="filter-select">
            <option>Most Popular</option>
            <option>Newest</option>
            <option>Top Rated</option>
          </select>

          <select className="filter-select">
            <option>Job Type</option>
            <option>Full Time</option>
            <option>Part Time</option>
            <option>Contract</option>
          </select>

          <select className="filter-select location-select">
            <option>Any</option>
            <option>Remote</option>
            <option>On-site</option>
          </select>
        </div>
      </div>

      <div className="Search-container">
        {staff.map((person) => (
          <Link to={`/staff-profile/${person.user._id}`} className="staff-card" key={person._id}>
            <div
              className="staff-info"
              style={{
                backgroundImage: `url(${BASE_URLS.STATIC}${person.user.profileImage})`,
              }}
            >
              <div className="name-stars">
                <h3>
                  {person.user.name.toUpperCase()} <span style={{ color: "#656565" }}> | </span>
                  <span>{person.user.city},{person.user.state}</span>
                </h3>
                <div className="stars">
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} color="red" />
                  ))}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
<div className="pagination-cont d-flex">
      {/* Pagination Controls */}
      <div className="pagination">
        <button disabled={page === 1} onClick={() => goToPage(page - 1)}>
          Previous
        </button>

        {/* <button
          className={page === 1 ? "active-page" : ""}
          onClick={() => goToPage(1)}
        >
          1
        </button> */}

        {renderPageNumbers()}

        <button disabled={page === totalPages} onClick={() => goToPage(page + 1)}>
          Next
        </button>
      </div>

      {/* Limit Dropdown */}
      <div className="limit-dropdown">
        <label>Show</label>
        <select value={limit} onChange={handleLimitChange}>
          <option value="8">8</option>
          <option value="16">16</option>
          <option value="24">24</option>
        </select>
        <span>Per Page</span>
      </div>
      </div>
    </div>
  );
};

export default SearchStaff;
