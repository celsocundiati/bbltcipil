import { Outlet } from "react-router-dom";
import { HiOutlineMenu } from "react-icons/hi";
import { useState } from "react";
import AdminNav from "../layout/admNav/admnav";
import Hamburger from "../layout/hamburger/hamburger";
import { motion } from "framer-motion";

function Admin() {

  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.main initial={{ opacity: 0, y: 20 }}       // começa invisível e levemente abaixo
        whileInView={{ opacity: 1, y: 0 }}   // anima quando entra na tela
        viewport={{ once: true }}             // anima apenas uma vez
        transition={{ duration: 0.8 }}     // começa invisível e levemente abaixo
      className="flex min-h-screen">

      <section className="md:ml-10">
        <Hamburger isOpen={isOpen} setIsOpen={setIsOpen} />
      </section>


      {/* Conteúdo principal */}
      <section className="flex-1 overflow-y-auto pt-5 pb-20 px-5 md:ml-72">

        {/* Botão hamburger só no mobile */}
        <button
          className="md:hidden fixed top-5 left-4 z-45"
          onClick={() => setIsOpen(!isOpen)}
        >
          <HiOutlineMenu size={30} />
        </button>

        <AdminNav />
        <Outlet />

      </section>
    </motion.main>
  );
}

export default Admin;




