import axios from "axios";
import React, { useEffect, useState } from "react";
import BASE_URLS from "../config";
import { Link } from "react-router-dom";

function ManageJobs() {
  const [jobs, setJobs] = useState([]);
  const [filter, setFilter] = useState("all");
  const [sort, setSort] = useState("new-to-old");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    axios
      .get(`${BASE_URLS.BACKEND_BASEURL}jobs/my-jobs`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((response) => {
        console.log(response.data);
        // Ensure jobs is an array, even if response.data.jobs is undefined
        setJobs(Array.isArray(response.data) ? response.data : []);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching jobs:", error);
        setError("Failed to fetch jobs. Please try again.");
        setLoading(false);
      });
  }, []);

  // Calculate endTime for a job
  const calculateEndTime = (startTime, duration) => {
    if (startTime && duration) {
      const start = new Date(`1970-01-01T${startTime}:00`);
      const durationHours = parseFloat(duration);
      if (!isNaN(durationHours)) {
        const end = new Date(start.getTime() + durationHours * 60 * 60 * 1000);
        const hours = end.getHours().toString().padStart(2, "0");
        const minutes = end.getMinutes().toString().padStart(2, "0");
        return `${hours}:${minutes}`;
      }
    }
    return "--:--";
  };

  const handleToggleStatus = async (jobId, currentStatus) => {
    try {
      const response = await axios.put(
        `${BASE_URLS.BACKEND_BASEURL}jobs/${jobId}`,
        { isActive: !currentStatus },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      // Update the job in local state
      setJobs((prevJobs) =>
        prevJobs.map((job) =>
          job._id === jobId ? { ...job, isActive: !currentStatus } : job
        )
      );
    } catch (error) {
      console.error("Failed to update job status:", error);
      alert("Failed to update job status. Please try again.");
    }
  };

  // Format job date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  // Handle filter change
  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  // Handle sort change
  const handleSortChange = (e) => {
    setSort(e.target.value);
  };

  // Filter and sort jobs
  const filteredJobs = Array.isArray(jobs)
    ? jobs.filter((job) => {
        if (filter === "all") return true;
        return job.status === filter;
      })
    : [];

  const sortedJobs = [...filteredJobs].sort((a, b) => {
    const dateA = new Date(a.createdAt);
    const dateB = new Date(b.createdAt);
    return sort === "new-to-old" ? dateB - dateA : dateA - dateB;
  });

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">Manage Jobs</h1>
        <div className="flex items-center gap-2">
          <select
            className="border rounded-full p-2 w-20 border-zinc-400 text-sm"
            value={filter}
            onChange={handleFilterChange}
          >
            <option value="all">All</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
          <select
            className="border rounded-full border-zinc-400 px-4 py-2 text-sm"
            value={sort}
            onChange={handleSortChange}
          >
            <option value="new-to-old">New to Old</option>
            <option value="old-to-new">Old to New</option>
          </select>
        </div>
      </div>

      {error && <div className="text-red-600 mb-4">{error}</div>}

      {loading ? (
        <div className="text-center text-gray-500">Loading jobs...</div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="min-w-full  bg-white text-sm">
            <thead className="text-left text-gray-600 bg-white border-50">
              <tr>
                <th className="px-6 py-4 font-medium">Event Name</th>
                <th className="px-6 py-4 font-medium">Job Title</th>
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium">Position</th>
                <th className="px-6 py-4 font-medium">Applications</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="text-gray-800 ">
              {sortedJobs.length > 0 ? (
                sortedJobs.map((job) => (
                  <tr
                    key={job._id}
                    className="border-t border-b border-gray-500 border-gray-200 even:bg-white odd:bg-gray-50"
                  >
                    <td className="px-6 py-4 font-semibold">{job.eventName}</td>
                    <td className="px-6 py-4">{job.jobTitle || "--"}</td>
                    <td className="px-6 py-4">{formatDate(job.jobDate)}</td>
                    <td className="px-6 py-4">
                      {job.hiredStaff.length}/{job.numberOfPositions} Filled
                    </td>
                    <td className="px-6 py-4">
                      <Link
                        to={"/dashboard/manage-jobs/" + job._id + "/view"}
                        className="text-pink-600 hover:underline"
                      >
                        {job.applicants.length} applications
                      </Link>
                    </td>
                    <td className="px-6 py-4">
                      {/* <label className="inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only"
                          checked={job.isActive}
                          readOnly
                        />
                        <div
                          className={`w-11 h-6 rounded-full ${
                            job.isActive ? "bg-pink-600" : "bg-gray-400"
                          } flex items-center px-1 transition-colors`}
                        >
                          <div
                            className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform ${
                              job.isActive ? "translate-x-5" : ""
                            }`}
                          ></div>
                        </div>
                      </label> */}
                      <label className="inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only"
                          checked={job.isActive}
                          onChange={() =>
                            handleToggleStatus(job._id, job.isActive)
                          }
                        />
                        <div
                          className={`w-11 h-6 rounded-full ${
                            job.isActive ? "bg-pink-600" : "bg-gray-400"
                          } flex items-center px-1 transition-colors`}
                        >
                          <div
                            className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform ${
                              job.isActive ? "translate-x-5" : ""
                            }`}
                          ></div>
                        </div>
                      </label>
                    </td>
                    <td className="px-6 py-4">
                      <Link
                        to={"/dashboard/manage-jobs/" + job._id + "/view"}
                        className="border-[1px] no-underline border-pink-600 text-pink-600 rounded-full px-4 py-2 hover:bg-pink-600 hover:text-white transition"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="7"
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    No jobs found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default ManageJobs;
