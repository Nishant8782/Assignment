import React, { useState, useEffect } from 'react';
import {
  Users,
  UserPlus,
  BarChart2,
  LogOut,
  Search,
  UserCheck
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Sidebar.css';
import '../Logout/Logout'; // Include popup styles here
import axios from 'axios';

const menuItems = [
  {
    section: 'Recruitment',
    items: [{ icon: <UserPlus size={16} />, label: 'Candidates', route: '/hr/candidates' }],
  },
  {
    section: 'Organization',
    items: [
      { icon: <Users size={16} />, label: 'Employees', route: '/hr/employee' },
      { icon: <BarChart2 size={16} />, label: 'Attendance', route: '/hr/attendance' },
      { icon: <UserCheck size={16} />, label: 'Leaves', route: '/hr/leaves' },
    ],
  },
  {
    section: 'Others',
    items: [{ icon: <LogOut size={16} />, label: 'Logout', route: '/logout' }],
  },
];

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const getActiveLabel = () => {
    for (const section of menuItems) {
      for (const item of section.items) {
        if (item.route === location.pathname) {
          return item.label;
        }
      }
    }
    return 'Candidates'; // Default fallback
  };

  const [activeItem, setActiveItem] = useState(getActiveLabel());
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);

  useEffect(() => {
    setActiveItem(getActiveLabel());
  }, [location.pathname]);

  const handleNavigation = (label, route) => {
    if (label === 'Logout') {
      setShowLogoutPopup(true);
      return;
    }
    setActiveItem(label);
    navigate(route);
  };

  const handleLogout = async () => {
    const token = localStorage.getItem('token');

    try {
      const res = await axios.post("http://localhost:3000/api/auth/logout", null, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 200) {
        navigate('/');
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="sidebar">
        <div className="logo">LOGO</div>
        <div className="search">
          <Search size={14} className="search-icon" />
          <input type="text" placeholder="Search" />
        </div>
        {menuItems.map((section, idx) => (
          <div key={idx}>
            <p className="section-title">{section.section}</p>
            {section.items.map((item) => (
              <div
                key={item.label}
                className={`menu-item ${activeItem === item.label ? 'active' : ''}`}
                onClick={() => handleNavigation(item.label, item.route)}
              >
                {item.icon}
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        ))}
      </div>

      {showLogoutPopup && (
        <div className="popup-overlay">
          <div className="popup-container">
            <div className="popup-header">
              <h2>Log Out</h2>
            </div>
            <div className="popup-body">
              <p>Are you sure you want to log out?</p>
              <div className="popup-actions">
                <button className="cancel-btn" onClick={() => setShowLogoutPopup(false)}>Cancel</button>
                <button className="logout-confirm-btn" onClick={handleLogout}>Logout</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
