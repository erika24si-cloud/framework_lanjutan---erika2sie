import { Outlet } from "react-router";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";

export function MainLayout(){
    return(
         <div className="bg-gray-100 min-h-screen flex">
      <Sidebar />
      <div className="flex-1 p-4">
        <Header />
       <Outlet/>
      </div>

    </div>
    )
}