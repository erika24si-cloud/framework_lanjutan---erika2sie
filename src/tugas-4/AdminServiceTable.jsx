import { useState } from "react";
import serviceData from "./services.json";

export default function AdminServiceTable() {
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
  const allProviders = [...new Set(serviceData.map((item) => item.details.provider))];

  const filtered = serviceData.filter((item) => {
    const search = dataForm.searchTerm.toLowerCase();
    const matchSearch = item.name.toLowerCase().includes(search) || item.description.toLowerCase().includes(search);
    const matchTag = dataForm.selectedTag ? item.tags.includes(dataForm.selectedTag) : true;
    const matchProvider = dataForm.selectedProvider ? item.details.provider === dataForm.selectedProvider : true;
    return matchSearch && matchTag && matchProvider;
  });

  return (
    <div className="min-h-screen bg-[#fcfcfd] p-4 md:p-8 font-sans text-slate-700">
      {/* GLOW DECORATION */}
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-blue-50 rounded-full blur-[120px] -z-10"></div>

      <div className="max-w-7xl mx-auto">
        {/* HEADER SECTION */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">
              Layanan <span className="text-blue-600">Dashboard</span>
            </h1>
            <p className="text-slate-500 text-sm mt-1">Kelola dan monitor semua layanan yang terdaftar.</p>
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-semibold shadow-md shadow-blue-200 hover:bg-blue-700 transition">
              + Tambah Layanan
            </button>
          </div>
        </div>

        {/* FILTER CARD */}
        <div className="bg-white/70 backdrop-blur-md border border-slate-200 p-2 rounded-[2rem] shadow-sm mb-8 flex flex-col md:flex-row gap-2">
          <div className="relative flex-1">
            <span className="absolute left-4 top-1/2 -translate-y-1/2">🔍</span>
            <input
              type="text"
              name="searchTerm"
              placeholder="Cari layanan atau deskripsi..."
              value={dataForm.searchTerm}
              onChange={handleChange}
              className="w-full pl-12 pr-4 py-3 rounded-2xl bg-transparent border-none focus:ring-2 focus:ring-blue-100 transition text-sm"
            />
          </div>

          <div className="flex flex-wrap md:flex-nowrap gap-2">
            <select
              name="selectedTag"
              value={dataForm.selectedTag}
              onChange={handleChange}
              className="p-3 bg-slate-50 border-none rounded-2xl text-sm font-medium focus:ring-2 focus:ring-blue-100 cursor-pointer min-w-[140px]"
            >
              <option value="">Semua Kategori</option>
              {allTags.map((tag) => (
                <option key={tag}>{tag}</option>
              ))}
            </select>

            <select
              name="selectedProvider"
              value={dataForm.selectedProvider}
              onChange={handleChange}
              className="p-3 bg-slate-50 border-none rounded-2xl text-sm font-medium focus:ring-2 focus:ring-blue-100 cursor-pointer min-w-[140px]"
            >
              <option value="">Semua Provider</option>
              {allProviders.map((p) => (
                <option key={p}>{p}</option>
              ))}
            </select>
          </div>
        </div>

        {/* TABLE CONTAINER */}
        <div className="bg-white border border-slate-200 rounded-[2rem] shadow-xl shadow-slate-200/50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100 text-slate-500 text-[11px] uppercase tracking-widest font-bold">
                  <th className="px-6 py-5">No</th>
                  <th className="px-6 py-5">Informasi Layanan</th>
                  <th className="px-6 py-5">Kategori</th>
                  <th className="px-6 py-5">Provider & Lokasi</th>
                  <th className="px-6 py-5">Kontak</th>
                  <th className="px-6 py-5 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.length > 0 ? (
                  filtered.map((item, index) => (
                    <tr key={item.id} className="hover:bg-blue-50/30 transition-colors group">
                      <td className="px-6 py-5">
                        <span className="text-slate-400 font-mono text-xs">{index + 1}</span>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-slate-100 overflow-hidden">
                            <img src={item.image} alt="" className="w-full h-full object-cover" />
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 group-hover:text-blue-600 transition">{item.name}</p>
                            <p className="text-xs text-slate-400 line-clamp-1 w-48">{item.description}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex flex-wrap gap-1">
                          {item.tags.map((tag, i) => (
                            <span key={i} className="px-2 py-1 bg-blue-50 text-blue-600 text-[10px] font-bold rounded-md uppercase">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <p className="text-sm font-semibold text-slate-700">{item.details.provider}</p>
                        <p className="text-xs text-slate-400 flex items-center gap-1">
                          <span>📍</span> {item.details.location}
                        </p>
                      </td>
                      <td className="px-6 py-5">
                        <span className="text-xs font-medium px-3 py-1 bg-slate-100 rounded-full text-slate-600 border border-slate-200">
                          {item.details.contact}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-center">
                        <div className="flex justify-center gap-2">
                          <button className="p-2 hover:bg-white rounded-lg hover:shadow-sm text-slate-400 hover:text-blue-600 transition">
                            ✏️
                          </button>
                          <button className="p-2 hover:bg-white rounded-lg hover:shadow-sm text-slate-400 hover:text-red-600 transition">
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center py-20">
                      <div className="flex flex-col items-center opacity-40">
                        <span className="text-4xl mb-2">📁</span>
                        <p className="text-sm font-medium">Data tidak ditemukan</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {/* FOOTER TABLE */}
          <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-100 flex justify-between items-center text-xs text-slate-500 font-medium">
            <p>Menampilkan {filtered.length} dari {serviceData.length} data</p>
            <div className="flex gap-1">
              <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 bg-white hover:bg-slate-50 transition">{"<"}</button>
              <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-blue-600 text-white shadow-sm">1</button>
              <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 bg-white hover:bg-slate-50 transition">{">"}</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}