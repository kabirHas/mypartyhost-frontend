import React, { useEffect, useState } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";
import ManageCategories from "../components/ManageCategories";
import "../asset/css/OrganizerDashboard.css";
import { FaFire, FaBriefcase, FaFileAlt, FaStar } from "react-icons/fa";
import BASE_URLS from "../config";
import Slider from "react-slick";
import axios from "axios";
import { Link } from "react-router-dom";

// const notifications = [
//   {
//     name: "Emily R.",
//     job: "VIP Pool Party Host",
//     message: "applied for your",
//     ending: "gig! Ready to turn up the heat?",
//     link: "Review Application",
//   },
//   {
//     name: "Sofia L.",
//     job: "Luxury Yacht Bash",
//     message: "wants to join your",
//     ending: "– She's a pro at keeping the party alive!",
//     link: "Check Her Profile",
//   },
//   {
//     name: "Mia T.",
//     job: "DJ Lounge Host",
//     message: "just applied to be your",
//     ending: "– Let’s keep the beats rolling!",
//     link: "Check Her Profile",
//   },
//   {
//     name: "Sofia L.",
//     job: "Luxury Yacht Bash",
//     message: "wants to join your",
//     ending: "– She's a pro at keeping the party alive!",
//     link: "Check Her Profile",
//   },
// ];

