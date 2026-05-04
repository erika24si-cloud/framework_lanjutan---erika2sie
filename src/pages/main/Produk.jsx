import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import PageHeader from "../../components/PageHeader";

export default function Produk() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("https://dummyjson.com/products")
      .then((response) => {
        setProducts(response.data.products);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  }, []);

  const filteredProducts = products.filter((item) =>
    item.title.toLowerCase().includes(search.toLowerCase())
  );

return (
    <div className="p-6">
      <PageHeader
        title="Products"
        breadcrumb={["Dashboard", "Product List"]}
      />

      {/* Container utama: 
        Ditambahkan p-6 agar SEMUA isinya (input & tabel) 
        punya batas kiri-kanan yang sama rata 
      */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 mt-6 p-6">
        
        {/* Input Pencarian */}
        <input
          type="text"
          placeholder="Cari produk..."
          className="w-full border border-gray-400 rounded-lg px-4 py-3 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all text-sm mb-6"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* Tabel Produk */}
        {/* Ditambahkan rounded-lg dan border agar ujung tabel hijaunya melengkung rapi */}
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-[#009262] text-white">
                <th className="py-4 px-6 font-semibold text-center w-16 border-b-0">#</th>
                <th className="py-4 px-6 font-semibold text-left border-b-0">Name</th>
                <th className="py-4 px-6 font-semibold text-center w-32 border-b-0">Category</th>
                <th className="py-4 px-6 font-semibold text-center w-32 border-b-0">Price</th>
                <th className="py-4 px-6 font-semibold text-center w-32 border-b-0">Stock</th>
              </tr>
            </thead>
            
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" className="p-6 text-center text-gray-500">
                    Loading data...
                  </td>
                </tr>
              ) : filteredProducts.length > 0 ? (
                filteredProducts.map((item, index) => (
                  <tr key={item.id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-6 text-center text-gray-600">{index + 1}</td>
                    
                    <td className="py-4 px-6 text-left">
                      <Link 
                        to={`/products/${item.id}`} 
                        className="text-[#009262] font-medium hover:text-emerald-700 hover:underline"
                      >
                        {item.title}
                      </Link>
                    </td>
                    
                    <td className="py-4 px-6 text-center text-gray-600 capitalize">{item.category}</td>
                    <td className="py-4 px-6 text-center text-gray-600">${item.price}</td>
                    <td className="py-4 px-6 text-center text-gray-600">{item.stock}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="p-6 text-center text-gray-500">
                    Produk tidak ditemukan
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}