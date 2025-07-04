import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";

const ApplyJob = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const job = state?.job;
  const [rate, setRate] = useState("");
  const [rateType, setRateType] = useState("Per Hour");
  const [coverLetter, setCoverLetter] = useState("");

  return (
    <div className="self-stretch p-12 w-full bg-[#f9f9f9] inline-flex justify-center items-start gap-2.5">
      <div className="w-[800px] max-w-[800px] mx-auto  inline-flex flex-col justify-start items-start gap-6 ">
        <button
          className="px-3 py-2 rounded-full outline outline-1 outline-offset-[-1px] outline-[#ECECEC] inline-flex justify-start items-center gap-2"
          onClick={() => navigate(-1)}
        >
          <i className="ri-arrow-left-line text-xl text-[#656565]"></i>
          <div className="justify-start text-black text-sm font-normal font-['Inter'] leading-tight">
            Back
          </div>
        </button>

        {/* Job Details */}
        <div className="self-stretch flex flex-col justify-start items-start gap-8">
          <div className="self-stretch p-6 bg-[#FFFFFF] rounded-3xl flex flex-col justify-start items-start gap-8">
            <div className="self-stretch flex flex-col justify-start items-start gap-6">
              <div className="self-stretch flex flex-col justify-start items-start gap-4">
                <div className="self-stretch flex flex-col justify-start items-start gap-3">
                  <div className="self-stretch inline-flex justify-start items-start gap-6">
                    <div className="flex-1 inline-flex flex-col justify-start items-start gap-2">
                      <h1 className="self-stretch justify-start text-[#292929] text-2xl font-bold font-['Inter'] leading-7">
                        {job?.title}
                      </h1>
                      <p className="self-stretch justify-start text-[#3D3D3D] text-base font-normal font-['Inter'] leading-snug">
                        {job?.category}
                      </p>
                    </div>
                    <p className="justify-start text-[#292929] text-xl font-bold font-['Inter'] leading-normal">
                      {job?.rate}
                    </p>
                  </div>
                  <p className="self-stretch justify-start text-[#3D3D3D] text-base font-medium font-['Inter'] leading-snug">
                    Positions Available: 8
                  </p>
                </div>
                <div className="self-stretch inline-flex justify-start items-center gap-6 flex-wrap content-center">
                  <div className="flex justify-start items-center gap-2">
                    <i className="ri-map-pin-line text-xl text-[#656565]"></i>

                    <span className="justify-start text-[#3D3D3D] text-base font-normal font-['Inter'] leading-snug">
                      {job?.location}
                    </span>
                  </div>
                  <div className="flex justify-start items-center gap-2">
                    <i className="ri-calendar-check-line text-xl text-[#656565]"></i>
                    <span className="justify-start text-[#3D3D3D] text-base font-normal font-['Inter'] leading-snug">
                      {job?.datetime.split("|")[0]}
                    </span>
                  </div>
                  <div className="flex justify-start items-center gap-2">
                    <i className="ri-time-line text-xl text-[#656565]"></i>
                    <span className="justify-start text-[#3D3D3D] text-base font-normal font-['Inter'] leading-snug">
                      {job?.datetime.split("|")[1]}
                    </span>
                  </div>
                </div>
              </div>
              <div className="self-stretch h-0 outline outline-1 outline-offset-[-0.50px] outline-[#ECECEC]"></div>
              <p className="self-stretch justify-start text-[#3D3D3D] text-base font-normal font-['Inter'] leading-snug">
                {job?.description}
              </p>
              <div className="self-stretch h-0 outline outline-1 outline-offset-[-0.50px] outline-[#ECECEC]"></div>
              <div className=" flex flex-col justify-start items-start gap-3">
                <p className="self-stretch justify-start text-[#3D3D3D] text-base font-normal font-['Inter'] leading-snug">
                  Gender : {job?.gender}
                </p>
                <div className=" w-full flex items-center gap-2">
                  <div className="justify-start text-[#3D3D3D] text-base font-normal font-['Inter'] leading-snug">
                    Travel Compensation
                  </div>
                  <i className="ri-checkbox-circle-fill text-xl text-[#E61E4D]"></i>
                </div>
              </div>
            </div>
            <div className="self-stretch h-0 outline outline-1 outline-offset-[-0.50px] outline-[#ECECEC]"></div>
            <div className="self-stretch flex flex-col justify-start items-start gap-2">
              <p className="self-stretch justify-start text-[#656565] text-sm font-medium font-['Inter'] leading-tight">
                Event Organizer
              </p>
              <div className="self-stretch inline-flex justify-start items-start gap-2">
                <img
                  className="w-12 h-12 rounded-full"
                  src="https://placehold.co/48x48"
                />
                <div className=" inline-flex flex-col justify-start items-start ">
                  <p className="self-stretch mb-0 justify-start text-[#292929] text-sm font-bold font-['Inter'] leading-tight">
                    {job?.organizer}
                  </p>
                  <div className="self-stretch inline-flex justify-start items-center gap-2">
                    <i className="ri-map-pin-line text-sm text-[#656565]"></i>
                    <div className="justify-start text-[#3D3D3D] text-sm font-normal font-['Inter'] leading-tight">
                      {job?.location}
                    </div>
                  </div>
                  <div className="inline-flex justify-start items-center gap-2">
                    <div className="flex justify-start items-center gap-1">
                      <i className="ri-star-fill text-sm text-[#FF8915]"></i>

                      <div className="justify-start text-orange-500 text-sm font-medium font-['Inter'] leading-tight">
                        {job?.rating}
                      </div>
                    </div>
                    <div className="justify-start text-[#3D3D3D] text-sm font-medium font-['Inter'] leading-tight">
                      ( {job?.reviews} reviews)
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Apply Form */}
          <div className="self-stretch p-6 bg-[#FFFFFF] rounded-3xl flex flex-col justify-start items-start gap-8">
            <h2 className="self-stretch justify-start text-[#292929] text-2xl font-bold font-['Inter'] leading-7">
              Apply for This Job
            </h2>
            <div className="self-stretch flex flex-col justify-start items-start gap-8">
              <div className="self-stretch flex flex-col justify-start items-start gap-6">
                <div className="flex flex-col justify-start items-start gap-2">
                  <label className="self-stretch justify-start text-[#292929] text-base font-normal font-['Inter'] leading-snug">
                    Your Rate
                  </label>

                  <div className="w-60 h-10 flex rounded-lg overflow-hidden outline outline-1 outline-gray-200 text-[#3D3D3D]">
                    <div className="flex items-center px-3 bg-white border-r border-gray-200">
                      <span className="text-base font-medium font-['Inter']">
                        $
                      </span>
                      <input
                        type="number"
                        value={rate}
                        onChange={(e) => setRate(e.target.value)}
                        className="w-25 pl-2 outline-none bg-transparent text-base text-[#3D3D3D] font-['Inter']"
                        min="0"
                      />
                    </div>

                    <div className="flex items-center justify-between px-3 bg-[#F5F5F5] flex-1 relative">
                      <select
                        value={rateType}
                        onChange={(e) => setRateType(e.target.value)}
                        className="appearance-none bg-transparent outline-none w-full pr-6 text-base font-normal font-['Inter']"
                      >
                        <option value="Per Hour">Per Hour</option>
                        <option value="Per Day">Per Day</option>
                      </select>
                      <i className="ri-arrow-down-s-line absolute right-3 text-[#656565] text-sm pointer-events-none"></i>
                    </div>
                  </div>

                  <p className="self-stretch justify-start text-[#656565] text-xs font-normal font-['Inter'] leading-none">
                    Minimum $50/h
                  </p>
                </div>
                <div
                  data-property-1="default"
                  data-show-icons="false"
                  data-show-instruction-message="true"
                  className="self-stretch h-52 flex flex-col justify-start items-start gap-2"
                >
                  <div className="self-stretch inline-flex justify-start items-center gap-3">
                    <label className="flex-1 justify-start text-[#3D3D3D] text-base font-normal font-['Inter'] leading-snug">
                      Cover Letter
                    </label>
                    <div className="justify-start text-[#656565] text-xs font-normal font-['Inter'] leading-none">
                      Max 1000 ch
                    </div>
                  </div>
                  <textarea
                    value={coverLetter}
                    onChange={(e) => setCoverLetter(e.target.value)}
                    rows={5}
                    maxLength={1000}
                    placeholder="Write a short note about why you're a great fit for this role. Please do not share contact details or social media accounts."
                    className="w-full h-800 px-3 py-2 rounded-lg outline outline-1 outline-offset-[-1px] outline-gray-200 text-sm font-normal text-gray-700 placeholder-gray-400 font-['Inter']"
                  />
                </div>
              </div>
              <div className="px-6 py-3 bg-gradient-to-l from-pink-600 to-rose-600 rounded-lg inline-flex justify-center items-center gap-2 overflow-hidden">
                <div className="justify-start text-[#FFFFFF] text-base font-medium font-['Inter'] leading-snug">
                  Submit Application
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplyJob;
