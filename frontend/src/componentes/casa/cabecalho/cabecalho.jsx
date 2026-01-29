
import { NavLink } from "react-router-dom";

import {LuBookOpen} from "react-icons/lu";
import {MdOutlineHome, MdPersonOutline, MdAdminPanelSettings} from "react-icons/md";
import {IoCalendarClearOutline} from "react-icons/io5";
import {GiGreekTemple} from "react-icons/gi";
import {RiBookShelfLine} from "react-icons/ri"
import { motion } from "framer-motion";

function Cabecalho() {

    
    {/* header */}

    // const paginas = ["Casa", "Catálogo", "Reservas", "Exposições", "Perfil"]

    // Array de itens do menu
    const paginas = [
    { path: "/", label: "Página Inicial", icon: MdOutlineHome },
    { path: "/catalogo", label: "Catálogo", icon: RiBookShelfLine },
    { path: "/reservas", label: "Reservas", icon: LuBookOpen },
    { path: "/exposicao", label: "Exposições", icon: IoCalendarClearOutline },
    { path: "/institucional", label: "Institucional", icon: GiGreekTemple },
    { path: "/perfil", label: "Meu Perfil", icon: MdPersonOutline },
    { path: "/admin", label: "Admin", icon: MdAdminPanelSettings },
    ];


    // const est_base = "flex items-center gap-1 py-0.5 px-2.5 rounded-lg transition-all sm:text-sm";
    const est_inativo = "text-[#000000]/57 hover:bg-[#000000]/5";
    const est_Ativo = "bg-[#f97b17]/35 text-[#f97b17]";

    return(
        // fixed top-0 left-0 w-full bg-white shadow z-50
        <motion.header  initial={{ opacity: 0, y: 20 }}       // começa invisível e levemente abaixo
            whileInView={{ opacity: 1, y: 0 }}   // anima quando entra na tela
            viewport={{ once: true }}             // anima apenas uma vez
            transition={{ duration: 0.8 }}
            className="fixed top-0 left-0 w-full bg-white shadow z-50">

            <div className="flex justify-between px-5 py-3 items-center w-full">

                <div className="flex items-center gap-1">
                    <LuBookOpen className="bg-[#f97b17] text-white p-1.5 size-10 rounded-sm"/>
                    <div className="flex flex-col gap-0">
                        <h2 className="text-[#f97b17] text-xl">IPIL
                            <span className="text-sm text-black/60 block">Biblioteca</span>
                        </h2>
                    </div>
                </div>

                <div className="flex items-center gap-5 overflow-hidden ml-6">

                    <ul className="
                    flex gap-6
                    w-full
                    whitespace-nowrap
                    overflow-x-auto md:overflow-visible
                    scrollbar-hide
                    ">
                    {paginas.map(item => {
                        const Icon = item.icon
                        return (
                        <li key={item.path}>
                            <NavLink to={item.path}
                                className={({isActive}) =>`min-w-max flex justify-center items-center 
                                gap-1 shrink-0 py-0.5 px-2.5 rounded-lg transition-all duration-300 sm:text-sm
                                    ${isActive ? est_Ativo : est_inativo}`} >
                                <Icon size={25}/>
                                {item.label}
                            </NavLink>
                        </li>
                        )
                    })}
                    </ul>

                    {/* <button className="shrink-0 cursor-pointer py-0.5 px-5 rounded-xl sm:text-xs bg-[#F86417] text-white">
                    LOGIN
                    </button> */}

                </div>
            </div>

        </motion.header>
    )
}

export default Cabecalho;
