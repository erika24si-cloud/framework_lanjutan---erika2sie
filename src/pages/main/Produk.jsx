import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import PageHeader from "../../components/PageHeader";
import { fetchProducts, createProduct, updateProduct, deleteProduct } from "@/services/supabaseAPI";

export default function Produk() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({ name: "", sku: "", price: "", stock: "" });

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await fetchProducts();
      setProducts(data);
    } catch (err) {
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name: formData.name,
        sku: formData.sku || null,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock) || 0,
      };
      if (editId) {
        await updateProduct(editId, payload);
      } else {
        await createProduct(payload);
      }
      setShowForm(false);
      setEditId(null);
      setFormData({ name: "", sku: "", price: "", stock: "" });
      loadProducts();
    } catch (err) {
      console.error("Error saving product:", err);
      alert("Error saving product: " + err.message);
    }
  };

  const handleEdit = (product) => {
    setEditId(product.id);
    setFormData({
      name: product.name,
      sku: product.sku || "",
      price: product.price.toString(),
      stock: product.stock.toString(),
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      await deleteProduct(id);
      loadProducts();
    } catch (err) {
      console.error("Error deleting product:", err);
      alert("Error deleting product: " + err.message);
    }
  };

  const filteredProducts = products.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6">
      <PageHeader
        title="Products"
        breadcrumb={["Dashboard", "Product List"]}
      >
        <button
          onClick={() => {
            setEditId(null);
            setFormData({ name: "", sku: "", price: "", stock: "" });
            setShowForm(true);
          }}
          className="bg-hijau text-white px-4 py-2 rounded-xl hover:opacity-90"
        >
          Add Product
        </button>
      </PageHeader>

      {showForm && (
        <div className="bg-white p-5 rounded-xl mb-5 shadow-sm">
          <h3 className="font-bold mb-3">{editId ? "Edit Product" : "Add Product"}</h3>
          <form onSubmit={handleSave}>
            <input
              name="name"
              value={formData.name}
              onChange={handleFormChange}
              className="border p-2 mb-2 w-full rounded"
              placeholder="Product Name"
              required
            />
            <input
              name="sku"
              value={formData.sku}
              onChange={handleFormChange}
              className="border p-2 mb-2 w-full rounded"
              placeholder="SKU (optional)"
            />
            <input
              name="price"
              type="number"
              step="0.01"
              value={formData.price}
              onChange={handleFormChange}
              className="border p-2 mb-2 w-full rounded"
              placeholder="Price"
              required
            />
            <input
              name="stock"
              type="number"
              value={formData.stock}
              onChange={handleFormChange}
              className="border p-2 mb-2 w-full rounded"
              placeholder="Stock"
              required
            />
            <div className="flex gap-2 mt-2">
              <button
                type="submit"
                className="bg-hijau text-white px-4 py-2 rounded-xl hover:opacity-90"
              >
                {editId ? "Update" : "Save"}
              </button>
              <button
                type="button"
                onClick={() => { setShowForm(false); setEditId(null); }}
                className="bg-red-500 text-white px-4 py-2 rounded-xl"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 mt-6 p-6">

        <input
          type="text"
          placeholder="Cari produk..."
          className="w-full border border-gray-400 rounded-lg px-4 py-3 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all text-sm mb-6"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-[#009262] text-white">
                <th className="py-4 px-6 font-semibold text-center w-16 border-b-0">#</th>
                <th className="py-4 px-6 font-semibold text-left border-b-0">Name</th>
                <th className="py-4 px-6 font-semibold text-center w-32 border-b-0">SKU</th>
                <th className="py-4 px-6 font-semibold text-center w-32 border-b-0">Price</th>
                <th className="py-4 px-6 font-semibold text-center w-32 border-b-0">Stock</th>
                <th className="py-4 px-6 font-semibold text-center w-32 border-b-0">Actions</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="p-6 text-center text-gray-500">
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
                        {item.name}
                      </Link>
                    </td>

                    <td className="py-4 px-6 text-center text-gray-600">{item.sku || "-"}</td>
                    <td className="py-4 px-6 text-center text-gray-600">Rp {Number(item.price).toLocaleString()}</td>
                    <td className="py-4 px-6 text-center text-gray-600">{item.stock}</td>
                    <td className="py-4 px-6 text-center">
                      <button
                        onClick={() => handleEdit(item)}
                        className="text-blue-600 hover:underline text-xs font-medium mr-2"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="text-red-600 hover:underline text-xs font-medium"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="p-6 text-center text-gray-500">
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