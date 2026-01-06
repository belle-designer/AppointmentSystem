import { useState, useEffect } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid
} from "recharts";
import { doctors } from "../../data/accounts";
import { hardcodedAppointments } from "../../data/appointments";
import { patientHistories } from "../../data/patientHistories";
import { BellIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";

const COLORS = ["#4ade80", "#06b6d4", "#6366f1", "#f97316", "#facc15"];
const ITEMS_PER_PAGE = 5;

function DoctorDashboard() {
  const [doctor, setDoctor] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [statusStats, setStatusStats] = useState([]);
  const [diagnosisData, setDiagnosisData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const email = localStorage.getItem("userEmail");
    if (!email) return;

    const loggedInDoctor = doctors.find(d => d.email === email);
    setDoctor(loggedInDoctor);

    const myAppointments = hardcodedAppointments.filter(
      a => a.doctorEmail === email
    );
    setAppointments(myAppointments);

    setStatusStats([
      { name: "Pending", value: myAppointments.filter(a => a.status === "Pending").length },
      { name: "Confirm", value: myAppointments.filter(a => a.status === "Confirm").length },
      { name: "Declined", value: myAppointments.filter(a => a.status === "Declined").length },
      { name: "Cancelled", value: myAppointments.filter(a => a.status === "Cancelled").length }
    ]);

    const diagMap = {};
    patientHistories.forEach(ph => {
      ph.records.forEach(r => {
        if (r.doctorEmail === email) {
          diagMap[r.diagnosis] = (diagMap[r.diagnosis] || 0) + 1;
        }
      });
    });

    setDiagnosisData(
      Object.entries(diagMap).map(([name, value]) => ({ name, value }))
    );
  }, []);

  if (!doctor)
    return <p className="text-center mt-10 text-gray-600">Loading doctor info...</p>;

  const notifications = appointments
    .filter(a => a.status === "Pending")
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  const totalPages = Math.ceil(notifications.length / ITEMS_PER_PAGE);
  const paginatedNotifications = notifications.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">

      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl p-6 shadow-lg flex flex-col sm:flex-row justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dr. {doctor.name}</h1>
          <p className="mt-1 text-lg">{doctor.specialization}</p>
        </div>

        <div className="mt-4 sm:mt-0 text-right relative">
          <p><strong>Email:</strong> {doctor.email}</p>

          <div className="mt-2 relative inline-block">
            <BellIcon className="h-8 w-8 text-white" />
            {notifications.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                {notifications.length}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Dashboard Action Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Link
          to="/doctor/appointments"
          className="p-6 bg-blue-600 hover:bg-blue-500 text-white rounded-xl shadow-lg text-center font-semibold transition"
        >
          View Appointments
        </Link>

        <Link
          to="/doctor/patient/1"
          className="p-6 bg-green-600 hover:bg-green-500 text-white rounded-xl shadow-lg text-center font-semibold transition"
        >
          Patient Details
        </Link>

        <Link
          to="/doctor/profile"
          className="p-6 bg-yellow-500 hover:bg-yellow-400 text-white rounded-xl shadow-lg text-center font-semibold transition"
        >
          Profile Info
        </Link>

        <Link
          to="/doctor/status"
          className="p-6 bg-purple-600 hover:bg-purple-500 text-white rounded-xl shadow-lg text-center font-semibold transition"
        >
          Appointment Status
        </Link>
      </div>

      {/* Notifications + Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Notifications */}
        <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col">
          <h2 className="text-xl font-semibold mb-4 flex items-center text-gray-700">
            <BellIcon className="h-6 w-6 mr-2" /> Pending Appointments
          </h2>

          {notifications.length === 0 ? (
            <p className="text-gray-500">No pending appointments.</p>
          ) : (
            <>
              <ul className="space-y-3 flex-1">
                {paginatedNotifications.map((appt, idx) => (
                  <li
                    key={idx}
                    className="p-4 border rounded-lg hover:bg-gray-50 flex justify-between items-center"
                  >
                    <div>
                      <p className="font-semibold">
                        {appt.date} at {appt.time}
                      </p>
                      <p>Patient: {appt.patientName}</p>
                    </div>
                    <span className="px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                      Pending
                    </span>
                  </li>
                ))}
              </ul>

              {totalPages > 1 && (
                <div className="flex justify-center items-center mt-4 space-x-4">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <span>Page {currentPage} of {totalPages}</span>
                  <button
                    onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {/* Appointment Status Chart */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">
            Appointment Status Overview
          </h2>

          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusStats.filter(s => s.value > 0)}
                dataKey="value"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={3}
                label
              >
                {statusStats.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend verticalAlign="bottom" />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Diagnosis Chart */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">
          Diagnosis Summary
        </h2>

        {diagnosisData.length === 0 ? (
          <p className="text-gray-500">No diagnosis records available.</p>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={diagnosisData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="value" fill="#6366f1" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}

export default DoctorDashboard;
