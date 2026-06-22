import { useState, useEffect } from "react";
import PageHeader from "../../components/PageHeader";
import { fetchOrders, fetchOrderWithItems, updateOrderStatus } from "@/services/supabaseAPI";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [detailOrder, setDetailOrder] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const data = await fetchOrders();
      setOrders(data);
    } catch (err) {
      console.error("Error fetching orders:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      loadOrders();
    } catch (err) {
      console.error("Error updating status:", err);
      alert("Error: " + err.message);
    }
  };

  const handleViewDetail = async (orderId) => {
    try {
      setDetailLoading(true);
      const data = await fetchOrderWithItems(orderId);
      setDetailOrder(data);
    } catch (err) {
      console.error("Error fetching order detail:", err);
    } finally {
      setDetailLoading(false);
    }
  };

  const statusColor = (status) => {
    switch (status) {
      case "completed": return "text-green-500 font-semibold capitalize";
      case "pending": return "text-yellow-500 font-semibold capitalize";
      case "cancelled": return "text-red-500 font-semibold capitalize";
      default: return "text-gray-500 font-semibold capitalize";
    }
  };

  return (
    <div className="p-5">
      <PageHeader
        title="Orders"
        breadcrumb={["Dashboard", "Orders"]}
      >
        <button
          onClick={loadOrders}
          className="bg-hijau text-white px-4 py-2 rounded-xl hover:opacity-90"
        >
          Refresh
        </button>
      </PageHeader>

      {detailOrder && (
        <div className="bg-white p-5 rounded-xl mb-5 shadow-sm">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-bold">Order Detail: {detailOrder.id.slice(0, 8)}...</h3>
            <button
              onClick={() => setDetailOrder(null)}
              className="bg-red-500 text-white px-4 py-2 rounded-xl text-sm"
            >
              Close
            </button>
          </div>
          <div className="grid grid-cols-4 text-sm font-bold text-gray-600 border-b pb-2 mb-2">
            <span>Product</span>
            <span>Qty</span>
            <span>Price</span>
            <span>Subtotal</span>
          </div>
          {(detailOrder.order_items || []).map((item) => (
            <div key={item.id} className="grid grid-cols-4 text-sm py-2 border-b">
              <span>{item.products?.name || "-"}</span>
              <span>{item.quantity}</span>
              <span>Rp {Number(item.price).toLocaleString()}</span>
              <span>Rp {(Number(item.price) * item.quantity).toLocaleString()}</span>
            </div>
          ))}
          <div className="mt-3 text-sm space-y-1">
            <p>Total: <b>Rp {Number(detailOrder.total_price).toLocaleString()}</b></p>
            <p>Discount: <b className="text-red-500">- Rp {Number(detailOrder.discount_amount).toLocaleString()}</b></p>
            <p>Final Price: <b className="text-hijau">Rp {Number(detailOrder.final_price).toLocaleString()}</b></p>
            <p>Points Earned: <b>{detailOrder.points_earned}</b></p>
          </div>
        </div>
      )}

      <div className="bg-white p-5 rounded-xl shadow-sm">

        <div className="grid grid-cols-7 font-bold text-gray-600 border-b pb-2 mb-2 text-sm">
          <span>Customer</span>
          <span>Status</span>
          <span>Total</span>
          <span>Discount</span>
          <span>Final</span>
          <span>Points</span>
          <span>Actions</span>
        </div>

        {loading ? (
          <div className="py-4 text-center text-gray-500">Loading...</div>
        ) : orders.length === 0 ? (
          <div className="py-4 text-center text-gray-500">No orders found</div>
        ) : (
          orders.map((o) => (
            <div
              key={o.id}
              className="grid grid-cols-7 py-2 border-b text-sm items-center hover:bg-gray-50"
            >
              <span>{o.member_name || "Unknown"}</span>

              <span className={statusColor(o.status)}>{o.status}</span>

              <span>Rp {Number(o.total_price).toLocaleString()}</span>
              <span className="text-red-500">- Rp {Number(o.discount_amount).toLocaleString()}</span>
              <span className="font-semibold">Rp {Number(o.final_price).toLocaleString()}</span>
              <span>{o.points_earned}</span>

              <span className="flex gap-2">
                <button
                  onClick={() => handleViewDetail(o.id)}
                  className="text-blue-600 hover:underline text-xs font-medium"
                  disabled={detailLoading}
                >
                  Detail
                </button>
                <select
                  value={o.status}
                  onChange={(e) => handleStatusChange(o.id, e.target.value)}
                  className="border rounded px-1 py-0.5 text-xs"
                >
                  <option value="pending">pending</option>
                  <option value="completed">completed</option>
                  <option value="cancelled">cancelled</option>
                </select>
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}