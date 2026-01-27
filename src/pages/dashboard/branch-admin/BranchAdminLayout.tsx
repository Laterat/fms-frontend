import { Outlet } from "react-router-dom";
import Sidebar from "./sidebar";

const BranchAdminLayout = () => {
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 min-h-screen bg-slate-50 p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default BranchAdminLayout;
