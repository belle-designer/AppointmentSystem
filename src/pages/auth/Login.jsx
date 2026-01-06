import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { doctors, patients } from "../../data/accounts";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";

export default function Login({ onSwitch, onSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setError("");

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    const doctor = doctors.find(
      (d) => d.email === email && d.password === password
    );
    if (doctor) {
      localStorage.setItem("userRole", "doctor");
      localStorage.setItem("userEmail", doctor.email);
      navigate("/doctor");
      return;
    }

    const patient = patients.find(
      (p) => p.email === email && p.password === password
    );
    if (patient) {
      localStorage.setItem("userRole", "patient");
      localStorage.setItem("userEmail", patient.email);
      navigate("/patient");
      return;
    }

    setError("Invalid email or password");
  };

  return (
    <div className="min-h-auto flex items-center justify-center bg-white px-6">
      <div className="w-full max-w-sm">
        {/* Title */}
        <h1 className="text-2xl font-semibold text-gray-800 text-center">
          Sign In
        </h1>
        <p className="text-sm text-gray-500 text-center mt-1 mb-8">
          Access your HealthCheck account
        </p>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          {error && (
            <div className="text-sm text-red-600 bg-red-50 border border-red-200 px-3 py-2 rounded">
              {error}
            </div>
          )}

          {/* Email */}
          <div className="relative">
            <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-3 py-2.5 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              required
            />
          </div>

          {/* Password */}
          <div className="relative">
            <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-10 py-2.5 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          {/* Button */}
          <button
            type="submit"
            className="w-full py-2.5 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-500 transition"
          >
            Sign In
          </button>

          {/* Only Forgot Password */}
          <div className="text-center text-sm pt-2">
            <Link to="/forgot-password" className="text-gray-500 hover:underline">
              Forgot password?
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
