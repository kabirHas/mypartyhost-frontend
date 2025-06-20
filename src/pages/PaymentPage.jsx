import React from "react";
import "../asset/css/PaymentPage.css";

const PaymentPage = () => {
  const transactions = [
    {
      date: "Apr 21",
      id: "#1024",
      type: "Payout",
      description: "Gala Night Booking",
      status: "Completed",
      statusColor: "bg-[#D3FFCC]",
    },
    {
      date: "Apr 20",
      id: "#4315",
      type: "Payment",
      description: "Spring Beach Party",
      status: "Pending",
      statusColor: "bg-[#FFDBB7]",
    },
    {
      date: "Apr 19",
      id: "#2211h",
      type: "Refund",
      description: "Canceled Corporate Gig",
      status: "Canceled",
      statusColor: "bg-[#FFCCD3]",
    },
    {
      date: "Apr 15",
      id: "#5697",
      type: "Payout",
      description: "Event",
      status: "Canceled",
      statusColor: "bg-[#FFCCD3]",
    },
  ];

  return (
    <div className="kaab-payment-container">
      <h1 className="kaab-payment-heading">Payment & Billing</h1>
      <p className="kaab-payment-subtext">
        View your payments, view balance and credits
      </p>

      <div className="kaab-credit-box">
        <p className="kaab-credit-title">Available Credit</p>
        <h2 className="kaab-credit-amount">$150</h2>
      </div>

      <div className="kaab-transaction-section">
        <h3 className="kaab-transaction-heading">Transaction History Table</h3>
        <div className="kaab-search-filter-bar">
          <div className="search-box-c d-flex">
            <img src="/images/search-icon.png" alt="icon" />
            <input
              type="text"
              className="kaab-search-input"
              placeholder="Search by name, email, or user ID..."
            />
          </div>

          <div className="kaab-filter-buttons">
            <select className="kaab-filter-select">
              <option value="All">Booking Payments</option>
              <option value="Payout">Payout</option>
              <option value="Payment">Payment</option>
              <option value="Refund">Refund</option>
            </select>

            <select className="kaab-filter-select">
              <option value="All">Completed</option>
              <option value="Completed">Completed</option>
              <option value="Pending">Pending</option>
              <option value="Canceled">Canceled</option>
            </select>
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
              <span className="text-[#3D3D3D] text-sm font-medium font-['Inter']">
                Date
              </span>
            </div>
            <div className="w-[130px] p-3 border-r border-[#ECECEC] flex justify-center items-center">
              <span className="text-[#3D3D3D] text-sm font-medium font-['Inter']">
                Transaction ID
              </span>
            </div>
            <div className="flex-1 p-3 border-r border-[#ECECEC] flex justify-center items-center">
              <span className="text-[#3D3D3D] text-sm font-medium font-['Inter']">
                Type
              </span>
            </div>
            <div className="flex-1 p-3 border-r border-[#ECECEC] flex justify-center items-center">
              <span className="text-[#3D3D3D] text-sm font-medium font-['Inter']">
                Event / Description
              </span>
            </div>
            <div className="w-[140px] p-3 border-r border-[#ECECEC] flex justify-center items-center">
              <span className="text-[#3D3D3D] text-sm font-medium font-['Inter']">
                Status
              </span>
            </div>
            <div className="flex-1 p-3 flex justify-center items-center">
              <span className="text-[#3D3D3D] text-sm font-medium font-['Inter']">
                Actions
              </span>
            </div>
          </div>

          {transactions.map((transaction, index) => (
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
                <span className="text-[#3D3D3D] text-sm font-normal font-['Inter']">
                  {transaction.date}
                </span>
              </div>
              <div className="w-[130px] py-6 px-3 border-r border-[#EAEAEA] flex justify-center items-center">
                <span className="text-[#3D3D3D] text-sm font-normal font-['Inter']">
                  {transaction.id}
                </span>
              </div>
              <div className="flex-1 py-6 px-3 border-r border-[#EAEAEA] flex justify-center items-center">
                <span className="text-[#3D3D3D] text-sm font-normal font-['Inter']">
                  {transaction.type}
                </span>
              </div>
              <div className="flex-1 py-6 px-3 border-r border-[#EAEAEA] flex justify-center items-center">
                <span className="text-[#E61E4D] text-sm font-normal font-['Inter'] underline">
                  {transaction.description}
                </span>
              </div>
              <div className="w-[140px] py-6 px-3 border-r border-[#EAEAEA] flex justify-center items-center">
                <div
                  className={`${transaction.statusColor} px-4 py-2 rounded-full flex justify-center items-center`}
                >
                  <span className="text-[#292929] text-xs font-normal font-['Inter']">
                    {transaction.status}
                  </span>
                </div>
              </div>
              <div className="flex-1 py-6 px-3 flex justify-center items-center gap-4">
                <div className="flex items-center gap-2 px-3 py-2 bg-white border border-[#ECECEC] rounded-full">
                  <span className="text-[#3D3D3D] text-sm font-medium font-['Inter']">
                    Invoice
                  </span>
                  <img src="/images/DownloadSimple.png" alt="download" />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-2 pagnations">
      <span className="text-[#292929] text-base font-normal font-['Inter'] leading-4">
        Showing
      </span>
      <div className="flex items-center gap-1 px-2 py-1 bg-[#F9F9F9] rounded-lg border border-[#656565]">
        <select className="text-[#292929] text-xs font-normal font-['Inter'] leading-[14.4px]">
          <option value="20">20</option>
        </select>
      </div>
      <span className="text-[#292929] text-base font-normal font-['Inter'] leading-4">
        of 200
      </span>
    </div>
      </div>
    </div>
  );
};

export default PaymentPage;
