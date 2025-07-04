import axios from "axios";
import React from "react";
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

delete L.Icon.Default.prototype._getIconUrl;

const redIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

function FindJobs() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showMap, setShowMap] = useState(false);

  const [geocodedJobs, setGeocodedJobs] = useState([]);

  const navigate = useNavigate();

  const [jobs, setJobs] = useState([
    {
      id: 1,
      title: "Exclusive Beach Party – Energetic Hostess Required",
      category: "Beach Party",
      location: "Surfers Paradise, QLD",
      datetime: "Tue, April 1, 2025 | 4:00 PM – 9:00 PM",
      rate: "$100/h",
      gender: "Female",
      organizer: "Emily Robertson",
      rating: 4.8,
      reviews: 120,
      description:
        "Join an upscale beach party where your charisma and energy will set the vibe! Mingle with guests, assist with event flow, and enjoy an outdoor celebration with a twist.",
    },
    {
      id: 2,
      title: "Exclusive Beach Party – Energetic Hostess Required",
      category: "Beach Party",
      location: "Ipswich, QLD",
      datetime: "Tue, April 1, 2025 | 4:00 PM – 9:00 PM",
      rate: "$100/h",
      gender: "Female",
      organizer: "Emily Robertson",
      rating: 4.8,
      reviews: 120,
      description:
        "Join an upscale beach party where your charisma and energy will set the vibe! Mingle with guests, assist with event flow, and enjoy an outdoor celebration with a twist.",
    },
    {
      id: 3,
      title: "Exclusive Beach Party – Energetic Hostess Required",
      category: "Beach Party",
      location: "Lucknow, India",
      datetime: "Tue, April 1, 2025 | 4:00 PM – 9:00 PM",
      rate: "$100/h",
      gender: "Female",
      organizer: "Emily Robertson",
      rating: 4.8,
      reviews: 120,
      description:
        "Join an upscale beach party where your charisma and energy will set the vibe! Mingle with guests, assist with event flow, and enjoy an outdoor celebration with a twist.",
    },
    {
      id: 4,
      title: "Exclusive Beach Party – Energetic Hostess Required",
      category: "Beach Party",
      location: "Brisbane, QLD",
      datetime: "Tue, April 1, 2025 | 4:00 PM – 9:00 PM",
      rate: "$100/h",
      gender: "Female",
      organizer: "Emily Robertson",
      rating: 4.8,
      reviews: 120,
      description:
        "Join an upscale beach party where your charisma and energy will set the vibe! Mingle with guests, assist with event flow, and enjoy an outdoor celebration with a twist.",
    },
    {
      id: 5,
      title: "Exclusive Beach Party – Energetic Hostess Required",
      category: "Beach Party",
      location: "Coolangatta, QLD",
      datetime: "Tue, April 1, 2025 | 4:00 PM – 9:00 PM",
      rate: "$100/h",
      gender: "Female",
      organizer: "Emily Robertson",
      rating: 4.8,
      reviews: 120,
      description:
        "Join an upscale beach party where your charisma and energy will set the vibe! Mingle with guests, assist with event flow, and enjoy an outdoor celebration with a twist.",
    },
  ]);

  const filteredJobs = jobs.filter((job) =>
    job.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const scrollRef = useRef(null);

  const scroll = (direction) => {
    const container = scrollRef.current;
    if (!container) return;
    const scrollAmount = container.offsetWidth / 2.5;
    container.scrollBy({
      left: direction === "right" ? scrollAmount : -scrollAmount,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    const fetchCoordinates = async () => {
      const updatedJobs = await Promise.all(
        jobs.map(async (job) => {
          try {
            const response = await axios.get(
              `https://nominatim.openstreetmap.org/search`,
              {
                params: {
                  q: job.location,
                  format: "json",
                  limit: 1,
                },
              }
            );

            if (response.data && response.data[0]) {
              return {
                ...job,
                lat: parseFloat(response.data[0].lat),
                lng: parseFloat(response.data[0].lon),
              };
            } else {
              return { ...job };
            }
          } catch (error) {
            console.error("Geocoding failed for:", job.location, error);
            return { ...job };
          }
        })
      );

      setGeocodedJobs(updatedJobs);
    };

    fetchCoordinates();
  }, [jobs]);

  return (
    <div className="self-stretch inline-flex flex-col justify-start items-start gap-12 font-['Inter']">
      <div className="w-full  flex flex-col justify-start items-start gap-12">
        <div className="self-stretch flex flex-col justify-start items-start gap-2">
          <h1 className="self-stretch justify-start text-black text-4xl font-bold font-['Inter'] leading-10">
            Job Listings – Find Your Next Gig
          </h1>
          <p className="self-stretch justify-start text-[#3D3D3D] text-base font-normal font-['Inter'] leading-snug">
            Discover exciting events that match your style and schedule. Apply
            instantly or save your favorites for later!
          </p>
        </div>

        {/* Search bar */}
        <div className="self-stretch h-12 pl-3 bg-[#F9F9F9] rounded-lg outline outline-1 outline-offset-[-1px] outline-[#656565] inline-flex justify-between items-center overflow-hidden">
          <i className="ri-search-line text-[#E61E4D] outline-none text-2xl"></i>
          <div className="flex-1 h-full px-3 py-2.5  flex items-center">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-transparent focus:outline-none text-[#292929] text-base font-normal font-['Inter'] leading-snug placeholder:text-gray-400"
            />
          </div>
          <div className="w-20 self-stretch px-3 py-2.5 bg-[#FFCCD3] flex justify-center items-center gap-2.5">
            <div className="justify-start text-[#292929] text-base font-normal font-['Inter'] leading-snug">
              Search
            </div>
          </div>
        </div>

        {/* Search Bar Container */}
        <div className="self-stretch flex flex-col justify-start items-start gap-6">
          <div className="self-stretch inline-flex justify-between items-center">
            <div className="flex justify-start items-center gap-4">
              <div
                onClick={() => setShowMap(false)}
                className={`p-2 rounded-lg cursor-pointer ${
                  !showMap
                    ? "bg-[#FFF1F2] outline outline-1 outline-offset-[-1px] text-[#E61E4D] outline-[#FE6E85]"
                    : "bg-white outline outline-1 outline-offset-[-1px] text-[#656565] outline-[#ECECEC]"
                }`}
              >
                <div className="w-8 h-8 flex items-center justify-center">
                  <i className="ri-menu-line text-xl"></i>
                </div>
              </div>

              <div
                onClick={() => setShowMap(true)}
                className={`p-2 rounded-lg cursor-pointer ${
                  showMap
                    ? "bg-[#FFF1F2] outline outline-1 outline-offset-[-1px] text-[#FE6E85] outline-[#FE6E85]"
                    : "bg-white outline outline-1 outline-offset-[-1px] text-[#656565] outline-[#ECECEC]"
                }`}
              >
                <div className="w-8 h-8 flex items-center justify-center">
                  <i className="ri-map-2-line text-xl"></i>
                </div>
              </div>
            </div>

            <div className="flex justify-start items-center gap-4">
              {/* Near Me Button */}
              <div
                className={`px-2 py-1 rounded-3xl flex justify-start items-center gap-1.5 cursor-pointer ${
                  showMap
                    ? "bg-[#FFF1F2] "
                    : "bg-white outline outline-1 outline-offset-[-1px] text-[#656565] outline-[#ECECEC]"
                }`}
              >
                <i className="ri-map-pin-line text-[#343330] text-xl"></i>

                <button className="text-sm font-normal font-['Inter'] leading-tight text-[#3D3D3D] ">
                  Near me
                </button>
              </div>

              {/* Latest Button */}
              <div
                className={`px-2 py-1 rounded-3xl flex justify-start items-center gap-1 cursor-pointer ${
                  showMap
                    ? "bg-[#FFF1F2] "
                    : "bg-white outline outline-1 outline-offset-[-1px] text-[#656565] outline-[#ECECEC]"
                }`}
              >
                <button className=" text-base font-normal font-['Inter'] leading-snug text-[#3D3D3D] ">
                  Latest
                </button>
                <i className="ri-expand-up-down-line text-[#343330] text-xl"></i>
              </div>
            </div>
          </div>
          <div className="self-stretch flex flex-col justify-start items-start gap-4">
            {/* Jobs Preview */}

            {!showMap ? (
              <>
                <p className="self-stretch justify-start text-[#656565] text-sm font-normal font-['Inter'] leading-tight">
                  {jobs.length} Jobs available
                </p>
                {filteredJobs.map((job) => (
                  <div
                    key={job.id}
                    data-property-1="Job preview"
                    className="self-stretch p-6 bg-[#FFFFFF] rounded-2xl flex flex-col justify-start items-end gap-4"
                  >
                    <div className="self-stretch flex flex-col justify-start items-start gap-6">
                      <div className="self-stretch flex flex-col justify-start items-start gap-4">
                        <div className="self-stretch inline-flex justify-center items-start gap-4">
                          <div className="flex-1 inline-flex flex-col justify-start items-start gap-2">
                            <h2 className="self-stretch justify-start text-[#292929] text-xl font-bold font-['Inter'] leading-normal">
                              {job.title}
                            </h2>
                            <div className="self-stretch justify-start text-[#656565] text-sm font-normal font-['Inter'] leading-tight">
                              {job.category}
                            </div>
                          </div>
                          <div className="justify-start text-[#292929] text-xl font-bold font-['Inter'] leading-normal">
                            {job.rate}
                          </div>
                        </div>
                        <div className="self-stretch flex flex-col justify-start items-start gap-2">
                          <div className="self-stretch inline-flex justify-start items-center gap-2">
                            <i className="ri-map-pin-line text-[#656565] text-xl"></i>

                            <div className="flex-1 justify-start text-[#3D3D3D] text-sm font-normal font-['Inter'] leading-tight">
                              {job.location}
                            </div>
                          </div>
                          <div className="self-stretch justify-start text-[#3D3D3D] text-sm font-normal font-['Inter'] leading-tight">
                            Date & Time: {job.datetime}
                          </div>
                        </div>
                      </div>
                      <div className="self-stretch justify-start text-[#3D3D3D] text-base font-normal font-['Inter'] leading-snug">
                        {job.description}
                      </div>
                    </div>
                    <div className="self-stretch h-0 outline outline-1 outline-offset-[-0.50px] outline-[#F9F9F9]"></div>
                    <div className="inline-flex justify-start items-center gap-6">
                      <div className="px-6 py-3 rounded-lg outline outline-1 outline-offset-[-1px] outline-[#E61E4D] flex justify-center items-center gap-2 overflow-hidden">
                        <button className="justify-start text-[#E61E4D] text-base font-medium font-['Inter'] leading-snug">
                          Save Job
                        </button>
                        <div className="w-6 h-6 relative">
                          <i className="ri-heart-3-line text-[#E61E4D]"></i>
                        </div>
                      </div>
                      <div
                        className="px-6 py-3 bg-gradient-to-l from-pink-600 to-rose-600 rounded-lg flex justify-center items-center gap-2 overflow-hidden"
                        onClick={() =>
                          navigate("/apply-job", { state: { job } })
                        }
                      >
                        <button className="justify-start text-[#FFFFFF] text-base font-medium font-['Inter'] leading-snug">
                          Apply Now
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Pagination */}
                <div className="self-stretch flex flex-col justify-center items-end gap-2.5">
                  <div className="inline-flex justify-start items-center gap-2">
                    <div
                      data-state="Disabled"
                      className="px-3 py-2 opacity-50 rounded-lg flex justify-center items-center gap-2"
                    >
                      <i className="ri-arrow-left-line text-base text-[#656565]"></i>

                      <button className="justify-start text-[#656565] text-base font-normal font-['Inter'] leading-none">
                        Previous
                      </button>
                    </div>
                    <div className="flex justify-start items-center gap-2">
                      {[1, 2, 3, "...", 9, 10].map((n, i) => (
                        <button
                          key={i}
                          className={`px-3 py-1 rounded-md ${
                            n === 1
                              ? "bg-[#FFCCD3] text-[#292929]"
                              : "text-gray-600"
                          }`}
                        >
                          {n}
                        </button>
                      ))}
                    </div>

                    <button className="justify-start text-[#292929] text-base font-normal font-['Inter'] leading-none">
                      Next
                    </button>
                    <i className="ri-arrow-right-line"></i>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="self-stretch inline-flex justify-between items-center">
                  <p className="self-stretch justify-start text-[#656565] text-sm font-normal font-['Inter'] leading-tight">
                    {jobs.length} Jobs available
                  </p>
                  <div className="px-3 py-1 rounded-lg outline outline-1 outline-offset-[-1px] outline-[#656565] inline-flex justify-center items-center gap-2">
                    <i className="ri-search-line text-[#E61E4D] outline-none text-2xl"></i>
                    <div className="justify-start text-[#656565] text-sm font-normal font-['Inter'] leading-tight">
                      Search location, suburb
                    </div>
                  </div>
                </div>
                <MapContainer
                  center={[-28.0167, 153.4]}
                  zoom={6}
                  scrollWheelZoom={false}
                  className="w-full h-[500px] rounded-2xl z-10"
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution="&copy; OpenStreetMap contributors"
                  />
                  {geocodedJobs
                    .filter((job) => job.lat && job.lng)
                    .map((job) => (
                      <Marker
                        key={job.id}
                        position={[job.lat, job.lng]}
                        icon={redIcon}
                      >
                        <Popup>
                          <strong>{job.title}</strong>
                          <br />
                          {job.location}
                          <br />
                          {job.datetime}
                        </Popup>
                      </Marker>
                    ))}
                </MapContainer>

                <div className="w-[1022px] px-3 py-4 relative bg-[#F9F9F9] inline-flex justify-start items-center gap-3">
                  {/* ← Button */}
                  <button
                    onClick={() => scroll("left")}
                    className="absolute z-10 left-0 top-1/2 transform -translate-y-1/2 bg-white shadow-lg rounded-xl p-2"
                  >
                    <i className="ri-arrow-left-line text-red-700 text-xl"></i>
                  </button>

                  {/* Scrollable container */}
                  <div
                    ref={scrollRef}
                    className="flex gap-4 overflow-hidden scroll-smooth "
                    style={{ scrollBehavior: "smooth" }}
                  >
                    {jobs.map((job) => (
                      <div
                        key={job.id}
                        className="min-w-[350px] max-w-sm p-6 bg-white rounded-2xl flex flex-col gap-3 shadow-sm"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h2 className="text-base font-bold text-[#292929]">
                              {job.title}
                            </h2>
                            <p className="text-xs text-[#656565]">
                              {job.category}
                            </p>
                          </div>
                          <p className="text-sm font-bold text-[#292929]">
                            {job.rate}
                          </p>
                        </div>
                        <div className="flex gap-1 items-center text-sm text-[#3D3D3D]">
                          <i className="ri-map-pin-line text-[#656565] text-base"></i>
                          {job.location}
                        </div>
                        <p className="text-xs text-[#3D3D3D]">
                          Date & Time: {job.datetime}
                        </p>
                        <div className="flex justify-center items-center gap-6 mt-2">
                          <button className="px-4 py-2 border-2 font-semibold border-[#E61E4D] text-[#E61E4D] text-sm rounded-lg flex items-center gap-1">
                            Save Job <i className="ri-heart-3-line"></i>
                          </button>
                          <button
                            className="px-4 py-2 bg-gradient-to-l from-pink-600 to-rose-600 text-white text-sm rounded-lg"
                            onClick={() =>
                              navigate("/apply-job", { state: { job } })
                            }
                          >
                            Apply Now
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* → Button */}
                  <button
                    onClick={() => scroll("right")}
                    className="absolute z-10 right-0 top-1/2 transform -translate-y-1/2 bg-white shadow-[9px_0px_28.700000762939453px_-3px_rgba(52,50,50,0.25)]  rounded-xl p-2"
                  >
                    <i className="ri-arrow-right-line text-[#E61E4D] text-xl"></i>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default FindJobs;
