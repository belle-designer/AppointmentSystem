import { useState, useEffect } from "react";
import { doctors, patients } from "../../data/accounts";
import { useNavigate } from "react-router-dom";
import { FaEnvelope, FaRedoAlt, FaLock, FaArrowLeft } from "react-icons/fa";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [timer, setTimer] = useState(0);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    const accountExists =
      doctors.some((d) => d.email === email) ||
      patients.some((p) => p.email === email);

    if (!accountExists) {
      setError("No account found with this email address.");
      return;
    }

    setError("");
    setSubmitted(true);
    setTimer(30);
  };

  const handleResend = () => {
    if (timer === 0) {
      setTimer(30);
      alert(`Reset code resent to ${email} (demo only)`);
    }
  };

  const handleDifferentEmail = () => {
    setEmail("");
    setSubmitted(false);
    setError("");
    setTimer(0);
  };

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer((t) => t - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white px-6">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg border border-gray-200 relative overflow-hidden">

        {/* Back Button */}
        <button
          onClick={() => navigate("/")}
          className="absolute top-4 left-4 flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 transition"
        >
          <FaArrowLeft />
          Back
        </button>

        {/* Header */}
        <div className="text-center px-8 pt-14 pb-8 bg-blue-50">
          <div className="mx-auto mb-4 w-14 h-14 flex items-center justify-center rounded-full bg-blue-100">
            <FaLock className="text-blue-600 text-2xl" />
          </div>
          <h1 className="text-3xl font-semibold text-gray-800">Password Recovery</h1>
          <p className="text-sm text-gray-500 mt-2">
            Enter your email and we’ll send you a reset code.
          </p>
        </div>

        {/* Content */}
        <div className="px-8 py-10">
          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="text-sm text-red-600 bg-red-50 border border-red-200 px-3 py-2 rounded-md">
                  {error}
                </div>
              )}

              {/* Email Input */}
              <div className="relative">
                <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3 py-3 border rounded-xl
                             focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="w-full py-3 bg-blue-600 text-white rounded-xl
                           font-semibold hover:bg-blue-500 transition"
              >
                Send Reset Code
              </button>
            </form>
          ) : (
            <div className="space-y-5 text-center">
              <p className="text-sm text-gray-700 leading-relaxed">
                A reset code has been sent to
                <br />
                <span className="font-medium text-gray-900">{email}</span>
              </p>

              <button
                onClick={handleResend}
                disabled={timer > 0}
                className={`w-full py-3 rounded-xl font-semibold transition
                  ${
                    timer > 0
                      ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                      : "bg-blue-600 text-white hover:bg-blue-500"
                  }`}
              >
                {timer > 0 ? `Resend in ${timer}s` : (
                  <>
                    <FaRedoAlt className="inline mr-2" />
                    Resend Code
                  </>
                )}
              </button>

              <button
                onClick={handleDifferentEmail}
                className="text-sm text-blue-600 hover:underline"
              >
                Use a different email
              </button>

              {/* Back to Home */}
              <button
                onClick={() => navigate("/")}
                className="w-full mt-4 py-3 border border-gray-300
                           rounded-xl text-gray-700 hover:bg-gray-100 transition"
              >
                Back to Home
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
