import { useState } from "react";
import PageHeader from "../../components/PageHeader";

const orders = Array.from({ length: 30 }, (_, i) => ({
  id: `#ORD-${1000 + i}`,
  name: `Customer ${i + 1}`,
  status: ["Pending", "Completed", "Cancelled"][i % 3],
  total: `Rp ${10000 * (i + 1)}`,
  date: `2025-04-${(i % 30) + 1}`
}));

export default function Orders() {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="p-5">
      <PageHeader
        title="Orders"
        breadcrumb={["Dashboard", "Orders"]}
      >
        <button
          onClick={() => setShowForm(true)}
          className="bg-hijau text-white px-4 py-2 rounded-xl hover:opacity-90"
        >
          Add Orders
        </button>
      </PageHeader>

      {showForm && (
        <div className="bg-white p-5 rounded-xl mb-5 shadow-sm">
          <h3 className="font-bold mb-3">Form Orders</h3>

          <input className="border p-2 mb-2 w-full rounded" placeholder="Order ID" />
          <input className="border p-2 mb-2 w-full rounded" placeholder="Customer Name" />

          <select className="border p-2 mb-2 w-full rounded">
            <option>Pending</option>
            <option>Completed</option>
            <option>Cancelled</option>
          </select>

          <input className="border p-2 mb-2 w-full rounded" placeholder="Total Price" />
          <input type="date" className="border p-2 mb-2 w-full rounded" />

          <button
            onClick={() => setShowForm(false)}
            className="bg-red-500 text-white px-4 py-2 rounded-xl mt-2"
          >
            Close
          </button>
        </div>
      )}

      <div className="bg-white p-5 rounded-xl shadow-sm">

        <div className="grid grid-cols-5 font-bold text-gray-600 border-b pb-2 mb-2 text-sm">
          <span>ID</span>
          <span>Customer</span>
          <span>Status</span>
          <span>Total</span>
          <span>Date</span>
        </div>

        {orders.map((o, i) => (
          <div
            key={i}
            className="grid grid-cols-5 py-2 border-b text-sm items-center hover:bg-gray-50"
          >
            <span>{o.id}</span>
            <span>{o.name}</span>

            <span
              className={
                o.status === "Pending"
                  ? "text-yellow-500 font-semibold"
                  : o.status === "Completed"
                  ? "text-green-500 font-semibold"
                  : "text-red-500 font-semibold"
              }
            >
              {o.status}
            </span>

            <span>{o.total}</span>
            <span>{o.date}</span>
          </div>
        ))}
      </div>
    </div>
  );
}