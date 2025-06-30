import React, { useState } from "react";
import { RiArrowDownSLine, RiArrowUpSLine, RiPencilLine, RiDeleteBinLine } from "react-icons/ri";
import ContentManagementSidebar from "../components/ContentManagementSidebar";

function ContentManagement() {
  // State for data
  const [pages, setPages] = useState([
    { id: 1, title: "Home", content: "Welcome to MyPartyHostess" },
    { id: 2, title: "About Us", content: "About our platform" },
    { id: 3, title: "Services", content: "Our services" },
    { id: 4, title: "Contact", content: "Contact us" },
    { id: 5, title: "Blog", content: "Latest news" },
    { id: 6, title: "FAQ", content: "Frequently asked questions" },
    { id: 7, title: "Events", content: "Upcoming events" },
    { id: 8, title: "Privacy Policy", content: "Privacy policy" },
  ]);

  const [faqs, setFaqs] = useState([
    { id: 1, category: "About Us", question: "What is MyPartyHostess?", answer: "MyPartyHostess is a platform connecting hosts with event planners.", isOpen: false },
    { id: 2, category: "Booking", question: "How do I book an event?", answer: "Select an event and follow the booking process.", isOpen: false },
    { id: 3, category: "Payments", question: "What payment methods are accepted?", answer: "We accept credit cards, PayPal, and bank transfers.", isOpen: false },
    { id: 4, category: "About Us", question: "Who founded MyPartyHostess?", answer: "Founded by a team of event enthusiasts.", isOpen: false },
  ]);

  const [categories, setCategories] = useState([
    { id: 1, name: "Weddings" },
    { id: 2, name: "Corporate Events" },
    { id: 3, name: "Birthdays" },
    { id: 4, name: "Conferences" },
    { id: 5, name: "Parties" },
    { id: 6, name: "Festivals" },
    { id: 7, name: "Seminars" },
    { id: 8, name: "Workshops" },
    { id: 9, name: "Concerts" },
    { id: 10, name: "Charity Events" },
    { id: 11, name: "Networking Events" },
    { id: 12, name: "Product Launches" },
  ]);

  const [locations, setLocations] = useState([
    { id: 1, name: "Sydney", categoryCount: 23 },
    { id: 2, name: "Melbourne", categoryCount: 23 },
    { id: 3, name: "Dubai", categoryCount: 23 },
    { id: 4, name: "New York", categoryCount: 23 },
    { id: 5, name: "London", categoryCount: 23 },
    { id: 6, name: "Los Angeles", categoryCount: 23 },
    { id: 7, name: "Paris", categoryCount: 23 },
    { id: 8, name: "Tokyo", categoryCount: 23 },
  ]);

  // State for UI
  const [selectedFaqCategory, setSelectedFaqCategory] = useState("All");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [sidebarMode, setSidebarMode] = useState(null); // addPage, editPage, addFaq, editFaq, viewFaqs, addCategory, editCategory, viewCategories, addLocation, editLocation, viewLocations
  const [editItem, setEditItem] = useState(null);

  // FAQ categories for dropdown
  const faqCategories = ["All", "About Us", "Booking", "Payments"];

  // Handle FAQ collapse toggle
  const toggleFaq = (id) => {
    setFaqs(faqs.map(faq => faq.id === id ? { ...faq, isOpen: !faq.isOpen } : faq));
  };

  // Handle delete FAQ
  const deleteFaq = (id) => {
    setFaqs(faqs.filter(faq => faq.id !== id));
  };

  // Open sidebar
  const openSidebar = (mode, item = null) => {
    setSidebarMode(mode);
    setEditItem(item);
    setIsSidebarOpen(true);
  };

  // Close sidebar
  const closeSidebar = () => {
    setIsSidebarOpen(false);
    setSidebarMode(null);
    setEditItem(null);
  };

  // Handle add/edit page
  const handleSavePage = (page) => {
    if (sidebarMode === "addPage") {
      setPages([...pages, { id: pages.length + 1, ...page }]);
    } else if (sidebarMode === "editPage") {
      setPages(pages.map(p => p.id === page.id ? page : p));
    }
    closeSidebar();
  };

  // Handle add/edit FAQ
  const handleSaveFaq = (faq) => {
    if (sidebarMode === "addFaq") {
      setFaqs([...faqs, { id: faqs.length + 1, ...faq, isOpen: false }]);
    } else if (sidebarMode === "editFaq") {
      setFaqs(faqs.map(f => f.id === faq.id ? { ...faq, isOpen: f.isOpen } : f));
    }
    closeSidebar();
  };

  // Handle add/edit category
  const handleSaveCategory = (category) => {
    if (sidebarMode === "addCategory") {
      setCategories([...categories, { id: categories.length + 1, ...category }]);
    } else if (sidebarMode === "editCategory") {
      setCategories(categories.map(c => c.id === category.id ? category : c));
    }
    closeSidebar();
  };

  const deleteCategory = (id) => {
    setCategories(categories.filter(c => c.id !== id));
  };

  // Handle add/edit location
  const handleSaveLocation = (location) => {
    if (sidebarMode === "addLocation") {
      setLocations([...locations, { id: locations.length + 1, ...location }]);
    } else if (sidebarMode === "editLocation") {
      setLocations(locations.map(l => l.id === location.id ? location : l));
    }
    closeSidebar();
  };

  // Filter FAQs by category
  const filteredFaqs = selectedFaqCategory === "All" ? faqs : faqs.filter(faq => faq.category === selectedFaqCategory);

  return (
    <div className="self-stretch inline-flex flex-col justify-start items-start gap-8">
      {/* Header */}
      <div className="w-[802px] flex flex-col justify-start items-start gap-2">
        <div className="self-stretch justify-start text-[#292929] text-4xl font-bold font-['Inter'] leading-10">
          Content Management
        </div>
        <div className="self-stretch justify-start text-[#292929] text-base font-normal font-['Inter'] leading-snug">
          Easily manage hostess profiles, event listings, reviews, and platform content. Keep everything organized and up-to-date.
        </div>
      </div>
      <div className="self-stretch inline-flex justify-start items-start gap-4">
        <div className="w-[524px] inline-flex flex-col justify-start items-start gap-4">
          {/* Pages Section */}
          <div className="self-stretch p-4 bg-[#FFFFFF] rounded-2xl flex flex-col justify-start items-start gap-4">
            <div className="self-stretch inline-flex justify-between items-center">
              <div className="justify-start text-[#292929] text-xl font-bold font-['Inter'] leading-normal">
                Pages ({pages.length})
              </div>
              <button
                className="py-1 rounded-lg flex justify-center items-center gap-2 overflow-hidden"
                onClick={() => openSidebar("addPage")}
              >
                <div className="justify-start text-[#E61E4D] text-base font-medium font-['Inter'] leading-snug">
                  Add Page
                </div>
              </button>
            </div>
            <div className="self-stretch h-0 outline outline-1 outline-offset-[-0.50px] outline-[#ECECEC]"></div>
            <div className="self-stretch flex flex-col justify-start items-start gap-2">
              {pages.map(page => (
                <div key={page.id} className="self-stretch py-1 inline-flex justify-between items-center">
                  <div className="justify-start text-[#3D3D3D] text-base font-medium font-['Inter'] leading-snug">
                    {page.title}
                  </div>
                  <button
                    className="justify-start text-[#656565] text-base font-medium font-['Inter'] underline leading-snug"
                    onClick={() => openSidebar("editPage", page)}
                  >
                    Edit
                  </button>
                </div>
              ))}
            </div>
          </div>
          {/* FAQs Section */}
          <div className="self-stretch p-4 bg-[#FFFFFF] rounded-2xl flex flex-col justify-start items-start gap-4">
            <div className="self-stretch inline-flex justify-between items-center">
              <div className="justify-start text-[#292929] text-xl font-bold font-['Inter'] leading-normal">
                FAQs ({faqs.length})
              </div>
              <div className="w-72 flex justify-end items-center gap-4">
                <div className="relative inline-flex items-center">
                  <select
                    value={selectedFaqCategory}
                    onChange={(e) => setSelectedFaqCategory(e.target.value)}
                    className="px-4 py-2 bg-[#FFFFFF] rounded-full outline outline-1 outline-offset-[-1px] outline-[#656565] text-[#3D3D3D] text-base font-medium font-['Inter'] leading-snug appearance-none pr-10"
                  >
                    {faqCategories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <RiArrowDownSLine className="w-5 h-5 text-[#656565]" />
                  </div>
                </div>
                <button
                  className="py-1 rounded-lg flex justify-center items-center gap-2 overflow-hidden"
                  onClick={() => openSidebar("addFaq")}
                >
                  <div className="justify-start text-[#E61E4D] text-base font-medium font-['Inter'] leading-snug">
                    Add FAQ
                  </div>
                </button>
              </div>
            </div>
            <div className="self-stretch h-0 outline outline-1 outline-offset-[-0.50px] outline-[#ECECEC]"></div>
            <div className="self-stretch flex flex-col justify-start items-start gap-4">
              {filteredFaqs.slice(0, 4).map(faq => (
                <div key={faq.id} className="self-stretch flex flex-col justify-start items-start gap-2">
                  <div className="self-stretch px-3 py-2 bg-[#FFFFFF] rounded-lg outline outline-1 outline-offset-[-1px] outline-[#ECECEC] inline-flex justify-between items-start">
                    <div className="flex justify-start items-center gap-2">
                      <div className="w-6 h-6 relative">
                        <div className="w-4 h-[2px] absolute left-[3.75px] top-[15px] bg-[#656565]" />
                        <div className="w-4 h-[2px] absolute left-[3.75px] top-[9px] bg-[#656565]" />
                      </div>
                      <div className="justify-center text-[#3D3D3D] text-base font-bold font-['Inter'] leading-snug">
                        {faq.question}
                      </div>
                    </div>
                    <div className="flex justify-start items-center gap-4">
                      <button onClick={() => toggleFaq(faq.id)}>
                        {faq.isOpen ? (
                          <RiArrowUpSLine className="w-6 h-6 text-[#656565]" />
                        ) : (
                          <RiArrowDownSLine className="w-6 h-6 text-[#656565]" />
                        )}
                      </button>
                      <button onClick={() => openSidebar("editFaq", faq)}>
                        <RiPencilLine className="w-5 h-5 text-[#656565]" />
                      </button>
                      <button onClick={() => deleteFaq(faq.id)}>
                        <RiDeleteBinLine className="w-5 h-5 text-[#E61E4D]" />
                      </button>
                    </div>
                  </div>
                  {faq.isOpen && (
                    <div className="self-stretch px-3 py-2 text-[#656565] text-sm font-normal font-['Inter'] leading-tight">
                      {faq.answer}
                    </div>
                  )}
                </div>
              ))}
              {filteredFaqs.length > 2 && (
                <button
                  className="self-stretch py-1 rounded-lg inline-flex justify-end items-center gap-2 overflow-hidden"
                  onClick={() => openSidebar("viewFaqs")}
                >
                  <div className="justify-start text-[#E61E4D] text-base font-medium font-['Inter'] leading-snug">
                    View All
                  </div>
                </button>
              )}
            </div>
          </div>
        </div>
        <div className="w-1/2 inline-flex flex-col justify-start items-start gap-4">
          {/* Categories Section */}
          <div className="self-stretch p-4 bg-[#FFFFFF] rounded-2xl flex flex-col justify-start items-end gap-4">
            <div className="self-stretch inline-flex justify-between items-center">
              <div className="justify-start text-[#292929] text-xl font-bold font-['Inter'] leading-normal">
                Categories ({categories.length})
              </div>
              <button
                className="py-1 rounded-lg flex justify-center items-center gap-2 overflow-hidden"
                onClick={() => openSidebar("addCategory")}
              >
                <div className="justify-start text-[#E61E4D] text-base font-medium font-['Inter'] leading-snug">
                  Add Category
                </div>
              </button>
            </div>
            <div className="self-stretch h-0 outline outline-1 outline-offset-[-0.50px] outline-[#ECECEC]"></div>
            <div className="self-stretch inline-flex justify-start items-center gap-2 flex-wrap content-center">
              {categories.slice(0, 17).map(category => (
                <button
                  key={category.id}
                  className="px-3 py-2 rounded-3xl outline outline-1 outline-offset-[-1px] outline-[#ECECEC] flex justify-start items-center gap-2"
                  onClick={() => openSidebar("editCategory", category)}
                >
                  <div className="w-5 h-5">
                    <i className="ri-quill-pen-line text-zinc-400"></i>
                  </div>
                  <div className="justify-start text-[#3D3D3D] text-sm font-medium font-['Inter'] leading-tight">
                    {category.name}
                  </div>
                </button>
              ))}
            </div>
            {categories.length > 5 && (
              <button
                className="self-stretch py-1 rounded-lg inline-flex justify-end items-center gap-2 overflow-hidden"
                onClick={() => openSidebar("viewCategories")}
              >
                <div className="justify-start text-[#E61E4D] text-base font-medium font-['Inter'] leading-snug">
                  View All
                </div>
              </button>
            )}
          </div>
          {/* Location Section */}
          <div className="self-stretch p-4 bg-[#FFFFFF] rounded-2xl flex flex-col justify-start items-start gap-4">
            <div className="self-stretch inline-flex justify-between items-center">
              <div className="justify-start text-[#292929] text-xl font-bold font-['Inter'] leading-normal">
                Location ({locations.length})
              </div>
              <button
                className="py-1 rounded-lg flex justify-center items-center gap-2 overflow-hidden"
                onClick={() => openSidebar("addLocation")}
              >
                <div className="justify-start text-[#E61E4D] text-base font-medium font-['Inter'] leading-snug">
                  Add Location
                </div>
              </button>
            </div>
            <div className="self-stretch h-0 outline outline-1 outline-offset-[-0.50px] outline-[#ECECEC]"></div>
            <div className="self-stretch flex flex-col justify-start items-start gap-2">
              {locations.slice(0, 6).map(location => (
                <div key={location.id} className="self-stretch py-1 inline-flex justify-between items-center">
                  <div className="justify-start text-[#292929] text-base font-medium font-['Inter'] leading-snug">
                    {location.name}
                  </div>
                  <button
                    className="justify-start text-[#656565] text-sm font-normal font-['Inter'] underline leading-tight"
                    onClick={() => openSidebar("editLocation", location)}
                  >
                    {location.categoryCount} categories
                  </button>
                </div>
              ))}
              {locations.length > 6 && (
                <button
                  className="self-stretch py-1 rounded-lg inline-flex justify-end items-center gap-2 overflow-hidden"
                  onClick={() => openSidebar("viewLocations")}
                >
                  <div className="justify-start text-[#E61E4D] text-base font-medium font-['Inter'] leading-snug">
                    View All
                  </div>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* Sidebar */}
      <ContentManagementSidebar
        isOpen={isSidebarOpen}
        mode={sidebarMode}
        editItem={editItem}
        onClose={closeSidebar}
        onSavePage={handleSavePage}
        onSaveFaq={handleSaveFaq}
        onSaveCategory={handleSaveCategory}
        onSaveLocation={handleSaveLocation}
        faqs={faqs}
        categories={categories}
        locations={locations}
        faqCategories={faqCategories}
        onDeleteFaq={deleteFaq}
        onEditItem={openSidebar}
        onDeleteCategory={deleteCategory}
      />
    </div>
  );
}

export default ContentManagement;