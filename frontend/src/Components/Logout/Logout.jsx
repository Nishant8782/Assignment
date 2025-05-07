// components/Logout.jsx
import React, { useState } from 'react';
import './Logout.css';
import { LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    const token = localStorage.getItem('token');
  
    try {
      const res = await axios.post(
        "http://localhost:3000/api/auth/logout",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      if (res.status === 200) {
        
        const isTokenRemove = localStorage.removeItem('token');
        
        if(isTokenRemove){
            setShowPopup(false);
        navigate('/');
        }
        
      }
    } catch (error) {
      console.log("Logout failed:", error);
    }
  };
  

  return (
    <>
      <div className="logout-wrapper">
        <button className="logout-btn" onClick={() => setShowPopup(true)}>
          <LogOut size={16} />
          <span>Log Out</span>
        </button>
      </div>

      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-container">
            <div className="popup-header">
              <h6>Log Out</h6>
            </div>
            <div className="popup-body">
              <p>Are you sure you want to log out?</p>
              <div className="popup-actions">
                <button className="cancel-btn" onClick={() => setShowPopup(false)}>Cancel</button>
                <button className="logout-confirm-btn" onClick={handleLogout}>Logout</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Logout;
