// src/pages/dashboard/hq-admin/pages/BranchAdmin.tsx
import { useState, useEffect } from 'react';
import axios from 'axios';

interface Branch {
  id: string;
  name: string;
}

interface User {
  id: string;
  fullName: string;
  email: string;
  role: string;
  branch?: Branch;
  isActive: boolean;
}

const BranchAdmin = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ fullName: '', email: '', branchId: '' });
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState('');

  const token = localStorage.getItem('supabase_token');

  // Fetch users
  const fetchUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
    } catch (err: any) {
      console.error('Failed to fetch users:', err);
      setError(err.response?.data?.message || err.message || 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  // Fetch branches
  const fetchBranches = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/branches`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBranches(res.data);
      if (res.data.length > 0) setFormData(prev => ({ ...prev, branchId: res.data[0].id }));
    } catch (err: any) {
      console.error('Failed to fetch branches:', err);
      setError(err.response?.data?.message || err.message || 'Failed to fetch branches');
    }
  };

  useEffect(() => {
    fetchBranches();
    fetchUsers();
  }, []);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email || !formData.branchId) {
      setFormError('All fields are required');
      return;
    }

    setFormError('');
    setFormLoading(true);

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/users`,
        { ...formData, role: 'BRANCH_ADMIN' },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUsers(prev => [...prev, res.data]);
      setFormData({ fullName: '', email: '', branchId: branches[0]?.id || '' });
      setShowForm(false);
    } catch (err: any) {
      console.error('Failed to create user:', err);
      setFormError(err.response?.data?.message || err.message || 'Failed to create user');
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Branch Admins</h1>
        <button
          className="bg-emerald-700 text-white px-4 py-2 rounded hover:bg-emerald-800"
          onClick={() => setShowForm(true)}
        >
          Create Branch Admin
        </button>
      </div>

      {loading ? (
        <p>Loading users...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : users.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">Name</th>
              <th className="border p-2">Email</th>
              <th className="border p-2">Role</th>
              <th className="border p-2">Branch</th>
              <th className="border p-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="border p-2">{user.fullName}</td>
                <td className="border p-2">{user.email}</td>
                <td className="border p-2">{user.role}</td>
                <td className="border p-2">{user.branch?.name || '-'}</td>
                <td className="border p-2">{user.isActive ? 'Active' : 'Inactive'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Modal Form */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow w-96 relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              onClick={() => setShowForm(false)}
            >
              &times;
            </button>
            <h2 className="text-xl font-bold mb-4">Create Branch Admin</h2>
            {formError && <p className="text-red-500 mb-2">{formError}</p>}
            <form onSubmit={handleCreateUser} className="flex flex-col gap-2">
              <input
                type="text"
                placeholder="Full Name"
                className="border p-2 rounded"
                value={formData.fullName}
                onChange={e => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                required
              />
              <input
                type="email"
                placeholder="Email"
                className="border p-2 rounded"
                value={formData.email}
                onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
                required
              />
              <select
                className="border p-2 rounded"
                value={formData.branchId}
                onChange={e => setFormData(prev => ({ ...prev, branchId: e.target.value }))}
              >
                {branches.map(b => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </select>
              <button
                type="submit"
                className="bg-emerald-700 text-white px-4 py-2 rounded hover:bg-emerald-800 mt-2 disabled:opacity-50"
                disabled={formLoading}
              >
                {formLoading ? 'Creating...' : 'Create'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BranchAdmin;
