import { Routes, Route, Navigate } from "react-router-dom";
import SignIn from "./pages/SignIn";
import Splash from "./pages/Splash";

import SetPassword from "./pages/set-password";

import HQAdminLayout from "./pages/dashboard/hq-admin/HQAdminLayout";

import DashboardHome from "./pages/dashboard/hq-admin/pages/DashboardHome";
import Branch from "./pages/dashboard/hq-admin/pages/Branch";
import BranchAdmin from "./pages/dashboard/hq-admin/pages/BranchAdmin";
import Reports from "./pages/dashboard/hq-admin/pages/Reports";
import Profile from "./pages/dashboard/hq-admin/pages/Profile";

const App = () => {
  return (
    <Routes>
      
      <Route path="/" element={<Splash />} />
      <Route path="/signin" element={<SignIn />} />

      {/* Invite / Set Password */}
      <Route path="/set-password" element={<SetPassword />} />

      {/* HQ Admin Dashboard Layout */}
   <Route path="/dashboard/hq-admin" element={<HQAdminLayout />}>
  <Route index element={<Navigate to="home" replace />} />
  <Route path="home" element={<DashboardHome />} />
  <Route path="branch" element={<Branch />} />
  <Route path="branch-admin" element={<BranchAdmin />} />
  <Route path="reports" element={<Reports />} />
  <Route path="profile" element={<Profile />} />
</Route>

    </Routes>
  );
};

export default App;
