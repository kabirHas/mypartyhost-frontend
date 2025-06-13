import React, { useState, useEffect } from "react";
import API from "../api";
import { useNavigate, useParams } from "react-router-dom";
import "../asset/css/CreatePage.css";
import Notify from "../utils/notify";

const UpdatePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [content, setContent] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [categories, setCategories] = useState([]);

  const [featuredImage, setFeaturedImage] = useState(null); // new file
  const [featuredImagePreview, setFeaturedImagePreview] = useState(""); // existing URL

  const [featuredHeading, setFeaturedHeading] = useState("");

  const [galleryImages, setGalleryImages] = useState([]); // new files
  const [galleryImagesPreview, setGalleryImagesPreview] = useState([]); // existing URLs

  const [partyHeading, setPartyHeading] = useState("");
  const [subpartHeading, setSubPartHeading] = useState("");

  // Party states for 3 parties: each has image (new file or existing URL), title, description
  const [party1, setParty1] = useState({ image: null, imagePreview: "", title: "", description: "" });
  const [party2, setParty2] = useState({ image: null, imagePreview: "", title: "", description: "" });
  const [party3, setParty3] = useState({ image: null, imagePreview: "", title: "", description: "" });

  const [isSubmitDisabled, setIsSubmitDisabled] = useState(false);

  // Load categories from backend
  useEffect(() => {
    API.get("/categories").then((res) => setCategories(res.data));
  }, []);

  // Load page data by id
  useEffect(() => {
    API.get(`/pages/${id}`)
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
        setSubPartHeading(p.subpartyHeading || "");

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
        Notify.error("Failed to load page data");
        console.error(err);
      });
  }, [id]);

  // // Auto-generate slug from title
  // useEffect(() => {
  //   const generateSlug = (text) => {
  //     return text
  //       .toLowerCase()
  //       .trim()
  //       .replace(/[^a-z0-9]+/g, "-")
  //       .replace(/^-+|-+$/g, "");
  //   };
  //   setSlug(generateSlug(title));
  // }, [title]);

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

    if (selectedFiles.length > 5) {
      Notify.error("You can only select up to 5 images.");
      e.target.value = "";
      setIsSubmitDisabled(true);
      return;
    }

    setGalleryImages(selectedFiles);
    setGalleryImagesPreview(selectedFiles.map((f) => URL.createObjectURL(f)));
    setIsSubmitDisabled(false);
  };

  // Party image change handlers
  const handlePartyImageChange = (partyNum, file) => {
    if (!file) return;
    const previewUrl = URL.createObjectURL(file);

    if (partyNum === 1) setParty1((prev) => ({ ...prev, image: file, imagePreview: previewUrl }));
    if (partyNum === 2) setParty2((prev) => ({ ...prev, image: file, imagePreview: previewUrl }));
    if (partyNum === 3) setParty3((prev) => ({ ...prev, image: file, imagePreview: previewUrl }));
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

    selectedCategories.forEach((cat) => formData.append("category", cat));

    if (featuredImage) formData.append("featuredImage", featuredImage);

    if (galleryImages.length > 0) {
      galleryImages.forEach((file) => formData.append("gallery", file));
    }

    // Append party data - images + titles + descriptions
    // For images, only append if new file selected, else backend will keep old URL
    if (party1.image) formData.append("partyImage1", party1.image);
    if (party2.image) formData.append("partyImage2", party2.image);
    if (party3.image) formData.append("partyImage3", party3.image);

    formData.append("partyTitles", party1.title);
    formData.append("partyTitles", party2.title);
    formData.append("partyTitles", party3.title);

    formData.append("partyDescriptions", party1.description);
    formData.append("partyDescriptions", party2.description);
    formData.append("partyDescriptions", party3.description);

    try {
      await API.put(`/pages/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      Notify.success("Page updated successfully");
      navigate("/dashboard");
    } catch (error) {
      console.error("Error updating page:", error);
      Notify.error("Page update failed.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      encType="multipart/form-data"
      className="create-page-form"
    >
      <h2>Update Page</h2>

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
        {featuredImagePreview && (
          <img
            src={featuredImagePreview}
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
          onChange={handleFeaturedImageChange}
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
          {galleryImagesPreview.map((src, i) => (
            <img
              key={i}
              src={src}
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
          marginTop: "20px",
        }}
      >
        {/* Party 1 */}
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
              setParty1((prev) => ({ ...prev, description: e.target.value }))
            }
            placeholder="Description"
            required
          />
          {party1.imagePreview && (
            <img
              src={party1.imagePreview}
              alt="Party 1 Preview"
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
            onChange={(e) => handlePartyImageChange(1, e.target.files[0])}
          />
        </div>

        {/* Party 2 */}
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
              setParty2((prev) => ({ ...prev, description: e.target.value }))
            }
            placeholder="Description"
            required
          />
          {party2.imagePreview && (
            <img
              src={party2.imagePreview}
              alt="Party 2 Preview"
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
            onChange={(e) => handlePartyImageChange(2, e.target.files[0])}
          />
        </div>

        {/* Party 3 */}
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
              setParty3((prev) => ({ ...prev, description: e.target.value }))
            }
            placeholder="Description"
            required
          />
          {party3.imagePreview && (
            <img
              src={party3.imagePreview}
              alt="Party 3 Preview"
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
            onChange={(e) => handlePartyImageChange(3, e.target.files[0])}
          />
        </div>
      </div>

      <button type="submit" disabled={isSubmitDisabled}>
        Update
      </button>
    </form>
  );
};

export default UpdatePage;
