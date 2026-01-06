import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { HomeIcon, CalendarIcon, ClockIcon, UserIcon, DocumentTextIcon, PlusIcon, ArrowRightOnRectangleIcon } from "@heroicons/react/24/solid";

function PatientLayout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("userRole");
    navigate("/");
  };

  const menuItems = [
    { name: "Dashboard", to: "/patient", icon: <HomeIcon className="w-5 h-5 mr-2" /> },
    { name: "Create Appointment", to: "/patient/create", icon: <PlusIcon className="w-5 h-5 mr-2" /> },
    { name: "History", to: "/patient/history", icon: <DocumentTextIcon className="w-5 h-5 mr-2" /> },
    { name: "Schedule", to: "/patient/schedule", icon: <CalendarIcon className="w-5 h-5 mr-2" /> },
    { name: "Profile", to: "/patient/profile", icon: <UserIcon className="w-5 h-5 mr-2" /> },
  ];

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-gradient-to-b from-teal-600 to-blue-600 text-white p-6 flex flex-col justify-between min-h-screen shadow-lg">
        <div>
          <h2 className="text-3xl font-bold mb-6">PATIENT DASHBOARD</h2>
          <nav className="flex flex-col space-y-2">
            {menuItems.map(item => (
              <NavLink
                key={item.name}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center px-3 py-2 rounded-lg transition-colors duration-200 ${
                    isActive ? "bg-teal-500 font-semibold shadow-md" : "hover:bg-teal-400"
                  }`
                }
              >
                {item.icon}
                {item.name}
              </NavLink>
            ))}
          </nav>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center justify-center mt-6 bg-red-500 hover:bg-red-400 rounded-lg px-4 py-2 font-semibold shadow-md transition-colors duration-200"
        >
          <ArrowRightOnRectangleIcon className="w-5 h-5 mr-2" />
          Logout
        </button>
      </aside>

      {/* Main content */}
      <main className="flex-1 bg-blue-50 overflow-auto">
        <div className="bg-white rounded-2xl shadow-lg min-h-full">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default PatientLayout;
