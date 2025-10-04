// import React, { useEffect, useState } from "react";
// import { FaStar } from "react-icons/fa";
// import "../asset/css/Staff.css";
// import BASE_URLS from "../config";
// import { Link } from "react-router-dom";
// import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";

// const SearchStaff = () => {
//   const [staff, setStaff] = useState([]);
//   const [allstaff, setAllStaff] = useState([]);
//   const [availableNow, setAvailableNow] = useState(false);
//   const [page, setPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [limit, setLimit] = useState(8);
//   const [isMobile, setIsMobile] = useState(false);

//   // const handleToggle = () => {
//   //   setAvailableNow(!availableNow);
//   //   console.log(staff);
//   //   const availnow = staff.filter(person => person.availableDates);
//   //   if(!availableNow) {
//   //     setStaff(availnow);
//   //   }
//   //   else {
//   //     setStaff(allstaff);
//   //   }
//   // };
// console.log(staff);
//   const handleToggle = () => {
//     setAvailableNow(!availableNow);
//     const today = new Date().toISOString().split("T")[0];

//     const availNow = staff.filter((person) => {
//       if (!Array.isArray(person.availableDates)) return false;

//       return person.availableDates.some((dateStr) => {
//         const dateOnly = new Date(dateStr).toISOString().split("T")[0];
//         return dateOnly === today;
//       });
//     });

//     if (!availableNow) {
//       setStaff(availNow);
//     } else {
//       setStaff(allstaff);
//     }
//   };

//   const handleLimitChange = (e) => {
//     setLimit(Number(e.target.value));
//     setPage(1);
//   };

//   useEffect(() => {
//     // fetch(`${BASE_URLS.API}/staff?page=${page}&limit=${limit}`)
//     fetch(`${BASE_URLS.API}/staff`)
//       .then((res) => res.json())
//       .then((data) => {
//         setStaff(data.data);
//         setAllStaff(data.data);
//         setTotalPages(data.totalPages);
//       })
//       .catch((err) => console.error(err));
//   }, [page, limit]);

//   const goToPage = (pageNum) => {
//     if (pageNum >= 1 && pageNum <= totalPages) {
//       setPage(pageNum);
//     }
//   };

//   useEffect(() => {
//     const checkWidth = () => {
//       setIsMobile(window.innerWidth <= 500);
//     };

//     checkWidth();
//     window.addEventListener("resize", checkWidth);

//     return () => window.removeEventListener("resize", checkWidth);
//   }, []);

//   const renderPageNumbers = () => {
//     const pages = [];

//     // Always show page 1
//     pages.push(
//       <button
//         key={1}
//         className={page === 1 ? "active-page" : ""}
//         onClick={() => goToPage(1)}
//       >
//         1
//       </button>
//     );

//     // Add dots if there’s a gap between page 1 and the start of the loop
//     if (page > 3) {
//       pages.push(<span key="startDots">...</span>);
//     }

//     // Loop for pages around the current page, excluding page 1 and totalPages
//     for (
//       let i = Math.max(2, page - 1);
//       i <= Math.min(totalPages - 1, page + 1);
//       i++
//     ) {
//       pages.push(
//         <button
//           key={i}
//           className={i === page ? "active-page" : ""}
//           onClick={() => goToPage(i)}
//         >
//           {i}
//         </button>
//       );
//     }

//     // Add dots if there’s a gap between the loop and the last page
//     if (page < totalPages - 2) {
//       pages.push(<span key="endDots">...</span>);
//     }

//     // Always show the last page if totalPages > 1
//     if (totalPages > 1) {
//       pages.push(
//         <button
//           key={totalPages}
//           className={page === totalPages ? "active-page" : ""}
//           onClick={() => goToPage(totalPages)}
//         >
//           {totalPages}
//         </button>
//       );
//     }

//     return pages;
//   };

