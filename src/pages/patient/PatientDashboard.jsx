import { useState, useEffect } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { patients } from "../../data/accounts";
import { hardcodedAppointments } from "../../data/appointments";
import { BellIcon } from "@heroicons/react/24/outline";

const COLORS = ["#4ade80", "#06b6d4", "#6366f1", "#f97316"];
const ITEMS_PER_PAGE = 5;

function PatientDashboard() {
  const [patient, setPatient] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [stats, setStats] = useState({ pending: 0, confirmed: 0, declined: 0, cancelled: 0 });
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const userEmail = localStorage.getItem("userEmail");
    if (!userEmail) return;

    const loggedInPatient = patients.find(p => p.email === userEmail);
    setPatient(loggedInPatient);

    const myAppointments = hardcodedAppointments.filter(a => a.patientEmail === userEmail);
    setAppointments(myAppointments);

    setStats({
      pending: myAppointments.filter(a => a.status === "Pending").length,
      confirmed: myAppointments.filter(a => a.status === "Confirm").length,
      declined: myAppointments.filter(a => a.status === "Declined").length,
      cancelled: myAppointments.filter(a => a.status === "Cancelled").length
    });
  }, []);

  if (!patient) return <p className="text-center mt-10 text-gray-600">Loading patient info...</p>;

  const chartData = Object.entries(stats)
    .filter(([_, value]) => value > 0)
    .map(([key, value]) => ({ name: key.charAt(0).toUpperCase() + key.slice(1), value }));

  // Notifications: confirmed or declined appointments
  const notifications = appointments
    .filter(a => a.status === "Confirm" || a.status === "Declined")
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  // Pagination logic
  const totalPages = Math.ceil(notifications.length / ITEMS_PER_PAGE);
  const paginatedNotifications = notifications.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePrevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));
  const handleNextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">

      {/* Header Card */}
      <div className="bg-gradient-to-r from-cyan-500 to-teal-600 text-white rounded-2xl p-6 shadow-lg flex flex-col sm:flex-row justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Hello, {patient.name}</h1>
          <p className="mt-1 text-lg">Welcome back!</p>
        </div>
        <div className="mt-4 sm:mt-0 text-right relative">
          <p><strong>Email:</strong> {patient.email}</p>
          <p><strong>Age:</strong> {patient.age}</p>

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

      {/* Notification + Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Notification Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col">
          <div className="flex items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-700 flex items-center">
              <BellIcon className="h-6 w-6 mr-2 text-gray-700" /> Notifications
            </h2>
          </div>

          {notifications.length === 0 ? (
            <p className="text-gray-500">No new notifications.</p>
          ) : (
            <>
              <ul className="space-y-3 flex-1">
                {paginatedNotifications.map((appt, idx) => (
                  <li key={idx} className="p-4 border rounded-lg hover:bg-gray-50 flex flex-col sm:flex-row justify-between items-start sm:items-center">
                    <div>
                      <p className="font-semibold">{appt.date} at {appt.time}</p>
                      <p>With Dr. {appt.doctorName}</p>
                    </div>
                    <span className={`mt-2 sm:mt-0 px-3 py-1 rounded-full text-sm font-medium ${
                      appt.status === "Confirm" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                    }`}>
                      {appt.status}
                    </span>
                  </li>
                ))}
              </ul>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center mt-4 space-x-4">
                  <button
                    onClick={handlePrevPage}
                    disabled={currentPage === 1}
                    className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <span>Page {currentPage} of {totalPages}</span>
                  <button
                    onClick={handleNextPage}
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

        {/* Graph Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Appointment Stats</h2>
          {chartData.length === 0 ? (
            <p className="text-gray-500 mt-6">No appointments yet.</p>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={chartData}
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value}`, "Appointments"]} />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

      </div>
    </div>
  );
}

export default PatientDashboard;
