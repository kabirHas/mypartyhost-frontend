import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import BASE_URLS from "../config";
import JobDetailCard from "../components/JobDetailCard";
import StripeWrapper from "../components/StripeWrapper";
import { ChatState } from "../Context/ChatProvider";

function ViewJobDetails() {
  const { id } = useParams();
  const [jobDetail, setJobDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("details");
  const [savedProfiles, setSavedProfiles] = useState([]); // Store saved profile IDs
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [amount, setAmount] = useState(0);
  const [currency, setCurrency] = useState("USD");
  const { user } = ChatState();

  useEffect(() => {
    // Step 1: Get user's currency
    axios
      .get("https://ipapi.co/json/")
      .then((res) => {
        const userCurrency = res.data.currency;
        setCurrency(userCurrency);
        console.log("User's currency:", userCurrency);
      })
      .catch((err) => console.error(err));
  }, [currency]);

  const handleProceedToPayment = async (
    jobId,
    applicationId,
    actualAmount,
    actualCurrency,
    duration,
    staffId,
    jobDetail
  ) => {
    console.log(
      jobId,
      applicationId,
      actualAmount,
      actualCurrency,
      duration,
      staffId,
      jobDetail.duration
    );
    if (!currency) return;
    const rateRes = await axios.get(
      `https://v6.exchangerate-api.com/v6/9f6020acea6f209461dca627/latest/${actualCurrency}`
    );
    const platformFeeRate = await axios.get(
      `https://v6.exchangerate-api.com/v6/9f6020acea6f209461dca627/latest/USD` // Assuming platform fee is in USD
    );
    const rate = rateRes.data.conversion_rates[currency] || 1;
    let convertedAmount = actualAmount * rate;
    let platformFee = 20;
    console.log("Platform Fee:", platformFee);
    let convertedPlatformFee = platformFee * platformFeeRate.data.conversion_rates[currency] || 1;
    let actualAmountInUSD = actualAmount * rateRes.data.conversion_rates['USD'] || 1;

    // let realAmt = actualAmount * jobDetail.duration;
    let realAmtAfterPlatform =
    (actualAmount  * 10 / 100) + platformFee;
    let amountUSDAfterPlatform = actualAmountInUSD.toFixed(2) * 10 / 100 + platformFee;
    console.log("Real Amount After Platform Fee:", realAmtAfterPlatform);
    console.log("Amount in USD ", amountUSDAfterPlatform);

    if (duration === "hour") {
      realAmtAfterPlatform = (actualAmount * jobDetail.duration * 10) / 100 + platformFee;
      amountUSDAfterPlatform = ((actualAmountInUSD * jobDetail.duration) * 10 / 100) + platformFee;
      convertedAmount *= jobDetail.duration;
      console.log("10 Percent", (convertedAmount * 10) / 100);
      let payableAmount = (convertedAmount * 10) / 100 + convertedPlatformFee;
      console.log("Converted Amount for hourly job:", payableAmount);

      

      try {
        const res = await axios.post(
          `${BASE_URLS.BACKEND_BASEURL}jobs/${jobId}/hire/${applicationId}/initiate`,
          {
            currency: currency,
            amount: payableAmount.toFixed(2),
            convertedAmount,
            actualAmount: actualAmount * jobDetail.duration,
            actualCurrency: actualCurrency,
            amountUSD: amountUSDAfterPlatform.toFixed(2),
            actualAmountPayable : realAmtAfterPlatform,
            platformFee,
            convertedPlatformFee,

          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        if (res.data.stripeRequired) {
          window.location.href = res.data.url;
        } else {
          alert("Payment done from wallet. Staff hired!");
        }
        // window.location.href = res.data.url;
      } catch (error) {
        console.error("Payment Error:", error);
        alert("Failed to create payment session.");
      }
    }

    // console.log('Converted Amount:',  convertedAmount);

    // convertedAmount *= jobDetail.duration;
    console.log("10 Percent", (convertedAmount * 10) / 100);
    let payableAmount = (convertedAmount * 10) / 100 + convertedPlatformFee;
    console.log("Converted Amount for  job:", payableAmount);

    try {
      const res = await axios.post(
        `${BASE_URLS.BACKEND_BASEURL}jobs/${jobId}/hire/${applicationId}/initiate`,
        {
          currency: currency,
          amount: payableAmount.toFixed(2),
          convertedAmount,
          amountUSD: amountUSDAfterPlatform.toFixed(2),
          actualAmount: actualAmount * jobDetail.duration,
          actualCurrency: actualCurrency,
          actualAmountPayable : realAmtAfterPlatform,
          platformFee,
          convertedPlatformFee,


        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      window.location.href = res.data.url;
    } catch (error) {
      console.error("Payment Error:", error);
      alert("Failed to create payment session.");
    }
  };

  const handleDecline = (job) => {
    console.log("Declining application:", job);
    axios.post(
      `${BASE_URLS.BACKEND_BASEURL}jobs/${job.job}/reject/${job._id}`,
      {},
      {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((res) => {
        console.log("Decline Response:", res.data);
        // alert("Declined job successfully.");
        window.location.reload();
      })
      .catch((err) => {
        console.error("Decline Error:", err);
        alert("Failed to decline job. Please try again.");
      });
  }

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
        console.log("Job Details Response:", res.data.applicants);
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
        console.log(
          `${isSaved ? "Unsaved" : "Saved"} Profile Response:`,
          res.data
        );
        // Update savedProfiles state
        setSavedProfiles((prev) =>
          isSaved ? prev.filter((id) => id !== staffId) : [...prev, staffId]
        );
      })
      .catch((err) => {
        console.error(
          `Error ${isSaved ? "unsaving" : "saving"} profile:`,
          err.response?.data || err.message
        );
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
          <h2 className="self-stretch justify-start text-[#292929] text-2xl font-bold font-['Inter'] leading-7">
            {eventName}
          </h2>
          <p className="self-stretch justify-start text-[#3D3D3D] text-base font-normal font-['Inter'] leading-snug">
            {jobTitle}
          </p>
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
          Application (
          {applicants?.filter((a) => a.status === "pending").length || 0})
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
              {applicants
                .filter((a) => a.status === "pending")
                .map((a, i) => (
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
                          title={
                            savedProfiles.includes(a.staff._id)
                              ? "Unsave Profile"
                              : "Save Profile"
                          }
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
                      Offer: {a.currency} {a.offer}/{a.duration === 'hour' ? "hr" : "-"} 
                    </p>
                    <p className="mb-4">{a.message}</p>
                    <hr className="border-zinc-500" />
                    <div className="flex items-center justify-end gap-4 pt-4">
                      <button onClick={() => handleDecline(a)} className="text-zinc-600 flex place-items-center gap-2 text-md">
                        Decline <i className="ri-close-line"></i>
                      </button>
                      <button
                        onClick={() => {
                          setSelectedApplication({
                            applicationId: a._id,
                            jobId: jobDetail._id,
                            application: a,
                            job: jobDetail,
                            staff: a.staff,
                          });
                          console.log(selectedApplication);
                          // setShowPaymentModal(true);
                          handleProceedToPayment(
                            jobDetail._id,
                            a._id,
                            a.offer,
                            a.currency,
                            a.duration,
                            a.staff._id,
                            jobDetail
                          );
                        }}
                        className="border-[#E61E4D] flex place-items-center gap-2 border-2 text-[#e31f82] font-semibold py-1 px-4 rounded-lg"
                      >
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
      {showPaymentModal && selectedApplication && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md relative">
            <button
              onClick={() => setShowPaymentModal(false)}
              className="absolute top-2 right-2 text-gray-600 text-lg"
            >
              ✕
            </button>
            <StripeWrapper
              jobId={selectedApplication.jobId}
              applicationId={selectedApplication.applicationId}
              onClose={() => setShowPaymentModal(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default ViewJobDetails;