//   return (
//     <div className="filters">
//       <div className="filter-div d-flex">
//         <h2 className="filter-head">Search Event Staff</h2>
//         <div className="filter-bar">
//           <div className="toggle-container">
//             <div className="tooltip-wrapper">
//               <span className="info-icon">
//                 <i className="fa-solid fa-info"></i>
//               </span>
//               <div className="tooltip-text">
//                 Event staff available now can be ready and available to start
//                 work in their city within 1 hour
//               </div>
//             </div>
//             <span>Available Now</span>
//             <label className="switch">
//               <input
//                 type="checkbox"
//                 checked={availableNow}
//                 onChange={handleToggle}
//               />
//               <span className="slider"></span>
//             </label>
//           </div>

//           <select className="filter-select">
//             <option>Most Popular</option>
//             <option>Newest</option>
//             <option>Top Rated</option>
//           </select>

//           <select className="filter-select">
//             <option>Job Type</option>
//             <option>Full Time</option>
//             <option>Part Time</option>
//             <option>Contract</option>
//           </select>

//           <select className="filter-select location-select">
//             <option>Any</option>
//             <option>Remote</option>
//             <option>On-site</option>
//           </select>
//         </div>
//       </div>

//       <div className="Search-container">
//         {staff.map((person) => (
//           <Link
//             to={`/staff-profile/${person.user._id}`}
//             className="staff-card"
//             key={person._id}
//           >
//             <div
//               className="staff-info"
//               style={{
//                 backgroundImage: `url(${person.user.profileImage})`,
//               }}
//             >
//               <div className="name-stars">
//                 <h3>
//                   {person.user.name.toUpperCase()}{" "}
//                   <span style={{ color: "#656565" }}> | </span>
//                   <span>
//                     {person.user.city},{person.user.state}
//                   </span>
//                 </h3>
//                 <div className="stars">
//                   {[...Array(5)].map((_, i) => (
//                     <FaStar key={i} color="red" />
//                   ))}
//                 </div>
//               </div>
//             </div>
//           </Link>
//         ))}
//       </div>
//       <div className="pagination-cont d-flex">
//         {/* Pagination Controls */}
//         <div className="pagination">
//           <button disabled={page === 1} onClick={() => goToPage(page - 1)}>
//             {!isMobile ? "Previous" : <FaAngleLeft />}
//           </button>

//           {/* <button
//           className={page === 1 ? "active-page" : ""}
//           onClick={() => goToPage(1)}
//         >
//           1
//         </button> */}

//           {renderPageNumbers()}

//           <button
//             disabled={page === totalPages}
//             onClick={() => goToPage(page + 1)}
//           >
//             {!isMobile ? "Next" : <FaAngleRight />}
//           </button>
//         </div>

//         {/* Limit Dropdown */}
//         <div className="limit-dropdown">
//           <label>Show</label>
//           <select value={limit} onChange={handleLimitChange}>
//             <option value="8">8</option>
//             <option value="16">16</option>
//             <option value="24">24</option>
//           </select>
//           <span>Per Page</span>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SearchStaff;

// import React, { useEffect, useState } from "react";
// import { FaStar } from "react-icons/fa";
// import "../asset/css/Staff.css";
// import BASE_URLS from "../config";
// import { Link } from "react-router-dom";
// import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";

// const JOB_TYPES = [
//   "Beach Party",
//   "Bikini Waitress",
//   "Poker Dealer",
//   "Party Hostess",
//   "Topless Waitress",
//   "Brand Promotion",
//   "Atmosphere Model",
// ];

// const SearchStaff = () => {
//   const [staff, setStaff] = useState([]);
//   const [allstaff, setAllStaff] = useState([]);
//   const [availableNow, setAvailableNow] = useState(false);
//   const [selectedJobType, setSelectedJobType] = useState("Any");
//   const [selectedLocation, setSelectedLocation] = useState("Any");
//   const [page, setPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [limit, setLimit] = useState(8);
//   const [isMobile, setIsMobile] = useState(false);

//   // 🔹 Apply all filters (Available Now + Job Type)
//   const applyFilters = (data) => {
//     let filtered = [...data];

