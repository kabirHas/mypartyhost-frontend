import React, { useState, useEffect } from "react";
import { RiArrowDownSLine, RiBallPenLine } from "react-icons/ri";
import { RiArrowUpSLine } from "react-icons/ri";
import { RiPencilLine } from "react-icons/ri";
import { RiDeleteBinLine } from "react-icons/ri";

const ContentManagementSidebar = ({
  isOpen,
  mode,
  editItem,
  onClose,
  onSavePage,
  onSaveFaq,
  onSaveCategory,
  onSaveLocation,
  faqs,
  categories,
  locations,
  faqCategories,
  onDeleteFaq,
  onEditItem,
  onDeleteCategory,
}) => {
  // State for form inputs
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    page: faqCategories[1] || "About Us", // Default to first non-"All" category
    category: faqCategories[1] || "About Us",
    question: "",
    answer: "",
    name: "",
    categoryCount: "",
  });

  // State for expanded FAQs in viewFaqs
  const [expandedFaqs, setExpandedFaqs] = useState({});

  // State for expanded locations and new categories
  const [expandedLocations, setExpandedLocations] = useState({});
  const [locationCategories, setLocationCategories] = useState({});
  const [newCategory, setNewCategory] = useState("");

  // Populate form data when editing
  useEffect(() => {
    if (editItem) {
      if (mode === "editPage") {
        setFormData({ title: editItem.title, content: editItem.content });
      } else if (mode === "editFaq") {
        setFormData({
          page: editItem.category,
          category: editItem.category,
          question: editItem.question,
          answer: editItem.answer,
        });
      } else if (mode === "editCategory") {
        setFormData({ name: editItem.name });
      } else if (mode === "editLocation") {
        setFormData({
          name: editItem.name,
          categoryCount: editItem.categoryCount.toString(),
        });
      }
    } else {
      setFormData({
        title: "",
        content: "",
        page: faqCategories[1] || "About Us",
        category: faqCategories[1] || "About Us",
        question: "",
        answer: "",
        name: "",
        categoryCount: "",
      });
    }
  }, [editItem, mode, faqCategories]);

  // Handle input changes
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle category input and addition
  const handleCategoryInput = (e) => {
    setNewCategory(e.target.value);
  };

  const handleAddCategory = (locationId, e) => {
    if (e.key === "Enter" && newCategory.trim()) {
      setLocationCategories((prev) => ({
        ...prev,
        [locationId]: [...(prev[locationId] || []), newCategory.trim()],
      }));
      setNewCategory("");
      const location = locations.find((loc) => loc.id === locationId);
      if (location) {
        onSaveLocation({
          id: location.id,
          name: location.name,
          categoryCount: (location.categoryCount || 0) + 1,
          categories: [...(location.categories || []), newCategory.trim()],
        });
      }
    }
  };

  // Handle category removal
  const handleRemoveCategory = (locationId, category) => {
    setLocationCategories((prev) => ({
      ...prev,
      [locationId]: (prev[locationId] || []).filter((c) => c !== category),
    }));
    const location = locations.find((loc) => loc.id === locationId);
    if (location) {
      onSaveLocation({
        id: location.id,
        name: location.name,
        categoryCount: (location.categoryCount || 0) - 1,
        categories: (location.categories || []).filter((c) => c !== category),
      });
    }
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (mode === "addPage" || mode === "editPage") {
      onSavePage({
        id: editItem?.id,
        title: formData.title,
        content: formData.content,
      });
    } else if (mode === "addFaq" || mode === "editFaq") {
      onSaveFaq({
        id: editItem?.id,
        category: formData.category,
        question: formData.question,
        answer: formData.answer,
      });
    } else if (mode === "addCategory" || mode === "editCategory") {
      onSaveCategory({ id: editItem?.id, name: formData.name });
    } else if (mode === "addLocation" || mode === "editLocation") {
      onSaveLocation({
        id: editItem?.id,
        name: formData.name,
        categoryCount: parseInt(formData.categoryCount) || 0,
      });
    }
    onClose();
  };

  // Handle add button in view modes
  const handleAdd = (addMode) => {
    setFormData({
      title: "",
      content: "",
      page: faqCategories[1] || "About Us",
      category: faqCategories[1] || "About Us",
      question: "",
      answer: "",
      name: "",
      categoryCount: "",
    });
    onEditItem(addMode);
  };

  // Toggle FAQ expansion
  const toggleFaq = (faqId) => {
    setExpandedFaqs((prev) => ({
      ...prev,
      [faqId]: !prev[faqId],
    }));
  };

  // Toggle location expansion
  const toggleLocation = (locationId) => {
    setExpandedLocations((prev) => ({
      ...prev,
      [locationId]: !prev[locationId],
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex ">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-zinc-400 bg-opacity-50"
        onClick={onClose}
      ></div>
      {/* Sidebar Content */}
      <div className="relative overflow-y-auto ml-auto w-[600px]  bg-[#FFFFFF] shadow-[-7px_2px_250px_32px_rgba(0,0,0,0.15)] border-l border-[#ECECEC] flex flex-col justify-start items-start overflow-auto">
        {/* Header */}
        <div className="self-stretch px-4 py-6 bg-[#FFFFFF] border-b border-[#ECECEC] flex justify-start items-center gap-6">
          <button className="w-8 h-8 relative" onClick={onClose}>
            <i class="ri-arrow-left-line text-xl"></i>
          </button>
          <h2 className="flex-1 text-[#292929] text-xl font-bold font-['Inter'] leading-normal">
            {mode === "addPage"
              ? "Add Page"
              : mode === "editPage"
              ? "Edit Page"
              : mode === "addFaq"
              ? "Add New FAQs"
              : mode === "editFaq"
              ? "Edit FAQ"
              : mode === "viewFaqs"
              ? "FAQs List"
              : mode === "addCategory"
              ? "Add Category"
              : mode === "editCategory"
              ? "Edit Category"
              : mode === "viewCategories"
              ? "Categories "
              : mode === "addLocation"
              ? "Add Location"
              : mode === "editLocation"
              ? "Edit Location"
              : "Locations List"}
          </h2>
          {(mode === "viewFaqs" ||
            mode === "viewCategories" ||
            mode === "viewLocations") && (
            <button
              className={`px-4 ${mode === "viewCategories" ? "hidden" : 'inline-block'} py-2 bg-gradient-to-l from-pink-600 to-rose-600 rounded-lg flex justify-center items-center gap-2 overflow-hidden`}
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
              <div className={`text-[#FFFFFF]  text-sm font-medium font-['Inter'] leading-tight`}>
                {mode === "viewFaqs"
                  ? "Add New FAQ"
                  : mode === "viewCategories"
                  ? "Add New Category"
                  : "Add New Location"}
              </div>
            </button>
          )}
        </div>
        {/* Content */}
        <div className="self-stretch overflow-y-auto flex-1 px-4 pt-4 pb-6 flex flex-col justify-start items-start gap-4 ">
          {/* View FAQs */}
          {mode === "viewFaqs" && (
            <div className="self-stretch flex flex-col justify-start items-start gap-4">
              {faqs.map((faq) => (
                <div
                  key={faq.id}
                  className="self-stretch px-3 py-2 bg-[#FFFFFF] rounded-lg outline outline-1 outline-offset-[-1px] outline-[#ECECEC] flex flex-col justify-start items-start gap-2"
                >
                  <div className="self-stretch flex justify-between items-center">
                    <div className="flex justify-start items-center gap-2">
                      <div className="w-6 h-6 relative">
                        <div className="w-6 h-6 absolute" />
                        <div className="w-4 h-0 left-[3.75px] top-[15px] absolute bg-zinc-800 outline outline-2 outline-offset-[-1px] outline-zinc-800" />
                        <div className="w-4 h-0 left-[3.75px] top-[9px] absolute bg-zinc-800 outline outline-2 outline-offset-[-1px] outline-zinc-800" />
                      </div>
                      <div className="text-[#3D3D3D] text-base font-bold font-['Inter'] leading-snug">
                        {faq.question}
                      </div>
                    </div>
                    <div className="flex justify-start items-center gap-4">
                      <button
                        className="w-6 h-6 relative"
                        onClick={() => toggleFaq(faq.id)}
                      >
                        <RiArrowDownSLine
                          className={`w-6 h-6 text-[#656565] transition-transform duration-200 ${
                            expandedFaqs[faq.id] ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                      <button
                        onClick={() => onEditItem("editFaq", faq)}
                        className="w-5 h-5 relative"
                      >
                        <i class="ri-pencil-line"></i>
                      </button>
                      <button
                        onClick={() => onDeleteFaq(faq.id)}
                        className="w-5 h-5 relative"
                      >
                        <i class="ri-delete-bin-line text-[#E61E4D]"></i>
                      </button>
                    </div>
                  </div>
                  {expandedFaqs[faq.id] && (
                    <>
                      <div className="self-stretch p-2 text-[#656565] text-base font-normal font-['Inter'] leading-snug">
                        {faq.answer}
                      </div>
                      <div className="self-stretch p-2 text-[#656565] text-xs font-normal font-['Inter'] leading-tight">
                        Category: {faq.category}
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
          {/* View Categories */}
          {mode === "viewCategories" && (
            <div className="flex flex-col gap-3 items-start">
              <p>{categories.length} Categories Listed</p>
              <div className="self-stretch flex flex-wrap justify-start items-start gap-4">
                {categories.map((category) => (
                  <div
                    key={category.id}
                    className="self-stretch w-fit px-3 py-2 bg-[#FFFFFF] gap-2 rounded-lg outline outline-1 outline-offset-[-1px] outline-[#ECECEC] flex justify-between items-center"
                  >
                    <div className="flex justify-start items-center gap-2">
                      <div className="w-5 h-5">
                        <i className="ri-quill-pen-line text-zinc-400"></i>
                      </div>
                      <div className="text-[#3D3D3D] text-base font-bold font-['Inter'] leading-snug">
                        {category.name}
                      </div>
                    </div>
                    <button
                      onClick={() => onDeleteCategory(category.id)}
                      className="flex items-center"
                    >
                      <i class="ri-close-circle-line"></i>
                    </button>
                  </div>
                ))}
              </div>
              <button onClick={()=>handleAdd("addCategory")} className="px-4 py-2 bg-gradient-to-l mt-3 from-pink-600 to-rose-600 rounded-lg flex justify-center items-center gap-2 overflow-hidden text-white">Add New Category</button>
            </div>
          )}
          {/* View Locations */}
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
                    <div
                      data-property-1={expandedLocations[location.id] ? "open" : "default"}
                      className="w-full flex flex-col justify-start items-start gap-4"
                    >
                      <div className="self-stretch inline-flex justify-between items-center">
                        <div className="text-[#292929] text-base font-bold font-['Inter'] leading-snug">
                          {location.name}
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
                          <button
                            className="p-2 flex justify-start items-center gap-2.5"
                            onClick={() => onEditItem("editLocation", location)}
                          >
                            <RiPencilLine className="w-5 h-5 text-[#656565]" />
                          </button>
                          <button
                            className="p-2 flex justify-start items-center gap-2.5"
                            onClick={() => onSaveLocation({ id: location.id, deleted: true })}
                          >
                            <RiDeleteBinLine className="w-5 h-5 text-[#E61E4D]" />
                          </button>
                        </div>
                      </div>
                      {expandedLocations[location.id] && (
                        <div className="self-stretch flex flex-col justify-start items-start gap-4">
                          <div className="self-stretch inline-flex justify-start items-center gap-2 flex-wrap content-center">
                            {(locationCategories[location.id] || location.categories || []).map(
                              (category) => (
                                <div
                                  key={category}
                                  className="px-3 py-2 rounded-3xl outline outline-1 outline-offset-[-1px] outline-[#ECECEC] flex justify-start items-center gap-1"
                                >
                                  <div className="w-5 h-5 relative">
                                  <i class="ri-quill-pen-line"></i>
                                  </div>
                                  <div className="text-[#656565] text-sm font-medium font-['Inter'] leading-tight">
                                    {category}
                                  </div>
                                  <button
                                    onClick={() => handleRemoveCategory(location.id, category)}
                                    
                                  >
                                    {/* <RiKCloseLine className="w-4 h-4 text-[#656565]" /> */}
                                    <i class="ri-close-circle-line text-lg text-[#656565]"></i>
                                  </button>
                                </div>
                              )
                            )}
                          </div>
                          <div className="flex flex-col justify-start items-start gap-2">
                            <div className="w-[566px] flex flex-col justify-start items-start gap-2">
                              <input
                                type="text"
                                value={newCategory}
                                onChange={handleCategoryInput}
                                onKeyDown={(e) => handleAddCategory(location.id, e)}
                                placeholder="search category"
                                className="self-stretch h-12 px-3 py-2 rounded-lg outline outline-1 outline-offset-[-1px] outline-[#ECECEC] text-[#E61E4D] text-sm font-normal font-['Inter'] leading-tight"
                              />
                            </div>
                            <div className="text-[#E61E4D] text-xs font-normal font-['Inter'] leading-none">
                              “Enter” to save category
                            </div>
                          </div>
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
          {/* Add/Edit Forms */}
          {(mode === "addPage" ||
            mode === "editPage" ||
            mode === "addFaq" ||
            mode === "editFaq" ||
            mode === "addCategory" ||
            mode === "editCategory" ||
            mode === "addLocation" ||
            mode === "editLocation") && (
            <div className="self-stretch flex flex-col justify-start items-start gap-4">
              {(mode === "addPage" || mode === "editPage") && (
                <>
                  <div className="self-stretch h-20 flex flex-col justify-start items-start gap-2">
                    <div className="self-stretch flex justify-start items-center gap-3">
                      <div className="flex-1 text-[#3D3D3D] text-base font-normal font-['Inter'] leading-snug">
                        Page Title
                      </div>
                    </div>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      placeholder="Enter page title"
                      className="self-stretch px-3 py-2 rounded-lg outline outline-1 outline-offset-[-1px] outline-[#ECECEC] text-[#656565] text-sm font-normal font-['Inter'] leading-tight"
                      required
                    />
                  </div>
                  <div className="self-stretch flex flex-col justify-start items-start gap-2">
                    <div className="self-stretch flex justify-start items-center gap-3">
                      <div className="flex-1 text-[#3D3D3D] text-base font-normal font-['Inter'] leading-snug">
                        Content
                      </div>
                    </div>
                    <textarea
                      name="content"
                      value={formData.content}
                      onChange={handleInputChange}
                      placeholder="Enter page content"
                      className="self-stretch px-3 py-2 rounded-lg outline outline-1 outline-offset-[-1px] outline-[#ECECEC] text-[#656565] text-sm font-normal font-['Inter'] leading-tight h-32"
                      required
                    />
                  </div>
                </>
              )}
              {(mode === "addFaq" || mode === "editFaq") && (
                <>
                  <div className="w-[566px] h-20 flex flex-col justify-start items-start gap-2">
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
                  <div className="w-[566px] flex flex-col justify-start items-start gap-2">
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
                          className="bg-transparent text-[#656565] text-base font-medium font-['Inter'] leading-snug focus:outline-none"
                        >
                          {faqCategories
                            .filter((c) => c !== "All")
                            .map((page) => (
                              <option key={page} value={page}>
                                {page}
                              </option>
                            ))}
                        </select>
                      </div>
                    </div>
                    <div className="flex justify-start items-center gap-2">
                      <div className="text-[#656565] text-sm font-medium font-['Inter'] leading-tight">
                        Category:
                      </div>
                      <div className="px-3 py-2 bg-[#FFFFFF] rounded-full outline outline-1 outline-offset-[-1px] outline-[#656565] flex justify-start items-center gap-2">
                        <select
                          name="category"
                          value={formData.category}
                          onChange={handleInputChange}
                          className="bg-transparent text-[#656565] text-base font-medium font-['Inter'] leading-snug focus:outline-none"
                        >
                          {faqCategories
                            .filter((c) => c !== "All")
                            .map((category) => (
                              <option key={category} value={category}>
                                {category}
                              </option>
                            ))}
                        </select>
                      </div>
                    </div>
                  </div>
                </>
              )}
              {(mode === "addCategory" || mode === "editCategory") && (
                <div>
                  <p className=" justify-start text-[#3D3D3D] text-base font-medium font-['Inter'] leading-snug">{categories.length} Categories listed</p>
                  <div className="self-stretch flex flex-wrap justify-start items-start gap-4">
                {categories.map((category) => (
                  <div
                    key={category.id}
                    className="self-stretch w-fit px-3 py-2 bg-[#FFFFFF] gap-2 rounded-lg outline outline-1 outline-offset-[-1px] outline-[#ECECEC] flex justify-between items-center"
                  >
                    <div className="flex justify-start items-center gap-2">
                      <div className="w-5 h-5">
                        <i className="ri-quill-pen-line text-zinc-400"></i>
                      </div>
                      <div className="text-[#3D3D3D] text-base  font-['Inter'] leading-snug">
                        {category.name}
                      </div>
                    </div>
                    <button
                      onClick={() => onDeleteCategory(category.id)}
                      className="flex items-center"
                    >
                      <i class="ri-close-circle-line"></i>
                    </button>
                  </div>
                ))}
              </div>
                <div className="self-stretch h-20 mt-4 flex flex-col justify-start items-start gap-2">
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Search Category"
                    className="self-stretch px-3 py-2 rounded-lg outline outline-1 outline-offset-[-1px] outline-[#ECECEC] text-[#656565] text-sm font-normal font-['Inter'] leading-tight"
                    required
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleSubmit(e);
                      }
                    }}
                  />
                  <span className="justify-start text-[#656565] text-xs font-normal font-['Inter'] leading-none">"Enter" to save Category</span>
                </div>
                </div>
              )}
              {(mode === "addLocation" || mode === "editLocation") && (
                <>
                  <div className="self-stretch h-20 flex flex-col justify-start items-start gap-2">
                    <div className="self-stretch flex justify-start items-center gap-3">
                      <div className="flex-1 text-[#3D3D3D] text-base font-normal font-['Inter'] leading-snug">
                        Location Name
                      </div>
                    </div>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Enter location name"
                      className="self-stretch px-3 py-2 rounded-lg outline outline-1 outline-offset-[-1px] outline-[#ECECEC] text-[#656565] text-sm font-normal font-['Inter'] leading-tight"
                      required
                    />
                  </div>
                  <div className="self-stretch h-20 flex flex-col justify-start items-start gap-2">
                    <div className="self-stretch flex justify-start items-center gap-3">
                      <div className="flex-1 text-[#3D3D3D] text-base font-normal font-['Inter'] leading-snug">
                        Category Count
                      </div>
                    </div>
                    <input
                      type="number"
                      name="categoryCount"
                      value={formData.categoryCount}
                      onChange={handleInputChange}
                      placeholder="Enter category count"
                      className="self-stretch px-3 py-2 rounded-lg outline outline-1 outline-offset-[-1px] outline-[#ECECEC] text-[#656565] text-sm font-normal font-['Inter'] leading-tight"
                      required
                    />
                  </div>
                </>
              )}
            </div>
          )}
        </div>
        {/* Footer */}
        <div className="self-stretch px-4 py-6 border-t border-[#ECECEC] flex justify-end items-center gap-4">
          <button
            className={`${mode === "addCategory" ? "hidden" : 'inline-block'} px-4 py-2 rounded-lg outline outline-1 outline-offset-[-1px] outline-[#656565] flex justify-center items-center gap-2 overflow-hidden`}
            onClick={onClose}
          >
            <div className="text-[#E61E4D] text-sm font-medium font-['Inter'] leading-tight">
              Cancel
            </div>
          </button>
          {(mode === "addPage" ||
            mode === "editPage" ||
            mode === "addFaq" ||
            mode === "editFaq" ||
            mode === "addCategory" ||
            mode === "editCategory" ||
            mode === "addLocation" ||
            mode === "editLocation") && (
            <button
              className={`${mode === "addCategory" ? "hidden" : 'inline-block'} px-4 py-2 bg-gradient-to-l from-pink-600 to-rose-600 rounded-lg flex justify-center items-center gap-2 overflow-hidden`}
              onClick={handleSubmit}
            >
              <div className="text-[#FFFFFF] text-sm font-medium font-['Inter'] leading-tight">
                {mode === "addFaq" ? "Add Question" : "Save Changes"}
              </div>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContentManagementSidebar;