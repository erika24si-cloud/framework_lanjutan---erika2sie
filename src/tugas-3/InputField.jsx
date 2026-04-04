export default function InputField({ label, type, placeholder, value, onChange, error }) {
  return (
    <div className="mb-4">
      <label className="block text-gray-700 font-medium mb-1">{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
      />
      {error && (
        <div className="mt-1 text-red-500 text-sm">
          {error}
        </div>
      )}
    </div>
  );
}