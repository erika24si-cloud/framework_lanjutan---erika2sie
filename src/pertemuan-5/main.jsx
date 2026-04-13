import { createRoot } from "react-dom/client";
import "./assets/tailwind.css";

// Import komponen-komponen yang sudah dibuat
import Sidebar from "./layouts/Sidebar";
import Header from "./layouts/Header";
import Dashboard from "./pages/Dashboard";

createRoot(document.getElementById("root")).render(
  /* 1. App Container */
  <div id="app-container" className="bg-gray-100 min-h-screen flex">
    
    {/* 2. Layout Wrapper */}
    <div id="layout-wrapper" className="flex flex-row flex-1">
      
      {/* Sidebar di sisi kiri */}
      <Sidebar />

      {/* 3. Main Content di sisi kanan */}
      <div id="main-content" className="flex-1 p-4 flex flex-col">
        
        {/* Header di bagian paling atas */}
        <Header />

        {/* Dashboard (Grid card statistik) */}
        <Dashboard />
        
      </div>
    </div>
  </div>
);