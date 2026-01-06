import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { patients } from "../../data/accounts";
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import Swal from "sweetalert2";

export default function Register({ onSuccess }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const resetForm = () => {
    setName("");
    setEmail("");
    setPassword("");
    setShowPassword(false);
    setError("");
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;
    if (!passwordRegex.test(password)) {
      setError(
        "Password must be at least 6 characters and include letters and numbers."
      );
      return;
    }

    // ✅ Confirm registration
    const result = await Swal.fire({
      title: "Create Account?",
      text: "Please confirm your registration details.",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Create account",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#2563eb",
      cancelButtonColor: "#6b7280",
    });

    if (!result.isConfirmed) return;

    // Demo register
    const newPatient = {
      id: patients.length + 1,
      name,
      email,
      password,
      age: 0,
    };

    console.log("Registered patient:", newPatient);

    // ✅ Success alert
    await Swal.fire({
      title: "Account Created!",
      text: "Your HealthCheck account has been successfully created.",
      icon: "success",
      confirmButtonColor: "#2563eb",
    });

    // ✅ Clear form
    resetForm();

    // ✅ Close modal
    onSuccess?.();

    // ✅ Back to landing page
    navigate("/");
  };

  return (
    <div className="w-full">
      <h1 className="text-2xl font-semibold text-gray-800 text-center">
        Create Account
      </h1>
      <p className="text-sm text-gray-500 text-center mt-1 mb-6">
        Register to access HealthCheck
      </p>

      <form onSubmit={handleRegister} className="space-y-4">
        {error && (
          <div className="text-sm text-red-600 bg-red-50 border border-red-200 px-3 py-2 rounded">
            {error}
          </div>
        )}

        {/* Name */}
        <div className="relative">
          <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full pl-10 pr-3 py-2.5 border rounded-md focus:ring-1 focus:ring-blue-500"
            required
          />
        </div>

        {/* Email */}
        <div className="relative">
          <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full pl-10 pr-3 py-2.5 border rounded-md focus:ring-1 focus:ring-blue-500"
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
            className="w-full pl-10 pr-10 py-2.5 border rounded-md focus:ring-1 focus:ring-blue-500"
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
        
        {/* Submit */}
        <button
          type="submit"
          className="w-full py-2.5 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-500 transition"
        >
          Register
        </button>

        {/* Forgot Password */}
          <div className="text-center text-sm pt-2">
            <Link to="/forgot-password" className="text-gray-500 hover:underline">
              Forgot password?
            </Link>
          </div>
      </form>
    </div>
  );
}
