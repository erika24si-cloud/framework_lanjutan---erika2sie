import PageHeader from "../components/PageHeader";

export default function Customers() {
  return (
    <div className="pb-10 bg-gray-50/50 min-h-screen">
      
      <PageHeader />

      <div className="p-5">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-gray-800">Customer</h2>
          <p className="text-gray-400 mt-2">Ini Halaman Customer</p>
        </div>
      </div>

    </div>
  );
}
