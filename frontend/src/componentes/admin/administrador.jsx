import { Outlet } from "react-router-dom";
import { HiOutlineMenu } from "react-icons/hi";
import { useState } from "react";
import Sidebar from "../layout/sidebar/side";
import AdminNav from "../layout/admNav/admnav";

function Admin(){

    const [isOpen, setIsOpen] = useState(false);

    return(
        <main className="flex flex-row min-h-screen bg-branco-50">
            <div className="absolute top-64 left-4 z-30">
                <button className="md:hidden py-3" onClick={() =>setIsOpen(!isOpen)}>
                    <HiOutlineMenu size={30}/>
                </button>
            </div>

            <section className="ml-82 mt-10 pb-20 hidden md:block">
                <Sidebar/>
            </section>
            <section className="flex-1 overflow-y-auto py-5 md:mt-10 px-5">
                <AdminNav/>
                <Outlet/>
            </section>
        </main>
    );
}
export default Admin;