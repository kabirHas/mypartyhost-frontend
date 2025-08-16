import React, { useState, useEffect } from "react";
import "../asset/css/PaymentPage.css";
import axios from "axios";

const PaymentPage = () => {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [credit, setCredit] = useState("No Credit Available"); // dynamic credit state
  const [creditSymbol, setCreditSymbol] = useState("");
  const [loadingCredit, setLoadingCredit] = useState(true);

  const [payments, setPayments] = useState([]); // State to store payment data
  const [loadingPayments, setLoadingPayments] = useState(true);
  const [transactions, setTransactions] = useState([]);
  const [loadingTransactions, setLoadingTransactions] = useState(true);

  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [currentPage, setCurrentPage] = useState(1);


  const token = localStorage.getItem("token");

 useEffect(() => {
  const fetchCredit = async () => {
    try {
      const res = await axios.get(
        "https://mypartyhost.onrender.com/api/wallet",
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Wallet API Response:", res.data);

      // API ke data se credit aur symbol set karo
      setCredit(res.data.balance || 0);
      setCreditSymbol(res.data.currency || "");
    } catch (err) {
      console.error("Error fetching wallet balance:", err);
    } finally {
      setLoadingCredit(false);
    }
  };

  if (token) {
    fetchCredit();
  } else {
    console.warn("No token found in localStorage");
    setLoadingCredit(false);
  }
}, [token]);




// Fetching payment data
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await axios.get(
          "https://mypartyhost.onrender.com/api/payment",
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // Map API response into UI format
        const mappedData = res.data.map((item) => {
          let type = "";
          let displayStatus = "";
          let statusColor = "";

          if (item.status === "pending") {
            type = "Payment";
            displayStatus = "Pending";
            statusColor = "bg-[#FFDBB7]";
          } else if (item.status === "refunded") {
            type = "Refund";
            displayStatus = "Canceled";
            statusColor = "bg-[#FFCCD3]";
          } else if (item.status === "paid") {
            type = "Payout";
            displayStatus = "Completed";
            statusColor = "bg-[#D3FFCC]";
          }

          return {
            date: new Date(item.createdAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            }),
            id: item._id,
            type,
            description: item.jobId.jobTitle || "N/A",
            status: displayStatus,
            statusColor,
          };
        });

        setTransactions(mappedData);
      } catch (err) {
        console.error("Error fetching transactions:", err);
      } finally {
        setLoadingTransactions(false);
      }
    };

    if (token) {
      fetchTransactions();
    } else {
      setLoadingTransactions(false);
    }
  }, [token]);


// const totalItems = filteredTransactions.length;
//   const totalPages = Math.ceil(totalItems / itemsPerPage);
//   const startIndex = (currentPage - 1) * itemsPerPage;
//   const endIndex = startIndex + itemsPerPage;
//   const paginatedTransactions = filteredTransactions.slice(startIndex, endIndex);


