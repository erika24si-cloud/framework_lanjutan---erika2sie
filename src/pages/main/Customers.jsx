import { useState } from "react";
import PageHeader from "../../components/PageHeader";

const customers = Array.from({ length: 30 }, (_, i) => ({
  id: `CUST-${100 + i}`,
  name: `Customer ${i + 1}`,
  email: `customer${i + 1}@mail.com`,
  phone: `08123${i}4567`,
  loyalty: ["Bronze", "Silver", "Gold"][i % 3],
}));

export default function Customers() {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="p-5">
      <PageHeader
        title="Customers"
        breadcrumb={["Dashboard", "Customers"]}
      >
        <button
          onClick={() => setShowForm(true)}
          className="bg-hijau text-white px-4 py-2 rounded-xl hover:opacity-90"
        >
          Add Customer
        </button>
      </PageHeader>

      {showForm && (
        <div className="bg-white p-5 rounded-xl mb-5 shadow-sm">
          <h3 className="font-bold mb-3">Form Customer</h3>

          <input className="border p-2 mb-2 w-full rounded" placeholder="Customer Name" />
          <input className="border p-2 mb-2 w-full rounded" placeholder="Email" />
          <input className="border p-2 mb-2 w-full rounded" placeholder="Phone" />

          <select className="border p-2 mb-2 w-full rounded">
            <option>Bronze</option>
            <option>Silver</option>
            <option>Gold</option>
          </select>

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
          <span>Name</span>
          <span>Email</span>
          <span>Phone</span>
          <span>Loyalty</span>
        </div>

        {customers.map((c, i) => (
          <div
            key={i}
            className="grid grid-cols-5 py-2 border-b text-sm items-center hover:bg-gray-50"
          >
            <span>{c.id}</span>
            <span>{c.name}</span>
            <span>{c.email}</span>
            <span>{c.phone}</span>

            <span
              className={
                c.loyalty === "Gold"
                  ? "text-yellow-500 font-semibold"
                  : c.loyalty === "Silver"
                  ? "text-gray-500 font-semibold"
                  : "text-orange-500 font-semibold"
              }
            >
              {c.loyalty}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}