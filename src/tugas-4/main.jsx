import { createRoot } from "react-dom/client";
import "./tailwind.css";
import ServiceList from "./ServiceList";
import AdminServiceTable from "./AdminServiceTable";

createRoot(document.getElementById("root"))
    .render(
        <div>
            <AdminServiceTable/>
            <ServiceList/>
        </div>
    );