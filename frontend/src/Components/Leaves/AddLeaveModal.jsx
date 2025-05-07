import React, { useState } from "react";
import { X, CalendarDays, Upload, Search } from "lucide-react";
import axios from "axios";
import "./AddLeaveModal.css";

const AddLeaveModal = ({ onClose }) => {
  const [formData, setFormData] = useState({
    employeeName: "",
    designation: "",
    leaveDate: "",
    reason: "",
  });
  const [document, setDocument] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setDocument(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!document || document.type !== "application/pdf") {
      alert("Please upload a valid PDF file.");
      return;
    }

    const data = new FormData();
    data.append("employeeName", formData.employeeName);
    data.append("designation", formData.designation);
    data.append("leaveDate", formData.leaveDate);
    data.append("reason", formData.reason);
    data.append("document", document);

    const token = localStorage.getItem("token");

    try {
      const res = await axios.post(
        "http://localhost:3000/api/leaves/add-leave",
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Leave request created successfully!");
      onClose();

      console.log(res);
    } catch (err) {
      console.error(err);
      alert("Failed to create leave.");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h2>Add New Leave</h2>
          <X size={20} className="close-icon" onClick={onClose} />
        </div>

        <form className="modal-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="input-group">
              <Search size={16} className="input-icon" />
              <input
                type="text"
                name="employeeName"
                placeholder="Search Employee Name"
                value={formData.employeeName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="input-group">
              <input
                type="text"
                name="designation"
                placeholder="Designation*"
                value={formData.designation}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="input-group">
              <CalendarDays size={16} className="input-icon" />
              <input
                type="date"
                name="leaveDate"
                value={formData.leaveDate}
                onChange={handleChange}
                required
              />
            </div>
            <div className="input-group">
              <Upload size={16} className="input-icon" />
              <input
                type="file"
                accept="application/pdf"
                onChange={handleFileChange}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="input-group full">
              <input
                type="text"
                name="reason"
                placeholder="Reason*"
                value={formData.reason}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <button className="save-btn" type="submit">Save</button>
        </form>
      </div>
    </div>
  );
};

export default AddLeaveModal;