//     const handleItemsPerPageChange = (e) => {
//     setItemsPerPage(Number(e.target.value));
//     setCurrentPage(1); 
//   };



  // const transactions = [
  //   {
  //     date: "Apr 21",
  //     id: "#1024",
  //     type: "Payout",
  //     description: "Gala Night Booking",
  //     status: "Completed",
  //     statusColor: "bg-[#D3FFCC]",
  //   },
  //   {
  //     date: "Apr 20",
  //     id: "#4315",
  //     type: "Payment",
  //     description: "Spring Beach Party",
  //     status: "Pending",
  //     statusColor: "bg-[#FFDBB7]",
  //   },
  //   {
  //     date: "Apr 19",
  //     id: "#2211h",
  //     type: "Refund",
  //     description: "Canceled Corporate Gig",
  //     status: "Canceled",
  //     statusColor: "bg-[#FFCCD3]",
  //   },
  //   {
  //     date: "Apr 15",
  //     id: "#5697",
  //     type: "Payout",
  //     description: "Event",
  //     status: "Canceled",
  //     statusColor: "bg-[#FFCCD3]",
  //   },
  // ];
   const filteredTransactions = transactions.filter((t) => {
    const searchText = search.toLowerCase();
    const matchSearch =
      t.date.toLowerCase().includes(searchText) ||
      t.id.toLowerCase().includes(searchText) ||
      t.type.toLowerCase().includes(searchText) ||
      t.description.toLowerCase().includes(searchText) ||
      t.status.toLowerCase().includes(searchText);

    const matchType = typeFilter === "" || t.type === typeFilter;
    const matchStatus = statusFilter === "" || t.status === statusFilter;

    return matchSearch && matchType && matchStatus;
  });


  const totalItems = filteredTransactions.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedTransactions = filteredTransactions.slice(startIndex, endIndex);

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1); // Reset to first page when items per page changes
  };






  return (
    <div className="kaab-payment-container">
      <h1 className="kaab-payment-heading">Payment & Billing</h1>
      <p className="kaab-payment-subtext">
        View your payments, view balance and credits
      </p>

      <div className="kaab-credit-box">
        <p className="kaab-credit-title">Available Credit</p>
        <h2 className="kaab-credit-amount">
          {loadingCredit ? "Loading..." : `${creditSymbol} ${"-",credit}`}
          {/* $150 */}
          </h2>
      </div>

      <div className="kaab-transaction-section">
        <h3 className="kaab-transaction-heading">Transaction History Table</h3>

        {/* Search and Filter */}
        <div className="kaab-search-filter-bar">
          <div className="search-box-c d-flex">
            <img src="/images/search-icon.png" alt="icon" />
            <input
              type="text"
              className="kaab-search-input"
              placeholder="Search by Date, ID, Type, Description or Status"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>



          <div className="flex flex-wrap gap-2 sm:gap-4">
            <div className="relative inline-flex items-center">
              <select
                className="pl-3 pr-[25px] py-2 bg-[#FFFFFF] rounded-full outline outline-1 outline-offset-[-1px] outline-[#656565] text-Token-Text-Secondary text-sm font-medium font-['Inter'] leading-tight appearance-none"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <option value="">All Types</option>
              <option value="Payout">Payout</option>
              <option value="Payment">Payment</option>
              <option value="Refund">Refund</option>
              </select>
              <div className="absolute right-2 pointer-events-none">
                <div className="w-5 h-5 relative flex items-center justify-center">
                  <i class="ri-arrow-down-s-line"></i>
                </div>
              </div>
            </div>
            <div className="relative inline-flex items-center">
              <select
                className="pl-3 pr-[25px] py-2  bg-[#FFFFFF] rounded-full outline outline-1 outline-offset-[-1px] outline-[#656565] text-Token-Text-Secondary text-sm font-medium font-['Inter'] leading-tight appearance-none"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">All Status</option>
              <option value="Completed">Completed</option>
              <option value="Pending">Pending</option>
              <option value="Canceled">Canceled</option>
              </select>
              <div className="absolute right-1 pointer-events-none">
                <div className="w-5 h-5 relative flex items-center justify-center">
                  <i className="ri-arrow-down-s-line text-Token-Text-Secondary text-lg" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full h-full overflow-hidden rounded-2xl border border-[#ECECEC] flex flex-col zole-table">
          <div className="flex w-full bg-white items-center table-heads">
            <div className="p-2 border-r border-[#ECECEC] flex items-center">
              <div className="w-6 h-6 relative">
                <div className="w-[16.5px] h-[16.5px] absolute left-[3.75px] top-[3.75px] border-2 border-[#656565]"></div>
              </div>
            </div>
            <div className="w-[100px] p-3 border-r border-[#ECECEC] flex justify-center items-center">
              <span className="text-[#3D3D3D] text-sm font-medium">Date</span>
            </div>
            <div className="w-[140px] p-3 border-r border-[#ECECEC] flex justify-center items-center">
              <span className="text-[#3D3D3D] text-sm font-medium">Transaction ID</span>
            </div>
            <div className="flex-1 p-3 border-r border-[#ECECEC] flex justify-center items-center">
              <span className="text-[#3D3D3D] text-sm font-medium">Type</span>
            </div>
            <div className="flex-1 p-3 border-r border-[#ECECEC] flex justify-center items-center">
              <span className="text-[#3D3D3D] text-sm font-medium">Event / Description</span>
            </div>
            <div className="w-[140px] p-3 border-r border-[#ECECEC] flex justify-center items-center">
              <span className="text-[#3D3D3D] text-sm font-medium">Status</span>
            </div>
            <div className="flex-1 p-3 flex justify-center items-center">
              <span className="text-[#3D3D3D] text-sm font-medium">Actions</span>
            </div>
          </div>

          {loadingTransactions ? (
            <div className="w-full p-6 text-center text-gray-500 text-sm">Loading transactions...</div>
          ) : paginatedTransactions.length > 0 ? (
            paginatedTransactions.map((transaction, index) => (
              <div
                key={index}
                className="flex w-full border-b border-[#656565] items-center table-bodies"
              >
                <div className="p-2 border-r border-[#ECECEC] flex items-center">
                  <div className="w-6 h-6 relative">
                    <div className="w-[16.5px] h-[16.5px] absolute left-[3.75px] top-[3.75px] border-2 border-[#656565]"></div>
                  </div>
                </div>
                <div className="w-[100px] py-6 px-3 border-r border-[#EAEAEA] flex justify-center items-center">
                  <span className="text-[#3D3D3D] text-sm">{transaction.date}</span>
                </div>
                <div className="w-[130px] py-6 px-3 border-r border-[#EAEAEA] flex justify-center items-center">
                  <span className="text-[#3D3D3D] text-sm">{transaction.id}</span>
                </div>
                <div className="flex-1 py-6 px-3 border-r border-[#EAEAEA] flex justify-center items-center">
                  <span className="text-[#3D3D3D] text-sm">{transaction.type}</span>
                </div>
                <div className="flex-1 py-6 px-3 border-r border-[#EAEAEA] flex justify-center items-center">
                  <span className="text-[#E61E4D] text-sm underline">{transaction.description}</span>
                </div>
                <div className="w-[140px] py-6 px-3 border-r border-[#EAEAEA] flex justify-center items-center">
                  <div className={`${transaction.statusColor} px-4 py-2 rounded-full`}>
                    <span className="text-[#292929] text-xs">{transaction.status}</span>
                  </div>
                </div>
                <div className="flex-1 py-6 px-3 flex justify-center items-center gap-4">
                  <div className="flex items-center gap-2 px-3 py-2 bg-white border border-[#ECECEC] rounded-full">
                    <span className="text-[#3D3D3D] text-sm font-medium">Invoice</span>
                    <img src="/images/DownloadSimple.png" alt="download" />
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="w-full p-6 text-center text-gray-500 text-sm">No transactions found.</div>
          )}
        </div>

        {/* Pagination Placeholder */}
        <div className="flex items-center gap-2 pagnations mt-4">
          <span className="text-[#292929] text-base">Showing</span>
          <div className="flex items-center gap-1 px-2 py-1 bg-[#F9F9F9] rounded-lg border border-[#656565]">
            <select
            className="text-[#292929] text-xs"
               value={itemsPerPage}
              onChange={handleItemsPerPageChange}
                                >
               <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
          </div>
          <span className="text-[#292929] text-base">of {totalItems}</span>
        </div>
      </div>
      
    </div>
  );
};

export default PaymentPage;
