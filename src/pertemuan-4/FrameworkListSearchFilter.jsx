import { useState } from "react";
import frameworkData from "./framework.json";

export default function FrameworkList() {
  /** 1. Inisialisasi state dataForm (Sesuai Gambar 1) **/
  const [dataForm, setDataForm] = useState({
    searchTerm: "",
    selectedTag: "",
  });

  /** 2. Handle perubahan nilai input form (Sesuai Gambar 1) **/
  const handleChange = (evt) => {
    const { name, value } = evt.target;
    setDataForm({
      ...dataForm,
      [name]: value,
    });
  };

  /** Logic: Mengambil list unik untuk pilihan di <select> **/
  const allTags = [...new Set(frameworkData.flatMap((item) => item.tags))];

  /** 3. Filter Data (Menggunakan dataForm.searchTerm dan dataForm.selectedTag) **/
  const filteredFrameworks = frameworkData.filter((item) => {
    const _searchTerm = dataForm.searchTerm.toLowerCase();
    
    // Cek apakah ada di Nama atau Deskripsi
    const matchesSearch =
      item.name.toLowerCase().includes(_searchTerm) ||
      item.description.toLowerCase().includes(_searchTerm);

    // Cek apakah tag sesuai (jika kosong, tampilkan semua)
    const matchesTag = dataForm.selectedTag
      ? item.tags.includes(dataForm.selectedTag)
      : true;

    return matchesSearch && matchesTag;
  });

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* --- Bagian Filter (Input & Select) --- */}
      <div className="mb-8 flex flex-col md:flex-row gap-4">
        {/* Input Search */}
        <input
          type="text"
          name="searchTerm" // Property name penting untuk handleChange
          placeholder="Cari framework..."
          value={dataForm.searchTerm} // Memanggil state dataForm
          onChange={handleChange} // Menggunakan function handleChange
          className="p-3 border rounded-lg flex-1 shadow-sm focus:ring-2 focus:ring-blue-400 outline-none"
        />

        {/* Select Tag */}
        <select
          name="selectedTag" // Property name penting untuk handleChange
          value={dataForm.selectedTag} // Memanggil state dataForm
          onChange={handleChange} // Menggunakan function handleChange
          className="p-3 border rounded-lg shadow-sm bg-white cursor-pointer"
        >
          <option value="">Semua Tag ✨</option>
          {allTags.map((tag) => (
            <option key={tag} value={tag}>
              {tag}
            </option>
          ))}
        </select>
      </div>

      {/* --- Bagian List Framework --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredFrameworks.length > 0 ? (
          filteredFrameworks.map((item) => (
            <div
              key={item.id}
              className="border p-6 rounded-xl shadow-md bg-white hover:shadow-lg transition-shadow flex flex-col justify-between"
            >
              <div>
                <h2 className="text-xl font-bold text-gray-800 mb-2">{item.name}</h2>
                <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                  {item.description}
                </p>
                <p className="text-red-500 font-semibold text-xs mb-2">
                  Dev: {item.details.developer}
                </p>
                
                {/* Link Website */}
                <a
                  href={item.details.officialWebsite}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 text-xs underline break-all block mb-4"
                >
                  {item.details.officialWebsite}
                </a>
              </div>

              {/* Tags Section */}
              <div className="flex flex-wrap gap-2">
                {item.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-red-100 text-red-700 px-3 py-1 text-[10px] font-bold rounded-full border border-red-200"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-10 text-gray-400">
            Yah, framework-nya nggak ketemu... 🏜️
          </div>
        )}
      </div>
    </div>
  );
}