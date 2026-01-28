import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useNavigate } from "react-router-dom";

export default function SetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const hash = window.location.hash.substring(1);
    const params = new URLSearchParams(hash);

    const token_hash = params.get("token_hash");
    const type = params.get("type");

    if (!token_hash || type !== "invite") {
      setErrorMessage("Invalid invite link.");
      setLoading(false);
      return;
    }

    supabase.auth
      .verifyOtp({
        type: "invite",
        token_hash
      })
      .then(({ error }) => {
        if (error) {
          setErrorMessage(error.message);
        }
        setLoading(false);
      });
  }, []);

  const handleSetPassword = async () => {
    if (password.length < 8) {
      alert("Password must be at least 8 characters");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      alert(error.message);
      return;
    }

    await supabase.auth.signOut();
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

      <button
        onClick={handleSetPassword}
        style={{ width: "100%", padding: 10 }}
      >
        Set Password
      </button>
    </div>
  );
}
