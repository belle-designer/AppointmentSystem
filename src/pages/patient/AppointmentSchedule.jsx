import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { doctors } from "../../data/accounts";
import { hardcodedAppointments } from "../../data/appointments";
import { FaSearch, FaFilter, FaTrash, FaRedo, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import Swal from "sweetalert2";

function AppointmentSchedule() {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [activeTab, setActiveTab] = useState("All");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const appointmentsPerPage = 3;

  useEffect(() => {
    const patientEmail = localStorage.getItem("userEmail");
    if (!patientEmail) return;

    const patientAppointments = hardcodedAppointments
      .filter((a) => a.patientEmail === patientEmail)
      .map((a) => ({ ...a, status: a.status || "Pending" }));

    setAppointments(patientAppointments);
  }, []);

  const getDoctorName = (email) => {
    const doctor = doctors.find((d) => d.email === email);
    return doctor ? doctor.name : "Unknown Doctor";
  };

  const cancelAppointment = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to cancel this appointment?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#e11d48",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, cancel it!",
    }).then((result) => {
      if (result.isConfirmed) {
        setAppointments((prev) =>
          prev.map((a) => (a.id === id ? { ...a, status: "Cancelled" } : a))
        );
        Swal.fire("Cancelled!", "Your appointment has been cancelled.", "success");
      }
    });
  };

  const rescheduleAppointment = (appointment) => {
    Swal.fire({
      title: "Reschedule Appointment?",
      text: "You will be redirected to create a new appointment.",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#06b6d4",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, reschedule",
    }).then((result) => {
      if (result.isConfirmed) {
        navigate("/patient/create", { state: { doctorEmail: appointment.doctorEmail } });
      }
    });
  };

  const statusTypes = ["All", "Pending", "Confirm", "Declined", "Cancelled"];
  const statusColors = {
    Pending: "bg-cyan-600",
    Confirm: "bg-emerald-600",
    Declined: "bg-rose-600",
    Cancelled: "bg-gray-500",
  };

  const filteredAppointments = appointments.filter((a) => {
    const matchesStatus = activeTab === "All" || a.status === activeTab;
    const matchesSearch =
      getDoctorName(a.doctorEmail).toLowerCase().includes(search.toLowerCase()) ||
      a.date.includes(search);
    return matchesStatus && matchesSearch;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredAppointments.length / appointmentsPerPage);
  const indexOfLast = currentPage * appointmentsPerPage;
  const indexOfFirst = indexOfLast - appointmentsPerPage;
  const currentAppointments = filteredAppointments.slice(indexOfFirst, indexOfLast);

  return (
    <div className="p-6 max-w-6xl mx-auto mt-10 space-y-8">
      <h1 className="text-4xl font-bold tracking-tight text-teal-700">
        My Appointments
      </h1>

      {/* Search + Filter */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-4 rounded-xl shadow">
        <div className="relative w-full md:w-1/2">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search doctor or date..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500"
          />
        </div>

        <div className="relative w-full md:w-1/4">
          <FaFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <select
            className="w-full px-10 py-2 rounded-lg border text-gray-700 focus:ring-2 focus:ring-teal-500"
            value={activeTab}
            onChange={(e) => {
              setActiveTab(e.target.value);
              setCurrentPage(1);
            }}
          >
            {statusTypes.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Folder Tabs */}
      <div className="flex space-x-2 border-b pb-2 overflow-x-auto">
        {statusTypes.map((status) => (
          <button
            key={status}
            onClick={() => {
              setActiveTab(status);
              setCurrentPage(1);
            }}
            className={`px-5 py-2 rounded-t-xl text-sm font-medium transition-all
              ${
                activeTab === status
                  ? "bg-teal-600 text-white shadow"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow border border-gray-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-teal-50">
            <tr>
              <th className="py-3 px-4">Doctor</th>
              <th className="py-3 px-4">Date</th>
              <th className="py-3 px-4">Time</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {currentAppointments.length === 0 ? (
              <tr>
                <td colSpan="5" className="py-6 text-center text-gray-500 italic">
                  No appointments found.
                </td>
              </tr>
            ) : (
              currentAppointments.map((a) => (
                <tr key={a.id} className="border-b hover:bg-teal-50 transition">
                  <td className="py-3 px-4 font-medium">{getDoctorName(a.doctorEmail)}</td>
                  <td className="py-3 px-4">{a.date}</td>
                  <td className="py-3 px-4">{a.time}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-3 py-1 rounded-full text-white text-sm ${statusColors[a.status]}`}
                    >
                      {a.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center space-x-2">
                    {a.status === "Pending" && (
                      <button
                        onClick={() => cancelAppointment(a.id)}
                        className="px-3 py-1 bg-rose-600 text-white rounded-lg hover:bg-rose-500 transition inline-flex items-center"
                      >
                        <FaTrash className="mr-1" /> Cancel
                      </button>
                    )}
                    {a.status === "Declined" && (
                      <button
                        onClick={() => rescheduleAppointment(a)}
                        className="px-3 py-1 bg-cyan-600 text-white rounded-lg hover:bg-cyan-500 transition inline-flex items-center"
                      >
                        <FaRedo className="mr-1" /> Reschedule
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {filteredAppointments.length > appointmentsPerPage && (
        <div className="flex justify-center items-center space-x-2 mt-4">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50 inline-flex items-center"
          >
            <FaChevronLeft />
          </button>

          {[...Array(totalPages)].map((_, i) => {
            const page = i + 1;
            return (
              <button
                key={i}
                onClick={() => setCurrentPage(page)}
                className={`w-8 h-8 flex items-center justify-center rounded-full ${
                  currentPage === page ? "bg-teal-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {page}
              </button>
            );
          })}

          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50 inline-flex items-center"
          >
            <FaChevronRight />
          </button>
        </div>
      )}
    </div>
  );
}

export default AppointmentSchedule;
