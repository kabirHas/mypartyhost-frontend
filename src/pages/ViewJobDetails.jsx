import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import BASE_URLS from "../config";
import JobDetailCard from "../components/JobDetailCard";

function ViewJobDetails() {
  const { id } = useParams();
  const [jobDetail, setJobDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("details");
  const [savedProfiles, setSavedProfiles] = useState([]); // Store saved profile IDs

  // Fetch job details and saved profiles
  useEffect(() => {
    const source = axios.CancelToken.source();

    // Fetch job details
    axios
      .get(`${BASE_URLS.BACKEND_BASEURL}jobs/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        cancelToken: source.token,
      })
      .then((res) => {
        console.log("Job Details Response:", res.data);
        setJobDetail(res.data);
        setLoading(false);
      })
      .catch((err) => {
        if (!axios.isCancel(err)) {
          setError(err.message);
          setLoading(false);
        }
      });

    // Fetch saved profiles
    axios
      .get(`${BASE_URLS.BACKEND_BASEURL}save-profile`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        cancelToken: source.token,
      })
      .then((res) => {
        console.log("Saved Profiles Response:", res.data);
        // Extract _id from full user objects
        const profileIds = (res.data || []).map((profile) => profile._id);
        setSavedProfiles(profileIds);
      })
      .catch((err) => {
        if (!axios.isCancel(err)) {
          console.error("Error fetching saved profiles:", err.message);
        }
      });

    return () => source.cancel("Request canceled");
  }, [id]);

  // Handle like/unlike profile
  const handleLike = (staffId) => {
    const isSaved = savedProfiles.includes(staffId);
    const url = `${BASE_URLS.BACKEND_BASEURL}save-profile/${staffId}`;
    const method = isSaved ? "put" : "post";

    axios({
      method,
      url,
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((res) => {
        console.log(`${isSaved ? "Unsaved" : "Saved"} Profile Response:`, res.data);
        // Update savedProfiles state
        setSavedProfiles((prev) =>
          isSaved
            ? prev.filter((id) => id !== staffId)
            : [...prev, staffId]
        );
      })
      .catch((err) => {
        console.error(`Error ${isSaved ? "unsaving" : "saving"} profile:`, err.response?.data || err.message);
      });
  };

  if (loading) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6 text-red-500">Error: {error}</div>;
  if (!jobDetail) return null;

  const {
    eventName,
    staffCategory,
    jobDescription,
    numberOfPositions,
    suburb,
    city,
    jobDate,
    startTime,
    endTime,
    lookingFor,
    travelAllowance,
    applicants,
    jobTitle,
  } = jobDetail;

  return (
    <div className="p-6 space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="self-stretch justify-start text-[#292929] text-2xl font-bold font-['Inter'] leading-7">{eventName}</h2>
          <p className="self-stretch justify-start text-[#3D3D3D] text-base font-normal font-['Inter'] leading-snug">{jobTitle}</p>
        </div>
        <Link
          to={`/dashboard/manage-jobs/${id}/edit`}
          className="text-zinc-600 no-underline text-sm px-3 py-1 rounded-md hover:bg-zinc-50 flex items-center gap-1"
        >
          <i className="ri-edit-box-line" />
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex gap-6 border-b border-gray-700 text-sm">
        <button
          onClick={() => setActiveTab("details")}
          className={`pb-2 ${
            activeTab === "details"
              ? "border-b-2 border-[#E61E4D] text-[#E61E4D] font-semibold"
              : "text-zinc-600"
          } font-medium font-['Inter'] leading-tight`}
        >
          Job Details
        </button>
        <button
          onClick={() => setActiveTab("applications")}
          className={`pb-2 ${
            activeTab === "applications"
              ? "border-b-2 border-[#E61E4D] text-[#E61E4D] font-semibold"
              : "text-zinc-600"
          } font-medium font-['Inter'] leading-tight`}
        >
          Application ({applicants?.length || 0})
        </button>
      </div>

      {/* Content */}
      {activeTab === "details" ? (
        <JobDetailCard
          jobDate={jobDate}
          jobDescription={jobDescription}
          endTime={endTime}
          lookingFor={lookingFor}
          travelAllowance={travelAllowance}
          numberOfPositions={numberOfPositions}
          startTime={startTime}
          suburb={suburb}
          city={city}
        />
      ) : (
        <div className="bg-white rounded-lg">
          {applicants?.length > 0 ? (
            <div className="text-sm p-6">
              {applicants.map((a, i) => (
                <div key={i} className="border-b last:border-b-0">
                  <div className="flex items-center gap-4 py-3 justify-between">
                    <div>
                      <h6 className="self-stretch justify-start text-[#292929] capitalize text-xl font-bold font-['Inter'] leading-normal">
                        {a.staff.name}
                      </h6>
                      <div className="flex items-center gap-2 text-zinc-500">
                        <span className="text-[#ff8915] flex font-semibold place-items-center gap-1 text-lg">
                          <i className="ri-star-s-fill"></i>
                          {a.averageRating || "4.9"}
                        </span>
                        <span className="underline text-[#656565]">
                          ({a.staff.reviews.length} Reviews)
                        </span>
                      </div>
                    </div>
                    <div className="flex place-items-center gap-3">
                      <button
                        onClick={() => handleLike(a.staff._id)}
                        className="border py-1 px-2 rounded-full border-zinc-400"
                        title={savedProfiles.includes(a.staff._id) ? "Unsave Profile" : "Save Profile"}
                      >
                        <i
                          className={`text-2xl ${
                            savedProfiles.includes(a.staff._id)
                              ? "ri-heart-fill text-red-500"
                              : "ri-heart-line text-[#E61E4D]"
                          }`}
                        ></i>
                      </button>
                      <button className="bg-gradient-to-l from-pink-600 to-rose-600 font-semibold text-white py-2 px-4 rounded-lg">
                        View Profile
                      </button>
                    </div>
                  </div>
                  <span className="flex items-center gap-2 text-md -mt-2  justify-start text-[#3D3D3D] text-base font-normal font-['Inter'] leading-snug">
                    <i className="ri-map-pin-line" />
                    {a.staff.city}, {a.staff.country}
                  </span>
                  <p className="self-stretch justify-start mt-3 text-[#292929] text-base font-medium font-['Inter'] leading-snug">
                    Offer: ${a.offer}/hr
                  </p>
                  <p className="mb-4">{a.message}</p>
                  <hr className="border-zinc-500" />
                  <div className="flex items-center justify-end gap-4 pt-4">
                    <button className="text-zinc-600 flex place-items-center gap-2 text-md">
                      Decline <i className="ri-close-line"></i>
                    </button>
                    <button className="border-[#E61E4D] flex place-items-center gap-2 border-2 text-[#e31f82] font-semibold py-1 px-4 rounded-lg">
                      Accept <i className="ri-check-line text-xl"></i>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-zinc-500 p-4">No applications received yet.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default ViewJobDetails;