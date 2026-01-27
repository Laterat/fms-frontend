import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useNavigate } from "react-router-dom";

export default function SetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  // Step 1: Get tokens from URL and validate
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const access_token = urlParams.get("access_token");
    const refresh_token = urlParams.get("refresh_token");

    if (!access_token || !refresh_token) {
      setErrorMessage("Invalid invite link.");
      setLoading(false);
      return;
    }

    // Step 2: Set the session
    supabase.auth
      .setSession({ access_token, refresh_token })
      .then(({ error, data }) => {
        if (error || !data.session) {
          setErrorMessage("Expired or invalid invite link.");
        }
        setLoading(false);
      });
  }, []);

  // Step 3: Handle password set
  const handleSetPassword = async () => {
    if (password.length < 8) {
      alert("Password must be at least 8 characters");
      return;
    }
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    // Update password
    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      alert(error.message);
      return;
    }

    // Sign out and redirect to sign-in page
    await supabase.auth.signOut();
    alert("Password set successfully! Please sign in with your new password.");
    navigate("/signin");
  };

  if (loading) return <p>Loading...</p>;
  if (errorMessage) return <p>{errorMessage}</p>;

  return (
    <div style={{ maxWidth: 400, margin: "auto", padding: 20 }}>
      <h1>Set your password</h1>

      <input
        type="password"
        placeholder="New password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ width: "100%", marginBottom: 10, padding: 8 }}
      />

      <input
        type="password"
        placeholder="Confirm password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        style={{ width: "100%", marginBottom: 10, padding: 8 }}
      />

      <button onClick={handleSetPassword} style={{ width: "100%", padding: 10 }}>
        Set Password
      </button>
    </div>
  );
}
