import { useEffect, useState } from "react";
import { doctors, patients } from "../../data/accounts";
import { hardcodedAppointments } from "../../data/appointments";
import { patientHistories } from "../../data/patientHistories";
import Swal from "sweetalert2";
import { FaArrowLeft, FaSortAmountDown, FaSortAmountUp, FaTimes, FaSearch, FaPlus, FaEdit, FaSave } from "react-icons/fa";

function PatientDetails() {
  const [doctor, setDoctor] = useState(null);
  const [allPatientHistories, setAllPatientHistories] = useState([]);
  const [currentPage, setCurrentPage] = useState("list"); // list | history | addRecord
  const [selectedPatientEmail, setSelectedPatientEmail] = useState("");
  const [newRecord, setNewRecord] = useState(getEmptyRecord());
  const [patientSearch, setPatientSearch] = useState("");
  const [historySearch, setHistorySearch] = useState("");
  const [sortOrder, setSortOrder] = useState("desc");

  // Track which prescription is being edited
  const [editingPrescription, setEditingPrescription] = useState({ recordIndex: null, prescriptionIndex: null });

  function getEmptyRecord() {
    return {
      date: new Date().toISOString().split("T")[0],
      diagnosis: "",
      prescriptions: [
        { title: "", brand: "", strengthValue: "", strengthUnit: "mg", dosage: "Tablet", durationValue: "", durationUnit: "days", frequency: "" }
      ]
    };
  }

  useEffect(() => {
    const email = localStorage.getItem("userEmail");
    if (!email) return;

    const user = doctors.find(d => d.email === email);
    setDoctor(user);

    const doctorPatients = hardcodedAppointments.filter(a => a.doctorEmail === email).map(a => a.patientEmail);

    const histories = patientHistories
      .map(ph => {
        if (!doctorPatients.includes(ph.patientEmail)) return null;
        const patientInfo = patients.find(p => p.email === ph.patientEmail);
        return { patient: patientInfo, records: [...ph.records] };
      })
      .filter(Boolean);

    setAllPatientHistories(histories);
  }, []);

  if (!doctor) return <p className="p-6 text-gray-600">No doctor info available. Please log in.</p>;

  const selectedPatient = allPatientHistories.find(h => h.patient.email === selectedPatientEmail);

  const handleBack = (page = "list") => {
    setCurrentPage(page);
    setNewRecord(getEmptyRecord());
    setEditingPrescription({ recordIndex: null, prescriptionIndex: null });
  };

  const handleAddPrescription = () => {
    setNewRecord(prev => ({
      ...prev,
      prescriptions: [...prev.prescriptions, { title: "", brand: "", strengthValue: "", strengthUnit: "mg", dosage: "Tablet", durationValue: "", durationUnit: "days", frequency: "" }]
    }));
  };

  const handlePrescriptionChange = (index, field, value) => {
    const updated = [...newRecord.prescriptions];
    updated[index][field] = value;
    setNewRecord(prev => ({ ...prev, prescriptions: updated }));
  };

  const handleRemovePrescription = (index) => {
    const updated = [...newRecord.prescriptions];
    updated.splice(index, 1);
    setNewRecord(prev => ({ ...prev, prescriptions: updated }));
  };

  const handleAddRecord = (e) => {
    e.preventDefault();
    if (!newRecord.diagnosis) {
      Swal.fire("Error", "Diagnosis is required.", "error");
      return;
    }

    const record = { ...newRecord };
    setAllPatientHistories(prev =>
      prev.map(h => h.patient.email === selectedPatient.patient.email
        ? { ...h, records: [...h.records, record] }
        : h
      )
    );

    const globalHistory = patientHistories.find(ph => ph.patientEmail === selectedPatient.patient.email);
    if (globalHistory) globalHistory.records.push(record);
    else patientHistories.push({ patientEmail: selectedPatient.patient.email, records: [record] });

    Swal.fire("Added!", "New record has been added.", "success").then(() => handleBack("history"));
  };

  const handleEditPrescription = (recordIndex, prescriptionIndex) => {
    setEditingPrescription({ recordIndex, prescriptionIndex });
    const rec = selectedPatient.records[recordIndex];
    const pres = rec.prescriptions[prescriptionIndex];
    setNewRecord({
      date: rec.date,
      diagnosis: rec.diagnosis,
      prescriptions: [{ ...pres }]
    });
    setCurrentPage("addRecord");
  };

  const handleSavePrescription = (e) => {
    e.preventDefault();
    const { recordIndex, prescriptionIndex } = editingPrescription;

    const updatedRecords = [...selectedPatient.records];
    const updatedPrescriptions = [...updatedRecords[recordIndex].prescriptions];
    updatedPrescriptions[prescriptionIndex] = { ...newRecord.prescriptions[0] };
    updatedRecords[recordIndex] = {
      ...updatedRecords[recordIndex],
      date: newRecord.date,
      diagnosis: newRecord.diagnosis,
      prescriptions: updatedPrescriptions
    };

    setAllPatientHistories(prev =>
      prev.map(h => h.patient.email === selectedPatient.patient.email ? { ...h, records: updatedRecords } : h)
    );

    const globalHistory = patientHistories.find(ph => ph.patientEmail === selectedPatient.patient.email);
    if (globalHistory) globalHistory.records[recordIndex] = updatedRecords[recordIndex];

    Swal.fire("Saved!", "Prescription has been updated.", "success").then(() => handleBack("history"));
  };

  const filteredRecords = selectedPatient
    ? selectedPatient.records
        .filter(r =>
          r.diagnosis.toLowerCase().includes(historySearch.toLowerCase()) ||
          r.prescriptions.some(p => p.brand.toLowerCase().includes(historySearch.toLowerCase()) || (p.title && p.title.toLowerCase().includes(historySearch.toLowerCase())))
        )
        .sort((a, b) => sortOrder === "asc" ? new Date(a.date) - new Date(b.date) : new Date(b.date) - new Date(a.date))
    : [];

  return (
    <div className="p-6 max-w-6xl mx-auto mt-10 space-y-8">
      <h1 className="text-4xl font-bold text-blue-900 mb-6">Patient Histories</h1>

      {/* ===== Patient List ===== */}
      {currentPage === "list" && (
        <>
          <div className="flex gap-4 mb-6 flex-wrap">
            <div className="flex items-center gap-2 flex-1 border rounded-xl p-2">
              <FaSearch className="text-gray-500" />
              <input type="text" placeholder="Search patient by name or email..." value={patientSearch} onChange={e => setPatientSearch(e.target.value)} className="flex-1 outline-none" />
            </div>
            <button onClick={() => setPatientSearch("")} className="px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-400 flex items-center gap-2"><FaTimes /> Clear</button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {allPatientHistories.filter(h =>
              h.patient.name.toLowerCase().includes(patientSearch.toLowerCase()) ||
              h.patient.email.toLowerCase().includes(patientSearch.toLowerCase())
            ).map(h => (
              <div key={h.patient.email} onClick={() => { setSelectedPatientEmail(h.patient.email); setCurrentPage("history"); }} className="cursor-pointer p-5 rounded-2xl shadow-lg hover:shadow-xl transition bg-white border border-gray-200">
                <h2 className="text-xl font-semibold">{h.patient.name}</h2>
                <p className="text-gray-500">{h.patient.email}</p>
                <p className="mt-2 text-gray-400">{h.records.length} Records</p>
              </div>
            ))}
          </div>
        </>
      )}

      {/* ===== History Table ===== */}
      {currentPage === "history" && selectedPatient && (
        <div className="space-y-6">
          <div className="flex flex-wrap gap-4 items-center mb-4">
            <button onClick={() => handleBack("list")} className="flex items-center gap-2 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-xl shadow"><FaArrowLeft /> Back</button>
            <div className="flex items-center gap-2 border rounded-xl p-2 flex-1 max-w-md">
              <FaSearch className="text-gray-500" />
              <input type="text" placeholder="Search diagnosis, title, or brand..." value={historySearch} onChange={e => setHistorySearch(e.target.value)} className="flex-1 outline-none" />
            </div>
            <button onClick={() => setSortOrder(prev => prev === "asc" ? "desc" : "asc")} className="px-3 py-1 bg-blue-500 text-white rounded-xl hover:bg-blue-400 flex items-center gap-2">
              {sortOrder === "asc" ? <FaSortAmountUp /> : <FaSortAmountDown />}
              {sortOrder === "asc" ? "Oldest → Newest" : "Newest → Oldest"}
            </button>
            <button onClick={() => { setNewRecord(getEmptyRecord()); setCurrentPage("addRecord"); }} className="ml-auto px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-500 flex items-center gap-2"><FaPlus /> Add New Record</button>
          </div>

          <div className="overflow-x-auto rounded-2xl shadow-lg border border-gray-200 bg-white">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Date</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Diagnosis</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Brand</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Strength</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Dosage</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Duration</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Frequency</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredRecords.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-6 text-gray-500">No records found.</td>
                  </tr>
                ) : (
                  filteredRecords.map((rec, recIdx) =>
                    rec.prescriptions.map((p, pIdx) => (
                      <tr key={`${recIdx}-${pIdx}`} className="hover:bg-gray-50 transition">
                        {pIdx === 0 && <>
                          <td rowSpan={rec.prescriptions.length} className="px-4 py-3">{rec.date}</td>
                          <td rowSpan={rec.prescriptions.length} className="px-4 py-3">{rec.diagnosis}</td>
                        </>}
                        <td className="px-4 py-3">{p.brand}</td>
                        <td className="px-4 py-3">{p.strengthValue}{p.strengthUnit}</td>
                        <td className="px-4 py-3">{p.dosage}</td>
                        <td className="px-4 py-3">{p.durationValue ? `${p.durationValue} ${p.durationUnit}` : p.durationUnit}</td>
                        <td className="px-4 py-3">{p.frequency ? `${p.frequency} a day` : ""}</td>
                        <td className="px-4 py-3 flex gap-2">
                          <button onClick={() => handleEditPrescription(recIdx, pIdx)} className="px-3 py-1 bg-yellow-400 rounded text-white flex items-center gap-1">
                            <FaEdit /> Edit
                          </button>
                        </td>
                      </tr>
                    ))
                  )
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ===== Add/Edit Prescription ===== */}
      {currentPage === "addRecord" && selectedPatient && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <button onClick={() => handleBack("history")} className="flex items-center gap-2 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-xl shadow"><FaArrowLeft /> Back</button>
            {editingPrescription.recordIndex !== null && (
              <button onClick={() => handleBack("history")} className="px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-400 flex items-center gap-2">Cancel Edit</button>
            )}
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-lg max-w-6xl mx-auto space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">{editingPrescription.recordIndex !== null ? "Edit Prescription" : "Add New Record"} for {selectedPatient.patient.name}</h2>
            <form className="space-y-6" onSubmit={editingPrescription.recordIndex !== null ? handleSavePrescription : handleAddRecord}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input type="date" value={newRecord.date} onChange={e => setNewRecord(prev => ({ ...prev, date: e.target.value }))} className="p-2 border rounded-xl shadow-sm focus:ring-2 focus:ring-blue-400" required />
                <input type="text" placeholder="Diagnosis" value={newRecord.diagnosis} onChange={e => setNewRecord(prev => ({ ...prev, diagnosis: e.target.value }))} className="p-2 border rounded-xl shadow-sm focus:ring-2 focus:ring-blue-400" required />
              </div>

{newRecord.prescriptions.map((p, idx) => (
  <div
    key={idx}
    className="grid grid-cols-1 md:grid-cols-4 gap-3 p-3 border rounded-2xl shadow-sm bg-white"
  >
    {/* Brand */}
    <input
      type="text"
      placeholder="Brand"
      value={p.brand}
      onChange={e => handlePrescriptionChange(idx, "brand", e.target.value)}
      className="p-3 border rounded-xl focus:ring-2 focus:ring-blue-400 w-full"
      required
    />

    {/* Strength */}
    <div className="flex gap-2">
      <input
        type="number"
        placeholder="Strength"
        value={p.strengthValue}
        onChange={e => handlePrescriptionChange(idx, "strengthValue", e.target.value)}
        className="p-3 border rounded-xl focus:ring-2 focus:ring-blue-400 w-24"
        required
      />
      <select
        value={p.strengthUnit}
        onChange={e => handlePrescriptionChange(idx, "strengthUnit", e.target.value)}
        className="p-3 border rounded-xl focus:ring-2 focus:ring-blue-400"
      >
        <option>mg</option>
        <option>ml</option>
        <option>g</option>
        <option>IU</option>
      </select>
    </div>

    {/* Dosage */}
    <select
      value={p.dosage}
      onChange={e => handlePrescriptionChange(idx, "dosage", e.target.value)}
      className="p-3 border rounded-xl focus:ring-2 focus:ring-blue-400"
    >
      <option>Tablet</option>
      <option>Syrup</option>
      <option>Injection</option>
      <option>Capsule</option>
    </select>

    {/* Duration */}
    <div className="flex gap-2">
      <input
        type="number"
        placeholder="Duration"
        value={p.durationValue}
        onChange={e => handlePrescriptionChange(idx, "durationValue", e.target.value)}
        className="p-3 border rounded-xl focus:ring-2 focus:ring-blue-400 w-24"
      />
      <select
        value={p.durationUnit}
        onChange={e => handlePrescriptionChange(idx, "durationUnit", e.target.value)}
        className="p-3 border rounded-xl focus:ring-2 focus:ring-blue-400"
      >
        <option>days</option>
        <option>weeks</option>
        <option>months</option>
        <option>years</option>
        <option>everyday</option>
        <option>lifetime</option>
      </select>
    </div>

    {/* Frequency */}
    <div className="flex gap-2 items-center">
      <input
        type="number"
        placeholder="Frequency"
        value={p.frequency}
        onChange={e => handlePrescriptionChange(idx, "frequency", e.target.value)}
        className="p-3 border rounded-xl focus:ring-2 focus:ring-blue-400 w-24"
      />
      <span className="text-gray-600">a day</span>
    </div>

    {/* Remove button */}
    <div className="flex justify-end">
      {newRecord.prescriptions.length > 1 && (
        <button
          type="button"
          onClick={() => handleRemovePrescription(idx)}
          className="text-red-500 font-bold px-3 py-1 border rounded-xl hover:bg-red-100 transition"
        >
          Cancel
        </button>
      )}
    </div>
  </div>
))}


              <div className="flex gap-4">
                {!editingPrescription.recordIndex && (
                  <button type="button" onClick={handleAddPrescription} className="px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-500 flex items-center gap-2"><FaPlus /> Add Another Prescription</button>
                )}
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-500 flex items-center gap-2"><FaSave /> {editingPrescription.recordIndex !== null ? "Save Changes" : "Save Record"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default PatientDetails;
