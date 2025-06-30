import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BASE_URLS from "../config";
import { format } from "date-fns";

const statusColors = {
  Resolved: "bg-green-100 text-green-700",
  "In-progress": "bg-gray-100 text-gray-700",
};

function Contact() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [tickets, setTickets] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await axios.get(`${BASE_URLS.BACKEND_BASEURL}contact/user`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        // Map API response to table structure
        const formattedTickets = response.data.map((ticket) => {
          const date = ticket.createdAt ? format(new Date(ticket.createdAt), "MMM dd, yyyy") : "NA";
          return {
            id: ticket._id,
            subject: ticket.subject,
            date,
            status: ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1), // Capitalize status
          };
        });
        setTickets(formattedTickets);
      } catch (error) {
        console.error("Error fetching tickets:", error);
        setTickets([]); // Set empty array on error
      }
    };
    fetchTickets();
  }, []);

  const filteredTickets = tickets.filter((ticket) => {
    const matchSearch =
      ticket.id.toLowerCase().includes(search.toLowerCase()) ||
      ticket.subject.toLowerCase().includes(search.toLowerCase());

    const matchStatus = statusFilter === "" || ticket.status === statusFilter;

    return matchSearch && matchStatus;
  });

  return (
    <div className="mx-auto py-6">
      {/* Back link */}
      <button className="text-sm text-gray-500 mb-4 flex items-center">
        <i className="ri-arrow-left-line mr-1 text-lg" />
        Back
      </button>

      {/* Heading */}
      <div className="flex justify-between items-center mb-4">
        <div className="self-stretch inline-flex flex-col justify-start items-start gap-1">
          <h1 className="text-4xl font-bold font-['Inter'] leading-10">Your Support Tickets</h1>
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
          <div className="p-2 bg-pink-100 flex justify-start items-center">
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

        <div className="relative">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none"
          >
            <option value="">All Status</option>
            <option value="In-progress">In Progress</option>
            <option value="Resolved">Resolved</option>
          </select>
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
              <th className="w-92 self-stretch p-3 border border-zinc-200 text-sm font-medium font-['Inter'] leading-tight">
                Subject
              </th>
              <th className="py-2 border border-zinc-200 text-sm font-medium font-['Inter'] leading-tight px-3">
                Date Submitted
              </th>
              <th className="py-3 w-44 border border-zinc-200 text-sm font-medium font-['Inter'] leading-tight px-3 border-gray-200">
                Status
              </th>
              <th className="py-3 w-34 border px-3 border-zinc-200 text-sm font-medium font-['Inter'] leading-tights">
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
                <td className="w-34 self-stretch px-3 py-6 border-r border-zinc-200">#{ticket.id.slice(-6)}</td>
                <td className="py-6 px-4 border-r border-zinc-200">{ticket.subject}</td>
                <td className="py-6 px-4 border-r border-zinc-200">{ticket.date}</td>
                <td className="py-6 px-4 border-r border-zinc-200">
                  <span
                    className={`px-3 py-2 bg-[#F9F9F9] rounded-full outline outline-1 outline-offset-[-1px] outline-[#ECECEC] inline-flex justify-start items-center gap-2 ${
                      statusColors[ticket.status] || "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {ticket.status}
                  </span>
                </td>
                <td className="px-3 py-6 justify-center items-center border-r border-zinc-200">
                  <button
                    onClick={() => navigate(`/dashboard/support/ticket/${ticket.id}`)}
                    className="text-[#E61E4D] border-1 border-[#E61E4D] px-3 py-2 font-normal font-['Inter'] leading-tight rounded-full text-xs hover:bg-pink-50"
                  >
                    View Ticket
                  </button>
                </td>
              </tr>
            ))}
            {filteredTickets.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center py-6 text-sm text-gray-500">
                  No tickets found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Contact;