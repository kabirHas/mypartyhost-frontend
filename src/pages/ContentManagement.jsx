import React, { useState, useEffect } from "react";
import { RiArrowDownSLine, RiArrowUpSLine, RiPencilLine, RiDeleteBinLine } from "react-icons/ri";
import axios from "axios";
import { toast } from "react-toastify";
import AddPageForm from "../components/AddPageForm";
import EditPageForm from "../components/EditPageForm";
import ContentManagementSidebar from "../components/ContentManagementSidebar";
import CreatePage from "./CreatePage";
import UpdatePage from "./UpdatePage";
import BASE_URLS from "../config";

function ContentManagement() {
  const [pages, setPages] = useState([]);
  const [faqs, setFaqs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [locations, setLocations] = useState([]);
  const [selectedFaqCategory, setSelectedFaqCategory] = useState("All");
  const [isAddPageOpen, setIsAddPageOpen] = useState(false);
  const [isEditPageOpen, setIsEditPageOpen] = useState(false);
  const [editPageItem, setEditPageItem] = useState(null);
  const [sidebarMode, setSidebarMode] = useState(null);
  const [editItem, setEditItem] = useState(null);

  const fetchFAQ = async () => {
    try {
      const { data } = await axios.get(`${BASE_URLS.BACKEND_BASEURL}faq`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      console.log("FAQ Response:", data);
      const flattenedFaqs = data.flatMap(item =>
        item.faqs.map(faq => ({
          id: faq._id,
          page: item.page,
          question: faq.question,
          answer: faq.answer,
          isOpen: false,
        }))
      );
      setFaqs(flattenedFaqs);
    } catch (error) {
      console.error("Error fetching FAQs:", error);
      toast.error("Failed to fetch FAQs: " + (error.response?.data?.message || error.message));
    }
  };

  const fetchLocations = async () => {
    try {
      const { data } = await axios.get(`${BASE_URLS.BACKEND_BASEURL}location`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      console.log("Locations Response:", data.data);
      setLocations(
        data.data.map(loc => ({
          id: loc._id,
          location: loc.location,
          category: loc.category.map(cat => cat._id),
        }))
      );
    } catch (error) {
      console.error("Error fetching locations:", error);
      toast.error("Failed to fetch locations: " + (error.response?.data?.message || error.message));
    }
  };

  useEffect(() => {
    fetchPages();
    fetchCategories();
    fetchFAQ();
    fetchLocations();
  }, []);

  const fetchPages = async () => {
    try {
      const { data } = await axios.get(`${BASE_URLS.BACKEND_BASEURL}pages`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      console.log("Pages Response:", data);
      setPages(data);
    } catch (error) {
      console.error("Error fetching pages:", error);
      toast.error("Failed to fetch pages: " + (error.response?.data?.message || error.message));
    }
  };

  const fetchCategories = async () => {
    try {
      const { data } = await axios.get(`${BASE_URLS.BACKEND_BASEURL}categories`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setCategories(
        data.map(cat => ({
          id: cat._id,
          name: cat.name,
          description: cat.description,
          icon: cat.icon,
        }))
      );
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Failed to fetch categories: " + (error.response?.data?.message || error.message));
    }
  };

  const toggleFaq = (id) => {
    setFaqs(faqs.map(faq => (faq.id === id ? { ...faq, isOpen: !faq.isOpen } : faq)));
  };

  const deleteFaq = async (page, faqId) => {
    try {
      await axios.delete(`${BASE_URLS.BACKEND_BASEURL}faq/${page}/${faqId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      await fetchFAQ();
      toast.success("FAQ deleted successfully");
    } catch (error) {
      console.error("Error deleting FAQ:", error);
      toast.error("FAQ deletion failed: " + (error.response?.data?.message || error.message));
    }
  };

  const deletePage = async (id) => {
    try {
      await axios.delete(`${BASE_URLS.BACKEND_BASEURL}pages/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setPages(prev => prev.filter(p => p._id !== id));
      toast.success("Page deleted successfully");
    } catch (error) {
      console.error("Error deleting page:", error);
      toast.error("Page deletion failed: " + (error.response?.data?.message || error.message));
    }
  };

  const openAddPage = () => {
    setIsAddPageOpen(true);
  };

  const openEditPage = (page) => {
    if (!page || !page._id) {
      console.error("Invalid page object:", page);
      toast.error("Cannot edit page: Invalid page ID");
      return;
    }
    setEditPageItem(page);
    setIsEditPageOpen(true);
  };

  const closeAddPage = () => {
    setIsAddPageOpen(false);
  };

  const closeEditPage = () => {
    setIsEditPageOpen(false);
    setEditPageItem(null);
  };

  const openSidebar = (mode, item = null) => {
    setSidebarMode(mode);
    setEditItem(item);
  };

  const closeSidebar = () => {
    setSidebarMode(null);
    setEditItem(null);
  };

  const handlePageSaved = (pageData, mode) => {
    if (mode === "addPage") {
      setPages(prev => [...prev, { _id: pageData._id, title: pageData.title, slug: pageData.slug }]);
    } else if (mode === "editPage") {
      setPages(prev =>
        prev.map(p => (p._id === pageData._id ? { _id: p._id, title: pageData.title, slug: pageData.slug } : p))
      );
    }
    closeAddPage();
    closeEditPage();
  };

  const handleSaveFaq = async (faqData) => {
    if (faqData.id) {
      setFaqs(prev => prev.map(faq => (faq.id === faqData.id ? { ...faq, ...faqData, isOpen: false } : faq)));
    } else {
      setFaqs(prev => [...prev, { ...faqData, id: `temp-${Date.now()}`, isOpen: false }]);
    }
    await fetchFAQ();
    closeSidebar();
  };

  const handleSaveCategory = async (categoryData) => {
    if (categoryData.id) {
      setCategories(prev => prev.map(cat => (cat.id === categoryData.id ? { ...cat, ...categoryData } : cat)));
    } else {
      setCategories(prev => [...prev, { ...categoryData }]);
    }
    await fetchCategories();
    closeSidebar();
  };

  const handleSaveLocation = async (locationData) => {
    try {
      if (locationData.delete) {
        setLocations(prev => prev.filter(loc => loc.id !== locationData.id));
        closeSidebar();
        return;
      }
      if (locationData.id) {
        const response = await axios.put(
          `${BASE_URLS.BACKEND_BASEURL}location/${locationData.id}`,
          {
            location: locationData.location,
            category: locationData.category,
          },
          {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          }
        );
        setLocations(prev =>
          prev.map(loc =>
            loc.id === locationData.id ? { ...loc, ...response.data.data } : loc
          )
        );
        toast.success("Location updated successfully");
      } else {
        const response = await axios.post(
          `${BASE_URLS.BACKEND_BASEURL}location`,
          {
            location: locationData.location,
            category: locationData.category,
          },
          {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          }
        );
        setLocations(prev => [
          ...prev,
          { id: response.data.data._id, ...response.data.data },
        ]);
        toast.success("Location created successfully");
      }
      await fetchLocations();
      closeSidebar();
    } catch (error) {
      console.error("Error saving location:", error);
      toast.error("Failed to save location: " + (error.response?.data?.message || error.message));
    }
  };

  const filteredFaqs =
    selectedFaqCategory === "All"
      ? faqs
      : faqs.filter(faq => faq.page === selectedFaqCategory);

  return (
    <div className="self-stretch flex flex-col justify-start items-start gap-8">
      <div className="w-[802px] flex flex-col justify-start items-start gap-2">
        <div className="self-stretch text-gray-800 text-4xl font-bold font-['Inter'] leading-10">
          Content Management
        </div>
        <div className="self-stretch text-gray-800 text-base font-normal font-['Inter'] leading-snug">
          Easily manage hostess profiles, event listings, reviews, and platform content. Keep everything organized and up-to-date.
        </div>
      </div>
      <div className="self-stretch flex justify-start items-start gap-4">
        <div className="w-[524px] flex flex-col justify-start items-start gap-4">
          <div className="self-stretch p-4 bg-white rounded-2xl flex flex-col justify-start items-start gap-4">
            <div className="self-stretch flex justify-between items-center">
              <div className="text-gray-800 text-xl font-bold font-['Inter'] leading-normal">
                Pages ({pages.length})
              </div>
              <button
                className="py-1 rounded-lg flex justify-center items-center gap-2"
                onClick={openAddPage}
              >
                <div className="text-rose-600 text-base font-medium font-['Inter'] leading-snug">
                  Add Page
                </div>
              </button>
            </div>
            <div className="self-stretch h-0 border-t border-gray-200"></div>
            <div className="self-stretch flex flex-col justify-start items-start gap-2">
              {pages.map(page => (
                <div key={page._id} className="self-stretch py-1 flex justify-between items-center">
                  <div className="capitalize text-gray-700 text-base font-medium font-['Inter'] leading-snug">
                    {page.slug}
                  </div>
                  <div className="flex gap-2">
                    <button
                      className="text-gray-600 text-base font-medium font-['Inter'] underline leading-snug"
                      onClick={() => openEditPage(page)}
                    >
                      Edit
                    </button>
                    <button
                      className="text-rose-600"
                      onClick={() => deletePage(page._id)}
                    >
                      <RiDeleteBinLine className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="self-stretch p-4 bg-white rounded-2xl flex flex-col justify-start items-start gap-4">
            <div className="self-stretch flex justify-between items-center">
              <div className="text-gray-800 text-xl font-bold font-['Inter'] leading-normal">
                FAQs ({filteredFaqs.length})
              </div>
              <div className="w-72 flex justify-end items-center gap-4">
                <div className="relative flex items-center">
                  <select
                    value={selectedFaqCategory}
                    onChange={e => setSelectedFaqCategory(e.target.value)}
                    className="px-4 py-2 bg-white capitalize rounded-full border border-gray-600 text-gray-700 text-base font-medium font-['Inter'] leading-snug appearance-none pr-10 focus:outline-none focus:ring-2 focus:ring-pink-600"
                  >
                    <option value="All">All</option>
                    {pages.map(page => (
                      <option key={page._id} value={page._id}>
                        {page.slug}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <RiArrowDownSLine className="w-5 h-5 text-gray-600" />
                  </div>
                </div>
                <button
                  className="py-1 rounded-lg flex justify-center items-center gap-2"
                  onClick={() => openSidebar("addFaq")}
                >
                  <div className="text-rose-600 text-base font-medium font-['Inter'] leading-snug">
                    Add FAQ
                  </div>
                </button>
              </div>
            </div>
            <div className="self-stretch h-0 border-t border-gray-200"></div>
            <div className="self-stretch flex flex-col justify-start items-start gap-4">
              {filteredFaqs.slice(0, 4).map(faq => (
                <div
                  key={faq.id}
                  className="self-stretch flex flex-col justify-start items-start gap-2"
                >
                  <div className="self-stretch px-3 py-2 bg-white rounded-lg border border-gray-200 flex justify-between items-start">
                    <div className="flex justify-start items-center gap-2">
                      <div className="w-6 h-6 relative">
                        <div className="w-4 h-[2px] absolute left-[3.75px] top-[15px] bg-gray-600" />
                        <div className="w-4 h-[2px] absolute left-[3.75px] top-[9px] bg-gray-600" />
                      </div>
                      <div className="text-gray-700 text-base font-bold font-['Inter'] leading-snug">
                        {faq.question}
                      </div>
                    </div>
                    <div className="flex justify-start items-center gap-4">
                      <button onClick={() => toggleFaq(faq.id)}>
                        {faq.isOpen ? (
                          <RiArrowUpSLine className="w-6 h-6 text-gray-600" />
                        ) : (
                          <RiArrowDownSLine className="w-6 h-6 text-gray-600" />
                        )}
                      </button>
                      <button onClick={() => openSidebar("editFaq", faq)}>
                        <RiPencilLine className="w-5 h-5 text-gray-600" />
                      </button>
                      <button onClick={() => deleteFaq(faq.page, faq.id)}>
                        <RiDeleteBinLine className="w-5 h-5 text-rose-600" />
                      </button>
                    </div>
                  </div>
                  {faq.isOpen && (
                    <div className="self-stretch px-3 py-2 text-gray-600 text-sm font-normal font-['Inter'] leading-tight">
                      {faq.answer}
                    </div>
                  )}
                </div>
              ))}
              {filteredFaqs.length > 4 && (
                <button
                  className="self-stretch py-1 rounded-lg flex justify-end items-center gap-2"
                  onClick={() => openSidebar("viewFaqs")}
                >
                  <div className="text-rose-600 text-base font-medium font-['Inter'] leading-snug">
                    View All
                  </div>
                </button>
              )}
            </div>
          </div>
        </div>
        <div className="w-1/2 flex flex-col justify-start items-start gap-4">
          <div className="self-stretch p-4 bg-white rounded-2xl flex flex-col justify-start items-end gap-4">
            <div className="self-stretch flex justify-between items-center">
              <div className="text-gray-800 text-xl font-bold font-['Inter'] leading-normal">
                Categories ({categories.length})
              </div>
              <button
                className="py-1 rounded-lg flex justify-center items-center gap-2"
                onClick={() => openSidebar("addCategory")}
              >
                <div className="text-rose-600 text-base font-medium font-['Inter'] leading-snug">
                  Add Category
                </div>
              </button>
            </div>
            <div className="self-stretch h-0 border-t border-gray-200"></div>
            <div className="self-stretch flex justify-start items-center gap-2 flex-wrap content-center">
              {categories.slice(0, 17).map(category => (
                <button
                  key={category.id}
                  className="px-3 py-2 rounded-3xl border border-gray-200 flex justify-start items-center gap-2"
                  onClick={() => openSidebar("editCategory", category)}
                >
                  <div className="w-5 h-5">
                    <i className={`${category.icon} text-zinc-400`}></i>
                  </div>
                  <div className="text-gray-700 text-sm font-medium font-['Inter'] leading-tight">
                    {category.name}
                  </div>
                </button>
              ))}
            </div>
            {categories.length > 5 && (
              <button
                className="self-stretch py-1 rounded-lg flex justify-end items-center gap-2"
                onClick={() => openSidebar("viewCategories")}
              >
                <div className="text-rose-600 text-base font-medium font-['Inter'] leading-snug">
                  View All
                </div>
              </button>
            )}
          </div>
          <div className="self-stretch p-4 bg-white rounded-2xl flex flex-col justify-start items-start gap-4">
            <div className="self-stretch flex justify-between items-center">
              <div className="text-gray-800 text-xl font-bold font-['Inter'] leading-normal">
                Location ({locations.length})
              </div>
              <button
                className="py-1 rounded-lg flex justify-center items-center gap-2"
                onClick={() => openSidebar("addLocation")}
              >
                <div className="text-rose-600 text-base font-medium font-['Inter'] leading-snug">
                  Add Location
                </div>
              </button>
            </div>
            <div className="self-stretch h-0 border-t border-gray-200"></div>
            <div className="self-stretch flex flex-col justify-start items-start gap-2">
              {locations.slice(0, 6).map(location => (
                <div
                  key={location.id}
                  className="self-stretch py-1 flex justify-between items-center"
                >
                  <div className="text-gray-800 text-base font-medium font-['Inter'] leading-snug">
                    {location.location}
                  </div>
                  <button
                    className="text-gray-600 text-sm font-normal font-['Inter'] underline leading-tight"
                    onClick={() => openSidebar("editLocation", location)}
                  >
                    {location.category.length} categories
                  </button>
                </div>
              ))}
              {locations.length > 0 && (
                <button
                  className="self-stretch py-1 rounded-lg flex justify-end items-center gap-2"
                  onClick={() => openSidebar("viewLocations")}
                >
                  <div className="text-rose-600 text-base font-medium font-['Inter'] leading-snug">
                    View All
                  </div>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      <CreatePage
        isOpen={isAddPageOpen}
        onClose={closeAddPage}
        onPageSaved={handlePageSaved}
        categories={categories}
      />
      <UpdatePage
        isOpen={isEditPageOpen}
        onClose={closeEditPage}
        onPageSaved={handlePageSaved}
        categories={categories}
        editItem={editPageItem}
      />
      <ContentManagementSidebar
        isOpen={!!sidebarMode}
        mode={sidebarMode}
        editItem={editItem}
        onClose={closeSidebar}
        onSaveFaq={handleSaveFaq}
        onSaveCategory={handleSaveCategory}
        onSaveLocation={handleSaveLocation}
        faqs={faqs}
        categories={categories}
        locations={locations}
        faqCategories={pages.map(page => page._id)}
        pages={pages}
        onDeleteFaq={deleteFaq}
        onEditItem={openSidebar}
        onDeleteCategory={async id => {
          setCategories(prev => prev.filter(cat => cat.id !== id));
          await fetchCategories();
        }}
        onFetchFAQ={fetchFAQ}
      />
    </div>
  );
}

export default ContentManagement;