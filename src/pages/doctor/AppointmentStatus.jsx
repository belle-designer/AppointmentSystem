import { useEffect, useState } from "react";
import { doctors, patients } from "../../data/accounts";
import { hardcodedAppointments } from "../../data/appointments";
import { FaSearch, FaFilter, FaChevronLeft, FaChevronRight } from "react-icons/fa";

function AppointmentStatus() {
  const [doctor, setDoctor] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [activeTab, setActiveTab] = useState("All");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const appointmentsPerPage = 5;

  useEffect(() => {
    const loggedInEmail = localStorage.getItem("userEmail");
    if (!loggedInEmail) return;

    const user = doctors.find(d => d.email === loggedInEmail);
    setDoctor(user);

    const myAppointments = hardcodedAppointments
      .filter(a => a.doctorEmail === loggedInEmail)
      .map(a => ({ ...a, status: a.status || "Pending" }));

    setAppointments(myAppointments);
  }, []);

  if (!doctor) {
    return (
      <div className="p-6 bg-gray-100 rounded shadow text-center">
        <p className="text-gray-600">No doctor info available. Please log in.</p>
      </div>
    );
  }

  const statusTypes = ["All", "Pending", "Confirm", "Declined", "Cancelled"];
  const statusColors = {
    Pending: "bg-blue-600",
    Confirm: "bg-blue-500",
    Declined: "bg-red-500",
    Cancelled: "bg-gray-500",
  };

  const getPatientName = (email) => {
    const patient = patients.find(p => p.email === email);
    return patient ? patient.name : "Unknown";
  };

  // Filter appointments by tab and search
  const filteredAppointments = appointments.filter(a => {
    const matchesStatus = activeTab === "All" || a.status === activeTab;
    const matchesSearch =
      getPatientName(a.patientEmail).toLowerCase().includes(search.toLowerCase()) ||
      a.date.includes(search);
    return matchesStatus && matchesSearch;
  });

  // Pagination
  const totalPages = Math.ceil(filteredAppointments.length / appointmentsPerPage);
  const indexOfLast = currentPage * appointmentsPerPage;
  const indexOfFirst = indexOfLast - appointmentsPerPage;
  const currentAppointments = filteredAppointments.slice(indexOfFirst, indexOfLast);

  return (
    <div className="p-6 max-w-6xl mx-auto mt-10 space-y-8">
      <h1 className="text-4xl font-bold text-blue-900">{doctor.name}'s Appointments</h1>

      {/* Search + Filter */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-4 rounded-xl shadow">
        <div className="relative w-full md:w-1/2">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search patient or date..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="relative w-full md:w-1/4">
          <FaFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <select
            className="w-full px-10 py-2 rounded-lg border text-gray-700 focus:ring-2 focus:ring-blue-500"
            value={activeTab}
            onChange={(e) => {
              setActiveTab(e.target.value);
              setCurrentPage(1);
            }}
          >
            {statusTypes.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Folder Tabs */}
      <div className="flex space-x-2 border-b pb-2 overflow-x-auto">
        {statusTypes.map(status => (
          <button
            key={status}
            onClick={() => { setActiveTab(status); setCurrentPage(1); }}
            className={`px-5 py-2 rounded-t-xl text-sm font-medium transition-all
              ${activeTab === status ? "bg-blue-900 text-white shadow" : "bg-gray-100 text-gray-700 hover:bg-blue-100"}`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow border border-gray-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-blue-100">
            <tr>
              <th className="py-3 px-4">Patient</th>
              <th className="py-3 px-4">Date</th>
              <th className="py-3 px-4">Time</th>
              <th className="py-3 px-4">Status</th>
              {(activeTab === "All" || activeTab === "Confirm") && <th className="py-3 px-4">Timing</th>}
            </tr>
          </thead>
          <tbody>
            {currentAppointments.length === 0 ? (
              <tr>
                <td colSpan={activeTab === "All" || activeTab === "Confirm" ? 5 : 4} className="py-6 text-center text-gray-500 italic">
                  No appointments found.
                </td>
              </tr>
            ) : (
              currentAppointments.map(a => {
                const now = new Date();
                const appDateTime = new Date(a.date + " " + a.time);
                const timing = appDateTime < now ? "Done" : "Upcoming";

                return (
                  <tr key={a.id} className="border-b hover:bg-blue-50 transition">
                    <td className="py-3 px-4 font-medium">{getPatientName(a.patientEmail)}</td>
                    <td className="py-3 px-4">{a.date}</td>
                    <td className="py-3 px-4">{a.time}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-white text-sm ${statusColors[a.status]}`}>
                        {a.status}
                      </span>
                    </td>
                    {(activeTab === "All" && a.status === "Confirm") || activeTab === "Confirm" ? (
                      <td className="py-3 px-4">{timing}</td>
                    ) : null}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {filteredAppointments.length > appointmentsPerPage && (
        <div className="flex justify-center items-center space-x-2 mt-4">
          <button
            onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
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
                className={`w-8 h-8 flex items-center justify-center rounded-full ${currentPage === page ? "bg-blue-900 text-white" : "bg-gray-200 text-gray-700 hover:bg-blue-100"}`}
              >
                {page}
              </button>
            );
          })}

          <button
            onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
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

export default AppointmentStatus;
