import React, { useState, useEffect, useRef } from "react";
import { RiArrowDownSLine, RiPencilLine, RiDeleteBinLine } from "react-icons/ri";
import axios from "axios";
import { toast } from "react-toastify";
import BASE_URLS from "../config";

const ContentManagementSidebar = ({
  isOpen,
  mode,
  editItem,
  onClose,
  onSaveFaq,
  onSaveCategory,
  onSaveLocation,
  faqs,
  categories,
  locations,
  faqCategories,
  pages,
  onDeleteFaq,
  onEditItem,
  onDeleteCategory,
  onFetchFAQ,
}) => {
  const [formData, setFormData] = useState({
    page: faqCategories?.[0] || "",
    question: "",
    answer: "",
    location: "",
    description: "",
    icon: "ri-settings-3-line",
    category: [],
  });

  const [isSubmitDisabled, setIsSubmitDisabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [expandedFaqs, setExpandedFaqs] = useState({});
  const [expandedLocations, setExpandedLocations] = useState({});
  const submissionRef = useRef(new Set());

  useEffect(() => {
    if (editItem) {
      if (mode === "editFaq") {
        setFormData({
          ...formData,
          page: editItem.page || faqCategories?.[0] || "",
          question: editItem.question || "",
          answer: editItem.answer || "",
        });
      } else if (mode === "editCategory") {
        setFormData({
          ...formData,
          name: editItem.name || "",
          description: editItem.description || "",
          icon: editItem.icon || "ri-settings-3-line",
        });
      } else if (mode === "editLocation") {
        setFormData({
          ...formData,
          location: editItem.location || "",
          category: editItem.category || [],
        });
      }
    } else {
      setFormData({
        page: faqCategories?.[0] || "",
        question: "",
        answer: "",
        location: "",
        description: "",
        icon: "ri-settings-3-line",
        category: [],
      });
    }
  }, [editItem, mode, faqCategories]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setFormData(prev => {
        const newCategories = checked
          ? [...prev.category, value]
          : prev.category.filter(id => id !== value);
        return { ...prev, category: newCategories };
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const submissionId = Date.now().toString();
    if (submissionRef.current.has(submissionId)) {
      console.log("Duplicate submission detected, ignoring:", submissionId);
      return;
    }
    submissionRef.current.add(submissionId);

    if (isLoading) {
      console.log("Submission blocked: isLoading is true");
      return;
    }

    setIsLoading(true);
    console.log("Sending payload:", { location: formData.location, category: formData.category });

    try {
      if (mode === "addFaq") {
        const response = await axios.post(
          `${BASE_URLS.BACKEND_BASEURL}faq`,
          {
            page: formData.page,
            faqs: [{ question: formData.question, answer: formData.answer }],
          },
          {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          }
        );
        console.log("FAQ created:", response.data);
        onSaveFaq({
          id: response.data.faqs[response.data.faqs.length - 1]._id,
          page: formData.page,
          question: formData.question,
          answer: formData.answer,
        });
        toast.success("FAQ created successfully");
        onFetchFAQ();
      } else if (mode === "editFaq") {
        const response = await axios.put(
          `${BASE_URLS.BACKEND_BASEURL}faq/${editItem.page}/${editItem.id}`,
          {
            question: formData.question,
            answer: formData.answer,
          },
          {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          }
        );
        console.log("FAQ updated:", response.data);
        onSaveFaq({
          id: editItem.id,
          page: formData.page,
          question: formData.question,
          answer: formData.answer,
        });
        toast.success("FAQ updated successfully");
        onFetchFAQ();
      } else if (mode === "addCategory") {
        const response = await axios.post(
          `${BASE_URLS.BACKEND_BASEURL}categories`,
          {
            name: formData.name,
            description: formData.description,
            icon: formData.icon,
          },
          {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          }
        );
        console.log("Category created:", response.data);
        onSaveCategory({
          id: response.data._id,
          name: response.data.name,
          description: response.data.description,
          icon: response.data.icon,
        });
        toast.success("Category created successfully");
      } else if (mode === "editCategory") {
        const response = await axios.put(
          `${BASE_URLS.BACKEND_BASEURL}categories/${editItem.id}`,
          {
            name: formData.name,
            description: formData.description,
            icon: formData.icon,
          },
          {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          }
        );
        console.log("Category updated:", response.data);
        onSaveCategory({
          id: editItem.id,
          name: response.data.name,
          description: response.data.description,
          icon: response.data.icon,
        });
        toast.success("Category updated successfully");
      } else if (mode === "addLocation" || mode === "editLocation") {
        const payload = {
          location: formData.location,
          category: formData.category,
        };
        if (mode === "addLocation") {
          const response = await axios.post(
            `${BASE_URLS.BACKEND_BASEURL}location`,
            payload,
            {
              headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            }
          );
          console.log("Location created:", response.data);
          onSaveLocation({
            id: response.data.data._id,
            location: response.data.data.location,
            category: response.data.data.category.map(cat => cat._id),
          });
          toast.success("Location created successfully");
        } else {
          const response = await axios.put(
            `${BASE_URLS.BACKEND_BASEURL}location/${editItem.id}`,
            payload,
            {
              headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            }
          );
          console.log("Location updated:", response.data);
          onSaveLocation({
            id: editItem.id,
            location: response.data.data.location,
            category: response.data.data.category.map(cat => cat._id),
          });
          toast.success("Location updated successfully");
        }
      }
    } catch (error) {
      console.error(
        `Error ${
          mode === "addFaq"
            ? "creating FAQ"
            : mode === "editFaq"
            ? "updating FAQ"
            : mode === "addCategory"
            ? "creating category"
            : mode === "editCategory"
            ? "updating category"
            : mode === "addLocation"
            ? "creating location"
            : "updating location"
        }:`,
        error
      );
      toast.error(
        `${
          mode === "addFaq"
            ? "Failed to create FAQ"
            : mode === "editFaq"
            ? "Failed to update FAQ"
            : mode === "addCategory"
            ? "Failed to create category"
            : mode === "editCategory"
            ? "Failed to update category"
            : mode === "addLocation"
            ? "Failed to create location"
            : "Failed to update location"
        }: ` + (error.response?.data?.message || error.message)
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    if (isLoading) {
      console.log("Deletion blocked: isLoading is true");
      return;
    }
    setIsLoading(true);
    try {
      await axios.delete(`${BASE_URLS.BACKEND_BASEURL}categories/${categoryId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      onDeleteCategory(categoryId);
      toast.success("Category deleted successfully");
    } catch (error) {
      console.error("Error deleting category:", error);
      toast.error("Failed to delete category: " + (error.response?.data?.message || error.message));
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteLocation = async (locationId) => {
    if (isLoading) {
      console.log("Deletion blocked: isLoading is true");
      return;
    }
    setIsLoading(true);
    try {
      await axios.delete(`${BASE_URLS.BACKEND_BASEURL}location/${locationId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      onSaveLocation({ id: locationId, delete: true });
      toast.success("Location deleted successfully");
    } catch (error) {
      console.error("Error deleting location:", error);
      toast.error("Failed to delete location: " + (error.response?.data?.message || error.message));
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdd = (addMode) => {
    setFormData({
      page: faqCategories?.[0] || "",
      question: "",
      answer: "",
      location: "",
      description: "",
      icon: "ri-settings-3-line",
      category: [],
    });
    onEditItem(addMode);
  };

  const toggleFaq = (faqId) => {
    setExpandedFaqs(prev => ({
      ...prev,
      [faqId]: !prev[faqId],
    }));
  };

  const toggleLocation = (locationId) => {
    setExpandedLocations(prev => ({
      ...prev,
      [locationId]: !prev[locationId],
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      <div
        className="absolute inset-0 bg-zinc-400 bg-opacity-50"
        onClick={onClose}
      ></div>
      <div className="relative overflow-y-auto ml-auto w-[600px] bg-[#FFFFFF] shadow-[-7px_2px_250px_32px_rgba(0,0,0,0.15)] border-l border-[#ECECEC] flex flex-col justify-start items-start overflow-auto">
        <div className="self-stretch px-4 py-6 bg-[#FFFFFF] border-b border-[#ECECEC] flex justify-start items-center gap-6">
          <button className="w-8 h-8 relative" onClick={onClose}>
            <i className="ri-arrow-left-line text-xl"></i>
          </button>
          <h2 className="flex-1 text-[#292929] text-xl font-bold font-['Inter'] leading-normal">
            {mode === "addFaq"
              ? "Add New FAQs"
              : mode === "editFaq"
              ? "Edit FAQ"
              : mode === "viewFaqs"
              ? "FAQs List"
              : mode === "addCategory"
              ? "Add Category"
              : mode === "editCategory"
              ? "Edit Category"
              : mode === "addLocation"
              ? "Add Location"
              : mode === "editLocation"
              ? "Edit Location"
              : "Locations List"}
          </h2>
          {(mode === "viewFaqs" || mode === "viewCategories" || mode === "viewLocations") && (
            <button
              className={`px-4 ${
                mode === "viewCategories" ? "hidden" : "inline-block"
              } py-2 bg-gradient-to-l from-pink-600 to-rose-600 rounded-lg flex justify-center items-center gap-2 overflow-hidden`}
              onClick={() =>
                handleAdd(
                  mode === "viewFaqs"
                    ? "addFaq"
                    : mode === "viewCategories"
                    ? "addCategory"
                    : "addLocation"
                )
              }
            >
              <div className="text-[#FFFFFF] text-sm font-medium font-['Inter'] leading-tight">
                {mode === "viewFaqs"
                  ? "Add New FAQ"
                  : mode === "viewCategories"
                  ? "Add New Category"
                  : "Add New Location"}
              </div>
            </button>
          )}
        </div>
        <div className="self-stretch overflow-y-auto flex-1 px-4 pt-4 pb-6 flex flex-col justify-start items-start gap-4">
          {(mode === "addFaq" || mode === "editFaq") && (
            <form
              onSubmit={handleSubmit}
              id="content-form"
              className="self-stretch flex flex-col justify-start items-start gap-4"
            >
              <div className="self-stretch flex flex-col justify-start items-start gap-2">
                <div className="self-stretch flex justify-start items-center gap-3">
                  <div className="flex-1 text-[#656565] text-base font-normal font-['Inter'] leading-snug">
                    Question
                  </div>
                </div>
                <input
                  type="text"
                  name="question"
                  value={formData.question}
                  onChange={handleInputChange}
                  placeholder="Type Question"
                  className="self-stretch px-3 py-2 rounded-lg outline outline-1 outline-offset-[-1px] outline-[#ECECEC] text-[#E61E4D] text-sm font-normal font-['Inter'] leading-tight"
                  required
                />
              </div>
              <div className="self-stretch flex flex-col justify-start items-start gap-2">
                <div className="self-stretch flex justify-start items-center gap-3">
                  <div className="flex-1 text-[#656565] text-base font-normal font-['Inter'] leading-snug">
                    Answer
                  </div>
                </div>
                <textarea
                  name="answer"
                  value={formData.answer}
                  onChange={handleInputChange}
                  placeholder="Type Answer"
                  className="self-stretch px-3 py-2 rounded-lg outline outline-1 outline-offset-[-1px] outline-[#ECECEC] text-[#E61E4D] text-sm font-normal font-['Inter'] leading-tight h-32"
                  required
                />
              </div>
              <div className="self-stretch flex justify-between items-center">
                <div className="flex justify-start items-center gap-2">
                  <div className="text-[#656565] text-sm font-medium font-['Inter'] leading-tight">
                    Page:
                  </div>
                  <div className="px-3 py-2 bg-[#FFFFFF] rounded-full outline outline-1 outline-offset-[-1px] outline-[#656565] flex justify-start items-center gap-2">
                    <select
                      name="page"
                      value={formData.page}
                      onChange={handleInputChange}
                      className="bg-transparent capitalize text-[#656565] text-base font-medium font-['Inter'] leading-snug focus:outline-none"
                      required
                    >
                      <option value="" disabled>
                        Select a page
                      </option>
                      {faqCategories?.map(pageId => {
                        const page = pages.find(p => p._id === pageId);
                        return (
                          <option key={pageId} className="capitalize" value={pageId}>
                            {page?.slug || pageId}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                </div>
              </div>
              <div className="self-stretch px-4 py-6 border-t border-[#ECECEC] flex justify-end items-center gap-4">
                <button
                  type="button"
                  className="px-4 py-2 rounded-lg outline outline-1 outline-offset-[-1px] outline-[#656565] flex justify-center items-center gap-2 overflow-hidden"
                  onClick={onClose}
                >
                  <div className="text-[#E61E4D] text-sm font-medium font-['Inter'] leading-tight">
                    Cancel
                  </div>
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-gradient-to-l from-pink-600 to-rose-600 rounded-lg flex justify-center items-center gap-2 overflow-hidden disabled:opacity-50"
                  disabled={isSubmitDisabled || isLoading}
                >
                  <div className="text-[#FFFFFF] text-sm font-medium font-['Inter'] leading-tight">
                    {isLoading ? "Saving..." : mode === "addFaq" ? "Add Question" : "Save Changes"}
                  </div>
                </button>
              </div>
            </form>
          )}
          {(mode === "addCategory" || mode === "editCategory") && (
            <form
              onSubmit={handleSubmit}
              id="content-form"
              className="self-stretch flex flex-col justify-start items-start gap-4"
            >
              <p className="justify-start text-[#3D3D3D] text-base font-medium font-['Inter'] leading-snug">
                {categories.length} Categories listed
              </p>
              <div className="self-stretch flex flex-wrap justify-start items-start gap-4">
                {categories.map(category => (
                  <div
                    key={category.id}
                    className="self-stretch w-fit px-3 py-2 bg-[#FFFFFF] gap-2 rounded-lg outline outline-1 outline-offset-[-1px] outline-[#ECECEC] flex flex-col justify-between items-start"
                  >
                    <div className="flex justify-start items-center gap-2 w-full">
                      <div className="w-5 h-5">
                        <i className={`${category.icon} text-zinc-400`}></i>
                      </div>
                      <div className="text-[#3D3D3D] text-base font-bold font-['Inter'] leading-snug">
                        {category.name}
                      </div>
                      <button
                        onClick={() => handleDeleteCategory(category.id)}
                        className="ml-auto flex items-center"
                      >
                        <i className="ri-close-circle-line"></i>
                      </button>
                    </div>
                    <div className="text-[#656565] text-sm font-normal font-['Inter'] leading-tight">
                      {category.description}
                    </div>
                  </div>
                ))}
              </div>
              <div className="self-stretch flex flex-col justify-start items-start gap-4 mt-4">
                <div className="self-stretch flex flex-col justify-start items-start gap-2">
                  <div className="self-stretch flex justify-start items-center gap-3">
                    <div className="flex-1 text-[#3D3D3D] text-base font-normal font-['Inter'] leading-snug">
                      Category Name
                    </div>
                  </div>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter category name"
                    className="self-stretch px-3 py-2 rounded-lg outline outline-1 outline-offset-[-1px] outline-[#ECECEC] text-[#656565] text-sm font-normal font-['Inter'] leading-tight"
                    required
                  />
                </div>
                <div className="self-stretch flex flex-col justify-start items-start gap-2">
                  <div className="self-stretch flex justify-start items-center gap-3">
                    <div className="flex-1 text-[#3D3D3D] text-base font-normal font-['Inter'] leading-snug">
                      Description
                    </div>
                  </div>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Enter description"
                    className="self-stretch px-3 py-2 rounded-lg outline outline-1 outline-offset-[-1px] outline-[#ECECEC] text-[#656565] text-sm font-normal font-['Inter'] leading-tight h-20"
                    required
                  />
                </div>
                <div className="self-stretch flex flex-col justify-start items-start gap-2">
                  <div className="self-stretch flex justify-start items-center gap-3">
                    <div className="flex-1 text-[#3D3D3D] text-base font-normal font-['Inter'] leading-snug">
                      Icon
                    </div>
                  </div>
                  <input
                    type="text"
                    name="icon"
                    value={formData.icon}
                    onChange={handleInputChange}
                    placeholder="Paste Remix Icon class (e.g., ri-book-2-line)"
                    className="self-stretch px-3 py-2 rounded-lg outline outline-1 outline-offset-[-1px] outline-[#ECECEC] text-[#656565] text-sm font-normal font-['Inter'] leading-tight"
                    required
                  />
                </div>
              </div>
              <div className="self-stretch px-4 py-6 border-t border-[#ECECEC] flex justify-end items-center gap-4">
                <button
                  type="button"
                  className="px-4 py-2 rounded-lg outline outline-1 outline-offset-[-1px] outline-[#656565] flex justify-center items-center gap-2 overflow-hidden"
                  onClick={onClose}
                >
                  <div className="text-[#E61E4D] text-sm font-medium font-['Inter'] leading-tight">
                    Cancel
                  </div>
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-gradient-to-l from-pink-600 to-rose-600 rounded-lg flex justify-center items-center gap-2 overflow-hidden disabled:opacity-50"
                  disabled={isSubmitDisabled || isLoading}
                >
                  <div className="text-[#FFFFFF] text-sm font-medium font-['Inter'] leading-tight">
                    {isLoading ? "Saving..." : mode === "addCategory" ? "Save Category" : "Save Changes"}
                  </div>
                </button>
              </div>
            </form>
          )}
          {(mode === "addLocation" || mode === "editLocation") && (
            <form
              onSubmit={handleSubmit}
              id="content-form"
              className="self-stretch flex flex-col justify-start items-start gap-4"
            >
              <div className="self-stretch flex flex-col justify-start items-start gap-2">
                <div className="self-stretch flex justify-start items-center gap-3">
                  <div className="flex-1 text-[#3D3D3D] text-base font-normal font-['Inter'] leading-snug">
                    Location Name
                  </div>
                </div>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="Enter location name"
                  className="self-stretch px-3 py-2 rounded-lg outline outline-1 outline-offset-[-1px] outline-[#ECECEC] text-[#656565] text-sm font-normal font-['Inter'] leading-tight"
                  required
                />
              </div>
              <div className="self-stretch flex flex-col justify-start items-start gap-2">
                <div className="self-stretch flex justify-start items-center gap-3">
                  <div className="flex-1 text-[#3D3D3D] text-base font-normal font-['Inter'] leading-snug">
                    Categories
                  </div>
                </div>
                <div className="self-stretch flex flex-col justify-start items-start gap-2">
                  {categories.map(category => (
                    <div
                      key={category.id}
                      className="self-stretch flex justify-start items-center gap-3"
                    >
                      <input
                        type="checkbox"
                        name="category"
                        value={category.id}
                        checked={formData.category.includes(category.id)}
                        onChange={handleInputChange}
                        className="mr-2"
                      />
                      <div className="flex items-center gap-2">
                        <i className={`${category.icon} text-zinc-400`}></i>
                        <div className="text-[#656565] text-sm font-normal font-['Inter'] leading-tight">
                          {category.name}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="self-stretch px-4 py-6 border-t border-[#ECECEC] flex justify-end items-center gap-4">
                <button
                  type="button"
                  className="px-4 py-2 rounded-lg outline outline-1 outline-offset-[-1px] outline-[#656565] flex justify-center items-center gap-2 overflow-hidden"
                  onClick={onClose}
                >
                  <div className="text-[#E61E4D] text-sm font-medium font-['Inter'] leading-tight">
                    Cancel
                  </div>
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-gradient-to-l from-pink-600 to-rose-600 rounded-lg flex justify-center items-center gap-2 overflow-hidden disabled:opacity-50"
                  disabled={isSubmitDisabled || isLoading || !formData.location}
                >
                  <div className="text-[#FFFFFF] text-sm font-medium font-['Inter'] leading-tight">
                    {isLoading ? "Saving..." : mode === "addLocation" ? "Add Location" : "Save Changes"}
                  </div>
                </button>
              </div>
            </form>
          )}
          {mode === "viewFaqs" && (
            <div className="self-stretch flex flex-col justify-start items-start gap-4">
              {faqs.map(faq => (
                <div
                  key={faq.id}
                  className="self-stretch px-3 py-2 bg-[#FFFFFF] rounded-lg outline outline-1 outline-offset-[-1px] outline-[#ECECEC] flex flex-col justify-start items-start gap-2"
                >
                  <div className="self-stretch flex justify-between items-center">
                    <div className="flex justify-start items-center gap-2">
                      <div className="w-6 h-6 relative">
                        <div className="w-4 h-[2px] absolute left-[3.75px] top-[15px] bg-zinc-800" />
                        <div className="w-4 h-[2px] absolute left-[3.75px] top-[9px] bg-zinc-800" />
                      </div>
                      <div className="text-[#3D3D3D] text-base font-bold font-['Inter'] leading-snug">
                        {faq.question}
                      </div>
                    </div>
                    <div className="flex justify-start items-center gap-4">
                      <button onClick={() => toggleFaq(faq.id)}>
                        <RiArrowDownSLine
                          className={`w-6 h-6 text-[#656565] transition-transform duration-200 ${
                            expandedFaqs[faq.id] ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                      <button onClick={() => onEditItem("editFaq", faq)}>
                        <RiPencilLine className="w-5 h-5 text-[#656565]" />
                      </button>
                      <button onClick={() => onDeleteFaq(faq.page, faq.id)}>
                        <RiDeleteBinLine className="w-5 h-5 text-[#E61E4D]" />
                      </button>
                    </div>
                  </div>
                  {expandedFaqs[faq.id] && (
                    <div className="self-stretch p-2 text-[#656565] text-base font-normal font-['Inter'] leading-snug">
                      {faq.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
          {mode === "viewCategories" && (
            <div className="flex flex-col gap-3 items-start">
              <p>{categories.length} Categories Listed</p>
              <div className="self-stretch flex flex-wrap justify-start items-start gap-4">
                {categories.map(category => (
                  <div
                    key={category.id}
                    className="self-stretch w-fit px-3 py-2 bg-[#FFFFFF] gap-2 rounded-lg outline outline-1 outline-offset-[-1px] outline-[#ECECEC] flex flex-col justify-between items-start"
                  >
                    <div className="flex justify-start items-center gap-2 w-full">
                      <div className="w-5 h-5">
                        <i className={`${category.icon} text-zinc-400`}></i>
                      </div>
                      <div className="text-[#3D3D3D] text-base font-bold font-['Inter'] leading-snug">
                        {category.name}
                      </div>
                      <button
                        onClick={() => handleDeleteCategory(category.id)}
                        className="ml-auto flex items-center"
                      >
                        <i className="ri-close-circle-line"></i>
                      </button>
                    </div>
                    <div className="text-[#656565] text-sm font-normal font-['Inter'] leading-tight">
                      {category.description}
                    </div>
                  </div>
                ))}
              </div>
              <button
                onClick={() => handleAdd("addCategory")}
                className="px-4 py-2 bg-gradient-to-l mt-3 from-pink-600 to-rose-600 rounded-lg flex justify-center items-center gap-2 overflow-hidden text-white"
              >
                Add New Category
              </button>
            </div>
          )}
          {mode === "viewLocations" && (
            <div className="self-stretch flex-1 flex flex-col justify-start items-start">
              <div className="w-full flex-1 px-2 pt-4 pb-6 flex flex-col flex-wrap justify-start items-start gap-4 overflow-hidden">
                <div className="self-stretch inline-flex justify-between items-start">
                  <div className="flex-1 text-[#656565] text-base font-medium font-['Inter'] leading-snug">
                    {locations.length} Location{locations.length !== 1 ? "s" : ""} Listed
                  </div>
                </div>
                {locations.map((location, index) => (
                  <React.Fragment key={location.id}>
                    <div className="w-full flex flex-col justify-start items-start gap-4">
                      <div className="self-stretch inline-flex justify-between items-center">
                        <div className="text-[#292929] text-base font-bold font-['Inter'] leading-snug">
                          {location.location}
                        </div>
                        <div className="flex justify-start items-start gap-4">
                          <button
                            className="p-2 flex justify-start items-center gap-2.5"
                            onClick={() => toggleLocation(location.id)}
                          >
                            <RiArrowDownSLine
                              className={`w-6 h-6 text-[#656565] transition-transform duration-200 ${
                                expandedLocations[location.id] ? "rotate-180" : ""
                              }`}
                            />
                          </button>
                          <button onClick={() => onEditItem("editLocation", location)}>
                            <RiPencilLine className="w-5 h-5 text-[#656565]" />
                          </button>
                          <button onClick={() => handleDeleteLocation(location.id)}>
                            <RiDeleteBinLine className="w-5 h-5 text-[#E61E4D]" />
                          </button>
                        </div>
                      </div>
                      {expandedLocations[location.id] && (
                        <div className="self-stretch flex flex-col justify-start items-start gap-2">
                          {location.category.length > 0 ? (
                            location.category.map((categoryId, catIndex) => {
                              const category = categories.find(cat => cat.id === categoryId);
                              return (
                                <div
                                  key={catIndex}
                                  className="self-stretch px-3 py-2 bg-[#FFFFFF] rounded-lg outline outline-1 outline-offset-[-1px] outline-[#ECECEC] inline-flex justify-between items-center"
                                >
                                  <div className="flex items-center gap-2">
                                    <i className={`${category?.icon || "ri-settings-3-line"} text-zinc-400`}></i>
                                    <div className="text-[#3D3D3D] text-base font-medium font-['Inter'] leading-snug">
                                      {category ? category.name : "Unknown Category"}
                                    </div>
                                  </div>
                                </div>
                              );
                            })
                          ) : (
                            <div className="text-[#656565] text-sm font-normal font-['Inter'] leading-tight">
                              No categories assigned
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    {index < locations.length - 1 && (
                      <div className="self-stretch h-0 outline outline-1 outline-offset-[-0.50px] outline-[#ECECEC]"></div>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContentManagementSidebar;