import { useState } from "react";
import { patients } from "../../data/accounts";
import { FaBirthdayCake, FaEnvelope, FaUser, FaPhone, FaMapMarkerAlt, FaEdit, FaSave, FaTrash } from "react-icons/fa";

function PatientProfile() {
  const email = localStorage.getItem("userEmail");
  const patientData = patients.find(p => p.email === email);

  const [patient, setPatient] = useState(patientData);
  const [editing, setEditing] = useState(false);

  if (!patient) {
    return <p className="text-red-500 text-center mt-10">No patient found. Please log in.</p>;
  }

  const toggleEdit = () => setEditing(!editing);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageURL = URL.createObjectURL(file);
      setPatient(prev => ({ ...prev, profileImage: imageURL }));
    }
  };

  const handleRemoveImage = () => {
    setPatient(prev => ({ ...prev, profileImage: null }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-teal-50 to-cyan-50 flex items-center justify-center p-6">
      <div className="max-w-4xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
        {/* Left Panel: Profile Image */}
        <div className="bg-teal-600 flex flex-col items-center justify-center p-8 w-full md:w-1/3">
          <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white flex items-center justify-center bg-teal-100 mb-4">
            {patient.profileImage ? (
              <img src={patient.profileImage} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <span className="text-white text-lg font-semibold">N/A</span>
            )}
          </div>
          {editing && (
            <div className="flex flex-col items-center space-y-2">
              <label className="cursor-pointer bg-teal-100 text-teal-700 px-4 py-2 rounded-full hover:bg-teal-200 flex items-center space-x-2">
                <FaEdit /> <span>Upload</span>
                <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
              </label>
              {patient.profileImage && (
                <button onClick={handleRemoveImage} className="flex items-center space-x-2 text-red-600 hover:underline">
                  <FaTrash /> <span>Remove</span>
                </button>
              )}
            </div>
          )}
          <h2 className="text-2xl font-bold text-white mt-4">{patient.name}</h2>
          <p className="text-teal-200 font-medium">{patient.role || "Patient"}</p>
        </div>

        {/* Right Panel: Info */}
        <div className="p-8 flex-1 space-y-6">
          {/* Info Rows */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-3 bg-teal-50 p-4 rounded-xl shadow hover:shadow-md transition">
              <FaUser className="text-teal-500" />
              <div>
                <p className="text-gray-700 font-medium">Full Name</p>
                <p className="font-semibold">{patient.name}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3 bg-teal-50 p-4 rounded-xl shadow hover:shadow-md transition">
              <FaEnvelope className="text-teal-500" />
              <div>
                <p className="text-gray-700 font-medium">Email</p>
                <p className="font-semibold">{patient.email}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3 bg-teal-50 p-4 rounded-xl shadow hover:shadow-md transition">
              <FaBirthdayCake className="text-teal-500" />
              <div>
                <p className="text-gray-700 font-medium">Age</p>
                <p className="font-semibold">{patient.age}</p>
              </div>
            </div>

            {patient.phone && (
              <div className="flex items-center space-x-3 bg-teal-50 p-4 rounded-xl shadow hover:shadow-md transition">
                <FaPhone className="text-teal-500" />
                <div>
                  <p className="text-gray-700 font-medium">Phone</p>
                  <p className="font-semibold">{patient.phone}</p>
                </div>
              </div>
            )}

            {patient.address && (
              <div className="flex items-center space-x-3 bg-teal-50 p-4 rounded-xl shadow hover:shadow-md transition">
                <FaMapMarkerAlt className="text-teal-500" />
                <div>
                  <p className="text-gray-700 font-medium">Address</p>
                  <p className="font-semibold">{patient.address}</p>
                </div>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="flex justify-between items-center mt-6">
            <p className="text-gray-500 text-sm">Total Appointments: <span className="font-semibold">{patient.reservationCount || 0}</span></p>
            <button
              onClick={toggleEdit}
              className={`px-6 py-2 rounded-xl shadow transition flex items-center space-x-2
                ${editing ? "bg-green-700 text-white hover:bg-green-600" : "bg-teal-600 text-white hover:bg-teal-500"}
              `}
            >
              {editing ? <><FaSave /> <span>Save Profile</span></> : <><FaEdit /> <span>Edit Profile</span></>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PatientProfile;
