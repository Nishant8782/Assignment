import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import "./Login.css";
import DashboardImg from "../../assets/DashboardImg.png";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);
  const [emailError, setEmailError] = useState("");
 
  const navigate = useNavigate()
  const isValidEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const isFormValid =
    email.trim() !== "" && password.trim() !== "" && isValidEmail(email);

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);

    if (!isValidEmail(value)) {
      setEmailError("Please enter a valid email address.");
    } else {
      setEmailError("");
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!isValidEmail(email)) {
      setEmailError("Please enter a valid email address.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:3000/api/auth/login", {
        email,
        password,
      });

      alert("Login successful!");
      console.log(response.data);
      localStorage.setItem("token", response.data.token);
      navigate("/hr/candidates")
    } catch (error) {
      console.error("Login error:", error);
      alert(error.response?.data?.message || "Invalid email or password");
    }
  };

  return (
    <div className="auth-container">
      <div className="logo-container">
        <div className="logo-box"></div>
        <span className="logo-text">LOGO</span>
      </div>

      <div className="auth-card">
        {/* Left Sidebar */}
        <div className="auth-sidebar">
          <div className="logo-container">
            <div className="logo">LOGO</div>
          </div>
          <div className="sidebar-content">
            <div className="dashboard-preview">
              <img src={DashboardImg} alt="Dashboard preview" />
            </div>
            <div className="sidebar-text">
              <p className="sidebar-heading">Lorem ipsum, dolor sit amet consectetur adipisicing elit.</p>
              <p className="sidebar-subtext">
                Sign in to access your dashboard and manage your account securely and efficiently.
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

        {/* Login Form */}
        <div className="form-section">
          <div className="form-container">
            <h1 className="form-title">Welcome to Dashboard</h1>
            <form className="auth-form" onSubmit={handleLogin}>
              <div className="form-group">
                <label htmlFor="email">Email Address*</label>
                <input
                  id="email"
                  type="email"
                  placeholder="Email Address"
                  value={email}
                  onChange={handleEmailChange}
                />
                {emailError && (
                  <p className="error-text">{emailError}</p>
                )}
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
              </div>

              <button
                type="submit"
                className="submit-button"
                disabled={!isFormValid}
              >
                Login
              </button>

              <div className="form-footer">
                Don’t have an account?{" "}
                <Link to="/signup" className="text-link">
                  Register
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
