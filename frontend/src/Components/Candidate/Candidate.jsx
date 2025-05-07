import React, { useEffect, useState } from 'react';
import './Candidate.css';
import { MoreVertical } from 'lucide-react';
import AddCandidate from './AddCandidate';
import axios from 'axios';
import Cookies from 'js-cookie';

const Candidate = () => {
  const [menuIndex, setMenuIndex] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [candidates, setCandidates] = useState([]);
  const [selectedCandidateId, setSelectedCandidateId] = useState(null);
  const [status, setStatus] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterPosition, setFilterPosition] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch all candidates data from backend
  const fetchAllCandidates = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await axios.get('http://localhost:3000/api/candidates/get-candidates', {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
      setCandidates(res.data);
      console.log("candidates", res);
    } catch (error) {
      console.log('Error fetching candidates:', error.response?.data || error.message);
    }
  };

  console.log("Cookies in browser:", document.cookie);


  // Handle status change for candidates
  const handleStatusChange = async (candidateId, newStatus) => {
    setSelectedCandidateId(candidateId);
    setStatus(newStatus);
    try {
      const token = localStorage.getItem('token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      await axios.patch(`http://localhost:3000/api/candidates/${candidateId}/status`, {
        status: newStatus,
      }, {
        headers,
        withCredentials: true,
      });
      fetchAllCandidates(); // Refresh list after update
    } catch (error) {
      console.log('Error updating status:', error.response?.data || error.message);
    }
  };

  // Resume download
  const handleDownloadResume = (resumeUrl) => {
    setMenuIndex(null);
    if (resumeUrl) {
      const a = document.createElement('a');
      a.href = resumeUrl;
      a.download = resumeUrl.split('/').pop();
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } else {
      alert('Resume URL not available');
    }
  };

  // Delete candidate
  const handleDelete = async (id) => {
    const token = localStorage.getItem('token');
    setMenuIndex(null);
    try {
      const res = await axios.delete(`http://localhost:3000/api/candidates/delete/${id}`,{
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
      if (res) {
        alert(res.data.message);
        fetchAllCandidates();
      }
    } catch (error) {
      console.log(error);
    }
  };

  // UseEffect to load candidates initially
  useEffect(() => {
    fetchAllCandidates();
  }, []);

  // Extract unique statuses and positions
  const positions = [...new Set(candidates.map(c => c.position))];
  const statuses = [...new Set(candidates.map(c => c.status))];

  // Apply filters and search
  const filteredCandidates = candidates.filter(c => {
    const matchesStatus = filterStatus ? c.status === filterStatus : true;
    const matchesPosition = filterPosition ? c.position === filterPosition : true;
    const matchesSearch = c.candidate_name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesPosition && matchesSearch;
  });

  return (
    <div className="main-container">
      <div className="filters">
        <div>
          <select
            style={{ marginRight: "1rem" }}
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="">All Status</option>
            {statuses.map((status) => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>

          <select
            value={filterPosition}
            onChange={(e) => setFilterPosition(e.target.value)}
          >
            <option value="">All Positions</option>
            {positions.map((pos) => (
              <option key={pos} value={pos}>{pos}</option>
            ))}
          </select>
        </div>

        <div>
          <input
            className="candidate-search"
            type="text"
            placeholder="Search by name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button
            style={{ marginLeft: "1rem" }}
            className="add-btn"
            onClick={() => setShowModal(true)}
          >
            Add Candidate
          </button>
        </div>
      </div>

      <div className="candidate-container">
        <table className="candidate-table">
          <thead>
            <tr>
              <th>Sr no.</th>
              <th>Candidates Name</th>
              <th>Email Address</th>
              <th>Phone Number</th>
              <th>Position</th>
              <th>Status</th>
              <th>Experience</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredCandidates.map((c, i) => (
              <tr key={c._id}>
                <td>{i + 1}</td>
                <td>{c.candidate_name}</td>
                <td>{c.email}</td>
                <td>{c.phone_number}</td>
                <td>{c.position}</td>
                <td>
                  <select
                    value={c.status}
                    className={`status ${c.status.toLowerCase()}`}
                    onChange={(e) => handleStatusChange(c._id, e.target.value)}
                  >
                    <option value="new">New</option>
                    <option value="selected">Selected</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </td>
                <td>{c.experience}</td>
                <td className="action-menu">
                  <MoreVertical onClick={() => setMenuIndex(menuIndex === i ? null : i)} />
                  {menuIndex === i && (
                    <div className="dropdown-menu">
                      <div onClick={() => handleDownloadResume(c.resume)}>
                        Download Resume
                      </div>
                      <div onClick={() => handleDelete(c._id)}>
                        Delete Candidate
                      </div>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <AddCandidate
          fetchAllCandidates={fetchAllCandidates}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

export default Candidate;