const OrganizerDashboard = () => {
  // const [pages, setPages] = useState([]);
  // const navigate = useNavigate();

  // useEffect(() => {
  //   API.get("/pages").then((res) => setPages(res.data));
  // }, []);

  // const handleUpdate = (id) => {
  //   navigate(`/update-page/${id}`);
  // };

  // const handleDelete = async (id) => {
  //   // if (window.confirm('Are you sure you want to delete this page?')) {
  //   try {
  //     await API.delete(`/pages/${id}`);
  //     setPages((prevPages) => prevPages.filter((p) => p._id !== id));
  //   } catch (error) {
  //     console.error("Delete failed:", error);
  //     alert("Failed to delete page.");
  //   }
  //   // }
  // };

  // return (
  //   <div>
  //     <div className="dashboard-conatiner d-flex">
  //       <div className="content-area">
  //         <h2>Dashboard</h2>
  //         <button onClick={() => navigate("/create-page")}>Create Page</button>
  //         <button onClick={() => navigate("/create-category")}>
  //           Create Category
  //         </button>
  //         <button onClick={() => navigate("/create-faq")}>Create FAQs</button>

  //         <ul>
  //           {pages.map((p) => (
  //             <li key={p._id}>
  //               <strong>{p.title}</strong> -{" "}
  //               <a
  //                 href={p.slug === "home" ? "/" : `/${p.slug}`}
  //                 target="_blank"
  //                 rel="noopener noreferrer"
  //               >
  //                 {p.slug}
  //               </a>
  //               <div>
  //                 <button onClick={() => handleUpdate(p._id)}>Update</button>
  //                 <button onClick={() => handleDelete(p._id)}>Delete</button>
  //               </div>
  //             </li>
  //           ))}
  //         </ul>
  //         <ManageCategories />
  //       </div>
  //     </div>
  //   </div>
  // );
  const [staff, setStaff] = useState([]);
  const [applications, setApplications] = useState(null);
  const [notifications, setNotifications] = useState(null);
  const [jobs, setJobs] = useState(null);
  const [savedProfile, setSavedProfile] = useState(null);

  const navigate = useNavigate();
  useEffect(() => {
    fetch(`${BASE_URLS.API}/staff`)
      .then((res) => res.json())
      .then((data) => setStaff(data.data))
      .catch((err) => console.error(err));

    axios
      .get(`${BASE_URLS.BACKEND_BASEURL}jobs/all/applications`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        // console.log(response.data.data);
        setApplications(response.data.data);
      })
      .catch((error) => {
        console.error("Error fetching applications:", error);
      });

    axios
      .get(`${BASE_URLS.BACKEND_BASEURL}notifications`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        // console.log("Notifications fetched:", response.data);
        setNotifications(response.data);
      })
      .catch((error) => {
        console.error("Error fetching notifications:", error);
      });
    axios
      .get(`${BASE_URLS.BACKEND_BASEURL}jobs/my-jobs`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        // console.log("Jobs fetched:", response.data);
        // You can process the jobs data if needed
        setJobs(response.data);
      })
      .catch((error) => {
        console.error("Error fetching jobs:", error);
      });

    axios
      .get(`${BASE_URLS.BACKEND_BASEURL}save-profile`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        // console.log("Saved profiles fetched:", response.data);
        // You can process the saved profiles data if needed
        setSavedProfile(response.data);
      })
      .catch((error) => {
        console.error("Error fetching saved profiles:", error);
      });
  }, []);

  const settings = {
    dots: false,
    infinite: true,
    speed: 600,
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: { slidesToShow: 2 },
      },
      {
        breakpoint: 600,
        settings: { slidesToShow: 1 },
      },
    ],
  };

  return (
    <div className="dashboard">
      <div className="top">
        <div className="left-card">
          <h3>Need a host?</h3>
          <p>Get started in seconds!</p>
          <div className="avatars">
            <img
              src="https://randomuser.me/api/portraits/women/1.jpg"
              alt="host"
            />
            <img
              src="https://randomuser.me/api/portraits/women/2.jpg"
              alt="host"
            />
            <img
              src="https://randomuser.me/api/portraits/women/3.jpg"
              alt="host"
            />
            <img
              src="https://randomuser.me/api/portraits/women/4.jpg"
              alt="host"
            />
            <span>300+ hosts joined this week</span>
          </div>
          <div className="btn-group">
            <button
              onClick={() => navigate("/multi-step")}
              className="post-btn"
            >
              Post a Job
            </button>
            <button className="browse-btn">Browse</button>
          </div>
        </div>

        <div className="stats">
          <div className="stat-card">
            <div className="icons">
              <FaBriefcase className="icon" />
            </div>

            <h2>{jobs && jobs.length}</h2>
            <p>Open Events</p>
            <button onClick={() => navigate("/dashboard/manage-jobs")}>
              View Events
            </button>
          </div>
          <div className="stat-card">
            <div className="icons">
              <FaFileAlt className="icon" />
            </div>

            <h2>{applications && applications.length}</h2>
            <p>Applications Received</p>
            <button>View Application</button>
          </div>
          <div className="stat-card">
            <div className="icons">
              <FaStar className="icon" />
            </div>

            <h2>{savedProfile && savedProfile.length}</h2>
            <p>Top Shortlisted</p>
            <button onClick={() => navigate("/dashboard/saved-profile")}>
              Book Now
            </button>
          </div>
        </div>
      </div>

      <div className="notifications">
        <h3>Latest Updates and Notifications</h3>
        {notifications &&
          notifications.map((item, idx) => (
            <div className="notification" key={idx}>
              <img src="/images/Update Avatar.png" className="flame-icon" />
              <div>
                <strong>{item.sender.name}</strong>{" "}
                {item.type === "job_invite"
                  ? "invited you to"
                  : "wants to join"}{" "}
                <b>{item.metadata?.jobTitle}</b> - Let's Start the Party!{" "}
                <span className="link">
                  {item.type === "job_invite" ? "View Job" : "View Application"}
                </span>
              </div>
            </div>
          ))}
      </div>
      <div className="staff-kabs">
        <h3>Most Loved Event Staff</h3>
        <div className="boost-staff-inners d-flex">
          <div className="right-a w-100">
            <div className="slider-container">
              {staff.length > 0 ? (
                <Slider {...settings}>
                  {staff
                    .filter((person) => person.user.isBoosted === true)
                    .map((person) => (
                      <div className="staff-card" key={person._id}>
                        <div
                          className="staff-info"
                          style={{
                            backgroundImage: `url(${BASE_URLS.STATIC}${person.user.profileImage})`,
                          }}
                        >
                          <h3>
                            <Link
                              to={`/staff-profile/${person.user._id}`}
                              className="text-white text-[20px] font-bold uppercase leading-[21px] tracking-[0.6px] break-words no-underline"
                            >
                              {person.user.name.toUpperCase()}
                            </Link>
                          </h3>

                          <div className="stars">
                            {[...Array(5)].map((_, i) => (
                              <FaStar key={i} color="red" />
                            ))}
                          </div>
                          <div className="icons">
                            {person.skills.map((skill, index) => {
                              return (
                                <span key={index}>
                                  <i className={skill.icon}></i>
                                </span>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    ))}
                </Slider>
              ) : (
                <p>Loading popular staff...</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrganizerDashboard;
