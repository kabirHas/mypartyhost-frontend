import React, { useState, useEffect } from "react";
import axios from "axios";
import { RiArrowLeftLine } from "react-icons/ri";
import BASE_URLS from "../config";

const AddPageForm = ({ isOpen, onClose, onPageSaved, categories }) => {
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [content, setContent] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [featuredImage, setFeaturedImage] = useState(null);
  const [featuredHeading, setFeaturedHeading] = useState("");
  const [galleryImages, setGalleryImages] = useState([]);
  const [partyHeading, setPartyHeading] = useState("");
  const [subpartHeading, setSubPartHeading] = useState("");
  const [party1, setParty1] = useState({
    image: null,
    title: "",
    description: "",
  });
  const [party2, setParty2] = useState({
    image: null,
    title: "",
    description: "",
  });
  const [party3, setParty3] = useState({
    image: null,
    title: "",
    description: "",
  });
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Auto-generate slug from title
  useEffect(() => {
    const generateSlug = (text) => {
      return text
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
    };
    setSlug(generateSlug(title));
  }, [title]);

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setSelectedCategories([...selectedCategories, value]);
    } else {
      setSelectedCategories(
        selectedCategories.filter((catId) => catId !== value)
      );
    }
  };

  const handleImageChange = (e) => {
    setFeaturedImage(e.target.files[0]);
  };

  const handleGalleryChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (selectedFiles.length > 5) {
      alert("You can only select up to 5 images.");
      setIsSubmitDisabled(true);
      return;
    }
    setGalleryImages(selectedFiles);
    setIsSubmitDisabled(false);
  };

  const handlePartyImageChange = (party, file) => {
    if (party === "party1") {
      setParty1((prev) => ({ ...prev, image: file }));
    } else if (party === "party2") {
      setParty2((prev) => ({ ...prev, image: file }));
    } else if (party === "party3") {
      setParty3((prev) => ({ ...prev, image: file }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("slug", slug);
    formData.append("content", content);
    formData.append("featuredHeading", featuredHeading);
    formData.append("partyHeading", partyHeading);
    formData.append("subpartyHeading", subpartHeading);

    if (featuredImage) {
      formData.append("featuredImage", featuredImage);
    }

    selectedCategories.forEach((cat) => formData.append("category", cat));

    galleryImages.forEach((file) => formData.append("gallery", file));

    [party1, party2, party3].forEach((party) => {
      if (party.image) formData.append("partyImages", party.image);
      formData.append("partyTitles", party.title);
      formData.append("partyDescriptions", party.description);
    });

    try {
      const response = await axios.post(
        `${BASE_URLS.BACKEND_BASEURL}pages`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log("API response:", response.data);
      onPageSaved(response.data, "addPage");
      onClose();
    } catch (error) {
      console.error("Error creating page:", error);
      alert(
        "Page creation failed: " +
          (error.response?.data?.message || error.message)
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      <div
        className="absolute inset-0 bg-zinc-400 bg-opacity-50"
        onClick={onClose}
      ></div>
      <div className="relative ml-auto w-[600px] bg-white shadow-[-7px_2px_250px_32px_rgba(0,0,0,0.15)] border-l border-gray-200 flex flex-col justify-start items-start overflow-auto">
        <div className="w-full px-4 py-6 bg-white border-b border-gray-200 flex justify-start items-center gap-6">
          <button className="w-8 h-8" onClick={onClose}>
            <RiArrowLeftLine className="text-xl text-gray-600" />
          </button>
          <h2 className="flex-1 text-gray-800 text-xl font-bold font-['Inter'] leading-normal">
            Add Page
          </h2>
        </div>
        <form
          onSubmit={handleSubmit}
          className="w-full px-4 pt-4 pb-6 flex flex-col gap-4 overflow-y-auto"
          encType="multipart/form-data"
        >
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
              placeholder="Enter slug (auto-generated)"
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
            {featuredImage && (
              <img
                src={URL.createObjectURL(featuredImage)}
                alt="Featured Preview"
                className="w-32 h-32 object-cover rounded-lg mb-2"
              />
            )}
            <input
              type="file"
              onChange={handleImageChange}
              accept="image/*"
              className="px-3 py-2 rounded-lg border border-gray-200 text-gray-600 text-sm font-normal font-['Inter'] leading-tight w-full focus:outline-none"
              required
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
              {galleryImages.map((file, i) => (
                <img
                  key={i}
                  src={URL.createObjectURL(file)}
                  alt={`Gallery Preview ${i + 1}`}
                  className="w-20 h-20 object-cover rounded-lg"
                />
              ))}
            </div>
            <input
              type="file"
              multiple
              onChange={handleGalleryChange}
              accept="image/*"
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
              value={subpartHeading}
              onChange={(e) => setSubPartHeading(e.target.value)}
              placeholder="Enter sub party heading"
              className="px-3 py-2 rounded-lg border border-gray-200 text-gray-600 text-sm font-normal font-['Inter'] leading-tight w-full focus:outline-none focus:ring-2 focus:ring-pink-600"
              required
            />
          </div>
          <div className="grid grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex flex-col gap-2">
                <label className="text-gray-700 text-base font-normal font-['Inter'] leading-snug">
                  Party {i}
                </label>
                {eval(`party${i}`).image && (
                  <img
                    src={URL.createObjectURL(eval(`party${i}`).image)}
                    alt={`Party ${i} Preview`}
                    className="w-full h-32 object-cover rounded-lg mb-2"
                  />
                )}
                <input
                  type="text"
                  value={eval(`party${i}`).title}
                  onChange={(e) =>
                    eval(`setParty${i}`)((prev) => ({
                      ...prev,
                      title: e.target.value,
                    }))
                  }
                  placeholder={`Party ${i} Title`}
                  className="px-3 py-2 rounded-lg border border-gray-200 text-gray-600 text-sm font-normal font-['Inter'] leading-tight w-full focus:outline-none focus:ring-2 focus:ring-pink-600"
                  required
                />
                <textarea
                  value={eval(`party${i}`).description}
                  onChange={(e) =>
                    eval(`setParty${i}`)((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  placeholder={`Party ${i} Description`}
                  className="px-3 py-2 rounded-lg border border-gray-200 text-gray-600 text-sm font-normal font-['Inter'] leading-tight h-20 w-full focus:outline-none focus:ring-2 focus:ring-pink-600"
                  required
                />
                <input
                  type="file"
                  onChange={(e) =>
                    handlePartyImageChange(`party${i}`, e.target.files[0])
                  }
                  accept="image/*"
                  className="px-3 py-2 rounded-lg border border-gray-200 text-gray-600 text-sm font-normal font-['Inter'] leading-tight w-full focus:outline-none"
                  required
                />
              </div>
            ))}
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
              {isLoading ? "Saving..." : "Create Page"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPageForm;
