import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Splash = () => {
  const navigate = useNavigate();

  // 🔑 THIS is what makes Supabase invite links work
  useEffect(() => {
    const params = window.location.search;

    if (
      params.includes("access_token") &&
      (params.includes("type=invite") || params.includes("type=recovery"))
    ) {
      navigate("/set-password" + params, { replace: true });
    }
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-blue-100">
      <h1 className="text-4xl font-bold mb-6">Fuel Management System</h1>
      <button
        onClick={() => navigate("/signin")}
        className="bg-blue-500 text-white px-6 py-3 rounded hover:bg-blue-600"
      >
        Sign In
      </button>
    </div>
  );
};

export default Splash;
