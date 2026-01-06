import { useState } from "react";
import Swal from "sweetalert2";
import { doctors } from "../../data/accounts";

const TIME_SLOTS = [
  "07:00 AM", "08:00 AM", "09:00 AM", "10:00 AM", "11:00 AM",
  "12:00 PM", "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM",
  "05:00 PM", "06:00 PM", "07:00 PM", "08:00 PM"
];

const HOLIDAYS = ["2025-12-25", "2025-01-01"];

function CreateAppointment() {
  const [stage, setStage] = useState(1);
  const [specialization, setSpecialization] = useState("");
  const [doctorEmail, setDoctorEmail] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [notes, setNotes] = useState("");
  const [appointments, setAppointments] = useState(() => JSON.parse(localStorage.getItem("appointments")) || []);
  const [message, setMessage] = useState("");

  const filteredDoctors = doctors.filter(d => d.specialization === specialization);

  const handleNext = () => {
    if (stage === 1 && (!specialization || !doctorEmail)) {
      setMessage("Please select a specialization and doctor.");
      return;
    }
    if (stage === 2 && (!date || !time)) {
      setMessage("Please select date and time.");
      return;
    }
    setMessage("");
    setStage(stage + 1);
  };

  const handleBack = () => {
    setMessage("");
    setStage(stage - 1);
  };

  const handleSubmit = async () => {
    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      setMessage("You cannot select a past date.");
      setStage(2);
      return;
    }

    if (HOLIDAYS.includes(date)) {
      setMessage("Selected date is a holiday. Please choose another date.");
      setStage(2);
      return;
    }

    const appointmentsOnDate = appointments.filter(a => a.date === date);
    if (appointmentsOnDate.length >= 5) {
      setMessage("Maximum appointments reached for this date.");
      setStage(2);
      return;
    }

    if (appointmentsOnDate.some(a => a.time === time)) {
      setMessage("This time slot is already booked. Please choose another.");
      setStage(2);
      return;
    }

    const patientEmail = localStorage.getItem("userEmail");
    const doctor = doctors.find(d => d.email === doctorEmail);

    // Ask user if they want to book
    const result = await Swal.fire({
      title: "Do you want to book this appointment?",
      html: `
        <p><strong>Doctor:</strong> ${doctor?.name}</p>
        <p><strong>Specialization:</strong> ${doctor?.specialization}</p>
        <p><strong>Date:</strong> ${date}</p>
        <p><strong>Time:</strong> ${time}</p>
        ${notes ? `<p><strong>Notes:</strong> ${notes}</p>` : ""}
      `,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, book it",
      cancelButtonText: "No, cancel"
    });

    if (result.isConfirmed) {
      // Save appointment
      const newAppointment = { patientEmail, doctorEmail, date, time, notes, status: "Pending" };
      const updatedAppointments = [...appointments, newAppointment];
      setAppointments(updatedAppointments);
      localStorage.setItem("appointments", JSON.stringify(updatedAppointments));

      await Swal.fire({
        title: "Appointment Booked!",
        html: `
          <p><strong>Doctor:</strong> ${doctor?.name}</p>
          <p><strong>Specialization:</strong> ${doctor?.specialization}</p>
          <p><strong>Date:</strong> ${date}</p>
          <p><strong>Time:</strong> ${time}</p>
          ${notes ? `<p><strong>Notes:</strong> ${notes}</p>` : ""}
        `,
        icon: "success",
        confirmButtonText: "OK"
      });

      // Reset form
      setStage(1);
      setSpecialization("");
      setDoctorEmail("");
      setDate("");
      setTime("");
      setNotes("");
      setMessage("");
    } else {
      // If user cancels
      Swal.fire({
        title: "Appointment not booked",
        icon: "info",
        confirmButtonText: "OK"
      });
    }
  };

  const stages = [
    { id: 1, title: "Doctor" },
    { id: 2, title: "Date & Time" },
    { id: 3, title: "Notes" }
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto mt-10 space-y-6">

      {/* Page Title */}
      <h1 className="text-4xl font-bold text-teal-700">Add Appointment</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left Column: Progress + Info */}
        <div className="lg:col-span-1 flex flex-col space-y-6 bg-gradient-to-br from-teal-400 to-indigo-500 text-white p-6 rounded-2xl shadow-lg pattern-diagonal-stripes">
          <h2 className="text-2xl font-bold">Book Appointment</h2>
          {message && <p className="text-yellow-300">{message}</p>}
          <div className="space-y-4">
            {stages.map(s => (
              <div key={s.id} className="flex items-center space-x-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${stage >= s.id ? "bg-gradient-to-r from-amber-400 to-yellow-500 text-white shadow-lg" : "bg-gray-300 text-gray-600"}`}>
                  {s.id}
                </div>
                <span className="font-semibold">{s.title}</span>
              </div>
            ))}
          </div>
          <div className="mt-6 bg-black bg-opacity-20 p-4 rounded">
            {stage === 1 && <p>Select a doctor by specialization. Check their experience and availability.</p>}
            {stage === 2 && <p>Select date & time. Holidays are unavailable: {HOLIDAYS.join(", ")}</p>}
            {stage === 3 && <p>Add notes or special requests for your appointment.</p>}
          </div>
        </div>

        {/* Right Column: Form + Doctor Cards */}
        <div className="lg:col-span-2 space-y-6">
          {/* Stage 1 */}
          {stage === 1 && (
            <div className="space-y-4">
              <div>
                <label className="block font-semibold mb-1">Specialization</label>
                <select
                  value={specialization}
                  onChange={(e) => { setSpecialization(e.target.value); setDoctorEmail(""); }}
                  className="w-full p-3 rounded-xl border border-gray-300 shadow-sm focus:ring-2 focus:ring-teal-400"
                >
                  <option value="">-- Choose specialization --</option>
                  {[...new Set(doctors.map(d => d.specialization))].map(spec => (
                    <option key={spec} value={spec}>{spec}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredDoctors.map(doc => (
                  <div
                    key={doc.email}
                    onClick={() => setDoctorEmail(doc.email)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer hover:shadow-lg ${doctorEmail === doc.email ? "border-teal-500 bg-teal-50" : "border-gray-300 bg-white"}`}
                  >
                    <p className="font-semibold text-lg">{doc.name}</p>
                    <p className="text-sm text-gray-600">Experience: {doc.experience || "N/A"} years</p>
                    <p className="text-sm text-gray-600">Email: {doc.email}</p>
                    <p className="text-sm text-gray-600">Specialization: {doc.specialization}</p>
                  </div>
                ))}
              </div>
              <button onClick={handleNext} className="mt-4 w-full py-3 bg-gradient-to-r from-teal-400 to-indigo-500 text-white rounded-xl font-semibold hover:opacity-90 transition">Next</button>
            </div>
          )}

          {/* Stage 2 */}
          {stage === 2 && (
            <div className="space-y-4 bg-white p-6 rounded-2xl shadow-lg">
              <label className="block font-semibold mb-1">Date</label>
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full p-3 rounded-xl border border-gray-300 shadow-sm" />
              <label className="block font-semibold mb-1">Time</label>
              <select value={time} onChange={(e) => setTime(e.target.value)} className="w-full p-3 rounded-xl border border-gray-300 shadow-sm">
                <option value="">-- Choose time --</option>
                {TIME_SLOTS.map(slot => <option key={slot} value={slot}>{slot}</option>)}
              </select>
              <div className="flex justify-between">
                <button onClick={handleBack} className="py-2 px-6 bg-gray-200 rounded-xl hover:bg-gray-300">Back</button>
                <button onClick={handleNext} className="py-2 px-6 bg-indigo-500 text-white rounded-xl hover:bg-indigo-600">Next</button>
              </div>
            </div>
          )}

          {/* Stage 3 */}
          {stage === 3 && (
            <div className="space-y-4 bg-white p-6 rounded-2xl shadow-lg">
              <label className="block font-semibold mb-1">Notes / Requests</label>
              <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Optional notes or requests..." className="w-full p-3 rounded-xl border border-gray-300 shadow-sm" rows={4}></textarea>
              <div className="flex justify-between">
                <button onClick={handleBack} className="py-2 px-6 bg-gray-200 rounded-xl hover:bg-gray-300">Back</button>
                <button onClick={handleSubmit} className="py-2 px-6 bg-amber-500 text-white rounded-xl hover:bg-amber-600">Confirm</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CreateAppointment;
