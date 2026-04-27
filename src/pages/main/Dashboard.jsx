import { FaShoppingCart, FaTruck, FaBan, FaDollarSign, FaExclamationTriangle } from "react-icons/fa";
import PageHeader from "../../components/PageHeader";

export default function Dashboard() {
    return (
        <div id="dashboard-container" className="pb-10 bg-gray-50/50 min-h-screen">
            <PageHeader />

            <div id="dashboard-grid" className="p-5 grid sm:grid-cols-2 md:grid-cols-4 gap-4">
                <div id="dashboard-orders" className="flex items-center space-x-5 bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
                    <div className="bg-hijau rounded-2xl p-4">
                        <FaShoppingCart className="text-3xl text-white" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-2xl font-bold text-gray-800">75</span>
                        <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">Total Orders</span>
                    </div>
                </div>

                <div id="dashboard-delivered" className="flex items-center space-x-5 bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
                    <div className="bg-blue-500 rounded-2xl p-4">
                        <FaTruck className="text-3xl text-white" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-2xl font-bold text-gray-800">175</span>
                        <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">Delivered</span>
                    </div>
                </div>

                <div id="dashboard-canceled" className="flex items-center space-x-5 bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
                    <div className="bg-red-500 rounded-2xl p-4">
                        <FaBan className="text-3xl text-white" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-2xl font-bold text-gray-800">40</span>
                        <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">Canceled</span>
                    </div>
                </div>

                <div id="dashboard-revenue" className="flex items-center space-x-5 bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
                    <div className="bg-orange-500 rounded-2xl p-4">
                        <FaDollarSign className="text-3xl text-white" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-2xl font-bold text-gray-800">Rp.128</span>
                        <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">Revenue</span>
                    </div>
                </div>
            </div>

            <div className="px-5 grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                <div className="lg:col-span-2 bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h3 className="text-xl font-bold text-gray-800">Recent Orders</h3>
                            <p className="text-sm text-gray-400">Transaksi terbaru hari ini</p>
                        </div>
                        <button className="text-hijau font-bold text-sm hover:bg-green-50 px-4 py-2 rounded-xl transition-all">
                            Lihat Semua
                        </button>
                    </div>

                    <div className="space-y-4">
                        <div className="grid grid-cols-4 px-4 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">
                            <div className="col-span-2">Customer</div>
                            <div>ID</div>
                            <div className="text-right">Status</div>
                        </div>

                        {[
                            { id: "#OR-88123", name: "A", status: "Completed", color: "bg-green-500" },
                            { id: "#OR-88124", name: "B", status: "Pending", color: "bg-orange-500" },
                            { id: "#OR-88125", name: "C", status: "Canceled", color: "bg-red-500" },
                        ].map((order, index) => (
                            <div key={index} className="grid grid-cols-4 items-center p-4 rounded-2xl border border-transparent hover:border-gray-100 hover:bg-gray-50/50 transition-all group">
                                <div className="col-span-2 flex items-center space-x-4">
                                    <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center font-bold text-gray-400 group-hover:bg-white transition-colors">
                                        {order.name.charAt(0)}
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="font-bold text-sm text-gray-700">{order.name}</span>
                                        <span className="text-[10px] text-gray-400">2 Menit yang lalu</span>
                                    </div>
                                </div>
                                <div className="text-xs font-medium text-gray-500">{order.id}</div>
                                <div className="flex justify-end items-center space-x-2">
                                    <div className={`w-1.5 h-1.5 rounded-full ${order.color}`}></div>
                                    <span className="text-xs font-bold text-gray-700">{order.status}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                    <div className="flex items-center space-x-3 mb-8 text-red-500">
                        <FaExclamationTriangle className="text-xl" />
                        <h3 className="text-xl font-bold">Stok Menipis</h3>
                    </div>
                    
                    <div className="space-y-3">
                        <div className="flex justify-between items-center p-4 bg-gray-50 rounded-2xl border border-transparent hover:border-red-100 transition-all">
                            <span className="font-bold text-sm text-gray-700">A</span>
                            <span className="bg-red-500 text-white px-3 py-1 rounded-lg text-[10px] font-black uppercase">Sisa 2</span>
                        </div>
                        <div className="flex justify-between items-center p-4 bg-gray-50 rounded-2xl border border-transparent hover:border-red-100 transition-all">
                            <span className="font-bold text-sm text-gray-700">B</span>
                            <span className="bg-red-500 text-white px-3 py-1 rounded-lg text-[10px] font-black uppercase">Sisa 5</span>
                        </div>
                        <div className="flex justify-between items-center p-4 bg-gray-50 rounded-2xl border border-transparent hover:border-red-100 transition-all">
                            <span className="font-bold text-sm text-gray-700">C</span>
                            <span className="bg-red-500 text-white px-3 py-1 rounded-lg text-[10px] font-black uppercase">Sisa 3</span>
                        </div>
                    </div>
                    
                    <button className="w-full mt-8 py-3 rounded-2xl border-2 border-dashed border-gray-200 text-gray-400 text-xs font-bold hover:border-red-200 hover:text-red-400 transition-all">
                        + Tambah Stok
                    </button>
                </div>

            </div>
        </div>
    );
}