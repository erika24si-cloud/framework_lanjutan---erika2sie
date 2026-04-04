import { useState, useEffect } from "react";
import InputField from "./InputField";
import SelectField from "./SelectField";

export default function KalkulatorDiskonForm() {
  const [formData, setFormData] = useState({
    namaBarang: "",
    hargaBarang: "",
    kuantitas: "",
    kategori: "",
    metodePembayaran: "",
  });

  const [errors, setErrors] = useState({});
  const [hasil, setHasil] = useState(null);
  const [isFormValid, setIsFormValid] = useState(false);

  const kategoriOptions = [
    { value: "elektronik", label: "Elektronik" },
    { value: "pakaian", label: "Pakaian" },
    { value: "makanan", label: "Makanan & Minuman" },
    { value: "rumahTangga", label: "Rumah Tangga" },
  ];

  const metodePembayaranOptions = [
    { value: "cash", label: "Tunai (Diskon 0%)" },
    { value: "debit", label: "Debit (Diskon 5%)" },
    { value: "credit", label: "Kredit (Diskon 10%)" },
    { value: "qris", label: "QRIS (Diskon 15%)" },
  ];

  const validateField = (name, value) => {
    switch (name) {
      case "namaBarang":
        if (!value) return "Nama barang wajib diisi";
        if (/\d/.test(value)) return "Nama barang tidak boleh mengandung angka";
        if (value.length < 3) return "Nama barang minimal 3 karakter";
        return "";
      
      case "hargaBarang":
        if (!value) return "Harga barang wajib diisi";
        if (isNaN(value)) return "Harga barang harus berupa angka";
        if (Number(value) <= 0) return "Harga barang harus lebih dari 0";
        if (Number(value) < 1000) return "Harga barang minimal Rp 1.000";
        return "";
      
      case "kuantitas":
        if (!value) return "Kuantitas wajib diisi";
        if (isNaN(value)) return "Kuantitas harus berupa angka";
        if (!Number.isInteger(Number(value))) return "Kuantitas harus berupa bilangan bulat";
        if (Number(value) <= 0) return "Kuantitas minimal 1";
        if (Number(value) > 100) return "Kuantitas maksimal 100 item";
        return "";
      
      case "kategori":
        if (!value) return "Kategori wajib dipilih";
        return "";
      
      case "metodePembayaran":
        if (!value) return "Metode pembayaran wajib dipilih";
        return "";
      
      default:
        return "";
    }
  };

  const handleChange = (e, fieldName) => {
    const value = e.target.value;
    setFormData({ ...formData, [fieldName]: value });
    const error = validateField(fieldName, value);
    setErrors({ ...errors, [fieldName]: error });
  };

  useEffect(() => {
    const allFieldsFilled = Object.values(formData).every(value => value !== "");
    const noErrors = Object.values(errors).every(error => error === "");
    setIsFormValid(allFieldsFilled && noErrors);
  }, [formData, errors]);

  const handleSubmit = () => {
    const newErrors = {};
    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key]);
      if (error) newErrors[key] = error;
    });
    
    setErrors(newErrors);
    
    if (Object.keys(newErrors).length === 0) {
      const harga = Number(formData.hargaBarang);
      const kuantitas = Number(formData.kuantitas);
      const subtotal = harga * kuantitas;
      
      let diskonKategori = 0;
      switch (formData.kategori) {
        case "elektronik":
          diskonKategori = 0.05;
          break;
        case "pakaian":
          diskonKategori = 0.10;
          break;
        case "makanan":
          diskonKategori = 0.03;
          break;
        default:
          diskonKategori = 0;
      }
      
      let diskonPembayaran = 0;
      switch (formData.metodePembayaran) {
        case "debit":
          diskonPembayaran = 0.05;
          break;
        case "credit":
          diskonPembayaran = 0.10;
          break;
        case "qris":
          diskonPembayaran = 0.15;
          break;
        default:
          diskonPembayaran = 0;
      }
      
      const totalDiskon = subtotal * (diskonKategori + diskonPembayaran);
      const totalBayar = subtotal - totalDiskon;
      
      setHasil({
        namaBarang: formData.namaBarang,
        kategori: kategoriOptions.find(k => k.value === formData.kategori)?.label,
        metodePembayaran: metodePembayaranOptions.find(m => m.value === formData.metodePembayaran)?.label,
        subtotal: subtotal,
        diskonKategori: diskonKategori * 100,
        diskonPembayaran: diskonPembayaran * 100,
        totalDiskon: totalDiskon,
        totalBayar: totalBayar,
        kuantitas: kuantitas,
        hargaPerItem: harga
      });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-5">
      <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-2xl">
        <h2 className="text-3xl font-bold text-center mb-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
          🛍️ Kalkulator Diskon Belanja
        </h2>
        <p className="text-center text-gray-600 mb-6">Hitung total belanja Anda dengan diskon spesial!</p>

        <div className="space-y-4">
          <InputField
            label="Nama Barang"
            type="text"
            placeholder="Contoh: Laptop, Baju, Makanan Ringan"
            value={formData.namaBarang}
            onChange={(e) => handleChange(e, "namaBarang")}
            error={errors.namaBarang}
          />

          <InputField
            label="Harga Barang (Rp)"
            type="number"
            placeholder="Masukkan harga per item"
            value={formData.hargaBarang}
            onChange={(e) => handleChange(e, "hargaBarang")}
            error={errors.hargaBarang}
          />

          <InputField
            label="Kuantitas"
            type="number"
            placeholder="Jumlah item yang dibeli"
            value={formData.kuantitas}
            onChange={(e) => handleChange(e, "kuantitas")}
            error={errors.kuantitas}
          />

          <SelectField
            label="Kategori Barang"
            options={kategoriOptions}
            value={formData.kategori}
            onChange={(e) => handleChange(e, "kategori")}
            error={errors.kategori}
          />

          <SelectField
            label="Metode Pembayaran"
            options={metodePembayaranOptions}
            value={formData.metodePembayaran}
            onChange={(e) => handleChange(e, "metodePembayaran")}
            error={errors.metodePembayaran}
          />
        </div>

        {isFormValid && (
          <button
            onClick={handleSubmit}
            className="w-full mt-6 bg-gradient-to-r from-green-500 to-blue-500 text-white font-bold py-3 px-4 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
          >
            Hitung Total Bayar
          </button>
        )}

        {hasil && (
          <div className="mt-6 p-6 bg-gradient-to-r from-green-100 to-blue-100 rounded-lg border-l-8 border-green-500 shadow-lg">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Rincian Belanja</h3>
            <div className="space-y-2">
              <p className="flex justify-between">
                <span className="font-semibold">Nama Barang:</span>
                <span>{hasil.namaBarang}</span>
              </p>
              <p className="flex justify-between">
                <span className="font-semibold">Harga per Item:</span>
                <span>Rp {hasil.hargaPerItem.toLocaleString()}</span>
              </p>
              <p className="flex justify-between">
                <span className="font-semibold">Kuantitas:</span>
                <span>{hasil.kuantitas} item</span>
              </p>
              <p className="flex justify-between">
                <span className="font-semibold">Kategori:</span>
                <span>{hasil.kategori}</span>
              </p>
              <p className="flex justify-between">
                <span className="font-semibold">Metode Pembayaran:</span>
                <span>{hasil.metodePembayaran}</span>
              </p>
              <div className="border-t border-gray-300 my-2 pt-2">
                <p className="flex justify-between">
                  <span className="font-semibold">Subtotal:</span>
                  <span>Rp {hasil.subtotal.toLocaleString()}</span>
                </p>
                <p className="flex justify-between text-green-600">
                  <span className="font-semibold">Diskon Kategori ({hasil.diskonKategori}%):</span>
                  <span>- Rp {(hasil.subtotal * hasil.diskonKategori / 100).toLocaleString()}</span>
                </p>
                <p className="flex justify-between text-green-600">
                  <span className="font-semibold">Diskon Pembayaran ({hasil.diskonPembayaran}%):</span>
                  <span>- Rp {(hasil.subtotal * hasil.diskonPembayaran / 100).toLocaleString()}</span>
                </p>
                <p className="flex justify-between text-red-600 font-bold">
                  <span className="font-semibold">Total Diskon:</span>
                  <span>- Rp {hasil.totalDiskon.toLocaleString()}</span>
                </p>
                <div className="border-t-2 border-gray-400 mt-2 pt-2">
                  <p className="flex justify-between text-xl font-bold text-blue-700">
                    <span>Total Yang Harus Dibayar:</span>
                    <span>Rp {hasil.totalBayar.toLocaleString()}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}