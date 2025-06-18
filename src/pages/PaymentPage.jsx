import React from "react";
import "../asset/css/PaymentPage.css";

const PaymentPage = () => {
  return (
    <div className="kaab-payment-container">
      <h1 className="kaab-payment-heading">Payment & Billing</h1>
      <p className="kaab-payment-subtext">View your payments, view balance and credits</p>

      <div className="kaab-credit-box">
        <p className="kaab-credit-title">Available Credit</p>
        <h2 className="kaab-credit-amount">$150</h2>
      </div>

      <div className="kaab-transaction-section">
        <h3 className="kaab-transaction-heading">Transaction History Table</h3>
        <div className="kaab-search-filter-bar">
          <input
            type="text"
            className="kaab-search-input"
            placeholder="Search by name, email, or user ID..."
          />
          <div className="kaab-filter-buttons">
            <select
              className="kaab-filter-select"
            >
              <option value="All">All Types</option>
              <option value="Payout">Payout</option>
              <option value="Payment">Payment</option>
              <option value="Refund">Refund</option>
            </select>

            <select
              className="kaab-filter-select"
            >
              <option value="All">All Statuses</option>
              <option value="Completed">Completed</option>
              <option value="Pending">Pending</option>
              <option value="Canceled">Canceled</option>
            </select>
          </div>
        </div>

        <table className="kaab-transaction-table">
          <thead>
            <tr>
              <th><input type="checkbox" /></th>
              <th>Date</th>
              <th>Transaction ID</th>
              <th>Type</th>
              <th>Event / Description</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><input type="checkbox" /></td>
              <td>Apr 21</td>
              <td>#1024</td>
              <td>Payout</td>
              <td><span className="kaab-event-link">Gala Night Booking</span></td>
              <td><span className="kaab-status kaab-status-completed">Completed</span></td>
              <td><button className="kaab-invoice-btn">Invoice ⬇</button></td>
            </tr>
            <tr>
              <td><input type="checkbox" /></td>
              <td>Apr 20</td>
              <td>#4315</td>
              <td>Payment</td>
              <td><span className="kaab-event-link">Spring Beach Party</span></td>
              <td><span className="kaab-status kaab-status-pending">Pending</span></td>
              <td><button className="kaab-invoice-btn">Invoice ⬇</button></td>
            </tr>
            <tr>
              <td><input type="checkbox" /></td>
              <td>Apr 19</td>
              <td>#2211h</td>
              <td>Refund</td>
              <td><span className="kaab-event-link">Canceled Corporate Gig</span></td>
              <td><span className="kaab-status kaab-status-canceled">Canceled</span></td>
              <td><button className="kaab-invoice-btn">Invoice ⬇</button></td>
            </tr>
            <tr>
              <td><input type="checkbox" /></td>
              <td>Apr 15</td>
              <td>#5697</td>
              <td>Payout</td>
              <td><span className="kaab-event-link">Event</span></td>
              <td><span className="kaab-status kaab-status-canceled">Canceled</span></td>
              <td><button className="kaab-invoice-btn">Invoice ⬇</button></td>
            </tr>
          </tbody>
        </table>

        <div className="kaab-pagination">Showing 20 of 200</div>
      </div>
    </div>
  );
};

export default PaymentPage;
