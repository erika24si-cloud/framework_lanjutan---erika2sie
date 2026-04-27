import { Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import Dashboard from "./pages/main/Dashboard";
import Orders from "./pages/main/Orders";
import Customers from "./pages/main/Customers";
import NotFound from "./pages/main/NotFound";
import Error400 from "./pages/main/Error400";
import Error401 from "./pages/main/Error401";
import Error403 from "./pages/main/Error403";
import { MainLayout } from "./layouts/MainLayout";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Forgot from "./pages/auth/Forgot";
import AuthLayout from "./layouts/AuthLayout";

export default function App() {
  return (
        <Routes>
          <Route element={<MainLayout/>}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="*" element={<NotFound />} />
          <Route path="/error-400" element={<Error400 />} />
          <Route path="/error-401" element={<Error401 />} />
          <Route path="/error-403" element={<Error403 />} />
        </Route>

        <Route element={<AuthLayout/>}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register/>} />
            <Route path="/forgot" element={<Forgot/>} />
        </Route>

        </Routes>
        
  );
}