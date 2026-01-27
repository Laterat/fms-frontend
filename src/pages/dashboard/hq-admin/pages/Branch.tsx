// src/pages/dashboard/hq-admin/pages/Branch.tsx
import { useEffect, useState } from 'react';
import axios from 'axios';

interface BranchI {
  id: string;
  name: string;
  code: string;
  region: string;
  zone: string;
  woreda: string;
  kebele: string;
}

const Branch = () => {
  const [branches, setBranches] = useState<BranchI[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    region: '',
    zone: '',
    woreda: '',
    kebele: '',
  });
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState('');

  const token = localStorage.getItem('supabase_token');

  // Fetch branches
  const fetchBranches = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/branches`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBranches(res.data);
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to fetch branches');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBranches();
  }, []);

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setFormLoading(true);

    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/branches`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setBranches(prev => [...prev, res.data]);
      setShowForm(false);
      setFormData({ name: '', code: '', region: '', zone: '', woreda: '', kebele: '' });
    } catch (err: any) {
      console.error(err);
      setFormError(err.response?.data?.message || 'Failed to create branch');
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Branches</h1>
        <button
          className="bg-emerald-700 text-white px-4 py-2 rounded hover:bg-emerald-800"
          onClick={() => setShowForm(true)}
        >
          Add Branch
        </button>
      </div>

      {loading ? (
        <p>Loading branches...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">Name</th>
              <th className="border p-2">Code</th>
              <th className="border p-2">Region</th>
              <th className="border p-2">Zone</th>
              <th className="border p-2">Woreda</th>
              <th className="border p-2">Kebele</th>
            </tr>
          </thead>
          <tbody>
            {branches.map(branch => (
              <tr key={branch.id} className="hover:bg-gray-50">
                <td className="border p-2">{branch.name}</td>
                <td className="border p-2">{branch.code}</td>
                <td className="border p-2">{branch.region}</td>
                <td className="border p-2">{branch.zone}</td>
                <td className="border p-2">{branch.woreda}</td>
                <td className="border p-2">{branch.kebele}</td>
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
            <h2 className="text-xl font-bold mb-4">Add Branch</h2>
            {formError && <p className="text-red-500 mb-2">{formError}</p>}
            <form onSubmit={handleSubmit} className="flex flex-col gap-2">
              {['name', 'code', 'region', 'zone', 'woreda', 'kebele'].map(field => (
                <input
                  key={field}
                  type="text"
                  placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                  className="border p-2 rounded"
                  value={(formData as any)[field]}
                  onChange={e => setFormData(prev => ({ ...prev, [field]: e.target.value }))}
                  required
                />
              ))}
              <button
                type="submit"
                className="bg-emerald-700 text-white px-4 py-2 rounded hover:bg-emerald-800 mt-2 disabled:opacity-50"
                disabled={formLoading}
              >
                {formLoading ? 'Adding...' : 'Add Branch'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Branch;
