import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import axios from 'axios';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignIn = async () => {
    setError('');
    setLoading(true);

    try {
      console.log('Attempting Supabase sign in...');
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      console.log('Supabase response:', data, authError);

      if (authError || !data.user) {
        setError(authError?.message || 'Authentication failed');
        return;
      }

     localStorage.setItem('supabase_token', data.session?.access_token || '');

// now you can call your backend safely
const userId = data.user.id;
      console.log('Logged in user ID:', userId);

      console.log('Fetching user role from backend...');
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/users/${userId}`, {
        headers: { Authorization: `Bearer ${data.session?.access_token}` },
      });
      console.log('Backend response:', res.data);

      const role = res.data.role;
      console.log('User role:', role);

      // Redirect based on role
      switch (role) {
        case 'HQ_ADMIN':
          navigate('/dashboard/hq-admin/home');
          break;
        case 'BRANCH_ADMIN':
          navigate('/dashboard/branch-admin/home');
          break;
        case 'REFUELING_TEAM':
          navigate('/dashboard/refueling-team/home');
          break;
        case 'REFUELING_MANAGER':
          navigate('/dashboard/refueling-manager/home');
          break;
        case 'FINANCE':
          navigate('/dashboard/finance/home');
          break;
        case 'FUEL_ADMIN':
          navigate('/dashboard/fuel-admin/home');
          break;
        case 'DRIVER':
          navigate('/dashboard/driver/home');
          break;
        default:
          setError('Unknown role');
      }
    } catch (err: any) {
      console.error('Sign-in error:', err);
      setError(err.response?.data?.message || err.message || 'Failed to fetch user info');
    } finally {
      setLoading(false); // Always reset loading
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow w-96">
        <h1 className="text-2xl font-bold mb-6">Sign In</h1>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSignIn();
          }}
        >
          <input
            type="email"
            placeholder="Email"
            className="w-full p-2 mb-4 border rounded"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError('');
            }}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-2 mb-4 border rounded"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError('');
            }}
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignIn;
