import { camposMain, camposBotton } from "../../layout/Campos";
import { HiOutlineMenu, HiOutlineX } from "react-icons/hi";
import { NavLink } from "react-router-dom";

function BtnHamburgerMenu({isOpen, toggleMenu}){
    return(        
        <div>
            <div>
                <button className="md:hidden py-1 px-1 bg-laranja-500 text-branco-100 rounded-md" onClick={toggleMenu}> 
                    {
                        isOpen ? <HiOutlineX size={30}/> : <HiOutlineMenu size={30}/>
                    }
                </button>
            </div>
            {isOpen && (
                <div className="top-64 left-1 bg-branco-100 shadow-lg rounded p-4 z-50 w-52 h-60 overflow-y-auto">
                    <nav className="px-5 space-y-5 p-4">
                        {camposMain.map(campo =>(
                            <NavLink onClick={() => setIsOpen(false)}
                                to={campo.caminho}
                                className={({ isActive }) =>
                                    `nav-btn w-full flex gap-2 items-center transition-colors duration-200 ${
                                    isActive ? "border-laranja-500 text-laranja-600 bg-laranja-100"  : ""
                                    }`
                                }
                                >
                                {campo.icone} {campo.label}
                            </NavLink>
                        ))}
                    </nav>
                    <div className="flex-1"></div>
                    <nav className="px-5 space-y-5 pb-4">
                        {camposBotton.map(campo =>(
                            <NavLink
                                to={campo.caminho}
                                className={({ isActive }) =>
                                    `nav-btn w-full flex gap-2 items-center transition-colors duration-200 ${
                                    isActive ? "border-laranja-500 text-laranja-600 bg-laranja-100"  : ""
                                    }`
                                }
                                >
                                {campo.icone} {campo.label}
                            </NavLink>
                        ))}
                    </nav>
                </div>
            )}
        </div>
    );
}
export default BtnHamburgerMenu;