import { useState, useEffect } from "react";
import PageHeader from "../../components/PageHeader";
import { fetchProfiles, updateProfile } from "@/services/supabaseAPI";

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({ full_name: "", role: "member", tier: "Bronze", points: 0 });

  const loadProfiles = async () => {
    try {
      setLoading(true);
      const data = await fetchProfiles();
      setCustomers(data);
    } catch (err) {
      console.error("Error fetching profiles:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfiles();
  }, []);

  const handleEdit = (profile) => {
    setEditId(profile.id);
    setFormData({
      full_name: profile.full_name,
      role: profile.role,
      tier: profile.tier,
      points: profile.points,
    });
    setShowForm(true);
  };

  const handleSave = async () => {
    try {
      await updateProfile(editId, {
        full_name: formData.full_name,
        role: formData.role,
        tier: formData.tier,
        points: parseInt(formData.points) || 0,
      });
      setShowForm(false);
      setEditId(null);
      loadProfiles();
    } catch (err) {
      console.error("Error updating profile:", err);
      alert("Error updating profile: " + err.message);
    }
  };

  const tierColor = (tier) => {
    switch (tier) {
      case "Platinum": return "text-purple-500 font-semibold";
      case "Gold": return "text-yellow-500 font-semibold";
      case "Silver": return "text-gray-500 font-semibold";
      default: return "text-orange-500 font-semibold";
    }
  };

  return (
    <div className="p-5">
      <PageHeader
        title="Customers"
        breadcrumb={["Dashboard", "Customers"]}
      >
        <button
          onClick={() => { setShowForm(false); setEditId(null); }}
          className="bg-hijau text-white px-4 py-2 rounded-xl hover:opacity-90"
        >
          Refresh
        </button>
      </PageHeader>

      {showForm && (
        <div className="bg-white p-5 rounded-xl mb-5 shadow-sm">
          <h3 className="font-bold mb-3">Edit Customer</h3>

          <input
            className="border p-2 mb-2 w-full rounded"
            placeholder="Full Name"
            value={formData.full_name}
            onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
          />

          <select
            className="border p-2 mb-2 w-full rounded"
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
          >
            <option value="member">Member</option>
            <option value="admin">Admin</option>
          </select>

          <select
            className="border p-2 mb-2 w-full rounded"
            value={formData.tier}
            onChange={(e) => setFormData({ ...formData, tier: e.target.value })}
          >
            <option value="Bronze">Bronze</option>
            <option value="Silver">Silver</option>
            <option value="Gold">Gold</option>
            <option value="Platinum">Platinum</option>
          </select>

          <input
            type="number"
            className="border p-2 mb-2 w-full rounded"
            placeholder="Points"
            value={formData.points}
            onChange={(e) => setFormData({ ...formData, points: e.target.value })}
          />

          <div className="flex gap-2 mt-2">
            <button
              onClick={handleSave}
              className="bg-hijau text-white px-4 py-2 rounded-xl hover:opacity-90"
            >
              Save
            </button>
            <button
              onClick={() => { setShowForm(false); setEditId(null); }}
              className="bg-red-500 text-white px-4 py-2 rounded-xl"
            >
              Close
            </button>
          </div>
        </div>
      )}

      <div className="bg-white p-5 rounded-xl shadow-sm">

        <div className="grid grid-cols-6 font-bold text-gray-600 border-b pb-2 mb-2 text-sm">
          <span className="col-span-2">Name</span>
          <span>Role</span>
          <span>Points</span>
          <span>Tier</span>
          <span>Actions</span>
        </div>

        {loading ? (
          <div className="py-4 text-center text-gray-500">Loading...</div>
        ) : customers.length === 0 ? (
          <div className="py-4 text-center text-gray-500">No customers found</div>
        ) : (
          customers.map((c) => (
            <div
              key={c.id}
              className="grid grid-cols-6 py-2 border-b text-sm items-center hover:bg-gray-50"
            >
              <span className="col-span-2">{c.full_name}</span>
              <span className={c.role === "admin" ? "text-blue-600 font-semibold capitalize" : "text-gray-600 capitalize"}>{c.role}</span>
              <span>{c.points}</span>
              <span className={tierColor(c.tier)}>{c.tier}</span>
              <span>
                <button
                  onClick={() => handleEdit(c)}
                  className="text-blue-600 hover:underline text-xs font-medium"
                >
                  Edit
                </button>
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}