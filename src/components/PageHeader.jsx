export default function PageHeader({ title, breadcrumb, children }) {
  return (
    <div className="flex justify-between items-center mb-5">
      
      <div>
        <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
        <p className="text-sm text-gray-400">
          {Array.isArray(breadcrumb)
            ? breadcrumb.join(" / ")
            : breadcrumb}
        </p>
      </div>

      <div>
        {children}
      </div>

    </div>
  );
}