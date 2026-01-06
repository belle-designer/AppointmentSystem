import { useState, useEffect } from "react";
import { patientHistories } from "../../data/patientHistories";
import { doctors, patients } from "../../data/accounts";
import { FaSearch, FaSort } from "react-icons/fa";

function AppointmentHistory() {
  const [patient, setPatient] = useState(null);
  const [history, setHistory] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortAsc, setSortAsc] = useState(false); // descending by default
  const itemsPerPage = 4;

  useEffect(() => {
    const email = localStorage.getItem("userEmail");
    if (!email) return;

    const loggedInPatient = patients.find((p) => p.email === email);
    setPatient(loggedInPatient);

    const patientHistory = patientHistories.find((h) => h.patientEmail === email);
    const sortedRecords =
      patientHistory?.records
        .slice()
        .sort((a, b) => new Date(b.date) - new Date(a.date)) || [];
    setHistory(sortedRecords);
  }, []);

  const getDoctorName = (email) => {
    const doctor = doctors.find((d) => d.email === email);
    return doctor ? doctor.name : email;
  };

  const toggleSort = () => {
    setSortAsc(!sortAsc);
  };

  // Search + Sorting
  const filteredHistory = history
    .filter(
      (record) =>
        getDoctorName(record.doctorEmail).toLowerCase().includes(search.toLowerCase()) ||
        record.date.includes(search)
    )
    .sort((a, b) => {
      return sortAsc
        ? new Date(a.date) - new Date(b.date)
        : new Date(b.date) - new Date(a.date);
    });

  const totalPages = Math.ceil(filteredHistory.length / itemsPerPage);
  const currentRecords = filteredHistory.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  if (!patient) {
    return <p className="text-center mt-10 text-gray-600">Please log in to view your history.</p>;
  }

  return (
    <div className="p-6 max-w-6xl mx-auto mt-10 space-y-8">
      <h1 className="text-4xl font-bold text-teal-700">My Medical History</h1>

      {/* Search + Sort */}
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

        <button
          onClick={toggleSort}
          className="flex items-center px-4 py-2 bg-teal-100 rounded-lg hover:bg-teal-200 transition text-gray-700"
        >
          <FaSort className="mr-2" /> Sort by Date {sortAsc ? "(Asc)" : "(Desc)"}
        </button>
      </div>

{/* Table */}
<div className="bg-white rounded-xl shadow border border-gray-200 overflow-x-auto">
  <table className="w-full text-left min-w-max">
    <thead className="bg-teal-50">
      <tr>
        <th className="py-3 px-4">Doctor</th>
        <th className="py-3 px-4">Date</th>
        <th className="py-3 px-4">Diagnosis</th>
        <th className="py-3 px-4">Brand</th>
        <th className="py-3 px-4">Strength</th>
        <th className="py-3 px-4">Dosage</th>
        <th className="py-3 px-4">Frequency</th>
      </tr>
    </thead>

<tbody>
  {currentRecords.length === 0 ? (
    <tr>
      <td colSpan="7" className="py-6 text-center text-gray-500 italic">
        No history found.
      </td>
    </tr>
  ) : (
    currentRecords.map((record, index) => {
      const prescriptions = record.prescriptions;
      return prescriptions.map((p, pIdx) => (
        <tr key={`${index}-${pIdx}`} className="border-b hover:bg-teal-50 transition">
          {/* Only show doctor, date, diagnosis in the first prescription row */}
          {pIdx === 0 && (
            <>
              <td className="py-3 px-4 font-medium" rowSpan={prescriptions.length}>
                {getDoctorName(record.doctorEmail)}
              </td>
              <td className="py-3 px-4" rowSpan={prescriptions.length}>
                {record.date}
              </td>
              <td className="py-3 px-4" rowSpan={prescriptions.length}>
                {record.diagnosis}
              </td>
            </>
          )}
          <td className="py-3 px-4">{p.brand}</td>
          <td className="py-3 px-4">{p.strengthValue}{p.strengthUnit}</td>
          <td className="py-3 px-4">{p.dosage}</td>
          <td className="py-3 px-4">{p.frequency} a day</td>
        </tr>
      ));
    })
  )}
</tbody>

  </table>
</div>


      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2 mt-4">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            className="p-2 bg-teal-100 rounded-full hover:bg-teal-200 transition"
          >
            &#8249;
          </button>
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => handlePageChange(i + 1)}
              className={`w-8 h-8 flex items-center justify-center rounded-full text-sm font-medium
                ${currentPage === i + 1 ? "bg-teal-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}
              `}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            className="p-2 bg-teal-100 rounded-full hover:bg-teal-200 transition"
          >
            &#8250;
          </button>
        </div>
      )}
    </div>
  );
}

export default AppointmentHistory;
