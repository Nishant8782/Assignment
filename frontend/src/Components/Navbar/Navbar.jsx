import React from "react";
import "./Navbar.css";
import { Mail, Bell, ChevronDown } from "lucide-react";
import { useLocation } from "react-router-dom";

const Navbar = () => {
  const location = useLocation();

  // Extract the last spart of the URL
  const pathSegments = location.pathname.split("/").filter(Boolean);
  const currentPage = pathSegments[pathSegments.length - 1] || "Dashboard";

  // Capitalize the first letter
  const pageTitle = currentPage.charAt(0).toUpperCase() + currentPage.slice(1);

  return (
    <div className="navbar">
      <div className="navbar-left">
        <span>{pageTitle}</span>
      </div>
      <div className="navbar-right">
        <Mail className="icon" />
        <Bell className="icon" />
        <div className="avatar-dropdown">
          <img
            src="https://randomuser.me/api/portraits/women/44.jpg"
            alt="User"
            className="avatar"
          />
          <ChevronDown size={16} />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
