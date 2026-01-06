import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Landing
import LandingPage from "../pages/landing/LandingPage";

// Auth
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import ForgotPassword from "../pages/auth/ForgotPassword";
import ResetPassword from "../pages/auth/ResetPassword";

// Doctor
import DoctorLayout from "../layouts/DoctorLayout";
import DoctorDashboard from "../pages/doctor/DoctorDashboard";
import AppointmentList from "../pages/doctor/AppointmentList";
import PatientDetails from "../pages/doctor/PatientDetails";
import ProfileInfo from "../pages/doctor/ProfileInfo";
import AppointmentStatus from "../pages/doctor/AppointmentStatus";

// Patient
import PatientLayout from "../layouts/PatientLayout";
import PatientDashboard from "../pages/patient/PatientDashboard";
import CreateAppointment from "../pages/patient/CreateAppointment";
import AppointmentHistory from "../pages/patient/AppointmentHistory";
import AppointmentSchedule from "../pages/patient/AppointmentSchedule";
import PatientProfile from "../pages/patient/PatientProfile";

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public */}
        <Route path="/" element={<LandingPage />} />

        {/* Auth */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Doctor Dashboard */}
        <Route element={<DoctorLayout />}>
          <Route path="/doctor" element={<DoctorDashboard />} />
          <Route path="/doctor/appointments" element={<AppointmentList />} />
          <Route path="/doctor/patient/:id" element={<PatientDetails />} />
          <Route path="/doctor/profile" element={<ProfileInfo />} />
          <Route path="/doctor/status" element={<AppointmentStatus />} />
        </Route>

        {/* Patient Dashboard */}
        <Route element={<PatientLayout />}>
          <Route path="/patient" element={<PatientDashboard />} />
          <Route path="/patient/create" element={<CreateAppointment />} />
          <Route path="/patient/history" element={<AppointmentHistory />} />
          <Route path="/patient/schedule" element={<AppointmentSchedule />} />
          <Route path="/patient/profile" element={<PatientProfile />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" />} />

      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;
