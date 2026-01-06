import { useState } from "react";
import {
  CalendarCheck,
  ShieldCheck,
  LayoutDashboard,
  UserPlus,
  ClipboardList,
  Stethoscope,
  Mail,
  Phone,
  MapPin,
  X,
} from "lucide-react";

import Login from "../auth/Login";
import Register from "../auth/Register";
import ForgotPassword from "../auth/ForgotPassword";

function LandingPage() {
  const [modal, setModal] = useState(null); // login | register | forgot

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      {/* ================= AUTH MODAL ================= */}
      {modal && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
            onClick={() => setModal(null)}
          />

          {/* Modal Container */}
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl p-6">
              <button
                onClick={() => setModal(null)}
                className="absolute -top-10 right-0 text-white hover:opacity-80"
              >
                <X size={28} />
              </button>

              {modal === "login" && (
                <Login isModal setModal={setModal} />
              )}
              {modal === "register" && (
                <Register isModal setModal={setModal} />
              )}
              {modal === "forgot" && (
                <ForgotPassword isModal setModal={setModal} />
              )}
            </div>
          </div>
        </>
      )}

      {/* ================= PAGE CONTENT ================= */}
      <div
        className={`min-h-screen transition ${
          modal ? "blur-sm pointer-events-none select-none" : ""
        }`}
      >
        {/* ================= NAVBAR ================= */}
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur border-b">
          <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
            <h1 className="text-xl font-bold text-blue-700">HealthCheck</h1>

            <nav className="hidden md:flex gap-8 text-gray-600 font-medium">
              <button onClick={() => scrollToSection("features")}>
                Features
              </button>
              <button onClick={() => scrollToSection("how-it-works")}>
                How it Works
              </button>
              <button onClick={() => scrollToSection("contact")}>
                Contact
              </button>
            </nav>

            <div className="flex gap-3">
              <button
                onClick={() => setModal("login")}
                className="px-5 py-2 text-blue-600 font-semibold hover:bg-blue-50 rounded-lg"
              >
                Login
              </button>
              <button
                onClick={() => setModal("register")}
                className="px-5 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-500 shadow"
              >
                Get Started
              </button>
            </div>
          </div>
        </header>

        {/* ================= HERO ================= */}
        <section className="max-w-7xl mx-auto px-6 py-28 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <span className="inline-block mb-4 px-4 py-1 rounded-full bg-blue-100 text-blue-700 text-sm font-semibold">
              Smart Healthcare Platform
            </span>

            <h2 className="text-5xl font-extrabold text-gray-800 mb-6">
              Healthcare Appointments <br />
              Made <span className="text-blue-600">Simple</span>
            </h2>

            <p className="text-gray-600 text-lg mb-8">
              Secure and efficient scheduling for patients, doctors, and
              administrators.
            </p>

            <div className="flex gap-4">
              <button
                onClick={() => setModal("register")}
                className="px-8 py-4 bg-blue-600 text-white font-semibold rounded-xl shadow hover:bg-blue-500"
              >
                Create Account
              </button>
              <button
                onClick={() => setModal("login")}
                className="px-8 py-4 border border-blue-600 text-blue-600 font-semibold rounded-xl hover:bg-blue-50"
              >
                Sign In
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h3 className="text-xl font-bold mb-6">
              Trusted Healthcare Features
            </h3>
            <ul className="space-y-4 text-gray-600">
              <li className="flex items-center gap-3">
                <CalendarCheck className="text-blue-600" />
                Fast Booking
              </li>
              <li className="flex items-center gap-3">
                <ShieldCheck className="text-blue-600" />
                Secure Records
              </li>
              <li className="flex items-center gap-3">
                <LayoutDashboard className="text-blue-600" />
                Admin Dashboard
              </li>
            </ul>
          </div>
        </section>

        {/* ================= FEATURES ================= */}
        <section id="features" className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <h3 className="text-4xl font-bold mb-12">Core Features</h3>
            <div className="grid md:grid-cols-3 gap-10">
              <Feature icon={CalendarCheck} title="Easy Scheduling" />
              <Feature icon={ShieldCheck} title="Secure System" />
              <Feature icon={LayoutDashboard} title="Admin Dashboard" />
            </div>
          </div>
        </section>

        {/* ================= HOW IT WORKS ================= */}
        <section id="how-it-works" className="py-24 bg-blue-50">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <h3 className="text-4xl font-bold mb-12">How It Works</h3>
            <div className="grid md:grid-cols-3 gap-10">
              <Step icon={UserPlus} title="Create Account" />
              <Step icon={ClipboardList} title="Book Appointment" />
              <Step icon={Stethoscope} title="Visit Clinic" />
            </div>
          </div>
        </section>

        {/* ================= CONTACT ================= */}
        <section id="contact" className="py-24 bg-white">
          <div className="max-w-5xl mx-auto px-6 text-center">
            <h3 className="text-4xl font-bold mb-12">Contact Us</h3>
            <div className="bg-blue-50 rounded-2xl p-10 shadow space-y-6">
              <p className="flex justify-center gap-3">
                <Mail /> support@healthcheck.com
              </p>
              <p className="flex justify-center gap-3">
                <Phone /> +63 900 000 0000
              </p>
              <p className="flex justify-center gap-3">
                <MapPin /> Philippines
              </p>
            </div>
          </div>
        </section>

        <footer className="bg-gray-100 py-6 text-center text-gray-500 text-sm">
          © {new Date().getFullYear()} HealthCheck. All rights reserved.
        </footer>
      </div>
    </>
  );
}

/* ================= COMPONENTS ================= */
const Feature = ({ icon: Icon, title }) => (
  <div className="bg-blue-50 p-8 rounded-2xl shadow">
    <Icon className="mx-auto mb-4 text-blue-600" size={36} />
    <h4 className="text-xl font-semibold">{title}</h4>
  </div>
);

const Step = ({ icon: Icon, title }) => (
  <div className="bg-white p-8 rounded-2xl shadow">
    <Icon className="mx-auto mb-4 text-blue-600" size={36} />
    <h4 className="text-xl font-semibold">{title}</h4>
  </div>
);

export default LandingPage;
