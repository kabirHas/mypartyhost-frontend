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
    <div className="p-2">
      <div className="flex items-center justify-between mb-4">
        <h1 className="self-stretch h-9 justify-start text-Token-Text-Primary text-3xl font-medium font-['Inter'] leading-9 tracking-tight">Manage Jobs</h1>
        <div className="flex items-center gap-2">
          <div className="relative w-20 inline-flex items-center px-2 py-1 rounded-3xl outline outline-1 outline-offset-[-1px] outline-zinc-300 bg-white">
            <select
              className="appearance-none bg-transparent text-base font-normal font-['Inter'] leading-snug text-zinc-600 pr-8 w-full focus:outline-none"
              value={filter}
              onChange={handleFilterChange}
            >
              <option value="all">All</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
            <div className="absolute right-2 pointer-events-none">
              <svg
                className="w-3.5 h-2 text-zinc-800"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 14 8"
              >
                <path d="M1 1l6 6 6-6" />
              </svg>
            </div>
          </div>
          <div className="relative inline-flex items-center px-2 py-1 rounded-3xl outline outline-1 outline-offset-[-1px] outline-zinc-300 bg-white">
      <select
        className="appearance-none bg-transparent text-base font-normal font-['Inter'] leading-snug text-zinc-600 pr-8 w-full focus:outline-none"
        value={sort}
        onChange={handleSortChange}
      >
        <option value="new-to-old">New to Old</option>
        <option value="old-to-new">Old to New</option>
      </select>
      <div className="absolute right-2 pointer-events-none w-6 h-4">
        <svg
          className="w-6 h-4 text-zinc-800"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path d="M8 7l4-4 4 4" />
          <path d="M8 17l4 4 4-4" />
        </svg>
      </div>
    </div>
        </div>
      </div>

      {error && <div className="text-red-600 mb-4">{error}</div>}

      {loading ? (
        <div className="text-center text-gray-500">Loading jobs...</div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="min-w-full border-collapse border-1    text-sm">
            <thead className="text-left  text-gray-600 bg-white border-zinc-500 border-50">
              <tr>
                <th className="px-6 w-48 py-3 border-1 border-zinc-200 self-stretch justify-start  text-sm font-medium font-['Inter'] leading-tight">Event Name</th>
                <th className="px-6 w-32 py-3 border-1 border-zinc-200 self-stretch justify-start text-Token-Text-Secondary text-sm font-medium font-['Inter'] leading-tight">Job Title</th>
                <th className="px-6 py-3 w-32 border-1 border-zinc-200 self-stretch justify-start text-Token-Text-Secondary text-sm font-medium font-['Inter'] leading-tight">Date</th>
                <th className="px-6 py-3 w-32 border-1 border-zinc-200 self-stretch justify-start text-Token-Text-Secondary text-sm font-medium font-['Inter'] leading-tight">Position</th>
                <th className="px-6 py-3 w-32 border-1 border-zinc-200 self-stretch justify-start text-Token-Text-Secondary text-sm font-medium font-['Inter'] leading-tight">Applications</th>
                <th className="px-6 py-3 w-32 border-1 border-zinc-200 self-stretch justify-start text-Token-Text-Secondary text-sm font-medium font-['Inter'] leading-tight">Status</th>
                <th className="px-6 py-3 border-1 border-zinc-200 self-stretch justify-start text-Token-Text-Secondary text-sm font-medium font-['Inter'] leading-tight">Actions</th>
              </tr>
            </thead>
            <tbody className="text-gray-800 ">
              {sortedJobs.length > 0 ? (
                sortedJobs.map((job) => (
                  <tr
                    key={job._id}
                    className=" text-xs text-gray-800 border-b-[1.2px] border-gray-900 hover:bg-gray-50 last:border-b-0 "
                  >
                    <td className="px-6 border-r border-zinc-200 py-4 font-semibold">{job.eventName}</td>
                    <td className="px-6 border-r border-zinc-200 py-4">{job.jobTitle || "--"}</td>
                    <td className="px-6 border-r border-zinc-200 py-4">{formatDate(job.jobDate)}</td>
                    <td className="px-6 border-r border-zinc-200 py-4">
                      {job.hiredStaff.length}/{job.numberOfPositions} Filled
                    </td>
                    <td className="px-6 border-r border-zinc-200 py-4">
                      <Link
                        to={"/dashboard/manage-jobs/" + job._id + "/view"}
                        className="text-[#e61e4c] hover:underline font-medium"
                      >
                        {job.applicants.length} applications
                      </Link>
                    </td>
                    <td className="px-6 border-r border-zinc-200 py-4">
                     
                      <label className="inline-flex items-center cursor-pointer">
                        <span className="text-zinc-500 mr-2">{job.isActive ? "Active" : "Inactive"}</span>
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
                            job.isActive ? "bg-[#E61E4D]" : "bg-gray-400"
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
                    <td className="px-6 border-r border-zinc-200 py-4">
                      <Link
                        to={"/dashboard/manage-jobs/" + job._id + "/view"}
                        className="border-[1px] no-underline border-[#e61e4c] text-zinc-600 rounded-full px-4 py-2 hover:bg-[#e61e4c] hover:text-white transition"
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
