export default function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center">
        <h1 className="text-5xl font-bold text-gray-800">404</h1>
        <p className="text-gray-400 mt-2">Halaman tidak ditemukan</p>

        <a
          href="/"
          className="inline-block mt-6 px-5 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
        >
          Kembali ke Dashboard
        </a>
      </div>
    </div>
  );
}
