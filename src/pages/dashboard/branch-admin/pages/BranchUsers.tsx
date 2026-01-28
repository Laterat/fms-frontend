import { useState, useEffect } from 'react';
import axios from 'axios';

// Define roles locally (do NOT import @prisma/client)
export enum UserRole {
  REFUELING_MANAGER = 'REFUELING_MANAGER',
  FUEL_ADMIN = 'FUEL_ADMIN',
  REFUELING_TEAM = 'REFUELING_TEAM',
  FINANCE = 'FINANCE',
  DRIVER = 'DRIVER',
}

interface UserI {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
  phoneNumber?: string;
  employeeId?: string;
}

const BranchUsers = () => {
  const [users, setUsers] = useState<UserI[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    role: '' as UserRole | '',
    phoneNumber: '',
    employeeId: '',
  });
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState('');

  const token = localStorage.getItem('supabase_token');

  // Fetch branch users
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setFormLoading(true);

    // Frontend check: only one Refueling Manager and Fuel Admin
    if (
      (formData.role === UserRole.REFUELING_MANAGER &&
        users.some(u => u.role === UserRole.REFUELING_MANAGER)) ||
      (formData.role === UserRole.FUEL_ADMIN &&
        users.some(u => u.role === UserRole.FUEL_ADMIN))
    ) {
      setFormError(`Only one ${formData.role} allowed per branch`);
      setFormLoading(false);
      return;
    }

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/users`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setUsers(prev => [...prev, res.data]);
      setShowForm(false);
      setFormData({ fullName: '', email: '', role: '' as UserRole | '', phoneNumber: '', employeeId: '' });
    } catch (err: any) {
      console.error(err);
      setFormError(err.response?.data?.message || 'Failed to create user');
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Branch Users</h1>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={() => setShowForm(true)}
        >
          Create User
        </button>
      </div>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {loading ? (
        <p>Loading users...</p>
      ) : (
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">Name</th>
              <th className="border p-2">Email</th>
              <th className="border p-2">Role</th>
              <th className="border p-2">Phone</th>
              <th className="border p-2">Employee ID</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="border p-2">{user.fullName}</td>
                <td className="border p-2">{user.email}</td>
                <td className="border p-2">{user.role}</td>
                <td className="border p-2">{user.phoneNumber || '-'}</td>
                <td className="border p-2">{user.employeeId || '-'}</td>
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
            <h2 className="text-xl font-bold mb-4">Create New User</h2>
            {formError && <p className="text-red-500 mb-2">{formError}</p>}
            <form onSubmit={handleSubmit} className="flex flex-col gap-2">
              <input
                type="text"
                placeholder="Full Name"
                value={formData.fullName}
                onChange={e => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                required
                className="border p-2 rounded"
              />
              <input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
                required
                className="border p-2 rounded"
              />
              <select
                value={formData.role}
                onChange={e => setFormData(prev => ({ ...prev, role: e.target.value as UserRole }))}
                required
                className="border p-2 rounded"
              >
                <option value="">Select Role</option>
                {Object.values(UserRole).map(role => (
                  <option key={role} value={role}>
                    {role.replace('_', ' ')}
                  </option>
                ))}
              </select>
              <input
                type="text"
                placeholder="Phone Number"
                value={formData.phoneNumber}
                onChange={e => setFormData(prev => ({ ...prev, phoneNumber: e.target.value }))}
                className="border p-2 rounded"
              />
              <input
                type="text"
                placeholder="Employee ID"
                value={formData.employeeId}
                onChange={e => setFormData(prev => ({ ...prev, employeeId: e.target.value }))}
                className="border p-2 rounded"
              />
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mt-2 disabled:opacity-50"
                disabled={formLoading}
              >
                {formLoading ? 'Creating...' : 'Create User'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BranchUsers;
