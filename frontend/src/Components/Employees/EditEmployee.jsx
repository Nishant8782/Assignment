import React, { useState } from 'react';
import axios from 'axios';
import './EditEmployee.css';
import { X, Calendar } from 'lucide-react';

const EditEmployee = ({ employee, onClose, fetchAllEmployees }) => {
  if (!employee) return null;

  const [formData, setFormData] = useState({
    fullname: employee.candidate_name,
    email: employee.email,
    phonenumber: employee.phone_number,
    department: employee.department,
    position: employee.position,
    date_of_joining: employee.date_of_joining,
  });

  console.log("id", employee._id)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const handleSave = async () => {
    const token = localStorage.getItem('token');
    try {
      await axios.put(
        `http://localhost:3000/api/candidates/${employee._id}/edit`,
        formData,{
          headers: {
            Authorization: `Bearer ${token}`,
          }
        }
      );
      alert('Employee details updated successfully!');
      onClose();
      fetchAllEmployees();
    } catch (error) {
      console.error('Error updating employee:', error);
      alert(
        error.response?.data?.message ||
          'Failed to update employee. Please check required fields.'
      );
    }
  };

  return (
    <div className="modal-overlay">
      <div className="employee-modal-content ">
        <div className="Employee-modal-header">
          <p></p>
          <h4>Edit Employee Details</h4>
          <X className="close-icon" onClick={onClose} />
        </div>
        <div className="employee-modal-form">
          <div className="input-group">
            <label>Full Name*</label>
            <input
              type="text"
              name="fullname"
              value={formData.fullname}
              onChange={handleChange}
            />
          </div>
          <div className="input-group">
            <label>Email Address*</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          <div className="input-group">
            <label>Phone Number*</label>
            <input
              type="text"
              name="phonenumber"
              value={formData.phonenumber}
              onChange={handleChange}
            />
          </div>
          <div className="input-group">
            <label>Department*</label>
            <input
              type="text"
              name="department"
              value={formData.department}
              onChange={handleChange}
            />
          </div>
          <div className="input-group">
            <label>Position*</label>
            <select
              name="position"
              value={formData.position}
              onChange={handleChange}
            >
              <option>Intern</option>
              <option>Junior</option>
              <option>Senior</option>
              <option>Team Lead</option>
              <option>Full Time</option>
            </select>
          </div>
          <div className="input-group">
            <label>Date of Joining*</label>
            <div className="date-input-wrapper">
              <input
                type="text"
                name="date_of_joining"
                value={formatDate(formData.date_of_joining)}
                onChange={handleChange}
              />
              <Calendar size={18} />
            </div>
          </div>
        </div>
        <button className="employee-save-btn" onClick={handleSave}>
          Save
        </button>
      </div>
    </div>
  );
};

export default EditEmployee;
