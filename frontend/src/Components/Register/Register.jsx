import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import axios from "axios";

import DashboardImg from "../../assets/DashboardImg.png";
import { Link } from "react-router-dom";

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!fullName.trim()) newErrors.fullName = "Full name is required";
    if (!email.trim()) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      newErrors.email = "Please enter a valid email";

    if (!password.trim()) newErrors.password = "Password is required";
    else if (password.length < 6)
      newErrors.password = "Password must be at least 6 characters";

    if (!confirmPassword.trim())
      newErrors.confirmPassword = "Confirm your password";
    else if (confirmPassword !== password)
      newErrors.confirmPassword = "Passwords do not match";

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const payload = {
      fullName,
      email,
      password,
    };

    try {
      const res = await axios.post("http://localhost:3000/api/auth/signup", payload);
      alert("Registration successful!");
      console.log(res.data);
      

      // Reset form
      setFullName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setErrors({});
    } catch (error) {
      console.error("Registration error:", error);
      alert(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="auth-container">
      <div className="logo-container">
        <div className="logo-box"></div>
        <span className="logo-text">LOGO</span>
      </div>

      <div className="auth-card">
        {/* Sidebar */}
        <div className="auth-sidebar">
          <div className="logo-container">
            <div className="logo">LOGO</div>
          </div>
          <div className="sidebar-content">
            <div className="dashboard-preview">
              <img src={DashboardImg} alt="Dashboard preview" />
            </div>
            <div className="sidebar-text">
              <p className="sidebar-heading">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit
              </p>
              <p className="sidebar-subtext">
                Tempor incididunt ut labore et dolore magna aliqua.
              </p>
            </div>
            <div className="slide-indicators">
              {[0, 1, 2].map((index) => (
                <button
                  key={index}
                  className={`slide-dot ${activeSlide === index ? "active" : ""}`}
                  onClick={() => setActiveSlide(index)}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="form-section">
          <div className="form-container">
            <h1 className="form-title">Welcome to Dashboard</h1>

            <form className="auth-form" onSubmit={handleSignup}>
              <div className="form-group">
                <label htmlFor="fullname">Full name*</label>
                <input
                  id="fullname"
                  type="text"
                  placeholder="Full name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
                {errors.fullName && <p className="error-text">{errors.fullName}</p>}
              </div>

              <div className="form-group">
                <label htmlFor="email">Email Address*</label>
                <input
                  id="email"
                  type="text"
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                {errors.email && <p className="error-text">{errors.email}</p>}
              </div>

              <div className="form-group">
                <label htmlFor="password">Password*</label>
                <div className="password-input">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.password && <p className="error-text">{errors.password}</p>}
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Password*</label>
                <div className="password-input">
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="error-text">{errors.confirmPassword}</p>
                )}
              </div>

              <button type="submit" className="submit-button">
                Register
              </button>

              <div className="form-footer">
                Already have an account?{" "}
                <Link to="/" className="text-link">
                  Login
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
