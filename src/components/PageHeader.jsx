export default function PageHeader() {
    const jam = new Date().getHours();
    let sapaan = "Selamat Pagi";

    if (jam >= 11 && jam < 15) {
        sapaan = "Selamat Siang";
    } else if (jam >= 15 && jam < 18) {
        sapaan = "Selamat Sore";
    } else if (jam >= 18 || jam < 4) {
        sapaan = "Selamat Malam";
    }

    return (
        <div id="pageheader-container" className="flex justify-between items-center p-4">
            <div id="pageheader-left" className="flex flex-col">
                <span id="pageheader-title" className="text-3xl font-semibold dark:text-black">
                    {sapaan} 👋
                </span>
                <div id="breadcrumb-links" className="flex items-center font-medium space-x-2 mt-2">
                    <span id="breadcrumb-home" className="text-gray-500">Dashboard</span>
                    <span id="breadcrumb-separator" className="text-gray-500">/</span>
                    <span id="breadcrumb-current" className="text-gray-500">Order List</span>
                </div>
            </div>
            
            <div id="action-button">
                <button id="add-button" className="bg-hijau text-white px-4 py-2 rounded-lg hover:scale-105 transition-transform">
                    Add Button
                </button>
            </div>
        </div>
    );
}