import React, { useState } from 'react';
import { X } from 'lucide-react';
import axios from 'axios';
import './AddCandidate.css';

const AddCandidate = ({ onClose, fetchAllCandidates }) => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    position: '',
    experience: '',
    resume: null,
    agreed: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === 'file') {
      setForm({ ...form, resume: files[0] });
    } else {
      setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('candidate_name', form.name);
    formData.append('email', form.email);
    formData.append('phone_number', form.phone);
    formData.append('position', form.position);
    formData.append('experience', form.experience);
    formData.append('resume', form.resume);
    formData.append('agreed', form.agreed);

    try {
      const token = localStorage.getItem('token');
      const res = await axios.post('http://localhost:3000/api/candidates/add-candidate', formData, {
        headers: { 
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
         }
      });

      if (res.status === 201) {
        alert('✅ Candidate added successfully!');
        console.log("res...", res)
        onClose();
        fetchAllCandidates();
      } else {
        alert('❌ Failed to add candidate.');
      }
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  };

  return (
    <div className="overlay">
      <div className="modal">
        <div className="modal-header">
          <div></div>
          <h3>Add New Candidate</h3>
          <X onClick={onClose} className="close-icon" />
        </div>
        <div className="modal-body">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <div className="input-wrapper">
                <input name="name" value={form.name} onChange={handleChange} required />
                <label>Full Name*</label>
              </div>
              <div className="input-wrapper">
                <input type="email" name="email" value={form.email} onChange={handleChange} required />
                <label>Email Address*</label>
              </div>
            </div>

            <div className="form-group">
              <div className="input-wrapper">
                <input name="phone" value={form.phone} onChange={handleChange} required />
                <label>Phone Number*</label>
              </div>
              <div className="input-wrapper">
                <input name="position" value={form.position} onChange={handleChange} required />
                <label>Position*</label>
              </div>
            </div>

            <div className="form-group">
              <div className="input-wrapper">
                <input name="experience" value={form.experience} onChange={handleChange} required />
                <label>Experience*</label>
              </div>
              <div className="input-wrapper">
                <input
                  type="file"
                  name="resume"
                  accept=".pdf"
                  onChange={handleChange}
                  required
                />
                <label>Resume (PDF)*</label>
              </div>
            </div>

            <div className="declaration">
              <input
                type="checkbox"
                name="agreed"
                checked={form.agreed}
                onChange={handleChange}
              />
              <span>I hereby declare that the above information is true to the best of my knowledge.</span>
            </div>

            <div className="save-btn-container">
              <button type="submit" className="candidate-save-btn" disabled={!form.agreed}>
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddCandidate;
