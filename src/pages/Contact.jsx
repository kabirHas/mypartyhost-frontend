import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BASE_URLS from "../config";
import { format } from "date-fns";
import { ChatState } from "../Context/ChatProvider";

const statusColors = {
  Open: "bg-blue-100 text-blue-700",
  "In-progress": "bg-orange-100 text-gray-700",
  Closed: "bg-red-100 text-red-700",
  Resolved: "bg-green-100 text-green-700",
};

function Contact() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [emailSubject, setEmailSubject] = useState("");
  const [emailMessage, setEmailMessage] = useState("");
  const navigate = useNavigate();
  const { user } = ChatState();

  const fetchTickets = async () => {
    try {
      const response = await axios.get(
        `${BASE_URLS.BACKEND_BASEURL}contact/user`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const formattedTickets = response.data.map((ticket) => {
        const date = ticket.createdAt
          ? format(new Date(ticket.createdAt), "MMM dd, yyyy")
          : "NA";
        return {
          id: ticket._id,
          subject: ticket.subject,
          date,
          status:
            ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1),
        };
      });
      setTickets(formattedTickets);
    } catch (error) {
      console.error("Error fetching tickets:", error);
      setTickets([]);
    }
  };

  const fetchAdminTickets = async () => {
    try {
      const response = await axios.get(
        `${BASE_URLS.BACKEND_BASEURL}admin/help-and-support`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const formattedTickets = response.data.helpAndSupport.map((ticket) => {
        const date = ticket.createdAt
          ? format(new Date(ticket.createdAt), "MMM dd, yyyy")
          : "NA";
        return {
          id: ticket._id,
          subject: ticket.subject,
          email: ticket.user.email,
          phone: ticket.user.phone,
          userName: ticket.user.name,
          date,
          status:
            ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1),
        };
      });
      setTickets(formattedTickets);
    } catch (error) {
      console.error("Error fetching tickets:", error);
      setTickets([]);
    }
  };

  const fetchTicketDetails = async (ticketId) => {
    try {
      const endpoint =
        user.role === "superadmin"
          ? `${BASE_URLS.BACKEND_BASEURL}contact/${ticketId}`
          : `${BASE_URLS.BACKEND_BASEURL}contact/${ticketId}`;
      const response = await axios.get(endpoint, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      // console.log("Ticket details:", response.data);
      setSelectedTicket(response.data);
      setIsSidebarOpen(true);
    } catch (error) {
      console.error("Error fetching ticket details:", error);
      setSelectedTicket(null);
    }
  };

  const updateTicketStatus = async (ticketId, newStatus) => {
    try {
      const response = await axios.put(
        `${BASE_URLS.BACKEND_BASEURL}contact/${ticketId}/update-status`,
        { status: newStatus.toLowerCase() },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      // Update tickets state
      setTickets((prevTickets) =>
        prevTickets.map((ticket) =>
          ticket.id === ticketId ? { ...ticket, status: newStatus } : ticket
        )
      );
      // Update selected ticket in sidebar
      if (selectedTicket && selectedTicket._id === ticketId) {
        setSelectedTicket({
          ...selectedTicket,
          status: newStatus,
        });
      }
      return response.data;
    } catch (error) {
      console.error("Error updating ticket status:", error);
      throw error;
    }
  };

  const handleSendEmail = (ticketId, email) => {
    // Placeholder for email API call
    console.log("Sending email:", {
      ticketId,
      to: email,
      subject: emailSubject,
      message: emailMessage,
    });
    // Here you would typically call your email API to send the email
    axios
      .post(
        `${BASE_URLS.BACKEND_BASEURL}contact/send-mail`,
        {
          email,
          subject: emailSubject,
          message: emailMessage,
          ticketId: ticketId,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((response) => {
        console.log("Email sent successfully:", response.data);
        setEmailSubject("");
        setEmailMessage("");
      })
      .catch((error) => {
        console.error("Error sending email:", error);
      });
    // Reset email fields
    // alert("Email sending functionality will be implemented once API is ready.");
  };

  useEffect(() => {
    if (user.role !== "superadmin") {
      fetchTickets();
    } else {
      fetchAdminTickets();
    }
  }, []);

  const filteredTickets = tickets.filter((ticket) => {
    const matchSearch =
      ticket.id.toLowerCase().includes(search.toLowerCase()) ||
      ticket.subject.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "" || ticket.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const closeSidebar = () => {
    setIsSidebarOpen(false);
    setSelectedTicket(null);
    setEmailSubject("");
    setEmailMessage("");
  };

  return (
    <div className="mx-auto py-6 relative">
      {/* Back link */}
      <button
        className="text-sm text-gray-500 mb-4 flex items-center"
        onClick={() => navigate("/dashboard/support")}
      >
        <i className="ri-arrow-left-line mr-1 text-lg" />
        Back
      </button>

      {/* Heading */}
      <div className="flex justify-between items-center mb-4">
        <div className="self-stretch inline-flex flex-col justify-start items-start gap-1">
          <h1 className="text-4xl font-bold font-['Inter'] leading-10">
            Your Support Tickets
          </h1>
          <p className="text-sm text-gray-500 font-normal font-['Inter'] leading-snug -mt-2">
            View the status of any tickets you’ve submitted
          </p>
        </div>
        <button
          onClick={() => navigate("/dashboard/support/new-ticket")}
          className="px-6 py-3 rounded-lg text-sm font-medium text-white bg-gradient-to-l from-pink-600 to-rose-600 rounded-LG inline-flex font-['Inter'] leading-snug justify-center items-center gap-2 overflow-hidden"
        >
          Submit New Ticket
        </button>
      </div>

      {/* Search + Filter */}
      <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
        <div className="relative bg-white rounded-lg w-full sm:w-1/3 pr-3 bg-zinc-100 rounded-LG outline outline-1 outline-offset-[-1px] outline-zinc-400 inline-flex justify-start items-center gap-3 overflow-hidden">
          <div className="p-2 bg-pink-100 border border-zinc-200 flex justify-start items-center">
            <svg
              className="w-8 h-8 text-[#E61E4D]"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 32 32"
            >
              <circle cx="14" cy="14" r="8" />
              <line x1="20.07" y1="20.07" x2="24" y2="24" />
            </svg>
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by Ticket ID or Subject"
            className="w-full bg-transparent text-zinc-500 text-sm font-normal font-['Inter'] leading-tight focus:outline-none py-2"
          />
        </div>

        <div className="flex flex-wrap gap-2 sm:gap-4">
          <div className="relative inline-flex items-center">
            <select
              className="pl-3 pr-[25px] py-2 bg-[#FFFFFF] rounded-full outline outline-1 outline-offset-[-1px] outline-[#656565] text-Token-Text-Secondary text-sm font-medium font-['Inter'] leading-tight appearance-none"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">All Status</option>
              <option value="Open">Open</option>
              <option value="In-progress">In Progress</option>
              <option value="Closed">Closed</option>
              <option value="Resolved">Resolved</option>
            </select>
            <div className="absolute right-2 pointer-events-none">
              <div className="w-5 h-5 relative flex items-center justify-center">
                <i className="ri-arrow-down-s-line"></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-2xl border border-gray-200">
        <table className="min-w-full rounded-2xl border-collapse">
          <thead>
            <tr className="text-left bg-white text-sm font-medium font-['Inter'] leading-tight text-gray-600 border">
              <th className="border border-zinc-200 w-34 self-stretch p-3 text-sm font-medium font-['Inter'] leading-tight">
                Ticket Number
              </th>
              {user.role === "superadmin" && (
                <th className="w-92 self-stretch p-3 border border-zinc-200 text-sm font-medium font-['Inter'] leading-tight">
                  User Name
                </th>
              )}
              <th className="w-92 self-stretch p-3 border border-zinc-200 text-sm font-medium font-['Inter'] leading-tight">
                Subject
              </th>
              <th className="py-2 border border-zinc-200 text-sm font-medium font-['Inter'] leading-tight px-3">
                Date Submitted
              </th>
              <th className="py-3 w-44 border border-zinc-200 text-sm font-medium font-['Inter'] leading-tight px-3 border-gray-200">
                Status
              </th>
              <th className="py-3 w-34 border px-3 border-zinc-200 text-sm font-medium font-['Inter'] leading-tight">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredTickets.map((ticket) => (
              <tr
                key={ticket.id}
                className="text-sm text-gray-800 border-b-[1.2px] border-gray-900 hover:bg-gray-50 last:border-b-0"
              >
                <td className="w-34 self-stretch px-3 py-6 border-r border-zinc-200">
                  #{ticket.id.slice(-6)}
                </td>
                {user.role === "superadmin" && (
                  <td className="py-6 px-4 border-r text-[#E61E4D] underline border-zinc-200">
                    {ticket.userName || "N/A"}
                  </td>
                )}
                <td className="py-6 px-4 border-r border-zinc-200">
                  {ticket.subject}
                </td>
                <td className="py-6 px-4 border-r border-zinc-200">
                  {ticket.date}
                </td>
                <td className="py-6 px-4 border-r border-zinc-200">
                  {user.role === "superadmin" ? (
                    <div className="relative inline-flex items-center">
                      <select
                        value={ticket.status}
                        onChange={(e) =>
                          updateTicketStatus(ticket.id, e.target.value)
                        }
                        className="pl-3 pr-[25px] py-2 bg-[#FFFFFF] rounded-full outline outline-1 outline-offset-[-1px] outline-[#656565] text-sm font-medium font-['Inter'] leading-tight appearance-none"
                      >
                        <option value="Open">Open</option>
                        <option value="In-progress">In Progress</option>
                        <option value="Closed">Closed</option>
                        <option value="Resolved">Resolved</option>
                      </select>
                      <div className="absolute right-2 pointer-events-none">
                        <div className="w-5 h-5 relative flex items-center justify-center">
                          <i className="ri-arrow-down-s-line"></i>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <span
                      className={`px-3 py-2 bg-[#F9F9F9] rounded-full text-xs outline outline-1 outline-offset-[-1px] outline-[#ECECEC] inline-flex justify-start items-center gap-2 ${
                        statusColors[ticket.status] ||
                        "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {ticket.status}
                    </span>
                  )}
                </td>
                <td className="px-3 py-6 justify-center items-center border-r border-zinc-200">
                  <button
                    onClick={() => fetchTicketDetails(ticket.id)}
                    className="text-[#E61E4D] border-1 border-[#E61E4D] px-3 py-2 font-normal font-['Inter'] leading-tight rounded-full text-xs hover:bg-pink-50"
                  >
                    View Ticket
                  </button>
                </td>
              </tr>
            ))}
            {filteredTickets.length === 0 && (
              <tr>
                <td
                  colSpan={user.role === "superadmin" ? 6 : 5}
                  className="text-center py-6 text-sm text-gray-500"
                >
                  No tickets found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-1/3 overflow-y-auto scrollbar-hide bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "translate-x-full"
        } z-50`}
      >
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-bold">Ticket Details</h2>
          <button
            onClick={closeSidebar}
            className="text-gray-500 hover:text-gray-700"
          >
            <i className="ri-close-line text-xl"></i>
          </button>
        </div>
        {selectedTicket ? (
          <div className="p-4">
            <p className="text-sm mb-2 text-[#E61E4D]">
              <strong className="text-zinc-800">Ticket ID:</strong> #
              {selectedTicket._id?.slice(-6) || "N/A"}
            </p>
            {user.role === "superadmin" && (
              <div className="w-full flex my-4 items-center gap-4  ">
                <img
                  src={selectedTicket.user.profileImage}
                  alt={selectedTicket.user.name}
                  className="w-24 h-24 rounded-full"
                />
                <div>
                  <p className="text-sm mb-2 capitalize">
                    <strong className="text-zinc-800 ">User Name:</strong>{" "}
                    {selectedTicket.user.name || "N/A"}
                  </p>
                  <p className="text-sm mb-2  text-[#E61E4D]">
                    <strong className="text-zinc-800">Email:</strong>{" "}
                    {selectedTicket.user.email || "N/A"}
                  </p>
                  <p className="text-sm mb-2 capitalize">
                    <strong className="text-zinc-800">Phone:</strong>{" "}
                    {selectedTicket.user.phone || "N/A"}
                  </p>
                  <p className="text-sm mb-2 capitalize">
                    <strong className="text-zinc-800">Role:</strong>{" "}
                    {selectedTicket.user.role || "N/A"}
                  </p>
                  
                </div>
              </div>
            )}
            <p className="text-sm mb-2">
              <strong>Subject:</strong> {selectedTicket.subject || "N/A"}
            </p>
            <div className="text-sm mb-2">
              <strong>Status:</strong>{" "}
              {user.role === "superadmin" ? (
                <div className="relative ml-2 inline-flex items-center">
                  <select
                    value={selectedTicket.status}
                    onChange={(e) =>
                      updateTicketStatus(selectedTicket._id, e.target.value)
                    }
                    className="pl-3 pr-[25px] py-2 bg-[#FFFFFF] rounded-full outline outline-1 outline-offset-[-1px] outline-[#656565] text-sm font-medium font-['Inter'] leading-tight appearance-none"
                  >
                    <option value="open">Open</option>
                    <option value="in-progress">In Progress</option>
                    <option value="closed">Closed</option>
                    <option value="resolved">Resolved</option>
                  </select>
                  <div className="absolute right-2 pointer-events-none">
                    <div className="w-5 h-5 relative flex items-center justify-center">
                      <i className="ri-arrow-down-s-line"></i>
                    </div>
                  </div>
                </div>
              ) : (
                <span
                  className={`px-2 py-1 rounded-full ${
                    statusColors[selectedTicket.status] ||
                    "bg-gray-100 text-gray-700"
                  }`}
                >
                  {selectedTicket.status || "N/A"}
                </span>
              )}
            </div>
            <p className="text-sm mb-2">
              <strong>Date Submitted:</strong>{" "}
              {selectedTicket.createdAt
                ? format(new Date(selectedTicket.createdAt), "MMM dd, yyyy")
                : "N/A"}
            </p>

            <p className="text-sm mb-2">
              <strong>Description:</strong>{" "}
              {selectedTicket.description || "N/A"}
            </p>
            {/* {user.role === "superadmin" && (
              <>
                <p className="text-sm mb-2">
                  <strong>User Name:</strong>{" "}
                  {selectedTicket.user?.name || "N/A"}
                </p>
                <p className="text-sm mb-2 text-[#E61E4D] ">
                  <strong className="text-zinc-800">Email:</strong>{" "}
                  <span className="underline">
                    {selectedTicket.user?.email || "N/A"}
                  </span>
                </p>
                <p className="text-sm mb-2">
                  <strong>Phone:</strong> {selectedTicket.user?.phone || "N/A"}
                </p>
                <p className="text-sm mb-2">
                  <strong>Role:</strong> {selectedTicket.user?.role || "N/A"}
                </p>
              </>
            )} */}
            <div>
              <strong className="text-sm mb-2">Attachments:</strong>
              {selectedTicket.attachments?.map((attachment, index) => (
                <img
                  src={attachment}
                  alt={`Attachment ${index + 1}`}
                  key={index}
                />
              ))}
            </div>
            {selectedTicket.response && (
              <p className="text-sm mb-2">
                <strong>Response:</strong> {selectedTicket.response}
              </p>
            )}
            {user.role === "superadmin" && (
              <div className="mt-4">
                <h3 className="text-sm font-bold mb-2">Send Email</h3>
                <input
                  type="text"
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                  placeholder="Email Subject"
                  className="w-full bg-zinc-100 rounded-lg outline outline-1 outline-zinc-400 text-sm font-normal font-['Inter'] leading-tight focus:outline-none py-2 px-3 mb-2"
                />
                <textarea
                  value={emailMessage}
                  onChange={(e) => setEmailMessage(e.target.value)}
                  placeholder="Email Message"
                  className="w-full bg-zinc-100 rounded-lg outline outline-1 outline-zinc-400 text-sm font-normal font-['Inter'] leading-tight focus:outline-none py-2 px-3 mb-2"
                  rows="4"
                />
                <button
                  onClick={() =>
                    handleSendEmail(
                      selectedTicket._id,
                      selectedTicket.user?.email
                    )
                  }
                  className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-gradient-to-l from-pink-600 to-rose-600 inline-flex font-['Inter'] leading-snug justify-center items-center"
                >
                  Send Email
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="p-4 text-sm text-gray-500">
            Loading ticket details...
          </div>
        )}
      </div>

      {/* Overlay for sidebar */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-10 z-40"
          onClick={closeSidebar}
        ></div>
      )}
    </div>
  );
}

export default Contact;
