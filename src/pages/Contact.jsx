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
    <div className="max-w-5xl mx-auto py-6">
      {/* Back link */}
      <button className="text-sm text-gray-500 mb-4 flex items-center">
        <i className="ri-arrow-left-line mr-1 text-lg" />
        Back
      </button>

      {/* Heading */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-2xl font-bold">Your Support Tickets</h1>
          <p className="text-sm text-gray-500">
            View the status of any tickets you’ve submitted
          </p>
        </div>
        <button onClick={() => navigate("/dashboard/support/new-ticket")} className="bg-pink-600 text-white px-4 py-2 rounded-md text-sm hover:bg-pink-700">
          Submit New Ticket
        </button>
      </div>

      {/* Search + Filter */}
      <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
        <div className="relative w-full sm:w-1/3">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by Ticket ID or Subject"
            className="w-full pl-12 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none"
          />
          <i className="ri-search-line bg-pink-300 px-2 bg-opacity-40 absolute left-1 top-1/2 transform -translate-y-1/2 text-pink-600 text-lg" />
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
      <div className="overflow-x-auto rounded-lg  ">
        <table className="min-w-full  rounded-lg  border-collapse">
          <thead>
            <tr className="text-left bg-white  text-sm text-gray-600 border-b">
              <th className="py-2 px-4">Ticket Number</th>
              <th className="py-2 px-4">Subject</th>
              <th className="py-2 px-4">Date Submitted</th>
              <th className="py-2 px-4">Status</th>
              <th className="py-2 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredTickets.map((ticket) => (
              <tr key={ticket.id} className="text-sm text-gray-800 border-b hover:bg-gray-50">
                <td className="py-3 px-4">{ticket.id}</td>
                <td className="py-3 px-4">{ticket.subject}</td>
                <td className="py-3 px-4">{ticket.date}</td>
                <td className="py-3 px-4">
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${statusColors[ticket.status]}`}>
                    {ticket.status}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <button className="text-pink-600 border-1 border-pink-600 px-3 py-1 rounded-full text-xs hover:bg-pink-50">
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
