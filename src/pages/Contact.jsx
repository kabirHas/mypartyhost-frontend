import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const ticketsData = [
  { id: "#1024", subject: "Unable to upload profile photo", date: "Apr 18, 2025", status: "In Progress" },
  { id: "#1017", subject: "Instant Book toggle not saving", date: "Apr 15, 2025", status: "Resolved" },
  { id: "#1029", subject: "Payment not appearing in my account", date: "Apr 17, 2025", status: "In Progress" },
  { id: "#1030", subject: "Error when applying to an event", date: "Apr 16, 2025", status: "In Progress" },
];

const statusColors = {
  "Resolved": "bg-green-100 text-green-700",
  "In Progress": "bg-gray-100 text-gray-700",
};

function Contact() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const navigate = useNavigate();

  const filteredTickets = ticketsData.filter((ticket) => {
    const matchSearch =
      ticket.id.toLowerCase().includes(search.toLowerCase()) ||
      ticket.subject.toLowerCase().includes(search.toLowerCase());

    const matchStatus = statusFilter === "" || ticket.status === statusFilter;

    return matchSearch && matchStatus;
  });

  return (
    <div className="  mx-auto py-6">
      {/* Back link */}
      <button className="text-sm text-gray-500 mb-4 flex items-center">
        <i className="ri-arrow-left-line mr-1 text-lg" />
        Back
      </button>

      {/* Heading */}
      <div className="flex justify-between items-center mb-4">
        <div className="self-stretch inline-flex flex-col justify-start items-start gap-1">
          <h1 className="text-4xl font-bold font-['Inter'] leading-10">Your Support Tickets</h1>
          <p className="text-sm text-gray-500  font-normal font-['Inter'] leading-snug -mt-2">
            View the status of any tickets you’ve submitted
          </p>
        </div>
        <button onClick={() => navigate("/dashboard/support/new-ticket")} className="px-6 py-3 text-sm font-medium text-white bg-gradient-to-l from-pink-600 to-rose-600 rounded-lg inline-flex font-['Inter'] leading-snug justify-center items-center gap-2 overflow-hidden">
          Submit New Ticket
        </button>
      </div>

      {/* Search + Filter */}
      <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
      <div className="relative w-full sm:w-1/3 pr-3 bg-zinc-100 rounded-lg outline outline-1 outline-offset-[-1px] outline-zinc-400 inline-flex justify-start items-center gap-3 overflow-hidden">
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
            <option value="">Status</option>
            <option>In Progress</option>
            <option>Resolved</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-2xl border border-gray-200  ">
        <table className="min-w-full   rounded-2xl  border-collapse">
          <thead>
            <tr className="text-left bg-white text-sm font-medium font-['Inter'] leading-tight   text-gray-600 border">
              <th className=" border border-zinc-200 w-34 self-stretch p-3 text-sm font-medium font-['Inter'] leading-tight">Ticket Number</th>
              <th className=" w-92 self-stretch p-3 border border-zinc-200 text-sm font-medium font-['Inter'] leading-tight ">Subject</th>
              <th className="py-2 border border-zinc-200 text-sm font-medium font-['Inter'] leading-tight px-3">Date Submitted</th>
              <th className="py-3 w-44 border border-zinc-200 text-sm font-medium font-['Inter'] leading-tight px-3">Status</th>
              <th className="py-3 w-34 border border-zinc-200 text-sm font-medium font-['Inter'] leading-tight px-3">Actions</th>
            </tr>
          </thead>
          <tbody >
            {filteredTickets.map((ticket) => (
              <tr key={ticket.id} className="text-sm text-gray-800 border-b-[1.2px] border-gray-900 hover:bg-gray-50 last:border-b-0 ">
                <td className=" w-34 self-stretch px-3 py-6   border-r border-zinc-200">{ticket.id}</td>
                <td className="py-6  px-4 border-r border-zinc-200">{ticket.subject}</td>
                <td className="py-6  px-4 border-r border-zinc-200">{ticket.date}</td>
                <td className="py-6  px-4 border-r border-zinc-200">
                  <span className={`px-3 py-2 bg-[#F9F9F9] rounded-full outline outline-1 outline-offset-[-1px] outline-[#ECECEC] inline-flex justify-start items-center gap-2 ${ticket.status === "Resolved" ? 'bg-[#D3FFCC]' : statusColors["In Progress"]}`}>
                    {ticket.status}
                  </span>
                </td>
                <td className="px-3 py-6  justify-center items-center  border-r border-zinc-200">
                  <button className="text-[#E61E4D] border-1 border-[#E61E4D] px-3 py-2  font-normal font-['Inter'] leading-tight rounded-full text-xs hover:bg-pink-50">
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