//     // Available Now filter
//     if (availableNow) {
//       const today = new Date().toISOString().split("T")[0];
//       filtered = filtered.filter((person) => {
//         if (!Array.isArray(person.availableDates)) return false;
//         return person.availableDates.some((dateStr) => {
//           const dateOnly = new Date(dateStr).toISOString().split("T")[0];
//           return dateOnly === today;
//         });
//       });
//     }

//     // Job Type filter
//     if (selectedJobType !== "Any") {
//       filtered = filtered.filter(
//         (person) =>
//           Array.isArray(person.additionalRates) &&
//           person.additionalRates.some(
//             (skill) => skill.label === selectedJobType
//           )
//       );
//     }

//     if (selectedLocation !== "Any") {
//       filtered = filtered.filter(
//         (person) =>
//           person.user.country === selectedLocation
//       );
//     }

//     return filtered;
//   };

//   console.log(staff);

//   // 🔹 Handle Available Now toggle
//   const handleToggle = () => {
//     setAvailableNow((prev) => !prev);
//   };

//   // 🔹 Job Type Change
//   const handleJobTypeChange = (e) => {
//     setSelectedJobType(e.target.value);
//     setPage(1);
//   };

//   const handleLocationChange = (e) => {
//     setSelectedLocation(e.target.value);
//     setPage(1);
//   };

//   // 🔹 Limit Change
//   const handleLimitChange = (e) => {
//     const newLimit = Number(e.target.value);
//     setLimit(newLimit);
//     setPage(1);
//   };

//   // 🔹 Fetch Staff once
//   useEffect(() => {
//     fetch(`${BASE_URLS.API}/staff`)
//       .then((res) => res.json())
//       .then((data) => {
//         setStaff(data.data);
//         setAllStaff(data.data);
//         setTotalPages(Math.ceil(data.data.length / limit));
//       })
//       .catch((err) => console.error(err));
//   }, []);

//   // 🔹 When filters change, update staff + pagination
//   useEffect(() => {
//     const filtered = applyFilters(allstaff);
//     setStaff(filtered);
//     setTotalPages(Math.ceil(filtered.length / limit));
//     setPage(1);
//   }, [availableNow, selectedJobType, limit, allstaff]);

//   // 🔹 Page Navigation
//   const goToPage = (pageNum) => {
//     if (pageNum >= 1 && pageNum <= totalPages) {
//       setPage(pageNum);
//     }
//   };

//   // 🔹 Mobile Check
//   useEffect(() => {
//     const checkWidth = () => {
//       setIsMobile(window.innerWidth <= 500);
//     };

//     checkWidth();
//     window.addEventListener("resize", checkWidth);

//     return () => window.removeEventListener("resize", checkWidth);
//   }, []);

//   // 🔹 Pagination Numbers
//   const renderPageNumbers = () => {
//     const pages = [];

//     pages.push(
//       <button
//         key={1}
//         className={page === 1 ? "active-page" : ""}
//         onClick={() => goToPage(1)}
//       >
//         1
//       </button>
//     );

//     if (page > 3) {
//       pages.push(<span key="startDots">...</span>);
//     }

//     for (
//       let i = Math.max(2, page - 1);
//       i <= Math.min(totalPages - 1, page + 1);
//       i++
//     ) {
//       pages.push(
//         <button
//           key={i}
//           className={i === page ? "active-page" : ""}
//           onClick={() => goToPage(i)}
//         >
//           {i}
//         </button>
//       );
//     }

//     if (page < totalPages - 2) {
//       pages.push(<span key="endDots">...</span>);
//     }

//     if (totalPages > 1) {
//       pages.push(
//         <button
//           key={totalPages}
//           className={page === totalPages ? "active-page" : ""}
//           onClick={() => goToPage(totalPages)}
//         >
//           {totalPages}
//         </button>
//       );
//     }

//     return pages;
//   };

//   // 🔹 Slice staff for current page
//   const paginatedStaff = staff.slice((page - 1) * limit, page * limit);

