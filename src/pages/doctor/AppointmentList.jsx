import { useEffect, useState } from "react";
import { doctors, patients } from "../../data/accounts";
import { hardcodedAppointments } from "../../data/appointments";
import { FaSearch, FaSortAmountDown, FaSortAmountUp, FaCheck, FaTimes } from "react-icons/fa";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

function AppointmentList() {
  const [doctor, setDoctor] = useState(null);
  const [myAppointments, setMyAppointments] = useState([]);
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    const loggedInEmail = localStorage.getItem("userEmail");
    if (!loggedInEmail) return;

    const user = doctors.find(d => d.email === loggedInEmail);
    setDoctor(user);

    const filtered = hardcodedAppointments.filter(
      app => app.doctorEmail === loggedInEmail && app.status === "Pending"
    );
    setMyAppointments(filtered);
  }, []);

  if (!doctor) {
    return (
      <div className="p-6 bg-gray-100 rounded-xl shadow text-center mt-10">
        <p className="text-gray-600">No doctor info available. Please log in.</p>
      </div>
    );
  }

  const getPatientName = (email) => {
    const patient = patients.find(p => p.email === email);
    return patient ? patient.name : "Unknown";
  };

  const handleAction = (id, action) => {
    const actionText = action === "confirm" ? "Confirm" : "Decline";
    const actionColor = action === "confirm" ? "#22c55e" : "#ef4444"; // green/red

    Swal.fire({
      title: `Are you sure you want to ${actionText.toLowerCase()} this appointment?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: actionColor,
      cancelButtonColor: "#9ca3af",
      confirmButtonText: actionText,
    }).then((result) => {
      if (result.isConfirmed) {
        setMyAppointments(prev =>
          prev.map(app =>
            app.id === id ? { ...app, status: action === "confirm" ? "Confirmed" : "Declined" } : app
          )
        );

        Swal.fire({
          title: `${actionText}ed!`,
          icon: "success",
          timer: 1200,
          showConfirmButton: false,
        });
      }
    });
  };

  const filteredAppointments = myAppointments
    .filter(app =>
      getPatientName(app.patientEmail).toLowerCase().includes(search.toLowerCase()) ||
      app.date.includes(search)
    )
    .sort((a, b) =>
      sortOrder === "asc"
        ? new Date(a.date) - new Date(b.date)
        : new Date(b.date) - new Date(a.date)
    );

  const totalPages = Math.ceil(filteredAppointments.length / itemsPerPage);
  const currentRecords = filteredAppointments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto mt-10 space-y-8">
      <h1 className="text-4xl font-bold text-blue-900">{doctor.name}'s Pending Appointments</h1>

      {/* Search + Sort */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-4 rounded-xl shadow mb-4">
        <div className="relative w-full md:w-1/2">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search patient or date..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
          className="flex items-center px-4 py-2 bg-blue-100 rounded-lg hover:bg-blue-200 transition text-blue-900 font-medium"
        >
          {sortOrder === "asc" ? <FaSortAmountUp className="mr-2" /> : <FaSortAmountDown className="mr-2" />}
          Sort by Date ({sortOrder === "asc" ? "Asc" : "Desc"})
        </button>
      </div>

      {/* Appointments Table */}
      <div className="bg-white rounded-2xl shadow border border-gray-200 overflow-hidden">
        <table className="w-full text-center">
          <thead className="bg-blue-50">
            <tr>
              <th className="py-3 px-4">Patient</th>
              <th className="py-3 px-4">Date</th>
              <th className="py-3 px-4">Time</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Actions</th>
            </tr>
          </thead>

          <tbody>
            {currentRecords.length === 0 ? (
              <tr>
                <td colSpan="5" className="py-6 text-center text-gray-500 italic">
                  No pending appointments.
                </td>
              </tr>
            ) : (
              currentRecords.map((app) => (
                <tr key={app.id} className="border-b hover:bg-blue-50 transition">
                  <td className="py-3 px-4 font-medium">{getPatientName(app.patientEmail)}</td>
                  <td className="py-3 px-4">{app.date}</td>
                  <td className="py-3 px-4">{app.time}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-sm font-semibold ${
                      app.status === "Pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : app.status === "Confirmed"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}>
                      {app.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 flex justify-center gap-2">
                    {app.status === "Pending" && (
                      <>
                        <button
                          onClick={() => handleAction(app.id, "confirm")}
                          className="px-3 py-1 bg-blue-700 hover:bg-blue-600 text-white rounded flex items-center gap-1"
                        >
                          <FaCheck /> Confirm
                        </button>
                        <button
                          onClick={() => handleAction(app.id, "decline")}
                          className="px-3 py-1 bg-red-500 hover:bg-red-400 text-white rounded flex items-center gap-1"
                        >
                          <FaTimes /> Decline
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2 mt-4">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            className="p-2 bg-blue-100 rounded-full hover:bg-blue-200 transition"
          >
            &#8249;
          </button>
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => handlePageChange(i + 1)}
              className={`w-8 h-8 flex items-center justify-center rounded-full text-sm font-medium
                ${currentPage === i + 1 ? "bg-blue-900 text-white" : "bg-gray-100 text-gray-700 hover:bg-blue-100"}`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            className="p-2 bg-blue-100 rounded-full hover:bg-blue-200 transition"
          >
            &#8250;
          </button>
        </div>
      )}
    </div>
  );
}

export default AppointmentList;
