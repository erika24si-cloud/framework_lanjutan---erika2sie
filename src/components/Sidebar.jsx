import { MdDashboard, MdListAlt, MdPeople, MdAdd } from "react-icons/md";
import { NavLink } from "react-router-dom";

export default function Sidebar() {

    const menuClass = ({ isActive }) =>
        `flex cursor-pointer items-center rounded-xl p-4 space-x-2
        ${isActive
            ? "bg-green-200 text-hijau font-extrabold"
            : "text-gray-600 hover:text-hijau hover:bg-green-200 hover:font-extrabold"
        }`;

    return (
        <div id="sidebar" className="flex min-h-screen w-90 flex-col bg-white p-10 shadow-lg">
            
            <div className="flex flex-col">
                <span className="font-poppins text-[48px] font-bold text-gray-900 leading-tight">
                    Sedap <b className="text-hijau">.</b>
                </span>
                <span className="text-gray-400 text-sm">Modern Admin Dashboard</span>
            </div>

            <div className="mt-10">
                <ul className="space-y-3">

                    <li>
                        <NavLink to="/" className={menuClass}>
                            <MdDashboard className="mr-4 text-xl" />
                            <span>Dashboard</span>
                        </NavLink>
                    </li>

                    <li>
                        <NavLink to="/orders" className={menuClass}>
                            <MdListAlt className="mr-4 text-xl" />
                            <span>Orders</span>
                        </NavLink>
                    </li>

                    <li>
                        <NavLink to="/customers" className={menuClass}>
                            <MdPeople className="mr-4 text-xl" />
                            <span>Customers</span>
                        </NavLink>
                    </li>

                    <li>
                        <NavLink to="/error-400" className={menuClass}>
                            <span>Error 400</span>
                        </NavLink>
                    </li>

                    <li>
                        <NavLink to="/error-401" className={menuClass}>
                            <span>Error 401</span>
                        </NavLink>
                    </li>

                    <li>
                        <NavLink to="/error-403" className={menuClass}>
                            <span>Error 403</span>
                        </NavLink>
                    </li>

                </ul>
            </div>

            <div className="mt-auto">
                <div className="bg-hijau px-4 py-2 rounded-md shadow-lg mb-10 flex items-center">
                    
                    <div className="text-white text-sm">
                        <span>Please organize your menus through button below!</span>

                        <div className="flex justify-center items-center p-2 mt-3 bg-white rounded-md space-x-2">
                            <span className="text-gray-600 flex items-center">
                                <MdAdd className="mr-2 text-xl" />
                                Add Menus
                            </span>
                        </div>
                    </div>

                    <img
                        className="w-20 rounded-full"
                        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTcPrsBlh4r2gBX6xnX9eHSsxH__CPaXce1vg&s"
                        alt="avatar"
                    />
                </div>

                <span className="font-bold text-gray-400">
                    Sedap Restaurant Admin Dashboard
                </span>
                <p className="font-light text-gray-400">
                    &copy; 2025 All Right Reserved
                </p>
            </div>

        </div>
    );
}