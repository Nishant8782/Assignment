import React, { useEffect, useState } from "react";
import { ChevronDown, MoreVertical } from "lucide-react";
import "./Attendence.css";
import axios from "axios";

const Attendence = () => {
  const [data, setData] = useState([]);
  const [filter, setFilter] = useState("All");
  const [rowStatus, setRowStatus] = useState({});
  const [searchTerm, setSearchTerm] = useState(""); // state for search input

  const fetchAllEmployees = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const res = await axios.get('http://localhost:3000/api/candidates/selected', {
        headers,
        withCredentials: true,
      });
      setData(res.data);
    } catch (error) {
      console.log('Error fetching candidates:', error.response?.data || error.message);
    }
  };

  // Fetching employee data on mount
  useEffect(() => {
    fetchAllEmployees();
  }, []);

  // Setting the initial status for each row to "Present"
  useEffect(() => {
    const initialStatus = {};
    data.forEach((_, index) => {
      initialStatus[index] = "Present"; // default value
    });
    setRowStatus(initialStatus);
  }, [data]);

  // Filter data based on the selected status and search term
  const filteredData = data.filter((emp, index) => {
    const matchesStatus = filter === "All" || rowStatus[index] === filter;
    const matchesSearchTerm = emp.candidate_name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearchTerm;
  });

  return (
    <div className="attendance-container">
      <div className="attendance-header">
        <div className="dropdown">
          <select
            className="dropdown-btn"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="All">All</option>
            <option value="Present">Present</option>
            <option value="Absent">Absent</option>
          </select>
        </div>
        <input
          type="text"
          placeholder="Search by Name"
          className="search-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)} // update search term
        />
      </div>

      <div className="attendance-table-container">
        <table className="attendance-table">
          <thead>
            <tr>
              <th>Profile</th>
              <th>Employee Name</th>
              <th>Position</th>
              <th>Department</th>
              <th>Task</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((emp, index) => (
              <tr key={index}>
                <td><img src={emp.profile || `https://randomuser.me/api/portraits/men/${Math.floor(Math.random() * 100)}.jpg`} alt="profile" className="profile-img" /></td>
                <td>{emp.candidate_name}</td>
                <td>{emp.position}</td>
                <td>{emp.department}</td>
                <td>{emp.task}</td>
                <td>
                  <select
                    className={`status-badge ${rowStatus[index]?.toLowerCase()}`}
                    value={rowStatus[index]}
                    onChange={(e) =>
                      setRowStatus((prev) => ({ ...prev, [index]: e.target.value }))
                    }
                  >
                    <option value="Present">Present</option>
                    <option value="Absent">Absent</option>
                  </select>
                </td>
                <td><MoreVertical size={18} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Attendence;
