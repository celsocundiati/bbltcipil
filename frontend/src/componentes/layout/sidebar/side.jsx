import { NavLink } from "react-router-dom";
import { camposBotton, camposMain } from "../campos/campos";
import { LuBookOpen } from "react-icons/lu";

function Sidebar(){

    const est_inativo = "text-[#000000]/57 hover:text-[#000000]/80 hover:bg-[#000000]/5";
    const est_Ativo = "bg-[#f97b17]/35 text-[#f97b17]";

    return(
        <aside className="fixed top-0 left-0 bottom-0 flex flex-col border border-b-0 border-t-0 w-82
            border-l border-black/15 bg-white z-50 overflow-hidden">

        
            <div className="flex items-center gap-1 px-5 py-7 border border-t-0 border-l-0 border-r-0 border-black/15">
                <LuBookOpen className="bg-[#f97b17] size-12  text-white p-2.5 rounded-xl"/>
                <div className="flex flex-col gap-0">
                    <h2 className="text-black/70 text-lg">Administração IPIL
                        <span className="text-sm text-black/60 block">Sistema de Gestão</span>
                    </h2>
                </div>
            </div>

            <nav className="p-5 space-y-5">
                {camposMain.map(campo =>(
                    <NavLink 
                        key={campo.caminho}
                        to={campo.caminho}
                        className={({isActive}) =>`min-w-max flex items-center font-semibold
                            gap-1 shrink-0 py-1.5 px-2 rounded-lg transition-all duration-300 text-sm
                                ${isActive ? est_Ativo : est_inativo}`} 
                        >
                        {campo.icone} {campo.label}
                    </NavLink>
                ))}
            </nav>
            <div className="flex-1"></div>
            <nav className="px-5 space-y-5 pb-4">
                {camposBotton.map(campo =>(
                    <NavLink
                        key={campo.caminho}
                        to={campo.caminho}
                        className={({isActive}) =>`min-w-max flex items-center font-semibold
                            gap-1 shrink-0 py-1.5 px-2 rounded-lg transition-all duration-300 text-sm
                            ${isActive ? est_Ativo : est_inativo}`}
                        >
                        {campo.icone} {campo.label}
                    </NavLink>
                ))}
            </nav>

        </aside>
    );
}
export default Sidebar;