//   return (
//     <div className="filters">
//       <div className="filter-div d-flex">
//         <h2 className="filter-head">Search Event Staff</h2>
//         <div className="filter-bar">
//           {/* Available Now Toggle */}
//           <div className="toggle-container">
//             <div className="tooltip-wrapper">
//               <span className="info-icon">
//                 <i className="fa-solid fa-info"></i>
//               </span>
//               <div className="tooltip-text">
//                 Event staff available now can be ready and available to start
//                 work in their city within 1 hour
//               </div>
//             </div>
//             <span>Available Now</span>
//             <label className="switch">
//               <input
//                 type="checkbox"
//                 checked={availableNow}
//                 onChange={handleToggle}
//               />
//               <span className="slider"></span>
//             </label>
//           </div>

//           {/* Sort Dropdown */}
//           <select className="filter-select">
//             <option>Most Popular</option>
//             <option>Newest</option>
//             <option>Top Rated</option>
//           </select>

//           {/* Job Type Filter */}
//           <select
//             className="filter-select"
//             value={selectedJobType}
//             onChange={handleJobTypeChange}
//           >
//             <option value="Any">Job Type</option>
//             {JOB_TYPES.map((job) => (
//               <option key={job} value={job}>
//                 {job}
//               </option>
//             ))}
//           </select>

//           {/* Location Filter Placeholder */}
//           <select className="filter-select location-select"
//           value={selectedLocation}
//             onChange={handleLocationChange}
//           >
//             <option value="Any">Location</option>
//             {[
//               ...new Set(
//                 staff
//                   .map((loc) => loc.user.country)
//                   .filter((c) => c && c.trim() !== "")
//               ),
//             ].map((country, i) => (
//               <option key={i} value={country}>{country}</option>
//             ))}
//           </select>
//         </div>
//       </div>

//       {/* Staff Cards */}
//       <div className="Search-container">
//         {paginatedStaff.map((person) => (
//           <Link
//             to={`/staff-profile/${person.user._id}`}
//             className="staff-card"
//             key={person._id}
//           >
//             <div
//               className="staff-info"
//               style={{
//                 backgroundImage: `url(${person.user.profileImage})`,
//               }}
//             >
//               <div className="name-stars">
//                 <h3>
//                   <b>{person.user.name.toUpperCase()} </b>
//                   <span class="lesgo">
//                     <span style={{ color: "#656565" }}> | </span>
//                     <span>
//                       {person.user.suburb},{person.user.country}
//                     </span>
//                   </span>
//                 </h3>
//                 <div className="stars">
//                   {[...Array(5)].map((_, i) => (
//                     <FaStar key={i} color="red" />
//                   ))}
//                 </div>
//               </div>
//             </div>
//           </Link>
//         ))}
//       </div>

//       {/* Pagination */}
//       <div className="pagination-cont d-flex">
//         <div className="pagination">
//           <button disabled={page === 1} onClick={() => goToPage(page - 1)}>
//             {!isMobile ? "Previous" : <FaAngleLeft />}
//           </button>

//           {renderPageNumbers()}

//           <button
//             disabled={page === totalPages}
//             onClick={() => goToPage(page + 1)}
//           >
//             {!isMobile ? "Next" : <FaAngleRight />}
//           </button>
//         </div>

//         {/* Limit Dropdown */}
//         <div className="limit-dropdown">
//           <label>Show</label>
//           <select value={limit} onChange={handleLimitChange}>
//             <option value="8">8</option>
//             <option value="16">16</option>
//             <option value="24">24</option>
//           </select>
//           <span>Per Page</span>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SearchStaff;

import React, { useEffect, useState } from "react";
import { FaStar } from "react-icons/fa";
import "../asset/css/Staff.css";
import BASE_URLS from "../config";
import { Link } from "react-router-dom";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";

const JOB_TYPES = [
  "Beach Party",
  "Bikini Waitress",
  "Poker Dealer",
  "Party Hostess",
  "Topless Waitress",
  "Brand Promotion",
  "Atmosphere Model",
];

