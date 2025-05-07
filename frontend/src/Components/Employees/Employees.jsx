import React, { useEffect, useState } from 'react';
import './Employees.css';
import { MoreVertical } from 'lucide-react';
import EditEmployee from './EditEmployee';
import axios from 'axios';

const Employees = () => {
  const [openMenu, setOpenMenu] = useState(null);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [selectedPosition, setSelectedPosition] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const fetchAllEmployees = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const res = await axios.get('http://localhost:3000/api/candidates/selected', {
        headers,
        withCredentials: true,
      });

      setEmployees(res.data);
    } catch (error) {
      console.log('Error fetching candidates:', error.response?.data || error.message);
    }
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem('token');
    try {
      const res = await axios.delete(`http://localhost:3000/api/candidates/delete/${id}`,{
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
      if (res) {
        alert(res.data.message);
        fetchAllEmployees();
        setOpenMenu(false)
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchAllEmployees();
  }, []);

  const positions = [...new Set(employees.map((emp) => emp.position))];

  const filteredEmployees = employees.filter((emp) => {
    const matchesPosition = selectedPosition ? emp.position === selectedPosition : true;
    const matchesSearch = emp.candidate_name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesPosition && matchesSearch;
  });

  return (
    <div className="employee-main">
      <div className="employee-header">
        <select
          className="employee-select"
          value={selectedPosition}
          onChange={(e) => setSelectedPosition(e.target.value)}
        >
          <option value="">All Positions</option>
          {positions.map((pos) => (
            <option key={pos} value={pos}>
              {pos}
            </option>
          ))}
        </select>

        <input
          type="text"
          className="employee-search"
          placeholder="Search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="employee-table-wrapper">
        <table className="employee-table">
          <thead>
            <tr>
              <th>Profile</th>
              <th>Employee Name</th>
              <th>Email Address</th>
              <th>Phone Number</th>
              <th>Position</th>
              <th>Department</th>
              <th>Date of Joining</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredEmployees.map((emp, idx) => (
              <tr key={emp.id}>
                <td>
                  <img src={emp.image || `https://randomuser.me/api/portraits/men/${Math.floor(Math.random() * 100)}.jpg`} alt={emp.candidate_name} className="emp-img" />
                </td>
                <td>{emp.candidate_name}</td>
                <td>{emp.email}</td>
                <td>{emp.phone_number}</td>
                <td>{emp.position}</td>
                <td>{emp.department}</td>
                <td>
                  {(() => {
                    const date = new Date(emp.date_of_joining);
                    const day = String(date.getDate()).padStart(2, '0');
                    const month = String(date.getMonth() + 1).padStart(2, '0');
                    const year = date.getFullYear();
                    return `${day}/${month}/${year}`;
                  })()}
                </td>
                <td className="action-cell">
                  <MoreVertical
                    className="action-icon"
                    onClick={() => setOpenMenu(openMenu === idx ? null : idx)}
                  />
                  {openMenu === idx && (
                    <div className="employee-action-menu">
                      <div
                        onClick={() => {
                          setOpenMenu(null);
                          setEditingEmployee(emp);
                        }}
                      >
                        Edit
                      </div>
                      <div onClick={() => handleDelete(emp._id)}>Delete</div>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editingEmployee && (
        <EditEmployee
          employee={editingEmployee}
          onClose={() => setEditingEmployee(null)}
          employees={employees}
          fetchAllEmployees={fetchAllEmployees}
        />
      )}
    </div>
  );
};

export default Employees;
