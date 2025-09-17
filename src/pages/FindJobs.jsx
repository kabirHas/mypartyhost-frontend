import axios from "axios";
import React from "react";
import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import BASE_URLS from "../config";

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

  const [jobs, setJobs] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 5;

  const [mapCenter, setMapCenter] = useState([20.5937, 78.9629]);
  const [mapZoom, setMapZoom] = useState(3);

  const [userLocation, setUserLocation] = useState(null);
  const [nearbyJobs, setNearbyJobs] = useState(null);

  const [sortByLatest, setSortByLatest] = useState(false);

  const [locationSearch, setLocationSearch] = useState("");
  const [searchedLocationName, setSearchedLocationName] = useState("");

  const [savedJobs, setSavedJobs] = useState([]);
  const [isSaving, setIsSaving] = useState(false);

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

  const handleSortLatest = () => {
    setSortByLatest(true);
    setNearbyJobs(null); // Clear nearbyJobs to show all jobs sorted
    setCurrentPage(1); // Reset to first page
  };

  const handleSaveJob = async (jobId) => {
    if (isSaving) return;
    setIsSaving(true);
    try {
      if (!localStorage.getItem("token")) {
        // alert("Please log in to save jobs.");
        navigate("/login");
        return;
      }
      const response = await axios.post(
        `${BASE_URLS.BACKEND_BASEURL}jobs/${jobId}/saved`,
        {},
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      if (response.status === 200 || response.status === 201) {
        setSavedJobs((prev) => [...new Set([...prev, jobId])]);
        await fetchSavedJobs();
        // alert("Job saved successfully!");
      } else {
        // alert("Failed to save job. Please try again.");
      }
    } catch (error) {
      console.error("Error saving job:", error);
      if (error.response?.status === 401) {
        // alert("Session expired. Please log in again.");
        navigate("/login");
      } else if (error.response?.status === 404) {
        // alert("Job not found or endpoint incorrect. Please verify the job ID or API endpoint.");
      } else {
        // alert("Error saving job. Please try again.");
      }
    } finally {
      setIsSaving(false);
    }
  };

  const filteredJobs = sortByLatest
    ? jobs
        .filter((job) =>
          job.title.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .sort((a, b) => new Date(b.jobDate) - new Date(a.jobDate))
    : jobs.filter((job) =>
        job.title.toLowerCase().includes(searchTerm.toLowerCase())
      );

  const calculateDistance = (lat1, lng1, lat2, lng2) => {
    const R = 6371; // Earth's radius in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLng = ((lng2 - lng1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
  };

  const handleNearMe = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation([latitude, longitude]);
          setMapCenter([latitude, longitude]);
          setMapZoom(12); // Closer zoom for user location
          const nearby = jobs
            .filter((job) => job.lat && job.lng)
            .map((job) => ({
              ...job,
              distance: calculateDistance(
                latitude,
                longitude,
                job.lat,
                job.lng
              ),
            }))
            .filter((job) => job.distance <= 50) // Show jobs within 50km
            .sort((a, b) => a.distance - b.distance);
          setNearbyJobs(nearby);
          setShowMap(true); // Switch to map view
        },
        (error) => {
          console.error("Geolocation error:", error);
          //  alert("Please allow location access to use the Near Me feature.");
        }
      );
    } else {
      //  alert("Geolocation is not supported by your browser.");
    }
  };

  function MapUpdater({ center, zoom }) {
    const map = useMap();
    useEffect(() => {
      map.setView(center, zoom);
    }, [center, zoom, map]);
    return null;
  }

  const handleLocationSearch = async () => {
    if (!locationSearch) {
      setNearbyJobs(null); // fix-2: Clear location filter
      setMapCenter([20.5937, 78.9629]); // fix-2: Reset to default India coordinates
      setMapZoom(3);
      setSearchedLocationName("");
      return;
    }
    try {
      const geoResponse = await axios.get(
        `https://nominatim.openstreetmap.org/search`,
        {
          params: {
            q: locationSearch,
            format: "json",
            limit: 1,
            addressdetails: 1,
          },
          headers: {
            "User-Agent": "MyPartyHost/1.0", // fix-3: Nominatim compliance
          },
        }
      );
      if (geoResponse.data && geoResponse.data[0]) {
        const { lat, lon, display_name, address } = geoResponse.data[0];
        setMapCenter([parseFloat(lat), parseFloat(lon)]);
        setSearchedLocationName(display_name);

        // Determine location type for zoom level
        let zoomLevel = 6;
        let locationType = "suburb";
        if (address) {
          if (address.country && !address.city && !address.suburb) {
            zoomLevel = 4;
            locationType = "country";
          } else if (address.city && !address.suburb) {
            zoomLevel = 11;
            locationType = "city";
          } else if (address.suburb) {
            zoomLevel = 14;
            locationType = "suburb";
          }
        } else if (
          display_name.toLowerCase().includes("india") ||
          locationSearch.toLowerCase() === "india"
        ) {
          zoomLevel = 3;
          locationType = "country";
        }
        setMapZoom(zoomLevel);

        let locationFiltered = [];
        const searchLower = locationSearch.toLowerCase(); // fix-4: Normalize search term
        if (locationType === "country") {
          const searchedCountry = address.country
            ? address.country.toLowerCase()
            : searchLower;
          locationFiltered = jobs.filter(
            (job) =>
              job.country &&
              (job.country.toLowerCase().includes(searchedCountry) ||
                job.location.toLowerCase().includes(searchLower)) // fix-4: Fallback to location string
          );
          console.log(
            "Country search results:",
            locationFiltered.map((job) => ({
              id: job.id,
              location: job.location,
              country: job.country,
            }))
          ); // fix-5: Log country search results
        } else if (locationType === "city") {
          const searchedCity = address.city
            ? address.city.toLowerCase()
            : searchLower;
          locationFiltered = jobs
            .filter(
              (job) =>
                job.city &&
                job.lat &&
                job.lng &&
                (job.city.toLowerCase().includes(searchedCity) ||
                  job.location.toLowerCase().includes(searchLower)) // fix-4: Fallback to location string
            )
            .map((job) => ({
              ...job,
              distance: calculateDistance(
                parseFloat(lat),
                parseFloat(lon),
                job.lat,
                job.lng
              ),
            }))
            .filter((job) => job.distance <= 50)
            .sort((a, b) => a.distance - b.distance);
          console.log(
            "City search results:",
            locationFiltered.map((job) => ({
              id: job.id,
              location: job.location,
              city: job.city,
              distance: job.distance,
            }))
          ); // fix-5: Log city search results
        } else if (locationType === "suburb") {
          const searchedSuburb = address.suburb
            ? address.suburb.toLowerCase()
            : searchLower;
          locationFiltered = jobs.filter(
            (job) =>
              (job.suburb &&
                job.suburb.toLowerCase().includes(searchedSuburb)) ||
              job.location.toLowerCase().includes(searchLower) // fix-4: Fallback to location string
          );
          console.log(
            "Suburb search results:",
            locationFiltered.map((job) => ({
              id: job.id,
              location: job.location,
              suburb: job.suburb,
              lat: job.lat,
              lng: job.lng,
            }))
          ); // fix-5: Log suburb search results
        }

        setNearbyJobs(locationFiltered);
        setShowMap(true);
        console.log(
          `Set nearbyJobs for ${locationType} search:`,
          locationFiltered.length
        ); // fix-6: Log number of filtered jobs
      } else {
        console.warn(`No geocoding results for: ${locationSearch}`); // fix-7: Log no results
        setNearbyJobs([]);
        setSearchedLocationName(locationSearch);
      }
    } catch (error) {
      console.error("Location search failed:", error.message); // fix-9: Enhanced error logging
      setNearbyJobs([]);
      setSearchedLocationName(locationSearch);
    }
  };

  const fetchSavedJobs = async () => {
    try {
      const response = await axios.get(
        `${BASE_URLS.BACKEND_BASEURL}jobs/saved`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      console.log("Saved jobs response:", response.data);
      const savedJobIds = (response.data.savedJobs || response.data).map(
        (job) => job._id
      );
      setSavedJobs(savedJobIds);
    } catch (error) {
      console.error("Error fetching saved jobs:", error);
      if (error.response?.status === 401) {
        // alert("Session expired. Please log in again.");
        navigate("/login");
      } else if (error.response?.status === 404) {
        console.log("Saved jobs endpoint not found.");
        setSavedJobs([]);
      } else {
        // alert("Error fetching saved jobs. Please try again.");
        setSavedJobs([]);
      }
    }
  };

  useEffect(() => {
    if (localStorage.getItem("token")) {
      fetchSavedJobs();
    }
  }, []);

  //   useEffect(() => {
  //     const fetchJobs = async () => {
  //       try {
  //         const response = await axios.get('https://mypartyhost.onrender.com/api/jobs');
  //         const activeJobs = response.data.filter(job => job.isActive);
  //         const updatedJobs = await Promise.all(
  //           activeJobs.map(async (job) => {
  //             try {
  //               const geoResponse = await axios.get(
  //                 `https://nominatim.openstreetmap.org/search`,
  //                 {
  //                   params: {
  //                     q: `${job.suburb}, ${job.city}, ${job.country}`,
  //                     format: "json",
  //                     limit: 1,
  //                   },
  //                 }
  //               );

  //               if (geoResponse.data && geoResponse.data[0]) {
  //                 return {
  //                   ...job,
  //                   lat: parseFloat(geoResponse.data[0].lat),
  //                   lng: parseFloat(geoResponse.data[0].lon),
  //                   id: job._id,
  //                   title: job.jobTitle,
  //                   category: job.staffCategory,
  //                   location: `${job.suburb}, ${job.city}, ${job.country}`,
  //                   datetime: `${new Date(job.jobDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })} | ${new Date(`1970-01-01T${job.startTime}`).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })} – ${new Date(`1970-01-01T${job.endTime}`).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}`,
  //                   rate: `${job.currency} ${job.rateOffered}/${job.paymentType === 'hourly' ? 'h' : 'fixed'}`,
  //                   gender: job.lookingFor,
  //                   organizer: job.organiser.firstName,
  //                   description: job.jobDescription,
  //                 };
  //               } else {
  //                 return {
  //                   ...job,
  //                   id: job._id,
  //                   title: job.jobTitle,
  //                   category: job.staffCategory,
  //                   location: `${job.suburb}, ${job.city}, ${job.country}`,
  //                   datetime: `${new Date(job.jobDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })} | ${new Date(`1970-01-01T${job.startTime}`).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })} – ${new Date(`1970-01-01T${job.endTime}`).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}`,
  //                   rate: `${job.currency} ${job.rateOffered}/${job.paymentType === 'hourly' ? 'h' : 'fixed'}`,

  //                   gender: job.lookingFor,
  //                   organizer: job.organiser.firstName,
  //                   description: job.jobDescription,
  //                 };
  //               }
  //             } catch (error) {
  //               console.error("Geocoding failed for:", job.location, error);
  //               return {
  //                 ...job,
  //                 id: job._id,
  //                 title: job.jobTitle,
  //                 category: job.staffCategory,
  //                 location: `${job.suburb}, ${job.city}, ${job.country}`,
  //                 datetime: `${new Date(job.jobDate).toLocaleDateString('en-US', { weekday: 'short', month: 'long', day: 'numeric', year: 'numeric' })} | ${job.startTime} – ${job.endTime}`,
  //                 rate: `${job.currency}${job.rateOffered}/${job.paymentType === 'hourly' ? 'h' : 'fixed'}`,
  //                 gender: job.lookingFor,
  //                 organizer: job.organiser.firstName,
  //                 description: job.jobDescription,
  //               };
  //             }
  //           })
  //         );

  //         const validJobs = updatedJobs.filter(job => job.lat && job.lng);
  //       if (validJobs.length > 0) {
  //         const avgLat = validJobs.reduce((sum, job) => sum + job.lat, 0) / validJobs.length;
  //         const avgLng = validJobs.reduce((sum, job) => sum + job.lng, 0) / validJobs.length;
  //         setMapCenter([avgLat, avgLng]);
  //         setMapZoom(7);
  //       }

  //         setGeocodedJobs(updatedJobs);
  //         setJobs(updatedJobs);
  //       } catch (error) {
  //         console.error("Failed to fetch jobs:", error);
  //       }
  //     };
  //   fetchJobs();
  // }, []);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios.get(`${BASE_URLS.BACKEND_BASEURL}jobs`);
        const currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0);
        const activeJobs = response.data.filter((job) => {
          if (!job.isActive) return false;
          const jobDate = new Date(job.jobDate);
          jobDate.setHours(0, 0, 0, 0);
          return jobDate >= currentDate;
        });
        console.log(
          "Filtered jobs:",
          activeJobs.map((job) => ({
            id: job._id,
            jobDate: job.jobDate,
            parsedDate: new Date(job.jobDate).toISOString(),
            location: `${job.suburb || ""}, ${job.city || ""}, ${
              job.country || ""
            }`,
          }))
        );

        const formatJob = (job, lat = null, lng = null) => ({
          id: job._id,
          title: job.jobTitle,
          category: job.staffCategory,
          location: `${job.suburb || ""}, ${job.city || ""}, ${
            job.country || ""
          }`,
          datetime: `${new Date(job.jobDate).toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
            year: "numeric",
          })} | ${new Date(`1970-01-01T${job.startTime}`).toLocaleTimeString(
            "en-US",
            { hour: "numeric", minute: "2-digit", hour12: true }
          )} – ${new Date(`1970-01-01T${job.endTime}`).toLocaleTimeString(
            "en-US",
            { hour: "numeric", minute: "2-digit", hour12: true }
          )}`,
          rate: `${job.currency} ${job.rateOffered}/${
            job.paymentType === "hourly" ? "h" : "fixed"
          }`,
          gender: job.lookingFor,
          organiser: {
            name: job.organiser.name || "Unknown Organizer",
            email: job.organiser.email || "Not provided",
            phone: job.organiser.phone || "Not provided",
            city: job.organiser.city || "Unknown",
            country: job.organiser.country || "Unknown",
            profileImage:
              job.organiser.profileImage || "https://placehold.co/48x48",
            reviews: job.organiser.reviews || [],
            rating: job.organiser.rating || "0",
          },
          description: job.jobDescription,
          lat,
          lng,
          currency: job.currency,
          paymentType: job.paymentType,
          jobDate: job.jobDate,
          suburb: job.suburb,
          city: job.city,
          country: job.country,
        });

        const updatedJobs = [];
        for (const job of activeJobs) {
          try {
            let geoResponse = await axios.get(
              `https://nominatim.openstreetmap.org/search`,
              {
                params: {
                  q: `${job.suburb || ""}${job.suburb ? "," : ""} ${
                    job.city || ""
                  }${job.city ? "," : ""} ${job.country || ""}`
                    .trim()
                    .replace(/,+/g, ","),
                  format: "json",
                  limit: 1,
                },
                headers: {
                  "User-Agent": "MyPartyHost/1.0",
                },
              }
            );
            if (geoResponse.data && geoResponse.data[0]) {
              updatedJobs.push(
                formatJob(
                  job,
                  parseFloat(geoResponse.data[0].lat),
                  parseFloat(geoResponse.data[0].lon)
                )
              );
              console.log(
                `Geocoding success for ${job.suburb || ""}, ${
                  job.city || ""
                }, ${job.country || ""}:`,
                {
                  lat: parseFloat(geoResponse.data[0].lat),
                  lng: parseFloat(geoResponse.data[0].lon),
                  jobId: job._id,
                }
              );
            } else {
              console.warn(
                `Geocoding failed for ${job.suburb || ""}, ${job.city || ""}, ${
                  job.country || ""
                }: No results, retrying with city and country`
              ); // comment-4: Improved logging for retry
              // Retry with city and country only
              geoResponse = await axios.get(
                `https://nominatim.openstreetmap.org/search`,
                {
                  params: {
                    q: `${job.city || ""}${job.city ? "," : ""} ${
                      job.country || ""
                    }`
                      .trim()
                      .replace(/,+/g, ","),
                    format: "json",
                    limit: 1,
                  },
                  headers: {
                    "User-Agent": "MyPartyHost/1.0",
                  },
                }
              );
              if (geoResponse.data && geoResponse.data[0]) {
                updatedJobs.push(
                  formatJob(
                    job,
                    parseFloat(geoResponse.data[0].lat),
                    parseFloat(geoResponse.data[0].lon)
                  )
                );
                console.log(
                  `Geocoding success on retry for ${job.city || ""}, ${
                    job.country || ""
                  }:`,
                  {
                    lat: parseFloat(geoResponse.data[0].lat),
                    lng: parseFloat(geoResponse.data[0].lon),
                    jobId: job._id,
                  }
                );
              } else {
                console.warn(
                  `Geocoding failed for ${job.city || ""}, ${
                    job.country || ""
                  }: No results`
                ); // comment-6: Log final geocoding failure
                updatedJobs.push(formatJob(job));
              }
            }
          } catch (error) {
            console.error(
              `Geocoding error for ${job.suburb || ""}, ${job.city || ""}, ${
                job.country || ""
              }:`,
              error.message
            ); // comment-7: Enhanced error logging
            updatedJobs.push(formatJob(job));
          }
        }

        const validJobs = updatedJobs.filter((job) => job.lat && job.lng);
        let center = [20.5937, 78.9629]; // default India coords
        let zoom = 3;
        if (validJobs.length > 0) {
          const avgLat =
            validJobs.reduce((sum, job) => sum + job.lat, 0) / validJobs.length;
          const avgLng =
            validJobs.reduce((sum, job) => sum + job.lng, 0) / validJobs.length;
          center = [avgLat, avgLng];
          zoom = 7;
        }

        // User location geocoding
        const userData = localStorage.getItem("token")
          ? JSON.parse(localStorage.getItem("userData"))
          : null;
        if (userData) {
          let userQuery = `${userData.suburb || ""}${
            userData.suburb ? "," : ""
          } ${userData.city || ""}${userData.city ? "," : ""} ${
            userData.state || ""
          }`
            .trim()
            .replace(/,+/g, ",");
          let geocoded = false;
          if (userQuery) {
            try {
              const geoResponse = await axios.get(
                `https://nominatim.openstreetmap.org/search`,
                {
                  params: {
                    q: userQuery,
                    format: "json",
                    limit: 1,
                    addressdetails: 1,
                  },
                  headers: {
                    "User-Agent": "MyPartyHost/1.0",
                  },
                }
              );
              if (geoResponse.data && geoResponse.data[0]) {
                const { lat, lon, address } = geoResponse.data[0];
                center = [parseFloat(lat), parseFloat(lon)];
                zoom = 4;
                if (address) {
                  if (address.country && !address.city && !address.suburb) {
                    zoom = 4; // Country
                  } else if (address.city && !address.suburb) {
                    zoom = 11; // City
                  } else if (address.suburb) {
                    zoom = 14; // Suburb
                  }
                }
                geocoded = true;
              }
            } catch (error) {
              console.error("User full location geocoding failed:", error);
            }
          }

          if (!geocoded && userData.country) {
            try {
              const geoResponse = await axios.get(
                `https://nominatim.openstreetmap.org/search`,
                {
                  params: {
                    q: userData.country,
                    format: "json",
                    limit: 1,
                    addressdetails: 1,
                  },
                  headers: {
                    "User-Agent": "MyPartyHost/1.0",
                  },
                }
              );
              if (geoResponse.data && geoResponse.data[0]) {
                const { lat, lon } = geoResponse.data[0];
                center = [parseFloat(lat), parseFloat(lon)];
                zoom = 2; // Country level
              }
            } catch (error) {
              console.error("User country geocoding failed:", error);
            }
          }
        }

        setMapCenter(center);
        setMapZoom(zoom);
        setGeocodedJobs(updatedJobs);
        setJobs(updatedJobs);
        console.log(
          "Jobs set to state:",
          updatedJobs.map((job) => ({
            id: job.id,
            lat: job.lat,
            lng: job.lng,
            location: job.location,
          }))
        );
      } catch (error) {
        console.error("Failed to fetch jobs:", error);
      }
    };
    fetchJobs();
  }, []);

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
              placeholder="Search jobs by title"
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
                onClick={handleNearMe}
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
              {/* <div onClick={handleSortLatest} className={`px-2 py-1 rounded-3xl flex justify-start items-center gap-1 cursor-pointer ${ sortByLatest && !showMap
                    ? "bg-[#FFF1F2]"
                    : "bg-white outline outline-1 outline-offset-[-1px] text-[#656565] outline-[#ECECEC]"
                }`}
              > */}
              <div
                onClick={handleSortLatest}
                className={`px-2 py-1 rounded-3xl flex justify-start items-center gap-1 cursor-pointer
                  ${
                    sortByLatest && !showMap
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
                {(nearbyJobs || filteredJobs)
                  .slice(
                    (currentPage - 1) * jobsPerPage,
                    currentPage * jobsPerPage
                  )
                  .map((job) => (
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
                        {/* <div className="px-6 py-3 rounded-lg outline outline-1 outline-offset-[-1px] outline-[#E61E4D] flex justify-center items-center gap-2 overflow-hidden"> */}
                        <div
                          className={`px-6 py-3 rounded-lg outline outline-1 outline-offset-[-1px] flex justify-center items-center gap-2 overflow-hidden ${
                            savedJobs.includes(job.id)
                              ? "bg-[#FFF1F2] outline-[#E61E4D] text-[#E61E4D]"
                              : "outline-[#E61E4D] text-[#E61E4D]"
                          }`}
                          onClick={() => handleSaveJob(job.id)}
                        >
                          <button className="justify-start text-base font-medium font-['Inter'] leading-snug">
                            {savedJobs.includes(job.id) ? "Saved" : "Save Job"}
                          </button>
                          {/* <button className="justify-start text-[#E61E4D] text-base font-medium font-['Inter'] leading-snug">
                          Save Job
                        </button> */}
                          <div className="w-6 h-6 relative">
                            <i
                              className={`ri-heart-3-${
                                savedJobs.includes(job.id) ? "fill" : "line"
                              } text-[#E61E4D]`}
                            ></i>
                            {/* <i className="ri-heart-3-line text-[#E61E4D]"></i> */}
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
                    {/* <div
                      data-state="Disabled"
                      className="px-3 py-2 opacity-50 rounded-lg flex justify-center items-center gap-2" 
                    > */}
                    <div
                      className={`px-3 py-2 rounded-lg flex justify-center items-center gap-2 ${
                        currentPage === 1
                          ? "opacity-50 cursor-not-allowed"
                          : "cursor-pointer"
                      }`}
                      onClick={() =>
                        currentPage > 1 && setCurrentPage(currentPage - 1)
                      }
                    >
                      <i className="ri-arrow-left-line text-base text-[#656565]"></i>

                      <button className="justify-start text-[#656565] text-base font-normal font-['Inter'] leading-none">
                        Previous
                      </button>
                    </div>
                    <div className="flex justify-start items-center gap-2">
                      {Array.from(
                        {
                          length: Math.ceil(filteredJobs.length / jobsPerPage),
                        },
                        (_, i) => i + 1
                      ).map((n) => (
                        <button
                          key={n}
                          onClick={() => setCurrentPage(n)}
                          className={`px-3 py-1 rounded-md ${
                            n === currentPage
                              ? "bg-[#FFCCD3] text-[#292929]"
                              : "text-gray-600"
                          }`}
                        >
                          {n}
                        </button>
                      ))}
                      {/* {[1, 2, 3, "...", 9, 10].map((n, i) => (
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
                      ))} */}
                    </div>
                    <div
                      className={`px-3 py-2 rounded-lg flex justify-center items-center gap-2 ${
                        currentPage ===
                        Math.ceil(filteredJobs.length / jobsPerPage)
                          ? "opacity-50 cursor-not-allowed"
                          : "cursor-pointer"
                      }`}
                      onClick={() =>
                        currentPage <
                          Math.ceil(filteredJobs.length / jobsPerPage) &&
                        setCurrentPage(currentPage + 1)
                      }
                    >
                      <button className="justify-start text-[#292929] text-base font-normal font-['Inter'] leading-none">
                        Next
                      </button>
                      <i className="ri-arrow-right-line"></i>
                    </div>
                  </div>
                </div>
              </>
            ) : showMap && mapCenter && mapZoom ? (
              <>
                <div className="self-stretch inline-flex justify-between items-center">
                  <p className="self-stretch justify-start text-[#656565] text-sm font-normal font-['Inter'] leading-tight">
                    {/* {jobs.length} Jobs available */}
                    {(nearbyJobs || geocodedJobs).length} Jobs available
                  </p>
                  <div className="px-3 py-1 rounded-lg outline outline-1 outline-offset-[-1px] outline-[#656565] inline-flex justify-center items-center gap-2">
                    <i className="ri-search-line text-[#E61E4D] outline-none text-2xl"></i>
                    <input
                      type="text"
                      value={locationSearch}
                      onChange={(e) => setLocationSearch(e.target.value)}
                      onKeyPress={(e) =>
                        e.key === "Enter" && handleLocationSearch()
                      }
                      placeholder="Search location, suburb"
                      className="bg-transparent focus:outline-none text-[#656565] text-sm font-normal font-['Inter'] leading-tight"
                    ></input>
                  </div>
                </div>
                <MapContainer
                  center={mapCenter}
                  zoom={mapZoom}
                  scrollWheelZoom={true}
                  className="w-full h-[500px] rounded-2xl z-10"
                >
                  <MapUpdater center={mapCenter} zoom={mapZoom} />
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution="&copy; OpenStreetMap contributors"
                  />
                  {(() => {
                    const jobsToDisplay = nearbyJobs || geocodedJobs;
                    console.log(
                      "Jobs displayed on map:",
                      jobsToDisplay
                        .filter((job) => job.lat && job.lng)
                        .map((job) => ({
                          id: job.id,
                          lat: job.lat,
                          lng: job.lng,
                          location: job.location,
                        }))
                    ); // comment-6: Log jobs being displayed on the map
                    return jobsToDisplay
                      .filter((job) => job.lat && job.lng)
                      .map((job) => (
                        <Marker
                          key={job.id}
                          position={[job.lat, job.lng]}
                          icon={redIcon}
                        >
                          <Popup>
                            <Link to="/job/${job.id}">{job.title}</Link>
                            <br />
                            {job.location}
                            <br />
                            {job.datetime}
                          </Popup>
                        </Marker>
                      ));
                  })()}
                  {(() => {
                    const jobsToDisplay = nearbyJobs || geocodedJobs;
                    console.log(
                      "Jobs displayed on map:",
                      jobsToDisplay
                        .filter((job) => job.lat && job.lng)
                        .map((job) => ({
                          id: job.id,
                          lat: job.lat,
                          lng: job.lng,
                          location: job.location,
                        }))
                    );
                    return jobsToDisplay
                      .filter((job) => job.lat && job.lng)
                      .map((job) => (
                        <Marker
                          key={job.id}
                          position={[job.lat, job.lng]}
                          icon={redIcon}
                        >
                          <Popup>
                            <Link
                              className="text-black font-bold text-decoration-none"
                              to={`/bookings/${job.id}`}
                            >
                              {job.title}
                            </Link>
                            <br />
                            {job.location}
                            <br />
                            {job.datetime}
                          </Popup>
                        </Marker>
                      ));
                  })()}
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
                    {nearbyJobs && nearbyJobs.length === 0 ? (
                      <div className="w-full text-center py-4">
                        <p className="text-[#3D3D3D] text-base font-normal font-['Inter'] leading-snug">
                          No jobs available in{" "}
                          {searchedLocationName || "this location"}.
                        </p>
                      </div>
                    ) : (
                      <>
                        {(nearbyJobs || jobs).map((job) => (
                          <div
                            key={job.id}
                            className="min-w-[350px] max-w-sm p-6 bg-white rounded-2xl flex flex-col gap-3 shadow-sm"
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <Link to={`/bookings/${job.id}`}  className="text-base font-bold text-decoration-none text-[#292929]">
                                  {job.title}
                                </Link>
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
                              {/* <button className="px-4 py-2 border-2 font-semibold border-[#E61E4D] text-[#E61E4D] text-sm rounded-lg flex items-center gap-1">
                            Save Job <i className="ri-heart-3-line"></i>
                          </button> */}

                              <button
                                className={`px-4 py-2 border-2 font-semibold border-[#E61E4D] text-[#E61E4D] text-sm rounded-lg flex items-center gap-1 ${
                                  savedJobs.includes(job.id)
                                    ? "bg-[#FFF1F2]"
                                    : ""
                                }`}
                                onClick={() => handleSaveJob(job.id)}
                              >
                                {savedJobs.includes(job.id)
                                  ? "Saved"
                                  : "Save Job"}
                                <i
                                  className={`ri-heart-3-${
                                    savedJobs.includes(job.id) ? "fill" : "line"
                                  }`}
                                ></i>
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
                      </>
                    )}
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
            ) : (
              <p>Loading map...</p> // Change 6
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default FindJobs;
