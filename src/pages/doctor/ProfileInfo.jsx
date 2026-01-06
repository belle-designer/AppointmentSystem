import { useState } from "react";
import { doctors } from "../../data/accounts";
import { FaUser, FaEnvelope, FaStethoscope, FaPhone, FaMapMarkerAlt, FaEdit, FaSave, FaTrash } from "react-icons/fa";

function DoctorProfile() {
  const email = localStorage.getItem("userEmail");
  const doctorData = doctors.find(d => d.email === email);

  const [doctor, setDoctor] = useState(doctorData);
  const [editing, setEditing] = useState(false);

  if (!doctor) {
    return <p className="text-red-500 text-center mt-10">No doctor found. Please log in.</p>;
  }

  const toggleEdit = () => setEditing(!editing);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageURL = URL.createObjectURL(file);
      setDoctor(prev => ({ ...prev, profileImage: imageURL }));
    }
  };

  const handleRemoveImage = () => {
    setDoctor(prev => ({ ...prev, profileImage: null }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-cyan-50 flex items-center justify-center p-6">
      <div className="max-w-4xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
        {/* Left Panel: Profile Image */}
        <div className="bg-blue-700 flex flex-col items-center justify-center p-8 w-full md:w-1/3">
          <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white flex items-center justify-center bg-blue-100 mb-4">
            {doctor.profileImage ? (
              <img src={doctor.profileImage} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <span className="text-white text-lg font-semibold">N/A</span>
            )}
          </div>

          {editing && (
            <div className="flex flex-col items-center space-y-2">
              <label className="cursor-pointer bg-blue-100 text-blue-700 px-4 py-2 rounded-full hover:bg-blue-200 flex items-center space-x-2">
                <FaEdit /> <span>Upload</span>
                <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
              </label>
              {doctor.profileImage && (
                <button onClick={handleRemoveImage} className="flex items-center space-x-2 text-red-600 hover:underline">
                  <FaTrash /> <span>Remove</span>
                </button>
              )}
            </div>
          )}

          <h2 className="text-2xl font-bold text-white mt-4">{doctor.name}</h2>
          <p className="text-blue-200 font-medium">{doctor.role || "Doctor"}</p>
        </div>

        {/* Right Panel: Info */}
        <div className="p-8 flex-1 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Full Name */}
            <div className="flex items-center space-x-3 bg-blue-50 p-4 rounded-xl shadow hover:shadow-md transition">
              <FaUser className="text-blue-500" />
              <div>
                <p className="text-gray-700 font-medium">Full Name</p>
                <p className="font-semibold">{doctor.name}</p>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-center space-x-3 bg-blue-50 p-4 rounded-xl shadow hover:shadow-md transition">
              <FaEnvelope className="text-blue-500" />
              <div>
                <p className="text-gray-700 font-medium">Email</p>
                <p className="font-semibold">{doctor.email}</p>
              </div>
            </div>

            {/* Specialization */}
            <div className="flex items-center space-x-3 bg-blue-50 p-4 rounded-xl shadow hover:shadow-md transition">
              <FaStethoscope className="text-blue-500" />
              <div>
                <p className="text-gray-700 font-medium">Specialization</p>
                <p className="font-semibold">{doctor.specialization}</p>
              </div>
            </div>

            {/* Phone */}
            {doctor.phone && (
              <div className="flex items-center space-x-3 bg-blue-50 p-4 rounded-xl shadow hover:shadow-md transition">
                <FaPhone className="text-blue-500" />
                <div>
                  <p className="text-gray-700 font-medium">Phone</p>
                  <p className="font-semibold">{doctor.phone}</p>
                </div>
              </div>
            )}

            {/* Address */}
            {doctor.address && (
              <div className="flex items-center space-x-3 bg-blue-50 p-4 rounded-xl shadow hover:shadow-md transition">
                <FaMapMarkerAlt className="text-blue-500" />
                <div>
                  <p className="text-gray-700 font-medium">Address</p>
                  <p className="font-semibold">{doctor.address}</p>
                </div>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="flex justify-between items-center mt-6">
            <p className="text-gray-500 text-sm">Total Patients: <span className="font-semibold">{doctor.patientCount || 0}</span></p>
            <button
              onClick={toggleEdit}
              className={`px-6 py-2 rounded-xl shadow transition flex items-center space-x-2
                ${editing ? "bg-green-700 text-white hover:bg-green-600" : "bg-blue-600 text-white hover:bg-blue-500"}
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

export default DoctorProfile;
