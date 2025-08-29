import React, { useState, useEffect } from "react";
import axios from "axios";
import { RiArrowLeftLine } from "react-icons/ri";
import BASE_URLS from "../config";

const EditPageForm = ({ isOpen, onClose, onPageSaved, categories, editItem }) => {
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [content, setContent] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [featuredImage, setFeaturedImage] = useState(null); // new file
  const [featuredImagePreview, setFeaturedImagePreview] = useState(""); // existing URL
  const [featuredHeading, setFeaturedHeading] = useState("");
  const [galleryImages, setGalleryImages] = useState([]); // new files
  const [galleryImagesPreview, setGalleryImagesPreview] = useState([]); // existing URLs
  const [partyHeading, setPartyHeading] = useState("");
  const [subpartyHeading, setSubpartyHeading] = useState("");
  const [party1, setParty1] = useState({ image: null, imagePreview: "", title: "", description: "" });
  const [party2, setParty2] = useState({ image: null, imagePreview: "", title: "", description: "" });
  const [party3, setParty3] = useState({ image: null, imagePreview: "", title: "", description: "" });
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  console.log("Edit Item:", editItem);

  useEffect(() => {
    if (editItem?._id) {
      axios
        .get(`${BASE_URLS.BACKEND_BASEURL}pages/${editItem._id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        })
        .then((res) => {
          const p = res.data;
          setTitle(p.title || "");
          setSlug(p.slug || "");
          setContent(p.content || "");
          setSelectedCategories(p.category?.map((c) => (typeof c === "string" ? c : c._id)) || []);
          setFeaturedImagePreview(p.featuredImage || "");
          setFeaturedImage(null);
          setFeaturedHeading(p.featuredHeading || "");
          setGalleryImagesPreview(p.gallery || []);
          setGalleryImages([]);
          setPartyHeading(p.partyHeading || "");
          setSubpartyHeading(p.subpartyHeading || "");
          setParty1({
            image: null,
            imagePreview: p.party_data1?.[0]?.image || "",
            title: p.party_data1?.[0]?.title || "",
            description: p.party_data1?.[0]?.description || "",
          });
          setParty2({
            image: null,
            imagePreview: p.party_data2?.[0]?.image || "",
            title: p.party_data2?.[0]?.title || "",
            description: p.party_data2?.[0]?.description || "",
          });
          setParty3({
            image: null,
            imagePreview: p.party_data3?.[0]?.image || "",
            title: p.party_data3?.[0]?.title || "",
            description: p.party_data3?.[0]?.description || "",
          });
        })
        .catch((err) => {
          console.error("Error fetching page:", err);
          alert(`Failed to load page data: ${err.response?.data?.message || err.message}`);
        });
    }
  }, [editItem]);

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setSelectedCategories([...selectedCategories, value]);
    } else {
      setSelectedCategories(selectedCategories.filter((catId) => catId !== value));
    }
  };

  const handleFeaturedImageChange = (e) => {
    const file = e.target.files[0];
    setFeaturedImage(file);
    if (file) {
      setFeaturedImagePreview(URL.createObjectURL(file));
    } else {
      setFeaturedImagePreview("");
    }
  };

  const handleGalleryChange = (e) => {
    const selectedFiles = Array.from(e.target.files);

    if (selectedFiles.length + galleryImagesPreview.length > 5) {
      alert("You can only have up to 5 gallery images.");
      e.target.value = "";
      setIsSubmitDisabled(true);
      return;
    }

    setGalleryImages(selectedFiles);
    setGalleryImagesPreview([...galleryImagesPreview, ...selectedFiles.map((f) => URL.createObjectURL(f))]);
    setIsSubmitDisabled(false);
  };

  const handlePartyImageChange = (partyNum, file) => {
    if (!file) return;
    const previewUrl = URL.createObjectURL(file);

    if (partyNum === 1) setParty1((prev) => ({ ...prev, image: file, imagePreview: previewUrl }));
    if (partyNum === 2) setParty2((prev) => ({ ...prev, image: file, imagePreview: previewUrl }));
    if (partyNum === 3) setParty3((prev) => ({ ...prev, image: file, imagePreview: previewUrl }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLoading) return;

    setIsLoading(true);

    const formDataToSend = new FormData();

    formDataToSend.append("title", title);
    formDataToSend.append("slug", slug);
    formDataToSend.append("content", content);
    formDataToSend.append("featuredHeading", featuredHeading);
    formDataToSend.append("partyHeading", partyHeading);
    formDataToSend.append("subpartyHeading", subpartyHeading);

    selectedCategories.forEach((cat) => formDataToSend.append("category", cat));

    if (featuredImage) formDataToSend.append("featuredImage", featuredImage);

    galleryImages.forEach((file) => formDataToSend.append("gallery", file));

    if (party1.image) formDataToSend.append("partyImage1", party1.image);
    if (party2.image) formDataToSend.append("partyImage2", party2.image);
    if (party3.image) formDataToSend.append("partyImage3", party3.image);

    [party1.title, party2.title, party3.title].forEach((title) => {
      if (title) formDataToSend.append("partyTitles", title);
    });

    [party1.description, party2.description, party3.description].forEach((desc) => {
      if (desc) formDataToSend.append("partyDescriptions", desc);
    });

    try {
      const response = await axios.put(`${BASE_URLS.BACKEND_BASEURL}pages/${editItem.id}`, formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      console.log("API response:", response.data);
      onPageSaved(response.data, "editPage");
      alert("Page updated successfully");
      onClose();
    } catch (error) {
      console.error("Error saving page:", error);
      alert(`Page save failed: ${error.response?.data?.message || error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="absolute inset-0 bg-zinc-400 bg-opacity-50" onClick={onClose}></div>
      <div className="relative ml-auto w-[600px] bg-white shadow-[-7px_2px_250px_32px_rgba(0,0,0,0.15)] border-l border-gray-200 flex flex-col justify-start items-start overflow-auto">
        <div className="w-full px-4 py-6 bg-white border-b border-gray-200 flex justify-start items-center gap-6">
          <button className="w-8 h-8" onClick={onClose}>
            <RiArrowLeftLine className="text-xl text-gray-600" />
          </button>
          <h2 className="flex-1 text-gray-800 text-xl font-bold font-['Inter'] leading-normal">
            Edit Page
          </h2>
        </div>
        <form onSubmit={handleSubmit} className="w-full px-4 pt-4 pb-6 flex flex-col gap-4 overflow-y-auto">
          <div className="flex flex-col gap-2">
            <label className="text-gray-700 text-base font-normal font-['Inter'] leading-snug">
              Page Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter page title"
              className="px-3 py-2 rounded-lg border border-gray-200 text-gray-600 text-sm font-normal font-['Inter'] leading-tight w-full focus:outline-none focus:ring-2 focus:ring-pink-600"
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-gray-700 text-base font-normal font-['Inter'] leading-snug">
              Slug
            </label>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="Enter slug"
              className="px-3 py-2 rounded-lg border border-gray-200 text-gray-600 text-sm font-normal font-['Inter'] leading-tight w-full focus:outline-none focus:ring-2 focus:ring-pink-600"
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-gray-700 text-base font-normal font-['Inter'] leading-snug">
              Content
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Enter page content"
              className="px-3 py-2 rounded-lg border border-gray-200 text-gray-600 text-sm font-normal font-['Inter'] leading-tight h-32 w-full focus:outline-none focus:ring-2 focus:ring-pink-600"
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-gray-700 text-base font-normal font-['Inter'] leading-snug">
              Categories
            </label>
            <div className="max-h-40 overflow-y-auto px-3 py-2 rounded-lg border border-gray-200">
              {categories.map((cat) => (
                <label key={cat.id} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    value={cat.id}
                    checked={selectedCategories.includes(cat.id)}
                    onChange={handleCheckboxChange}
                    className="text-pink-600 focus:ring-pink-600"
                  />
                  <span className="text-gray-600 text-sm font-normal font-['Inter'] leading-tight">
                    {cat.name}
                  </span>
                </label>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-gray-700 text-base font-normal font-['Inter'] leading-snug">
              Featured Image
            </label>
            {featuredImagePreview && (
              <img
                src={featuredImagePreview}
                alt="Featured Preview"
                className="w-32 h-32 object-cover rounded-lg mb-2"
              />
            )}
            <input
              type="file"
              onChange={handleFeaturedImageChange}
              accept="image/*"
              className="px-3 py-2 rounded-lg border border-gray-200 text-gray-600 text-sm font-normal font-['Inter'] leading-tight w-full focus:outline-none"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-gray-700 text-base font-normal font-['Inter'] leading-snug">
              Featured Heading
            </label>
            <input
              type="text"
              value={featuredHeading}
              onChange={(e) => setFeaturedHeading(e.target.value)}
              placeholder="Enter featured heading"
              className="px-3 py-2 rounded-lg border border-gray-200 text-gray-600 text-sm font-normal font-['Inter'] leading-tight w-full focus:outline-none focus:ring-2 focus:ring-pink-600"
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-gray-700 text-base font-normal font-['Inter'] leading-snug">
              Gallery Images (Max 5)
            </label>
            <div className="flex flex-wrap gap-2">
              {galleryImagesPreview.map((src, i) => (
                <img
                  key={i}
                  src={src}
                  alt={`Gallery Preview ${i + 1}`}
                  className="w-20 h-20 object-cover rounded-lg"
                />
              ))}
            </div>
            <input
              type="file"
              onChange={handleGalleryChange}
              accept="image/*"
              multiple
              className="px-3 py-2 rounded-lg border border-gray-200 text-gray-600 text-sm font-normal font-['Inter'] leading-tight w-full focus:outline-none"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-gray-700 text-base font-normal font-['Inter'] leading-snug">
              Party Section Heading
            </label>
            <input
              type="text"
              value={partyHeading}
              onChange={(e) => setPartyHeading(e.target.value)}
              placeholder="Enter party heading"
              className="px-3 py-2 rounded-lg border border-gray-200 text-gray-600 text-sm font-normal font-['Inter'] leading-tight w-full focus:outline-none focus:ring-2 focus:ring-pink-600"
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-gray-700 text-base font-normal font-['Inter'] leading-snug">
              Party Section Subheading
            </label>
            <input
              type="text"
              value={subpartyHeading}
              onChange={(e) => setSubpartyHeading(e.target.value)}
              placeholder="Enter sub party heading"
              className="px-3 py-2 rounded-lg border border-gray-200 text-gray-600 text-sm font-normal font-['Inter'] leading-tight w-full focus:outline-none focus:ring-2 focus:ring-pink-600"
              required
            />
          </div>
          <div className="grid grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => {
              const party = i === 1 ? party1 : i === 2 ? party2 : party3;
              const setParty = i === 1 ? setParty1 : i === 2 ? setParty2 : setParty3;
              return (
                <div key={i} className="flex flex-col gap-2">
                  <label className="text-gray-700 text-base font-normal font-['Inter'] leading-snug">
                    Party {i}
                  </label>
                  {party.imagePreview && (
                    <img
                      src={party.imagePreview}
                      alt={`Party ${i} Preview`}
                      className="w-full h-32 object-cover rounded-lg mb-2"
                    />
                  )}
                  <input
                    type="text"
                    value={party.title}
                    onChange={(e) => setParty((prev) => ({ ...prev, title: e.target.value }))}
                    placeholder={`Party ${i} Title`}
                    className="px-3 py-2 rounded-lg border border-gray-200 text-gray-600 text-sm font-normal font-['Inter'] leading-tight w-full focus:outline-none focus:ring-2 focus:ring-pink-600"
                    required
                  />
                  <textarea
                    value={party.description}
                    onChange={(e) => setParty((prev) => ({ ...prev, description: e.target.value }))}
                    placeholder={`Party ${i} Description`}
                    className="px-3 py-2 rounded-lg border border-gray-200 text-gray-600 text-sm font-normal font-['Inter'] leading-tight h-20 w-full focus:outline-none focus:ring-2 focus:ring-pink-600"
                    required
                  />
                  <input
                    type="file"
                    onChange={(e) => handlePartyImageChange(i, e.target.files[0])}
                    accept="image/*"
                    className="px-3 py-2 rounded-lg border border-gray-200 text-gray-600 text-sm font-normal font-['Inter'] leading-tight w-full focus:outline-none"
                  />
                </div>
              );
            })}
          </div>
          <div className="w-full px-4 py-6 border-t border-gray-200 flex justify-end items-center gap-4">
            <button
              type="button"
              className="px-4 py-2 rounded-lg border border-gray-600 text-rose-600 text-sm font-medium font-['Inter'] leading-tight hover:bg-gray-100"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-gradient-to-l from-pink-600 to-rose-600 rounded-lg text-white text-sm font-medium font-['Inter'] leading-tight hover:from-pink-700 hover:to-rose-700 disabled:opacity-50"
              disabled={isSubmitDisabled || isLoading}
            >
              {isLoading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPageForm;