import React, { useState, useEffect } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";
import "../asset/css/CreatePage.css";
import { RiArrowLeftLine } from "react-icons/ri";

const CreatePage = ({ onClose,isOpen, onPageSaved }) => {
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [content, setContent] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [featuredImage, setFeaturedImage] = useState(null);
  const [featuredHeading, setFeaturedHeading] = useState("");
  const [galleryImages, setGalleryImages] = useState([]);
  const [partyHeading, setPartyHeading] = useState("");
  const [subpartHeading, setSubPartHeading] = useState("");
  // Separate states for party data
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

  const navigate = useNavigate();

  // Load categories from backend
  useEffect(() => {
    API.get("/categories").then((res) => setCategories(res.data));
  }, []);

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
      e.target.value = "";
      setIsSubmitDisabled(true);
      return;
    }

    setGalleryImages(selectedFiles);
    setIsSubmitDisabled(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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

    // Append party data
    [party1, party2, party3].forEach((party, i) => {
      if (party.image) formData.append("partyImages", party.image);
      formData.append("partyTitles", party.title);
      formData.append("partyDescriptions", party.description);
    });

    try {
     let res =  await API.post("/pages", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("Page created:", res.data);
      onPageSaved(res.data,'addPage');
      onClose();
      // navigate("/dashboard/all-pages");
    } catch (error) {
      console.error("Error creating page:", error);
      alert("Page creation failed.");
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
          encType="multipart/form-data"
          className="create-page-form p-6"
        >
          {/* <h2>Create Page</h2> */}

          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
            type="text"
            required
          />

          <input type="hidden" value={slug} />

          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Content"
            required
          />

          <div>
            <p>Select Categories:</p>
            <div className="for-scrolls">
              {categories.map((cat) => (
                <label key={cat._id}>
                  <input
                    type="checkbox"
                    value={cat._id}
                    checked={selectedCategories.includes(cat._id)}
                    onChange={handleCheckboxChange}
                  />
                  {cat.name}
                </label>
              ))}
            </div>
          </div>

          <div>
            <p>Featured Image:</p>
            {featuredImage && (
              <img
                src={URL.createObjectURL(featuredImage)}
                alt="Featured Preview"
                style={{
                  width: "200px",
                  height: "auto",
                  marginBottom: "10px",
                  objectFit: "cover",
                }}
              />
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              required
            />
          </div>

          <input
            value={featuredHeading}
            onChange={(e) => setFeaturedHeading(e.target.value)}
            placeholder="Featured In Section Heading"
            type="text"
            required
          />

          <div>
            <p>Gallery Images (max 5):</p>
            <div
              style={{
                display: "flex",
                gap: "10px",
                flexWrap: "wrap",
                marginBottom: "10px",
              }}
            >
              {galleryImages.map((file, i) => (
                <img
                  key={i}
                  src={URL.createObjectURL(file)}
                  alt={`Gallery Preview ${i + 1}`}
                  style={{
                    width: "100px",
                    height: "100px",
                    objectFit: "cover",
                    borderRadius: "4px",
                  }}
                />
              ))}
            </div>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleGalleryChange}
            />
          </div>

          <input
            value={partyHeading}
            onChange={(e) => setPartyHeading(e.target.value)}
            placeholder="Party Section Heading"
            type="text"
            required
          />

          <input
            value={subpartHeading}
            onChange={(e) => setSubPartHeading(e.target.value)}
            placeholder="Party Section Subheading"
            type="text"
            required
          />

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "20px",
            }}
          >
            <div>
              <h3>Party 1</h3>
              <input
                type="text"
                value={party1.title}
                onChange={(e) =>
                  setParty1((prev) => ({ ...prev, title: e.target.value }))
                }
                placeholder="Title"
                required
              />
              <textarea
                value={party1.description}
                onChange={(e) =>
                  setParty1((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                placeholder="Description"
                required
              />
              {party1?.image instanceof Blob && (
                <img
                  src={URL.createObjectURL(party1.image)}
                  alt={`Party Preview`}
                  style={{
                    width: "100%",
                    height: "auto",
                    marginBottom: "10px",
                    objectFit: "cover",
                  }}
                />
              )}

              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setParty1((prev) => ({ ...prev, image: e.target.files[0] }))
                }
                required
              />
            </div>

            <div>
              <h3>Party 2</h3>
              <input
                type="text"
                value={party2.title}
                onChange={(e) =>
                  setParty2((prev) => ({ ...prev, title: e.target.value }))
                }
                placeholder="Title"
                required
              />
              <textarea
                value={party2.description}
                onChange={(e) =>
                  setParty2((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                placeholder="Description"
                required
              />
              {party2?.image instanceof Blob && (
                <img
                  src={URL.createObjectURL(party2.image)}
                  alt={`Party Preview`}
                  style={{
                    width: "100%",
                    height: "auto",
                    marginBottom: "10px",
                    objectFit: "cover",
                  }}
                />
              )}
              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setParty2((prev) => ({ ...prev, image: e.target.files[0] }))
                }
                required
              />
            </div>

            <div>
              <h3>Party 3</h3>
              <input
                type="text"
                value={party3.title}
                onChange={(e) =>
                  setParty3((prev) => ({ ...prev, title: e.target.value }))
                }
                placeholder="Title"
                required
              />
              <textarea
                value={party3.description}
                onChange={(e) =>
                  setParty3((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                placeholder="Description"
                required
              />
              {party3?.image instanceof Blob && (
                <img
                  src={URL.createObjectURL(party3.image)}
                  alt={`Party Preview`}
                  style={{
                    width: "100%",
                    height: "auto",
                    marginBottom: "10px",
                    objectFit: "cover",
                  }}
                />
              )}
              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setParty3((prev) => ({ ...prev, image: e.target.files[0] }))
                }
                required
              />
            </div>
          </div>

          <button type="submit" disabled={isSubmitDisabled}>
            Create
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreatePage;
