import { NavLink } from "react-router-dom";

const Sidebar = () => {
  return (
    <aside className="w-[20%] min-w-[240px] h-screen bg-gradient-to-b from-emerald-700 to-emerald-900 px-6 py-8 text-emerald-50">
      <h2 className="text-2xl font-bold mb-10 tracking-wide">
        HQ Admin
      </h2>

      <nav className="flex flex-col gap-3">
        <NavLink
          to="home"
          end
          className={({ isActive }) =>
            `px-4 py-3 rounded-lg transition-all duration-200
             ${isActive
               ? "bg-white text-emerald-900 font-semibold"
               : "text-emerald-100 hover:bg-white/15"}`
          }
        >
          Dashboard
        </NavLink>

        <NavLink
          to="branch"
          className={({ isActive }) =>
            `px-4 py-3 rounded-lg transition-all duration-200
             ${isActive
               ? "bg-white text-emerald-900 font-semibold"
               : "text-emerald-100 hover:bg-white/15"}`
          }
        >
          Branch
        </NavLink>

        <NavLink
          to="branch-admin"
          className={({ isActive }) =>
            `px-4 py-3 rounded-lg transition-all duration-200
             ${isActive
               ? "bg-white text-emerald-900 font-semibold"
               : "text-emerald-100 hover:bg-white/15"}`
          }
        >
          Branch Admin
        </NavLink>

        <NavLink
          to="reports"
          className={({ isActive }) =>
            `px-4 py-3 rounded-lg transition-all duration-200
             ${isActive
               ? "bg-white text-emerald-900 font-semibold"
               : "text-emerald-100 hover:bg-white/15"}`
          }
        >
          Reports
        </NavLink>

        <NavLink
          to="profile"
          className={({ isActive }) =>
            `px-4 py-3 rounded-lg transition-all duration-200
             ${isActive
               ? "bg-white text-emerald-900 font-semibold"
               : "text-emerald-100 hover:bg-white/15"}`
          }
        >
          Profile
        </NavLink>
      </nav>
    </aside>
  );
};

export default Sidebar;