const SearchStaff = () => {
  const [staff, setStaff] = useState([]);
  const [allstaff, setAllStaff] = useState([]);
  const [availableNow, setAvailableNow] = useState(false);
  const [selectedJobType, setSelectedJobType] = useState("Any");
  const [selectedLocation, setSelectedLocation] = useState("Any");
  const [selectedSort, setSelectedSort] = useState("Any");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit, setLimit] = useState(8);
  const [isMobile, setIsMobile] = useState(false);

  // 🔹 Apply all filters
  const applyFilters = (data) => {
    let filtered = [...data];

    // Available Now filter
    if (availableNow) {
      const today = new Date().toISOString().split("T")[0];
      filtered = filtered.filter((person) => {
        if (!Array.isArray(person.availableDates)) return false;
        return person.availableDates.some((dateStr) => {
          const dateOnly = new Date(dateStr).toISOString().split("T")[0];
          return dateOnly === today;
        });
      });
    }

    // Job Type filter
    if (selectedJobType !== "Any") {
      filtered = filtered.filter(
        (person) =>
          Array.isArray(person.additionalRates) &&
          person.additionalRates.some(
            (skill) => skill.label === selectedJobType
          )
      );
    }

    // Location filter
    if (selectedLocation !== "Any") {
      filtered = filtered.filter(
        (person) => person.user.country === selectedLocation
      );
    }

    // Sort filter
    if (selectedSort === "top-rated") {
      filtered = filtered.sort((a, b) => b.averageRating - a.averageRating);
    } else if (selectedSort === "newest") {
      filtered = filtered.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
    } else if (selectedSort === "recently-active") {
      filtered = filtered.sort((a, b) => {
        const aLogin =
          a.user && a.user.lastLogin ? new Date(a.user.lastLogin) : null;
        const bLogin =
          b.user && b.user.lastLogin ? new Date(b.user.lastLogin) : null;

        if (!aLogin && !bLogin) return 0; // both missing → same level
        if (!aLogin) return 1; // a missing → send to bottom
        if (!bLogin) return -1; // b missing → send to bottom

        return bLogin - aLogin; // normal sort (recent first)
      });
    }

    return filtered;
  };

  console.log(staff);

  // 🔹 Handle Available Now toggle
  const handleToggle = () => {
    setAvailableNow((prev) => !prev);
  };

  // 🔹 Job Type Change
  const handleJobTypeChange = (e) => {
    setSelectedJobType(e.target.value);
    setPage(1);
  };

  // 🔹 Location Change
  const handleLocationChange = (e) => {
    setSelectedLocation(e.target.value);
    setPage(1);
  };

  // Sort change
  const handleSortChange = (e) => {
    setSelectedSort(e.target.value);
    setPage(1);
  };

  // 🔹 Limit Change
  const handleLimitChange = (e) => {
    const newLimit = Number(e.target.value);
    setLimit(newLimit);
    setPage(1);
  };

  // 🔹 Fetch Staff once
  useEffect(() => {
    fetch(`${BASE_URLS.API}/staff`)
      .then((res) => res.json())
      .then((data) => {
        setStaff(data.data);
        setAllStaff(data.data);
        setTotalPages(Math.ceil(data.data.length / limit));
      })
      .catch((err) => console.error(err));
  }, []);

  // 🔹 When filters change, update staff + pagination
  useEffect(() => {
    const filtered = applyFilters(allstaff);
    setStaff(filtered);
    setTotalPages(Math.ceil(filtered.length / limit));
    setPage(1);
  }, [
    availableNow,
    selectedJobType,
    selectedLocation,
    selectedSort,
    limit,
    allstaff,
  ]);

  // 🔹 Page Navigation
  const goToPage = (pageNum) => {
    if (pageNum >= 1 && pageNum <= totalPages) {
      setPage(pageNum);
    }
  };

  // 🔹 Mobile Check
  useEffect(() => {
    const checkWidth = () => {
      setIsMobile(window.innerWidth <= 500);
    };

    checkWidth();
    window.addEventListener("resize", checkWidth);

    return () => window.removeEventListener("resize", checkWidth);
  }, []);

  // 🔹 Pagination Numbers
  const renderPageNumbers = () => {
    const pages = [];

    pages.push(
      <button
        key={1}
        className={page === 1 ? "active-page" : ""}
        onClick={() => goToPage(1)}
      >
        1
      </button>
    );

    if (page > 3) {
      pages.push(<span key="startDots">...</span>);
    }

    for (
      let i = Math.max(2, page - 1);
      i <= Math.min(totalPages - 1, page + 1);
      i++
    ) {
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

    if (page < totalPages - 2) {
      pages.push(<span key="endDots">...</span>);
    }

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

  // 🔹 Slice staff for current page
  const paginatedStaff = staff.slice((page - 1) * limit, page * limit);

  // 🔹 Build sorted unique countries from allstaff
  const countries = [
    ...new Set(
      allstaff
        .map((loc) => loc.user.country)
        .filter((c) => c && c.trim() !== "")
    ),
  ].sort();

  return (
    <div className="filters">
      <div className="filter-div d-flex">
        <h2 className="filter-head">Search Event Staff</h2>
        <div className="filter-bar">
          {/* Available Now Toggle */}
          <div className="toggle-container">
            <div className="tooltip-wrapper">
              <span className="info-icon">
                <i className="fa-solid fa-info"></i>
              </span>
              <div className="tooltip-text">
                Event staff available now can be ready and available to start
                work in their city within 1 hour
              </div>
            </div>
            <span>Available Now</span>
            <label className="switch">
              <input
                type="checkbox"
                checked={availableNow}
                onChange={handleToggle}
              />
              <span className="slider"></span>
            </label>
          </div>

          {/* Sort Dropdown */}
          <select
            className="filter-select"
            value={selectedSort}
            onChange={handleSortChange}
          >
            <option value="Any">Sort By</option>
            <option value="newest">Newest</option>
            <option value="top-rated">Most Popular</option>
            <option value="recently-active">Recently Active</option>
          </select>

          {/* Job Type Filter */}
          <select
            className="filter-select"
            value={selectedJobType}
            onChange={handleJobTypeChange}
          >
            <option value="Any">Job Type</option>
            {JOB_TYPES.map((job) => (
              <option key={job} value={job}>
                {job}
              </option>
            ))}
          </select>

          {/* Location Filter */}
          <select
            className="filter-select location-select"
            value={selectedLocation}
            onChange={handleLocationChange}
          >
            <option value="Any">Location</option>
            {countries.map((country, i) => (
              <option key={i} value={country}>
                {country}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Staff Cards */}
      <div className="Search-container">
        {paginatedStaff.map((person) => (
          <Link
            to={`/staff-profile/${person.user._id}`}
            className="staff-card"
            key={person._id}
          >
            <div
              className="staff-info"
              style={{
                backgroundImage: `url(${person.user.profileImage})`,
              }}
            >
              <div className="name-stars">
                <h3>
                  <b>{person.user.name.toUpperCase()} </b>
                  <span className="lesgo">
                    <span style={{ color: "#656565" }}> | </span>
                    <span>
                      {person.user.suburb},{person.user.country}
                    </span>
                  </span>
                </h3>
                <div className="stars">
                  {[...Array(5)].map((_, i) => (
                    <FaStar
                      key={i}
                      color={i < person.averageRating ? "red" : "#ccc"}
                    />
                  ))}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Pagination */}
      <div className="pagination-cont d-flex">
        <div className="pagination">
          <button disabled={page === 1} onClick={() => goToPage(page - 1)}>
            {!isMobile ? "Previous" : <FaAngleLeft />}
          </button>

          {renderPageNumbers()}

          <button
            disabled={page === totalPages}
            onClick={() => goToPage(page + 1)}
          >
            {!isMobile ? "Next" : <FaAngleRight />}
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
