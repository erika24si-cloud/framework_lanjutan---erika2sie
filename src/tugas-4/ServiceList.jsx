import { useState } from "react";
import serviceData from "./services.json";

export default function ServiceListSearch() {
  const [dataForm, setDataForm] = useState({
    searchTerm: "",
    selectedTag: "",
    selectedProvider: "", 
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDataForm({ ...dataForm, [name]: value });
  };

  const allTags = [...new Set(serviceData.flatMap((item) => item.tags))];
  const allProviders = [
    ...new Set(serviceData.map((item) => item.details.provider)),
  ];

  const filtered = serviceData.filter((item) => {
    const search = dataForm.searchTerm.toLowerCase();

    const matchSearch =
      item.name.toLowerCase().includes(search) ||
      item.description.toLowerCase().includes(search);

    const matchTag = dataForm.selectedTag
      ? item.tags.includes(dataForm.selectedTag)
      : true;

    const matchProvider = dataForm.selectedProvider
      ? item.details.provider === dataForm.selectedProvider
      : true;

    return matchSearch && matchTag && matchProvider;
  });

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 p-6 font-sans">
      
      {/* BACKGROUND */}
      <div className="fixed top-0 right-0 w-80 h-80 bg-blue-100 rounded-full blur-3xl opacity-60 -z-10"></div>
      <div className="fixed bottom-0 left-0 w-96 h-96 bg-purple-100 rounded-full blur-3xl opacity-60 -z-10"></div>

      <div className="max-w-6xl mx-auto">
        
        {/* HEADER */}
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1.5 mb-4 text-sm font-bold tracking-widest text-blue-600 uppercase bg-blue-50 rounded-full">
            Explore Services
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900">
            Cari Layanan <span className="text-blue-600">Impianmu.</span>
          </h1>
        </div>

        {/* SEARCH + 2 FILTER */}
        <div className="max-w-4xl mx-auto mb-16 px-4">
          <div className="flex flex-col md:flex-row items-center gap-3 p-2 bg-white rounded-[2rem] shadow border">

            {/* SEARCH */}
            <div className="relative flex-1 w-full">
              <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 text-xl">
                🔍
              </span>
              <input
                type="text"
                name="searchTerm"
                placeholder="Lagi butuh apa hari ini?"
                value={dataForm.searchTerm}
                onChange={handleChange}
                className="w-full pl-14 pr-4 py-4 rounded-[1.5rem] bg-transparent border-none focus:ring-0"
              />
            </div>

            {/* FILTER 1 */}
            <select
              name="selectedTag"
              value={dataForm.selectedTag}
              onChange={handleChange}
              className="w-full md:w-48 p-4 rounded-[1.5rem] bg-slate-50 cursor-pointer"
            >
              <option value="">Kategori</option>
              {allTags.map((tag) => (
                <option key={tag} value={tag}>{tag}</option>
              ))}
            </select>

            {/* FILTER 2 ✅ */}
            <select
              name="selectedProvider"
              value={dataForm.selectedProvider}
              onChange={handleChange}
              className="w-full md:w-48 p-4 rounded-[1.5rem] bg-slate-50 cursor-pointer"
            >
              <option value="">Provider</option>
              {allProviders.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>
        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {filtered.length > 0 ? (
            filtered.map((item) => (
              <div
                key={item.id}
                className="group bg-white rounded-[2.5rem] p-4 shadow hover:shadow-xl transition flex flex-col"
              >
                {/* IMAGE */}
                <div className="h-48 mb-6 overflow-hidden rounded-[2rem]">
                  <img
                    src={item.image}
                    className="w-full h-full object-cover group-hover:scale-110 transition"
                  />
                </div>

                {/* CONTENT */}
                <div className="px-2 flex-1">
                  <h2 className="text-xl font-bold">{item.name}</h2>
                  <p className="text-sm text-slate-500 mb-4">
                    {item.description}
                  </p>

                  <p className="text-xs font-semibold text-slate-600">
                    🏪 {item.details.provider}
                  </p>
                  <p className="text-xs text-slate-400">
                    📍 {item.details.location}
                  </p>
                </div>

                {/* BUTTON */}
                <button className="mt-4 py-3 rounded-xl bg-slate-900 text-white hover:bg-blue-600 transition">
                  Hubungi
                </button>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-20">
              😢 Data tidak ditemukan
            </div>
          )}
        </div>
      </div>
    </div>
  );
}