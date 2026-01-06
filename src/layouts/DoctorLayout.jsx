import { Outlet, NavLink, useNavigate } from "react-router-dom";
import {
  HomeIcon,
  CalendarIcon,
  IdentificationIcon,
  ClockIcon,
  UserIcon,
  ArrowRightOnRectangleIcon
} from "@heroicons/react/24/solid";

function DoctorLayout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("userRole");
    navigate("/");
  };

  const menuItems = [
    { name: "Dashboard", to: "/doctor", icon: <HomeIcon className="w-5 h-5 mr-2" /> },
    { name: "Appointments", to: "/doctor/appointments", icon: <CalendarIcon className="w-5 h-5 mr-2" /> },
    { name: "Patient Details", to: "/doctor/patient/:id", icon: <IdentificationIcon className="w-5 h-5 mr-2" /> },
    { name: "Status", to: "/doctor/status", icon: <ClockIcon className="w-5 h-5 mr-2" /> },
    { name: "Profile", to: "/doctor/profile", icon: <UserIcon className="w-5 h-5 mr-2" /> },
  ];

  return (
  <div className="flex min-h-screen">
  {/* Sidebar */}
  <aside className="w-64 bg-gradient-to-b from-blue-800 to-blue-600 text-white p-6 flex flex-col justify-between shadow-lg flex-none">
    <div>
      <h2 className="text-3xl font-bold mb-6">DOCTOR DASHBOARD</h2>
      <nav className="flex flex-col space-y-2">
        {menuItems.map(item => (
          <NavLink
            key={item.name}
            to={item.to}
            end={item.to === "/doctor"}
            className={({ isActive }) =>
              `flex items-center px-3 py-2 rounded-lg transition-colors duration-200 ${
                isActive ? "bg-blue-500 font-semibold shadow-md" : "hover:bg-blue-400"
              }`
            }
          >
            {item.icon}
            {item.name}
          </NavLink>
        ))}
      </nav>
    </div>

    {/* Logout Button */}
    <button
      onClick={handleLogout}
      className="flex items-center justify-center bg-red-500 hover:bg-red-400 rounded-lg px-4 py-2 font-semibold shadow-md transition"
    >
      <ArrowRightOnRectangleIcon className="w-5 h-5 mr-2" />
      Logout
    </button>
  </aside>

  {/* Main Content */}
  <main className="flex-1 bg-blue-50 overflow-auto max-h-screen">
    <div className="bg-white rounded-2xl shadow-lg min-h-full">
      <Outlet />
    </div>
  </main>
</div>

  );
}

export default DoctorLayout;
