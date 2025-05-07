import React, { useEffect, useState } from "react";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Search,
  Plus,
} from "lucide-react";
import axios from "axios";
import "./Leaves.css";
import AddLeaveModal from "./AddLeaveModal";

const Leaves = () => {
  const [today, setToday] = useState(new Date());
  const [showModal, setShowModal] = useState(false);
  const [leaveData, setLeaveData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const fetchLeaves = async () => {
    const token = localStorage.getItem("token");

    try {
      const res = await axios.get(
        "http://localhost:3000/api/leaves/get-leaves",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res) {
        setLeaveData(res.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchLeaves();
    const interval = setInterval(() => {
      setToday(new Date());
    }, 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    const token = localStorage.getItem("token");

    try {
      const res = await axios.patch(
        `http://localhost:3000/api/leaves/${id}/status`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setLeaveData((prevData) =>
        prevData.map((leave) =>
          leave._id === id ? { ...leave, status: newStatus } : leave
        )
      );
      console.log("Status updated successfully:", res.data);
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
  const startDay = firstDayOfMonth.getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  const filteredLeaves = leaveData.filter((leave) => {
    const matchesSearch = leave.employeeName
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "" || leave.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="leaves-wrapper">
      {/* Top Controls */}
      <div className="top-bar">
        <div>
          <select
            className="status-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
        <div style={{ display: "flex" }}>
          <div style={{ marginRight: "14px" }} className="search-bar">
            <Search size={16} />
            <input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="add-leave-btn" onClick={() => setShowModal(true)}>
            Add Leave <Plus size={14} />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Left: Leave Details */}
        <div className="leave-details shadow-box">
          <div className="leave-header">
            <span>Profile</span>
            <span>Name</span>
            <span>Date</span>
            <span>Reason</span>
            <span>Status</span>
            <span>Docs</span>
          </div>

          {filteredLeaves.map((leave) => (
            <div key={leave._id} className="leave-row">
              <img
                src={
                  leave.profile ||
                  `https://randomuser.me/api/portraits/men/${Math.floor(
                    Math.random() * 100
                  )}.jpg`
                }
                alt="profile"
                className="profile-pic"
              />
              <div>
                <div>{leave.employeeName}</div>
                <div className="secondary-text">{leave.designation}</div>
              </div>
              <span>
                {new Date(leave.leaveDate).toLocaleDateString()}
              </span>
              <span>{leave.reason}</span>
              <select
                value={leave.status}
                onChange={(e) =>
                  handleStatusChange(leave._id, e.target.value)
                }
                className="status-select"
              >
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
              <a
                href={leave.document}
                target="_blank"
                rel="noopener noreferrer"
              >
                📄
              </a>
            </div>
          ))}
        </div>

        {/* Right: Calendar */}
        <div className="calendar-container shadow-box">
          <div className="calendar-header">
            <span>Leave Calendar</span>
            <div className="calendar-controls">
              <ChevronLeft size={14} />
              <span>
                {today.toLocaleString("default", { month: "long" })},{" "}
                {currentYear}
              </span>
              <ChevronRight size={14} />
            </div>
          </div>

          <div className="calendar-grid">
            {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
              <div key={i} className="calendar-day-name">
                {d}
              </div>
            ))}
            {Array.from({ length: startDay }).map((_, i) => (
              <div key={"empty-" + i} className="calendar-day empty"></div>
            ))}
            {Array.from({ length: daysInMonth }, (_, i) => {
              const day = i + 1;
              const date = new Date(currentYear, currentMonth, day);
              const isToday = date.toDateString() === today.toDateString();
              const isTomorrow =
                date.toDateString() === tomorrow.toDateString();

              return (
                <div
                  key={day}
                  className={`calendar-day ${
                    isToday ? "today" : ""
                  } ${isTomorrow ? "tomorrow" : ""}`}
                >
                  {day}
                </div>
              );
            })}
          </div>

          {/* Approved Leaves */}
          <div className="approved-leaves">
            <h4>Approved Leaves</h4>
            {filteredLeaves
              .filter((leave) => leave.status === "approved")
              .map((leave) => (
                <div key={leave._id} className="approved-entry">
                  <img
                    src={
                      leave.profile ||
                      `https://randomuser.me/api/portraits/men/${Math.floor(
                        Math.random() * 100
                      )}.jpg`
                    }
                    alt="profile"
                    className="profile-pic"
                  />
                  <div>
                    <div>{leave.employeeName}</div>
                    <div className="secondary-text">
                      {leave.designation}
                    </div>
                  </div>
                  <span>
                    {new Date(leave.leaveDate).toLocaleDateString()}
                  </span>
                </div>
              ))}
          </div>
        </div>
      </div>

      {showModal && <AddLeaveModal onClose={() => setShowModal(false)} />}
    </div>
  );
};

export default Leaves;
