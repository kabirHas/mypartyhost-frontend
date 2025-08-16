import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function SavedJobs() {
    const [activeTab, setActiveTab] = useState("saved");
  const [savedJobs, setSavedJobs] = useState([]);
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [isRemoving, setIsRemoving] = useState(false);
  const navigate = useNavigate();

  

  useEffect(() => {
    const fetchSavedJobs = async () => {
      try {
        const response = await axios.get("https://mypartyhost.onrender.com/api/jobs/saved", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        const data = response.data.savedJobs || response.data; // Handle different response structures
        const savedJobsArray = Array.isArray(data) ? data : [];
        const formattedJobs = savedJobsArray.map(job => ({
          id: job._id,
          title: job.jobTitle,
          category: job.staffCategory,
          location: `${job.suburb}, ${job.city}, ${job.country}`,
          dateTime: `${new Date(job.jobDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })} | ${new Date(`1970-01-01T${job.startTime}`).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })} – ${new Date(`1970-01-01T${job.endTime}`).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}`,
          pay: `${job.currency}${job.rateOffered}/${job.paymentType === 'hourly' ? 'h' : 'fixed'}`,
          description: job.jobDescription,
        }));
        setSavedJobs(formattedJobs);
      } catch (error) {
        console.error("Error fetching saved jobs:", error);
        if (error.response?.status === 401) {
          alert("Session expired. Please log in again.");
          navigate("/login");
        } else if (error.response?.status === 404) {
          // alert("Saved jobs endpoint not found. Please contact support.");
        } else {
          // alert("Error fetching saved jobs. Please try again.");
        }
        setSavedJobs([]);
      }
    };

    if (localStorage.getItem("token")) {
      fetchSavedJobs();
    } else {
      alert("Please log in to view saved jobs.");
      navigate("/login");
    }
  

    const fetchAppliedJobs = async () => {
  try {
    const response = await axios.get("https://mypartyhost.onrender.com/api/jobs/applied-jobs", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    console.log("Applied jobs response:", response.data);
    const data = response.data.appliedJobs || response.data;
    const appliedJobsArray = Array.isArray(data) ? data : [];
    const formattedJobs = appliedJobsArray.map(item => ({
      id: item.job?._id || "N/A",
      applicationId: item._id || "N/A", // Store application ID
      title: item.job?.jobTitle || "Untitled Job",
      category: item.job?.staffCategory || "Unknown Category",
      location: `${item.job?.suburb || "Unknown"}, ${item.job?.city || "Unknown"}, ${item.job?.country || "Unknown"}`,
      dateTime: `${
        item.job?.jobDate
          ? new Date(item.job.jobDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
          : "Unknown Date"
      } | ${
        item.job?.startTime && item.job?.endTime
          ? `${new Date(`1970-01-01T${item.job.startTime}`).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })} – ${new Date(`1970-01-01T${item.job.endTime}`).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}`
          : "Unknown Time"
      }`,
      pay: `${item.job?.currency || "AUD"}${item.job?.rateOffered || 0}/${item.job?.paymentType === 'hourly' ? 'h' : 'fixed'}`,
      description: item.job?.jobDescription || "No description available",
    }));
    console.log("Formatted applied jobs:", formattedJobs);
    setAppliedJobs(formattedJobs);
  } catch (error) {
    console.error("Error fetching applied jobs:", error);
    console.error("Error details:", error.response?.data);
    if (error.response?.status === 401) {
      alert("Session expired. Please log in again.");
      navigate("/login");
    }
    setAppliedJobs([]);
  }
};

  if (localStorage.getItem("token")) {
    if (activeTab === "saved") {
      fetchSavedJobs();
    } else if (activeTab === "applied") {
      fetchAppliedJobs();
    }
  } else {
    alert("Please log in to view jobs.");
    navigate("/login");
  }
}, [navigate, activeTab]);



  const handleRemoveJob = async (jobId) => {
  if (isRemoving) return; // Prevent multiple clicks
  setIsRemoving(true);
  try {
    const response = await axios.delete(`https://mypartyhost.onrender.com/api/jobs/${jobId}/saved`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    if (response.status === 200 || response.status === 204) {
      setSavedJobs((prev) => prev.filter((job) => job.id !== jobId));
      alert("Job removed from saved list.");
    } else {
      alert("Failed to remove job. Please try again.");
    }
  } catch (error) {
    console.error("Error removing job:", error);
    if (error.response?.status === 401) {
      alert("Session expired. Please log in again.");
      navigate("/login");
    } else if (error.response?.status === 404) {
      alert("Job not found or endpoint incorrect. Please verify the job ID or API endpoint.");
    } else {
      alert("Error removing job. Please try again.");
    }
  } finally {
    setIsRemoving(false); // Reset after request
  }
};

  



const handleApplyJob = async (jobId) => {
  try {
    const token = localStorage.getItem("token");
    console.log("Token (first 10 chars):", token?.substring(0, 10) || "No token");
    // Decode token to get staff ID
    let staffId;
    try {
      const base64Payload = token.split(".")[1];
      const decodedPayload = atob(base64Payload);
      const payloadObj = JSON.parse(decodedPayload);
      staffId = payloadObj._id;
      console.log("Decoded staffId:", staffId);
    } catch (err) {
      console.error("Error decoding token:", err);
      alert("Invalid token. Please log in again.");
      navigate("/login");
      return;
    }

    // Find the job to get its data
    const job = savedJobs.find(job => job.id === jobId);
    if (!job) {
      console.error("Job not found in saved jobs:", jobId);
      alert("Job not found in saved jobs.");
      return;
    }

    // Extract currency and duration from job.pay (e.g., "AUD30/fixed")
    const currency = job.pay.split(/[0-9]/)[0] || "AUD";
    const duration = job.pay.includes("/h") ? "Per Hour" : "Per Day";
    const offer = parseFloat(job.pay.match(/\d+(\.\d+)?/)?.[0]) || 50; // Default to 50 if parsing fails
    const message = "I am interested in this job."; // Default message

    const payload = { job: jobId, staff: staffId, offer, message, duration, currency };
    console.log("Applying for job, full payload:", JSON.stringify(payload, null, 2));
    console.log("Job details from savedJobs:", JSON.stringify(job, null, 2));

    const response = await axios.post(
      `https://mypartyhost.onrender.com/api/jobs/${jobId}/apply`,
      payload,
      { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
    );

    if (response.status === 200 || response.status === 201) {
      alert("Job applied successfully!");
      setSavedJobs(prev => prev.filter(job => job.id !== jobId));
      setAppliedJobs(prev => [... prev, { ...job, applicationId: response.data.applicationId || "N/A" }]);
    } else {
      console.error("Failed to apply for job. Status:", response.status);
      alert("Failed to apply for job. Please try again.");
    }
  } catch (error) {
    console.error("Error applying for job:", error);
    console.error("Error details:", error.response?.data, "Status:", error.response?.status);
    console.error("Full error response:", {
      status: error.response?.status,
      data: error.response?.data,
      headers: error.response?.headers,
      request: {
        url: error.config?.url,
        method: error.config?.method,
        headers: error.config?.headers,
        data: error.config?.data,
      },
    });
    if (error.response?.status === 401) {
      alert("Session expired. Please log in again.");
      navigate("/login");
    } else if (error.response?.status === 404) {
      alert("Job not found. Please verify the job ID.");
    } else {
      alert("Error applying for job. Please try again or contact support.");
    }
  }
};





const handleWithdrawApplication = async (jobId, applicationId) => {
  try {
    const token = localStorage.getItem("token");
    await axios.post(
      `https://mypartyhost.onrender.com/api/jobs/${jobId}/withdraw/${applicationId}`,
      {}, // <- empty body
      {
        headers: { Authorization: `Bearer ${token}` }, // <- correct headers
      }
    );

    // Remove the job from appliedJobs list
    setAppliedJobs(prev => prev.filter(job => job.applicationId !== applicationId));
    alert("Application withdrawn successfully.");
  } catch (error) {
    console.error("Error withdrawing application:", error);
    alert("Failed to withdraw application. Please try again.");
  }
};




  return (
    <>
      <div className="self-stretch inline-flex flex-col justify-start items-start gap-2.5">
        <div className="self-stretch flex flex-col justify-start items-start gap-4">
          <h2 className="self-stretch justify-start text-black text-4xl font-bold font-['Inter'] leading-10">
            {activeTab === "saved" ? "Saved Jobs" : "Applied Jobs"}
          </h2>
          <div className="self-stretch flex flex-col justify-start items-start gap-8">
            <div className="border-b border-[#656565] inline-flex justify-start items-center">
              <div
                onClick={() => setActiveTab("saved")}
                className={`px-4 py-2 border-b-2 flex justify-center items-center gap-2.5 ${
                  activeTab === "saved" ? "border-[#E61E4D]" : ""
                }`}
              >
                <div
                  className={`justify-start text-sm font-medium font-['Inter'] leading-tight ${
                    activeTab === "saved" ? "text-[#E61E4D]" : "text-[#656565]"
                  }`}
                >
                  Saved Jobs
                </div>
              </div>
              <div
                onClick={() => setActiveTab("applied")}
                className={`px-4 py-2 border-b-2 flex justify-center items-center gap-2.5 ${
                  activeTab === "applied" ? "border-[#E61E4D]" : ""
                }`}
              >
                <div
                  className={`justify-start text-sm font-medium font-['Inter'] leading-tight ${
                    activeTab === "applied" ? "text-[#E61E4D]" : "text-[#656565]"
                  }`}
                >
                  Applied
                </div>
              </div>
            </div>

            {activeTab === "saved" ? (
              <div className="self-stretch flex flex-row justify-start items-start gap-6">
                {savedJobs.length === 0 ? (
                  <p className="self-stretch justify-start text-[#3D3D3D] text-base font-normal font-['Inter'] leading-snug">
                    No saved jobs found.
                  </p>
                ) : (
                  savedJobs.map((job) => (
                    <div className="w-1/2 self-stretch inline-flex justify-start items-center gap-6" key={job.applicationId}>
                      <div
                        data-property-1="Favorite"
                        className="flex-1 p-6 bg-[#FFFFFF] rounded-2xl inline-flex flex-col justify-start items-end gap-2"
                      >
                        <div className="self-stretch flex flex-col justify-start items-start gap-6">
                          <div className="self-stretch flex flex-col justify-start items-start gap-4">
                            <div className="self-stretch inline-flex justify-center items-start gap-4">
                              <div className="flex-1 inline-flex flex-col justify-start items-start gap-2">
                                <h3 className="self-stretch justify-start text-[#292929] text-xl font-bold font-['Inter'] leading-normal">
                                  {job.title}
                                </h3>
                                <div className="self-stretch justify-start text-[#656565] text-sm font-normal font-['Inter'] leading-tight">
                                  {job.category}
                                </div>
                              </div>
                              <div className="justify-start text-[#292929] text-xl font-bold font-['Inter'] leading-normal">
                                {job.pay}
                              </div>
                            </div>
                            <div className="self-stretch flex flex-col justify-start items-start gap-2">
                              <div className="self-stretch inline-flex justify-start items-center gap-2">
                                <div
                                  data-format="Stroke"
                                  data-weight="Light"
                                  className="relative"
                                >
                                  <i className="ri-map-pin-line text-[#656565] text-base"></i>
                                </div>
                                <div className="flex-1 justify-start text-[#3D3D3D] text-sm font-normal font-['Inter'] leading-tight">
                                  {job.location}
                                </div>
                              </div>
                              <div className="self-stretch justify-start text-[#3D3D3D] text-sm font-normal font-['Inter'] leading-tight">
                                {job.dateTime}
                              </div>
                            </div>
                          </div>
                          <p className="self-stretch justify-start text-[#3D3D3D] text-base font-normal font-['Inter'] leading-snug">
                            {job.description}
                          </p>
                        </div>
                        <div className="self-stretch h-0 outline-1 outline-offset-[-0.50px] outline-[#F9F9F9]"></div>
                        <div className="inline-flex justify-start items-center gap-6">
                          <button
                            onClick={() => handleRemoveJob(job.id)}
                            className="px-6 py-2 rounded-lg outline-1 outline-offset-[-1px] outline-[#E61E4D] flex justify-center items-center gap-2 overflow-hidden"
                          >
                            <span className="justify-start text-[#E61E4D] text-base font-medium font-['Inter'] leading-snug">
                              Remove From Shortlist
                            </span>
                            <div
                              data-format="Stroke"
                              data-weight="Fill"
                              className="relative"
                            >
                              <i className="ri-poker-hearts-fill text-[#E61E4D] text-xl"></i>
                            </div>
                          </button>
                          <button
                            onClick={() => handleApplyJob(job.id)}
                            className="px-6 py-3 bg-gradient-to-l from-pink-600 to-rose-600 rounded-lg flex justify-center items-center gap-2 overflow-hidden text-white text-base font-medium leading-snug font-['Inter']"
                          >
                            Apply Now
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            ) : (
              <div className="self-stretch flex flex-row justify-end items-start gap-6">
                {appliedJobs.length === 0 ? (
                  <p className="self-stretch justify-start text-[#3D3D3D] text-base font-normal font-['Inter'] leading-snug">
                    No applied jobs found.
                  </p>
                ) : (
                  appliedJobs.map((job) => (
                    <div className="w-1/2 self-stretch inline-flex justify-start items-center gap-6" key={job.applicationId}>
                      <div
                        data-property-1="applied"
                        className="flex-1 p-6 bg-[#FFFFFF] rounded-2xl inline-flex flex-col justify-start items-end gap-2"
                      >
                        <div className="self-stretch flex flex-col justify-start items-start gap-6">
                          <div className="self-stretch flex flex-col justify-start items-start gap-4">
                            <div className="self-stretch inline-flex justify-center items-start gap-4">
                              <div className="flex-1 inline-flex flex-col justify-start items-start gap-2">
                                <h3 className="self-stretch justify-start text-[#292929] text-xl font-bold font-['Inter'] leading-normal">
                                  {job.title}
                                </h3>
                                <div className="self-stretch justify-start text-[#656565] text-sm font-normal font-['Inter'] leading-tight">
                                  {job.category}
                                </div>
                              </div>
                              <div className="justify-start text-[#292929] text-xl font-bold font-['Inter'] leading-normal">
                                {job.pay}
                              </div>
                            </div>
                            <div className="self-stretch flex flex-col justify-start items-start gap-2">
                              <div className="self-stretch inline-flex justify-start items-center gap-2">
                                <div
                                  data-format="Stroke"
                                  data-weight="Light"
                                  className="relative"
                                >
                                  <i className="ri-map-pin-line text-[#656565] text-base"></i>
                                </div>
                                <div className="flex-1 justify-start text-[#3D3D3D] text-sm font-normal font-['Inter'] leading-tight">
                                  {job.location}
                                </div>
                              </div>
                              <div className="self-stretch justify-start text-[#3D3D3D] text-sm font-normal font-['Inter'] leading-tight">
                                {job.dateTime}
                              </div>
                            </div>
                          </div>
                          <p className="self-stretch justify-start text-[#3D3D3D] text-base font-normal font-['Inter'] leading-snug">
                            {job.description}
                          </p>
                        </div>
                        <div className="self-stretch h-0 outline-1 outline-offset-[-0.50px] outline-[#F9F9F9]"></div>
                        <div className="inline-flex justify-start items-center gap-4">
                          <div className="flex justify-start items-center gap-6">
                            <div className="py-1 rounded-lg flex justify-center items-center gap-2 overflow-hidden">
                              <div className="justify-start text-[#656565] text-sm font-normal font-['Inter'] leading-tight">
                                You already applied for this job
                              </div>
                            </div>
                          </div>
                          <button onClick={() => handleWithdrawApplication(job.id, job.applicationId)} className="px-6 py-3 rounded-lg outline-1 outline-offset-[-1px] outline-[#E61E4D] flex justify-center items-center gap-2 overflow-hidden">
                            <div className="justify-start text-[#E61E4D] text-base font-medium font-['Inter'] leading-snug">
                              Withdraw Application
                            </div>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default SavedJobs;



